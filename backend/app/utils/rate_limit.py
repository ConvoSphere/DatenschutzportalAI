import time
from fastapi import Request, HTTPException
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self, requests_per_minute: int = 5):
        self.requests_per_minute = requests_per_minute
        self.requests = defaultdict(list)

    async def __call__(self, request: Request):
        client_ip = request.client.host
        now = time.time()
        
        # Clean up old requests
        self.requests[client_ip] = [req_time for req_time in self.requests[client_ip] if now - req_time < 60]
        
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
        
        self.requests[client_ip].append(now)
