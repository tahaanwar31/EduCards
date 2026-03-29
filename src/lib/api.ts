/// <reference types="vite/client" />
const API_URL = '/api/v1';

async function handleResponse(res: Response, defaultMessage: string) {
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || defaultMessage);
  }
  return res.json();
}

export async function fetchSubjects() {
  const res = await fetch(`${API_URL}/subjects-list`);
  return handleResponse(res, 'Failed to fetch subjects');
}

export async function createSubject(data: { name: string; description?: string }) {
  const res = await fetch(`${API_URL}/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Failed to create subject');
}

export async function deleteSubject(id: string) {
  const res = await fetch(`${API_URL}/subjects/${id}`, { method: 'DELETE' });
  return handleResponse(res, 'Failed to delete subject');
}

export async function fetchTopics(subjectId: string) {
  const res = await fetch(`${API_URL}/subjects/${subjectId}/topics`);
  return handleResponse(res, 'Failed to fetch topics');
}

export async function createTopic(subjectId: string, data: { name: string }) {
  const res = await fetch(`${API_URL}/subjects/${subjectId}/topics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Failed to create topic');
}

export async function deleteTopic(id: string) {
  const res = await fetch(`${API_URL}/topics/${id}`, { method: 'DELETE' });
  return handleResponse(res, 'Failed to delete topic');
}

export async function fetchFlashcards(topicId: string) {
  const res = await fetch(`${API_URL}/topics/${topicId}/flashcards`);
  return handleResponse(res, 'Failed to fetch flashcards');
}

export async function createFlashcard(topicId: string, data: { question: string; answer: string }) {
  const res = await fetch(`${API_URL}/topics/${topicId}/flashcards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Failed to create flashcard');
}

export async function deleteFlashcard(id: string) {
  const res = await fetch(`${API_URL}/flashcards/${id}`, { method: 'DELETE' });
  return handleResponse(res, 'Failed to delete flashcard');
}

