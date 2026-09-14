import { Icons } from '../utils/icons.js';
import { AppState } from '../state.js';
import { NlpApi } from '../api/nlpApi.js';
import { ProjectApi } from '../api/projectApi.js';
import { MessageApi } from '../api/messageApi.js';
import { Storage } from '../utils/storage.js';
import { Toast } from '../components/toast.js';
import { Helpers } from '../utils/helpers.js';

export function renderChatPage(projectName, navigate) {
  const container = document.createElement('div');
  container.className = 'chat-page-layout';

  const projects = Storage.getProjects();
  const project = projects.find(p => p.project_name === projectName) || {
    project_name: projectName,
    title: projectName
  };

  const username = AppState.user?.username || 'Parent';
  const initial = username.charAt(0).toUpperCase();

  let messagePage = 1;
  let hasMoreMessages = false;
  let isLoadingMore = false;

  container.innerHTML = `
    <!-- Main Chat Pane -->
    <div class="chat-main-container">
      <button class="chat-sidebar-tab-btn" id="chat-sidebar-tab" title="Open records panel">
        ${Icons.paperclip} <span>Records</span>
      </button>

      <!-- Chat Header -->
      <div class="chat-header">
        <div class="chat-header-left">
          <button class="chat-back-btn" id="btn-back-dashboard" title="Back to Dashboard">
            ${Icons.backArrow}
          </button>
          <div class="chat-title-wrap">
            <h2>${project.title || project.project_name}</h2>
            <div class="chat-project-name">Project: ${project.project_name}</div>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="chat-messages-area" id="chat-messages-list">
        <div id="load-more-indicator" style="display:none;text-align:center;padding:8px 0;">
          <span class="badge badge-sky" style="font-size:0.75rem;">Loading earlier messages...</span>
        </div>
        <!-- Welcome intro card -->
        <div class="chat-message assistant" id="welcome-msg">
          <div class="message-avatar ai-avatar">
            <div style="width: 24px; height: 24px;">${Icons.logo}</div>
          </div>
          <div class="message-bubble">
            <p style="font-weight: 700; color: #0f3460; margin-bottom: 6px;">
              Hello ${username}! I'm CubCare AI 🐾
            </p>
            <p>
              Ask any pediatric health, nutrition, or wellness question to get real-time AI guidance.
            </p>
          </div>
        </div>
      </div>

      <!-- Chat Input Composer -->
      <div class="chat-input-wrapper">
        <form id="chat-form">
          <div class="chat-input-box" id="chat-input-box">
            <textarea 
              id="chat-textarea" 
              class="chat-textarea" 
              placeholder="Ask a pediatric health question..." 
              rows="1"
              required
            ></textarea>
            <button type="submit" class="chat-action-btn chat-send-btn" id="chat-send-btn" title="Send text message">
              ${Icons.send}
            </button>
            <button type="button" class="chat-action-btn chat-mic-btn" id="chat-mic-btn" title="Record voice message">
              ${Icons.mic}
            </button>
          </div>
          <div class="chat-recording-bar" id="chat-rec-bar" style="display:none;">
            <div class="recording-indicator-wrap">
              <span class="recording-pulse-dot"></span>
              <span class="recording-label">Recording Voice...</span>
              <span class="recording-timer" id="rec-timer">00:00</span>
              <div class="recording-waveform">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div class="recording-actions">
              <button type="button" class="chat-action-btn chat-cancel-rec-btn" id="rec-cancel-btn" title="Cancel recording">${Icons.trash}</button>
              <button type="button" class="chat-action-btn chat-send-rec-btn" id="rec-send-btn" title="Finish & Send voice">${Icons.send}</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Sidebar: Records & Documents -->
    <aside class="chat-sidebar" id="chat-sidebar">
      <div class="chat-sidebar-resizer" id="chat-sidebar-resizer" title="Drag to resize panel"></div>
      <div class="chat-sidebar-header">
        <h3 class="chat-sidebar-title">
          ${Icons.leaf}
          <span>Child Records</span>
        </h3>
        <button class="modal-close-btn" id="close-sidebar-btn" title="Close Panel">&times;</button>
      </div>

      <div class="chat-sidebar-content">
        <!-- File Upload Area -->
        <input type="file" id="record-file-input" style="display: none;" />
        <div class="upload-dropzone" id="upload-dropzone">
          <div style="font-size: 1.8rem; margin-bottom: 4px;">📄</div>
          <div style="font-weight: 700; color: #1565c0; font-size: 0.95rem;">Upload Record File</div>
          <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">PDF or TXT document</div>
        </div>

        <div id="upload-status-box"></div>

        <!-- Attached Documents Section -->
        <div class="uploaded-files-section">
          <div class="uploaded-files-header">
            <span>Attached Documents</span>
            <span class="badge badge-sky" id="files-count">0</span>
          </div>
          <div class="uploaded-files-list" id="files-list"></div>
        </div>
      </div>
    </aside>
  `;

  // Back to Dashboard
  container.querySelector('#btn-back-dashboard').addEventListener('click', () => {
    navigate('/dashboard');
  });

  // Sidebar Sliding & Resizing
  const sidebar = container.querySelector('#chat-sidebar');
  const tabBtn = container.querySelector('#chat-sidebar-tab');
  const closeSidebarBtn = container.querySelector('#close-sidebar-btn');
  const resizer = container.querySelector('#chat-sidebar-resizer');

  function closeSidebar() {
    sidebar.classList.add('is-collapsed');
    sidebar.classList.remove('is-open');
    tabBtn.classList.add('is-visible');
  }

  function openSidebar() {
    sidebar.classList.remove('is-collapsed');
    sidebar.classList.add('is-open');
    tabBtn.classList.remove('is-visible');
  }

  closeSidebarBtn.addEventListener('click', closeSidebar);
  tabBtn.addEventListener('click', openSidebar);

  // Drag to Resize
  let isResizing = false;
  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    resizer.classList.add('is-resizing');
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const containerRect = container.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    if (newWidth >= 240 && newWidth <= 600) {
      sidebar.style.width = `${newWidth}px`;
    }
  });

  window.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      resizer.classList.remove('is-resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });

  // Document List Rendering
  const filesList = container.querySelector('#files-list');
  const filesCount = container.querySelector('#files-count');

  async function renderFilesList() {
    let files = [];
    try {
      const res = await ProjectApi.getProjectAssets(projectName);
      if (res && res.assets && Array.isArray(res.assets)) {
        files = res.assets.map(a => ({
          name: a.asset_name,
          size: a.asset_size,
          uploadedAt: a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Ready'
        }));
      }
    } catch (e) {
      console.warn('Fetch assets from DB fallback to cache:', e.message);
      files = Storage.getProjectFiles(projectName) || [];
    }

    filesCount.textContent = files.length;
    filesList.innerHTML = '';

    if (files.length === 0) {
      filesList.innerHTML = `<div style="color:#94a3b8;font-size:0.82rem;text-align:center;padding:12px;">No documents uploaded yet</div>`;
      return;
    }

    files.forEach(f => {
      const item = document.createElement('div');
      item.className = 'uploaded-file-card';
      item.innerHTML = `
        <div class="uploaded-file-icon">📄</div>
        <div class="uploaded-file-info">
          <div class="uploaded-file-name" title="${Helpers.escapeHtml(f.name)}">${Helpers.escapeHtml(f.name)}</div>
          <div class="uploaded-file-date">${f.uploadedAt || 'Ready for questions'}</div>
        </div>
        <div class="uploaded-file-status" title="Active">✓</div>
      `;
      filesList.appendChild(item);
    });
  }

  renderFilesList();

  // File Upload & Automated Indexing
  const fileInput = container.querySelector('#record-file-input');
  const dropzone = container.querySelector('#upload-dropzone');
  const uploadStatusBox = container.querySelector('#upload-status-box');

  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    uploadStatusBox.innerHTML = `
      <div class="alert alert-info" style="font-size: 0.85rem; padding: 8px 12px;">
        <span>Uploading ${file.name}...</span>
      </div>
    `;

    try {
      // Step 1: Upload File
      const uploadRes = await ProjectApi.uploadFile(projectName, file);
      const uploadedFileName = uploadRes.file_name || file.name;

      // Step 2: Process File using /api/v1/data/process/{project_name}
      await ProjectApi.processFile(projectName, uploadedFileName, 1000, 100, 0);

      // Step 3: Vector Embeddings Push automatically
      await NlpApi.pushToVectorDb(projectName, 0);

      Toast.success('File uploaded successfully!');
      uploadStatusBox.innerHTML = `
        <div class="alert alert-success" style="font-size: 0.85rem; padding: 8px 12px;">
          ✓ ${file.name} uploaded successfully!
        </div>
      `;

      Storage.saveProjectFile(projectName, {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleDateString()
      });
      renderFilesList();
    } catch (err) {
      uploadStatusBox.innerHTML = `
        <div class="alert alert-error" style="font-size: 0.85rem; padding: 8px 12px;">
          ✕ Upload failed: ${err.message || 'Error occurred'}
        </div>
      `;
    } finally {
      fileInput.value = '';
    }
  });

  // Chat Form & Messages Area
  const messagesList = container.querySelector('#chat-messages-list');
  const loadMoreIndicator = container.querySelector('#load-more-indicator');
  const welcomeMsg = container.querySelector('#welcome-msg');
  const chatForm = container.querySelector('#chat-form');
  const textarea = container.querySelector('#chat-textarea');
  const sendBtn = container.querySelector('#chat-send-btn');
  const micBtn = container.querySelector('#chat-mic-btn');
  const inputBox = container.querySelector('#chat-input-box');
  const recBar = container.querySelector('#chat-rec-bar');
  const recTimer = container.querySelector('#rec-timer');
  const cancelRecBtn = container.querySelector('#rec-cancel-btn');
  const sendRecBtn = container.querySelector('#rec-send-btn');

  // Voice recording state (16kHz Linear PCM WAV)
  let audioContext = null;
  let mediaStreamSource = null;
  let scriptProcessor = null;
  let pcmBuffers = [];
  let recordTimerInterval = null;
  let recordSeconds = 0;
  let streamInstance = null;

  function formatTimer(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function cleanupAudioNodes() {
    if (scriptProcessor) {
      scriptProcessor.onaudioprocess = null;
      try { scriptProcessor.disconnect(); } catch (e) {}
      scriptProcessor = null;
    }
    if (mediaStreamSource) {
      try { mediaStreamSource.disconnect(); } catch (e) {}
      mediaStreamSource = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
      try { audioContext.close(); } catch (e) {}
      audioContext = null;
    }
    if (streamInstance) {
      streamInstance.getTracks().forEach(track => track.stop());
      streamInstance = null;
    }
    if (recordTimerInterval) {
      clearInterval(recordTimerInterval);
      recordTimerInterval = null;
    }
  }

  function encodeWavBlob(buffers, inputSampleRate, targetSampleRate = 16000) {
    let totalLength = 0;
    for (const b of buffers) totalLength += b.length;
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const b of buffers) {
      merged.set(b, offset);
      offset += b.length;
    }

    let samples = merged;
    if (inputSampleRate !== targetSampleRate) {
      const ratio = inputSampleRate / targetSampleRate;
      const newLen = Math.round(merged.length / ratio);
      const downsampled = new Float32Array(newLen);
      for (let i = 0; i < newLen; i++) {
        const origIndex = Math.round(i * ratio);
        downsampled[i] = merged[Math.min(origIndex, merged.length - 1)];
      }
      samples = downsampled;
    }

    const wavBuffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(wavBuffer);

    const writeStr = (v, off, str) => {
      for (let i = 0; i < str.length; i++) v.setUint8(off + i, str.charCodeAt(i));
    };

    writeStr(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeStr(view, 8, 'WAVE');

    writeStr(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, targetSampleRate, true);
    view.setUint32(28, targetSampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);

    writeStr(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let dataOffset = 44;
    for (let i = 0; i < samples.length; i++, dataOffset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(dataOffset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([wavBuffer], { type: 'audio/wav' });
  }

  async function startRecording() {
    try {
      pcmBuffers = [];
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      streamInstance = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();

      mediaStreamSource = audioContext.createMediaStreamSource(stream);
      scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

      scriptProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        pcmBuffers.push(new Float32Array(inputData));
      };

      mediaStreamSource.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      recordSeconds = 0;
      recTimer.textContent = '00:00';
      recTimer.style.color = '#be123c';
      recordTimerInterval = setInterval(() => {
        recordSeconds++;
        recTimer.textContent = `${formatTimer(recordSeconds)}`;
        if (recordSeconds === 110) {
          Toast.info('10 seconds remaining (max 2 minutes).');
        }
        if (recordSeconds >= 120) {
          Toast.warning('Maximum voice length of 2 minutes reached.');
          finishAndSendRecording();
        }
      }, 1000);

      inputBox.style.display = 'none';
      recBar.style.display = 'flex';
    } catch (err) {
      console.error('Microphone access error:', err);
      Toast.error('Microphone access was denied or not found.');
      cleanupAudioNodes();
    }
  }

  function cancelRecording() {
    cleanupAudioNodes();
    pcmBuffers = [];
    recBar.style.display = 'none';
    inputBox.style.display = 'flex';
  }

  async function finishAndSendRecording() {
    if (!audioContext) return;
    const durationRecorded = recordSeconds;
    const inputRate = audioContext.sampleRate || 16000;
    const buffers = [...pcmBuffers];
    cleanupAudioNodes();
    pcmBuffers = [];

    recBar.style.display = 'none';
    inputBox.style.display = 'flex';

    if (durationRecorded > 120) {
      Toast.warning('Voice recording must be 2 minutes (120 seconds) or less. Please record a shorter message.');
      return;
    }

    const audioBlob = encodeWavBlob(buffers, inputRate, 16000);

    if (audioBlob.size < 500) {
      Toast.info('Voice recording was too short.');
      return;
    }

    const audioUrl = URL.createObjectURL(audioBlob);

    // Add user voice message node
    const uMsg = document.createElement('div');
    uMsg.className = 'chat-message user';
    uMsg.innerHTML = `
      <div class="message-avatar user-avatar">${initial}</div>
      <div class="message-bubble voice-message-bubble">
        <div class="voice-msg-player">
          <span class="voice-mic-icon">🎙️</span>
          <audio controls src="${audioUrl}" class="chat-audio-player"></audio>
        </div>
      </div>
    `;
    messagesList.appendChild(uMsg);

    // Add assistant placeholder
    const aiMsg = document.createElement('div');
    aiMsg.className = 'chat-message assistant';
    aiMsg.innerHTML = `
      <div class="message-avatar ai-avatar"><div style="width:24px;height:24px;">${Icons.logo}</div></div>
      <div class="message-bubble"><span class="ai-text-content">Listening to your voice & thinking...</span><span class="streaming-cursor"></span></div>
    `;
    messagesList.appendChild(aiMsg);
    messagesList.scrollTop = messagesList.scrollHeight;

    const aiTextContent = aiMsg.querySelector('.ai-text-content');
    const cursor = aiMsg.querySelector('.streaming-cursor');
    sendBtn.disabled = true;
    micBtn.disabled = true;

    let started = false;
    await NlpApi.answerVoiceStream(
      projectName,
      audioBlob,
      (token, full) => {
        if (!started) { started = true; aiTextContent.innerHTML = ''; }
        aiTextContent.innerHTML = Helpers.renderMarkdown(full);
        messagesList.scrollTop = messagesList.scrollHeight;
      },
      (final) => {
        cursor?.remove();
        if (final) aiTextContent.innerHTML = Helpers.renderMarkdown(final);
        sendBtn.disabled = false;
        micBtn.disabled = false;
        messagesList.scrollTop = messagesList.scrollHeight;
      },
      (err) => {
        cursor?.remove();
        aiTextContent.innerHTML = `<span style="color:#c62828;">⚠️ ${err.message}</span>`;
        sendBtn.disabled = false;
        micBtn.disabled = false;
      }
    );
  }

  micBtn.addEventListener('click', startRecording);
  cancelRecBtn.addEventListener('click', cancelRecording);
  sendRecBtn.addEventListener('click', finishAndSendRecording);

  function createMessageNode(role, content) {
    const el = document.createElement('div');
    el.className = `chat-message ${role === 'user' ? 'user' : 'assistant'}`;
    if (role === 'user') {
      el.innerHTML = `<div class="message-avatar user-avatar">${initial}</div><div class="message-bubble">${Helpers.escapeHtml(content)}</div>`;
    } else {
      el.innerHTML = `
        <div class="message-avatar ai-avatar"><div style="width:24px;height:24px;">${Icons.logo}</div></div>
        <div class="message-bubble">${Helpers.renderMarkdown(content)}</div>
      `;
    }
    return el;
  }

  async function loadInitialMessages() {
    try {
      const res = await MessageApi.getAllMessages(projectName, 1, 20);
      if (res && res.messages && res.messages.length > 0) {
        hasMoreMessages = !!res.has_more;
        messagePage = 1;
        res.messages.forEach(m => {
          const node = createMessageNode(m.role, m.content);
          messagesList.appendChild(node);
        });
        messagesList.scrollTop = messagesList.scrollHeight;
      }
    } catch (err) {
      console.warn('Initial chat load skipped/offline:', err.message);
    }
  }

  messagesList.addEventListener('scroll', async () => {
    if (messagesList.scrollTop <= 40 && hasMoreMessages && !isLoadingMore) {
      isLoadingMore = true;
      if (loadMoreIndicator) loadMoreIndicator.style.display = 'block';

      const previousScrollHeight = messagesList.scrollHeight;
      const previousScrollTop = messagesList.scrollTop;
      const nextPage = messagePage + 1;

      try {
        const res = await MessageApi.getAllMessages(projectName, nextPage, 20);
        if (res && res.messages && res.messages.length > 0) {
          messagePage = nextPage;
          hasMoreMessages = !!res.has_more;

          const insertReference = welcomeMsg ? welcomeMsg.nextSibling : messagesList.firstChild;
          res.messages.forEach(m => {
            const node = createMessageNode(m.role, m.content);
            messagesList.insertBefore(node, insertReference);
          });

          const newScrollHeight = messagesList.scrollHeight;
          messagesList.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
        } else {
          hasMoreMessages = false;
        }
      } catch (err) {
        console.warn('Load older messages failed:', err.message);
      } finally {
        if (loadMoreIndicator) loadMoreIndicator.style.display = 'none';
        isLoadingMore = false;
      }
    }
  });

  loadInitialMessages();

  // Dynamically auto-expand textarea for large prompts and enable scroll
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    const scrollH = textarea.scrollHeight;
    textarea.style.height = `${Math.min(scrollH, 220)}px`;
  });

  // Enter sends message, Shift+Enter adds a new line
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  let isStreaming = false;

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isStreaming) return;

    const query = textarea.value.trim();
    if (!query) return;

    textarea.value = '';
    textarea.style.height = 'auto';

    const userMsgEl = document.createElement('div');
    userMsgEl.className = 'chat-message user';
    userMsgEl.innerHTML = `
      <div class="message-avatar user-avatar">${initial}</div>
      <div class="message-bubble">${Helpers.escapeHtml(query)}</div>
    `;
    messagesList.appendChild(userMsgEl);

    const aiMsgEl = document.createElement('div');
    aiMsgEl.className = 'chat-message assistant';
    aiMsgEl.innerHTML = `
      <div class="message-avatar ai-avatar">
        <div style="width: 24px; height: 24px;">${Icons.logo}</div>
      </div>
      <div class="message-bubble">
        <span class="ai-text-content">Thinking...</span>
        <span class="streaming-cursor"></span>
      </div>
    `;
    messagesList.appendChild(aiMsgEl);
    messagesList.scrollTop = messagesList.scrollHeight;

    const aiTextContent = aiMsgEl.querySelector('.ai-text-content');
    const cursor = aiMsgEl.querySelector('.streaming-cursor');

    isStreaming = true;
    sendBtn.disabled = true;

    let receivedAny = false;

    await NlpApi.answerQuestionStream(
      projectName,
      query,
      3,
      (token, fullText) => {
        if (!receivedAny) {
          receivedAny = true;
          aiTextContent.innerHTML = '';
        }
        aiTextContent.innerHTML = Helpers.renderMarkdown(fullText);
        messagesList.scrollTop = messagesList.scrollHeight;
      },
      (finalText) => {
        cursor?.remove();
        if (finalText) aiTextContent.innerHTML = Helpers.renderMarkdown(finalText);
        isStreaming = false;
        sendBtn.disabled = false;
        messagesList.scrollTop = messagesList.scrollHeight;
      },
      (error) => {
        cursor?.remove();
        aiTextContent.innerHTML = `<span style="color: #c62828;">⚠️ ${error.message}</span>`;
        isStreaming = false;
        sendBtn.disabled = false;
      }
    );
  });

  return container;
}
