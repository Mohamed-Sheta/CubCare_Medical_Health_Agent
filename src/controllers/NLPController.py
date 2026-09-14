from fastapi import UploadFile
from src.controllers import BaseController
from src.models.db.schemas import Project, Chunk
from src.stores.llm.enums import DocumentTypeEnum
from sqlalchemy.orm import sessionmaker
from typing import List, Union
import logging
import json

class NLPController(BaseController):
    def __init__(
    self,
    db_client: sessionmaker,
    embedding_client,
    generation_client,
    vectordb_client,
    template_parser,
    summary_template_parser,
    voice_transcription_client
    ):
        super().__init__(db_client=db_client)
        self.embedding_client = embedding_client
        self.generation_client = generation_client
        self.vectordb_client = vectordb_client
        self.template_parser = template_parser
        self.summary_template_parser = summary_template_parser
        self.voice_transcription_client = voice_transcription_client

        self.logger = logging.getLogger("uvicorn.error")

    
    def get_collection_name(self, project_name: str):
        return f"collection_{self.vectordb_client.default_vector_size}_{project_name}".strip() 

    
    async def get_vector_db_collection_info(self, project: Project):
        collection_name = self.get_collection_name(project_name=project.project_name)

        if not await self.vectordb_client.is_collection_exists(collection_name=collection_name):
            self.logger.error("collection isn't exist")
            return None

        return await self.vectordb_client.get_collection_info(collection_name=collection_name)

    
    async def reset_vector_db_collection(self, project: Project):
        collection_name = self.get_collection_name(project_name=project.project_name)

        return await self.vectordb_client.delete_collection(collection_name=collection_name)


    async def index_into_vector_db(self, project: Project, chunks: List[Chunk], chunks_ids: List[int], do_reset: bool = False):
        collection_name = self.get_collection_name(project_name=project.project_name)
        
        texts = [chunk.chunk_text for chunk in chunks]
        metadata = [chunk.chunk_metadata for chunk in chunks]
        vectors = self.embedding_client.embed_text(text=texts, document_type=DocumentTypeEnum.DOCUMENT.value)

        _ = await self.vectordb_client.create_collection(
            collection_name=collection_name,
            embedding_size=self.embedding_client.embedding_size,
            do_reset=do_reset
        )

        _ = await self.vectordb_client.insert_many(
            collection_name=collection_name,
            texts=texts,
            metadata=metadata,
            vectors=vectors,
            record_ids=chunks_ids
        )

        return True


    async def search_vector_db_collection(self, project: Project, text: str, limit: int = 5):
        collection_name = self.get_collection_name(project_name=project.project_name)

        query_vector = None
        vectors_embedding = self.embedding_client.embed_text(text=text, document_type=DocumentTypeEnum.QUERY.value)

        if not vectors_embedding or len(vectors_embedding) == 0:
            return False

        if isinstance(vectors_embedding, list) and len(vectors_embedding) > 0:
            query_vector = vectors_embedding[0]

        if not query_vector:
            return False
        
        documents = await self.vectordb_client.search_hybrid(
            collection_name=collection_name,
            query=text,
            dense_vector=query_vector,
            limit=limit
        )

        if not documents:
            return False
        
        return json.loads(
           json.dumps(documents, default=lambda x: x.__dict__)
        )


    async def summarize_conversation(self, conversation: Union[str, list], old_summary: str = None):
        if isinstance(conversation, list):
            formatted_conversation = "\n".join([f"{msg.role}: {msg.content}" for msg in conversation])
        else:
            formatted_conversation = str(conversation)

        summary_system_prompt = self.summary_template_parser.get(
            "summary_instruction",
            "summary_instruction_prompt",
            {"old_summary": old_summary if old_summary else "No previous summary"}
        )

        summary_result = await self.generation_client.summarize_conversation(
            conversation=formatted_conversation,
            old_summary=summary_system_prompt
        )

        return summary_result



    async def answer_rag_question(self, project: Project, query: str, last_messages: str, summary: str = "", limit: int = 5):
        answer, full_prompt, chat_history = None, None, None

        # retrieve related documents
        retrieved_documents = await self.search_vector_db_collection(
            project=project,
            text=query,
            limit=limit
        )

        # system prompt
        system_prompt = self.template_parser.get("rag","system_prompt")

        # chat_information_history
        chat_information_history = self.template_parser.get("rag","chat_information_history", {"summary":summary})

        # last_3_messages
        formatted_last_messages = "\n".join([f"{msg.role}: {msg.content}" for msg in last_messages]) if isinstance(last_messages, list) else str(last_messages)
        last_3_messages = self.template_parser.get("rag","last_3_messages",{"messages": formatted_last_messages})

        # document prompts
        documents_prompts = ""
        if retrieved_documents and isinstance(retrieved_documents, list) and len(retrieved_documents) > 0:
            documents_prompts = "\n".join([
                self.template_parser.get(
                    "rag", 
                    "document_prompt", 
                    {
                        "doc_num": i + 1, 
                        "chunk_text": self.generation_client.process_text(doc["text"])
                    }
                ) for i, doc in enumerate(retrieved_documents)
            ])

        # footer prompt
        footer_prompt = self.template_parser.get("rag","footer_prompt", {"query":query})

        full_system_prompt = f"{system_prompt}\n\n{chat_information_history}" if chat_information_history else system_prompt

        chat_history = [
            self.generation_client.construct_prompt(
                prompt=full_system_prompt,
                role=self.generation_client.enums.SYSTEM.value
            )
        ]

        prompt_components = [p for p in [last_3_messages, documents_prompts, footer_prompt] if p]
        full_prompt = "\n\n".join(prompt_components)

        answer = await self.generation_client.generate_text(
            prompt=full_prompt,
            chat_history=chat_history
        )

        return answer, full_prompt, chat_history


    async def answer_rag_question_stream(self, project: Project, query: str, last_messages: str, summary: str = "", limit: int = 5):
        # retrieve related documents
        retrieved_documents = await self.search_vector_db_collection(
            project=project,
            text=query,
            limit=limit
        )

        # system prompt
        system_prompt = self.template_parser.get("rag","system_prompt")

        # chat_information_history
        chat_information_history = self.template_parser.get("rag","chat_information_history", {"summary":summary})

        # last_3_messages
        formatted_last_messages = "\n".join([f"{msg.role}: {msg.content}" for msg in last_messages]) if isinstance(last_messages, list) else str(last_messages)
        last_3_messages = self.template_parser.get("rag","last_3_messages",{"messages": formatted_last_messages})

        # document prompts
        documents_prompts = ""
        if retrieved_documents and isinstance(retrieved_documents, list) and len(retrieved_documents) > 0:
            documents_prompts = "\n".join([
                self.template_parser.get(
                    "rag", 
                    "document_prompt", 
                    {
                        "doc_num": i + 1, 
                        "chunk_text": self.generation_client.process_text(doc["text"])
                    }
                ) for i, doc in enumerate(retrieved_documents)
            ])

        # footer prompt
        footer_prompt = self.template_parser.get("rag","footer_prompt", {"query":query})

        full_system_prompt = f"{system_prompt}\n\n{chat_information_history}" if chat_information_history else system_prompt

        chat_history = [
            self.generation_client.construct_prompt(
                prompt=full_system_prompt,
                role=self.generation_client.enums.SYSTEM.value
            )
        ]

        prompt_components = [p for p in [last_3_messages, documents_prompts, footer_prompt] if p]
        full_prompt = "\n\n".join(prompt_components)

        stream_generator = self.generation_client.generate_text_stream(
            prompt=full_prompt,
            chat_history=chat_history
        )

        return stream_generator, full_prompt, chat_history



    async def answer_voice_stream(self, project: Project, user_voice: UploadFile, last_messages: str, summary: str = "", limit: int = 5):
        transcription = self.voice_transcription_client.transcribe(user_voice)
        stream_generator, full_prompt, chat_history = await self.answer_rag_question_stream(
            project=project, 
            query=transcription,
            last_messages=last_messages,
            summary=summary,
            limit=limit
        )
        return transcription, stream_generator, full_prompt, chat_history
