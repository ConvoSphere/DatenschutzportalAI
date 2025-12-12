# Deployment Guide

## Übersicht

Dieser Guide beschreibt das Deployment des Datenschutzportals für Produktionsumgebungen.

## Deployment-Optionen

1. **Docker Compose** (Empfohlen für kleinere Deployments)
2. **Kubernetes** (Für skalierbare Produktionsumgebungen)
3. **Manuelle Installation** (Für spezielle Anforderungen)

## 1. Docker Compose Deployment

### Voraussetzungen

- Docker 20.10+
- Docker Compose 2.0+
- Domain mit SSL-Zertifikat
- Hessenbox-Zugangsdaten
- SMTP-Server-Zugang

### Projektstruktur

```
datenschutzportal/
├── frontend/
│   ├── (React App Files)
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── .env.production
└── nginx/
    └── nginx.conf (Reverse Proxy)
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Frontend nginx.conf

```nginx
# frontend/nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts for file upload
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/api/health')"

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: datenschutzportal-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - datenschutzportal-network

  # Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: datenschutzportal-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file:
      - .env.production
    volumes:
      - ./backend/logs:/app/logs
    networks:
      - datenschutzportal-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Nginx Reverse Proxy (optional, für SSL)
  nginx:
    image: nginx:alpine
    container_name: datenschutzportal-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - frontend
      - backend
    networks:
      - datenschutzportal-network

networks:
  datenschutzportal-network:
    driver: bridge
```

### .env.production

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=False
CORS_ORIGINS=https://datenschutzportal.uni-frankfurt.de

# Hessenbox Configuration
HESSENBOX_URL=https://hessenbox.tu-darmstadt.de/remote.php/webdav/
HESSENBOX_USERNAME=production_user
HESSENBOX_PASSWORD=secure_password_here
HESSENBOX_BASE_PATH=/Datenschutzportal

# SMTP Configuration
SMTP_HOST=smtp.uni-frankfurt.de
SMTP_PORT=587
SMTP_USERNAME=datenschutz@uni-frankfurt.de
SMTP_PASSWORD=secure_smtp_password
SMTP_FROM_EMAIL=datenschutz@uni-frankfurt.de
SMTP_FROM_NAME=Datenschutzportal

# Notification E-Mails (comma-separated)
NOTIFICATION_EMAILS=team1@uni-frankfurt.de,team2@uni-frankfurt.de

# Security
SECRET_KEY=generate-secure-random-key-here-min-32-chars
ALGORITHM=HS256

# File Upload Limits
MAX_FILE_SIZE=52428800
ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.zip,.txt

# Logging
LOG_LEVEL=INFO
LOG_FILE=/app/logs/datenschutzportal.log
```

### Deployment Steps

```bash
# 1. Clone repository
git clone https://github.com/uni-frankfurt/datenschutzportal.git
cd datenschutzportal

# 2. Konfiguration anpassen
cp .env.example .env.production
nano .env.production  # Zugangsdaten eintragen

# 3. SSL-Zertifikate hinzufügen (Let's Encrypt)
sudo certbot certonly --standalone -d datenschutzportal.uni-frankfurt.de
cp /etc/letsencrypt/live/datenschutzportal.uni-frankfurt.de/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/datenschutzportal.uni-frankfurt.de/privkey.pem nginx/ssl/

# 4. Build und Start
docker-compose up -d --build

# 5. Logs überprüfen
docker-compose logs -f

# 6. Health Check
curl https://datenschutzportal.uni-frankfurt.de/api/health
```

### Reverse Proxy nginx.conf (mit SSL)

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=upload_limit:10m rate=10r/m;
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;

    # Upstream Backend
    upstream backend {
        server backend:8000;
    }

    # Upstream Frontend
    upstream frontend {
        server frontend:80;
    }

    # HTTP -> HTTPS Redirect
    server {
        listen 80;
        server_name datenschutzportal.uni-frankfurt.de;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name datenschutzportal.uni-frankfurt.de;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security Headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:;" always;

        # Max upload size
        client_max_body_size 100M;

        # API Routes
        location /api {
            limit_req zone=api_limit burst=20 nodelay;
            limit_req zone=upload_limit burst=5 nodelay;

            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Timeouts for file upload
            proxy_read_timeout 600;
            proxy_connect_timeout 600;
            proxy_send_timeout 600;
        }

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health Check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 2. Kubernetes Deployment

### Kubernetes Manifests

#### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: datenschutzportal-backend
  namespace: datenschutzportal
spec:
  replicas: 3
  selector:
    matchLabels:
      app: datenschutzportal-backend
  template:
    metadata:
      labels:
        app: datenschutzportal-backend
    spec:
      containers:
      - name: backend
        image: registry.uni-frankfurt.de/datenschutzportal-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: API_HOST
          value: "0.0.0.0"
        - name: API_PORT
          value: "8000"
        envFrom:
        - secretRef:
            name: datenschutzportal-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: datenschutzportal-frontend
  namespace: datenschutzportal
spec:
  replicas: 2
  selector:
    matchLabels:
      app: datenschutzportal-frontend
  template:
    metadata:
      labels:
        app: datenschutzportal-frontend
    spec:
      containers:
      - name: frontend
        image: registry.uni-frankfurt.de/datenschutzportal-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
```

#### service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: datenschutzportal-backend-service
  namespace: datenschutzportal
spec:
  selector:
    app: datenschutzportal-backend
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: datenschutzportal-frontend-service
  namespace: datenschutzportal
spec:
  selector:
    app: datenschutzportal-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

#### ingress.yaml

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: datenschutzportal-ingress
  namespace: datenschutzportal
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/proxy-body-size: "100m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - datenschutzportal.uni-frankfurt.de
    secretName: datenschutzportal-tls
  rules:
  - host: datenschutzportal.uni-frankfurt.de
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: datenschutzportal-backend-service
            port:
              number: 8000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: datenschutzportal-frontend-service
            port:
              number: 80
```

### Deployment

```bash
# 1. Namespace erstellen
kubectl create namespace datenschutzportal

# 2. Secrets erstellen
kubectl create secret generic datenschutzportal-secrets \
  --from-env-file=.env.production \
  -n datenschutzportal

# 3. Deployments anwenden
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml

# 4. Status prüfen
kubectl get pods -n datenschutzportal
kubectl get services -n datenschutzportal
kubectl get ingress -n datenschutzportal

# 5. Logs anzeigen
kubectl logs -f -l app=datenschutzportal-backend -n datenschutzportal
```

## 3. Monitoring & Logging

### Prometheus Metrics

```python
# backend/app/monitoring.py
from prometheus_client import Counter, Histogram, Gauge

# Metrics
upload_counter = Counter('uploads_total', 'Total number of uploads')
upload_duration = Histogram('upload_duration_seconds', 'Upload duration')
active_uploads = Gauge('active_uploads', 'Number of active uploads')
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Datenschutzportal Monitoring",
    "panels": [
      {
        "title": "Upload Rate",
        "targets": [
          {
            "expr": "rate(uploads_total[5m])"
          }
        ]
      },
      {
        "title": "Active Uploads",
        "targets": [
          {
            "expr": "active_uploads"
          }
        ]
      }
    ]
  }
}
```

### Logging mit ELK Stack

```yaml
# filebeat.yml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /app/logs/*.log
  json.keys_under_root: true

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "datenschutzportal-%{+yyyy.MM.dd}"
```

## 4. Backup & Recovery

### Hessenbox Backup

```bash
#!/bin/bash
# backup_hessenbox.sh

BACKUP_DIR="/backup/hessenbox"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup via WebDAV
rclone sync hessenbox:/Datenschutzportal $BACKUP_DIR/datenschutzportal-$DATE

# Keep last 30 days
find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} \;
```

### Database Backup (falls verwendet)

```bash
#!/bin/bash
# backup_database.sh

BACKUP_DIR="/backup/database"
DATE=$(date +%Y%m%d_%H%M%S)

# PostgreSQL Backup
pg_dump -h localhost -U datenschutzportal datenschutzportal > $BACKUP_DIR/db-$DATE.sql

# Compress
gzip $BACKUP_DIR/db-$DATE.sql

# Keep last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete
```

## 5. Security Checklist

- [ ] SSL/TLS Zertifikat konfiguriert (Let's Encrypt)
- [ ] Firewall konfiguriert (nur Ports 80, 443 offen)
- [ ] Secrets in Environment Variables (nicht im Code)
- [ ] Rate Limiting aktiviert
- [ ] CORS richtig konfiguriert
- [ ] Security Headers gesetzt
- [ ] File Upload Limits gesetzt
- [ ] Input Validation aktiviert
- [ ] Logging ohne sensitive Daten
- [ ] Regelmäßige Security Updates
- [ ] Backup-Strategie implementiert
- [ ] Monitoring & Alerting eingerichtet

## 6. Performance Tuning

### Nginx

```nginx
# Worker processes
worker_processes auto;
worker_rlimit_nofile 65535;

# Connection settings
events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}
```

### FastAPI

```python
# Uvicorn mit Gunicorn
gunicorn app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 300 \
    --keepalive 5
```

## 7. Troubleshooting

### Common Issues

**Issue**: Upload schlägt fehl  
**Solution**: Prüfe `client_max_body_size` in Nginx und `MAX_FILE_SIZE` in Backend

**Issue**: Langsame Uploads  
**Solution**: Erhöhe Timeouts in Nginx und FastAPI

**Issue**: Hessenbox Connection Timeout  
**Solution**: Prüfe Firewall-Regeln und WebDAV-Zugangsdaten

### Logs

```bash
# Docker Logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Kubernetes Logs
kubectl logs -f deployment/datenschutzportal-backend -n datenschutzportal

# Nginx Logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## 8. CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker Images
        run: |
          docker build -t datenschutzportal-frontend:${{ github.sha }} ./frontend
          docker build -t datenschutzportal-backend:${{ github.sha }} ./backend
      
      - name: Push to Registry
        run: |
          docker tag datenschutzportal-frontend:${{ github.sha }} registry.uni-frankfurt.de/datenschutzportal-frontend:latest
          docker push registry.uni-frankfurt.de/datenschutzportal-frontend:latest
      
      - name: Deploy to Server
        run: |
          ssh deploy@server "cd /opt/datenschutzportal && docker-compose pull && docker-compose up -d"
```

## Support

**DevOps Team**: devops@uni-frankfurt.de  
**Notfall-Hotline**: +49 69 798 12345
