<div align="center">

# 🩺 Medical Health Assistant (Agentic-RAG)

An intelligent, production-ready Retrieval-Augmented Generation (RAG) assistant designed for medical and healthcare question-answering with Model Context Protocol (MCP) integration and scalable background processing.

[![Python](https://img.shields.io/badge/Python-3.12.5-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![Celery](https://img.shields.io/badge/Celery-Distributed_Tasks-37814A?style=for-the-badge&logo=celery&logoColor=white)](https://docs.celeryq.dev)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](./LICENCE)

</div>

---

## 🌟 Key Features

- **Accurate Medical Q&A**: Domain-specific retrieval over healthcare documents using modern vector indexing and LLMs (Groq, etc.).
- **Voice & Stream Support**: Direct audio transcription and low-latency token streaming for natural voice/text interactions.
- **Model Context Protocol (MCP)**: Built-in MCP server for real-time web search and external tool integration.
- **Asynchronous Task Queue**: Distributed document processing and data indexing powered by Celery, Redis, and Flower.
- **Enterprise Ready**: JWT authentication, rate limiting, and modular provider factories for LLM and Vector databases.

---

## 🏗️ System Architecture & Workflow

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                              🖥️ CLIENT INTERFACE                               │
│       Web Dashboard (HTML/JS)   │   Audio / Voice Input   │   REST / Swagger  │
└───────────────────────────────────────┬───────────────────────────────────────┘
                                        │  HTTP / Streaming / Audio
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                        ⚡ FASTAPI GATEWAY & SECURITY                           │
│       JWT Auth Middleware   │   Session Handling   │   SlowAPI Rate Limiter   │
└───────────────────────────────────────┬───────────────────────────────────────┘
                                        │  Validated Request
                                        ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                         🧠 AGENTIC NLP & RAG ENGINE                            │
│  ┌────────────────────────┐ ┌────────────────────────┐ ┌───────────────────┐  │
│  │  Voice Transcriber     │ │ Context & Summarizer   │ │ Dynamic Prompter  │  │
│  │  (Nemo / Whisper ASR)  │ │ (Conversation Memory)  │ │ (System/Docs/Chat)│  │
│  └────────────────────────┘ └────────────────────────┘ └───────────────────┘  │
│            │                             │                        │           │
│            ▼                             ▼                        ▼           │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      🤖 LLM Generation & Streaming                      │  │
│  │                      (Groq / OpenAI / HuggingFace)                      │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────────────┬───────────────┘
                        │                                       │
        Hybrid Search   │                                       │ External Tools
                        ▼                                       ▼
┌──────────────────────────────────────────────┐ ┌──────────────────────────────┐
│             📚 KNOWLEDGE STORES              │ │      🌐 MCP TOOL SERVER      │
│  • Qdrant / PgVector (Dense & Hybrid Index)  │ │  • Model Context Protocol    │
│  • PostgreSQL (Users, Projects, Chunks)      │ │  • DuckDuckGo Live Search    │
└──────────────────────────────────────────────┘ └──────────────────────────────┘
                        ▲
                        │ Background Ingestion & Data Indexing
┌───────────────────────────────────────────────────────────────────────────────┐
│                     ⚙️ DISTRIBUTED BACKGROUND PROCESSING                       │
│       Celery Workers   │   Celery Beat Scheduler   │   Flower Dashboard       │
│                               Redis Message Broker                            │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 🔄 End-to-End Processing Lifecycle

| Stage | Component | Flow & Description |
| :--- | :--- | :--- |
| **1. Ingest** | 📄 **Document Indexing** | Medical files are chunked, embedded, and stored in vector collections asynchronously via Celery. |
| **2. Capture** | 🎙️ **Voice & Input** | User text or real-time voice audio is received and transcribed instantly by the ASR engine. |
| **3. Retrieve**| 🔍 **Hybrid Search** | Executes dense vector + keyword search across clinical knowledge chunks with metadata filtering. |
| **4. Augment** | 🛠️ **MCP & Memory** | Injects conversation summaries and triggers live Model Context Protocol (MCP) search if needed. |
| **5. Stream**  | ⚡ **LLM Synthesis** | The LLM synthesizes retrieved evidence and context to stream real-time, grounded responses. |

---

## 🚀 Quick Start

### 1. Prerequisites & Environment Setup

Using **MiniConda** (recommended) or standard `venv`:

```bash
# Create and activate virtual environment
conda create -n [name] python=3.12.5
conda activate [name]
```

### 2. Installation & Configuration

```bash
# Install dependencies
pip install -r requirements.txt

# Configure main environment variables
cp .env.example .env
```
> [!TIP]
> Edit `.env` to configure your API keys (e.g. `GROQ_API_KEY`), database, and model settings.

---

### 3. Start Infrastructure Services

Spin up required backend services (PostgreSQL/pgvector, Redis):

```bash
cd docker
cp .env.example .env
sudo docker compose up -d
cd ..
```

---

### 4. Run the Application

Execute these services in separate terminal tabs or background sessions:

#### ① Run MCP Server
```bash
python -m src.stores.llm.mcp.server
```

#### ② Run FastAPI Backend
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 5000
```
- **API Base URL**: `http://localhost:5000`
- **Interactive Swagger Docs**: `http://localhost:5000/docs`

#### ③ Run Web Interface
```bash
python -m http.server 8080 --directory src/views
```
- **Frontend App**: `http://localhost:8080`

---

## ⚙️ Celery Workers & Monitoring (Development)

For background file processing and scheduled data indexing:

```bash
# 1. Run Celery Worker (dedicated queues)
python -m celery -A celery_app worker --queues=default,file_processing,data_indexing --loglevel=info

# 2. Run Beat Scheduler
python -m celery -A celery_app beat --loglevel=info

# 3. Run Flower Monitoring Dashboard
python -m celery -A celery_app flower --conf=flowerconfig.py
```

> [!NOTE]
> Open your browser and navigate to **`http://localhost:5555`** to monitor real-time worker metrics in the Flower dashboard.

---

## 📂 Project Structure

```text
├── docker/                 # Docker compose & database configurations
├── src/
│   ├── auth/              # JWT & session authentication
│   ├── controllers/       # NLP, Upload, Processing & User controllers
│   ├── models/            # SQLAlchemy schemas & Pydantic models
│   ├── routes/            # FastAPI route endpoints (NLP, Auth, Data, Messages)
│   ├── stores/            # LLM providers, VectorDB adapters, MCP tools & Voice
│   ├── views/             # Frontend web application interface
│   └── main.py            # FastAPI application bootstrap & DI
└── requirements.txt       # Project dependencies
```

---

## 📄 License

Distributed under the [Apache 2.0 License](./LICENCE).