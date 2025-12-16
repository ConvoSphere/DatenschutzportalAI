import { ExtractedStudyData } from '../types/privacy-concept';

const API_BASE = '/api/privacy-concept';

export async function extractData(files: File[], manualText?: string): Promise<ExtractedStudyData> {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  if (manualText) formData.append('manual_text', manualText);

  const response = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Extraction failed: ${errorText}`);
  }
  return response.json();
}

export async function generateConcept(data: ExtractedStudyData): Promise<{ concept_markdown: string }> {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
       const errorText = await response.text();
       throw new Error(`Generation failed: ${errorText}`);
  }
  return response.json();
}

export async function downloadDocx(markdown: string) {
  const response = await fetch(`${API_BASE}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format: 'docx', markdown_content: markdown }),
  });

  if (!response.ok) {
       const errorText = await response.text();
       throw new Error(`Export failed: ${errorText}`);
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Datenschutzkonzept.docx';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
