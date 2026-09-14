import { request, API_BASE } from './client.js';
import { Storage } from '../utils/storage.js';

export const NlpApi = {
  async pushToVectorDb(projectName, doReset = 0) {
    return await request(`/api/v1/nlp/index/push/${encodeURIComponent(projectName)}`, {
      method: 'POST',
      body: { do_reset: doReset }
    });
  },

  async getProjectInfo(projectName) {
    return await request(`/api/v1/nlp/index/info/${encodeURIComponent(projectName)}`, {
      method: 'GET'
    });
  },

  async searchVectorDb(projectName, text, limit = 3) {
    return await request(`/api/v1/nlp/index/search/${encodeURIComponent(projectName)}`, {
      method: 'POST',
      body: { text, limit }
    });
  },

  async answerQuestion(projectName, text, limit = 3) {
    return await request(`/api/v1/nlp/index/answer/${encodeURIComponent(projectName)}`, {
      method: 'POST',
      body: { text, limit }
    });
  },

  /**
   * Real-Time SSE Stream Consumer for RAG Answers
   * @param {string} projectName 
   * @param {string} text - User query
   * @param {number} limit - Chunk search limit
   * @param {function(string, string): void} onChunk - (token, currentFullText) => void
   * @param {function(string): void} onDone - (fullAnswer) => void
   * @param {function(Error): void} onError - (error) => void
   * @param {AbortSignal} [signal] - Optional abort signal
   */
  async answerQuestionStream(projectName, text, limit = 3, onChunk, onDone, onError, signal) {
    const url = `${API_BASE}/api/v1/nlp/index/answer/stream/${encodeURIComponent(projectName)}`;
    const token = Storage.getToken();

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text, limit }),
        signal
      });

      if (!response.ok) {
        let errMessage = 'Failed to generate response';
        try {
          const errData = await response.json();
          errMessage = errData.detail || errMessage;
        } catch {
          errMessage = await response.text();
        }
        const error = new Error(errMessage || `HTTP Error ${response.status}`);
        error.status = response.status;
        if (onError) onError(error);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullAnswer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Keep the last incomplete fragment in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          const dataPayload = trimmed.replace(/^data:\s*/, '').trim();

          if (dataPayload === '[DONE]') {
            if (onDone) onDone(fullAnswer);
            return;
          }

          try {
            const parsed = JSON.parse(dataPayload);
            if (parsed.error) {
              if (onError) onError(new Error(parsed.error));
              return;
            }
            if (parsed.text !== undefined) {
              fullAnswer += parsed.text;
              if (onChunk) onChunk(parsed.text, fullAnswer);
            }
          } catch {
            // Raw text fallback if not JSON
            fullAnswer += dataPayload;
            if (onChunk) onChunk(dataPayload, fullAnswer);
          }
        }
      }

      // If stream finished without [DONE] tag
      if (onDone) onDone(fullAnswer);

    } catch (err) {
      if (err.name === 'AbortError') {
        return; // User cancelled
      }
      if (onError) onError(err);
    }
  },

  /**
   * Real-Time SSE Stream Consumer for Voice Answers
   * @param {string} projectName 
   * @param {Blob} audioBlob - Recorded voice Blob
   * @param {function(string, string): void} onChunk - (token, currentFullText) => void
   * @param {function(string): void} onDone - (fullAnswer) => void
   * @param {function(Error): void} onError - (error) => void
   * @param {AbortSignal} [signal] - Optional abort signal
   */
  async answerVoiceStream(projectName, audioBlob, onChunk, onDone, onError, signal) {
    const url = `${API_BASE}/api/v1/nlp/index/voice/answer/stream/${encodeURIComponent(projectName)}`;
    const token = Storage.getToken();

    const headers = {
      'Accept': 'text/event-stream'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append('user_voice', audioBlob, 'recording.wav');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        signal
      });

      if (!response.ok) {
        let errMessage = 'Failed to stream voice response';
        try {
          const errData = await response.json();
          errMessage = errData.detail || errMessage;
        } catch {
          errMessage = await response.text();
        }
        const error = new Error(errMessage || `HTTP Error ${response.status}`);
        error.status = response.status;
        if (onError) onError(error);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullAnswer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;

          const dataPayload = trimmed.replace(/^data:\s*/, '').trim();

          if (dataPayload === '[DONE]') {
            if (onDone) onDone(fullAnswer);
            return;
          }

          try {
            const parsed = JSON.parse(dataPayload);
            if (parsed.error) {
              if (onError) onError(new Error(parsed.error));
              return;
            }
            if (parsed.text !== undefined) {
              fullAnswer += parsed.text;
              if (onChunk) onChunk(parsed.text, fullAnswer);
            }
          } catch {
            fullAnswer += dataPayload;
            if (onChunk) onChunk(dataPayload, fullAnswer);
          }
        }
      }

      if (onDone) onDone(fullAnswer);

    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      if (onError) onError(err);
    }
  }
};
