from fastapi import APIRouter, HTTPException, status, Depends, Request, UploadFile
from fastapi.responses import StreamingResponse
import json
from src.models.enums import ResponseSignal
from src.helpers import Settings, get_settings, limiter
from src.auth.oauth2 import get_current_user
from src.models.db.schemas import Message
from src.stores.llm.enums import GroqAiEnum
from src.models import ProjectModel, ChunkModel, ChatModel, MessageModel
from src.controllers import NLPController
from src.routes.schemas import SearchRequest, GenerateRequest, IndexPushRequest
from tqdm.auto import tqdm


nlp_router = APIRouter(
    prefix="/api/v1/nlp",
    tags=["api_v1","nlp"]
)


@nlp_router.post('/index/push/{project_name}', status_code=status.HTTP_200_OK)
@limiter.limit("10/minute")
async def index_into_vector_db(request: Request, project_name: str, push_request: IndexPushRequest,
                            current_user = Depends(get_current_user), app_settings: Settings = Depends(get_settings)): 
    
    vectordb_client = request.app.vectordb_provider_factory.create(
        provider=app_settings.VECTOR_DB_BACKEND,
        current_user=current_user,
        project_name=project_name
    )
    
    _ = await vectordb_client.connect()

    nlp_controller = NLPController(
        db_client=request.app.db_client,
        embedding_client=request.app.embedding_client,
        generation_client=request.app.generation_client,
        vectordb_client=vectordb_client,
        template_parser=request.app.template_parser,
        summary_template_parser=request.app.summary_template_parser,
        voice_transcription_client=request.app.voice_transcription_client
    )

    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    chunk_model = await ChunkModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    project = await project_model.get_project(project_name=project_name)

    collection_name = nlp_controller.get_collection_name(project_name=project_name)

    _ = await vectordb_client.create_collection(
        collection_name=collection_name,
        embedding_size=request.app.embedding_client.embedding_size,
        do_reset=push_request.do_reset
    )

    # setup batching
    total_chunks_count = await chunk_model.get_total_chunks_count(project_id=project.project_id)

    progress_bar = tqdm(
        total=total_chunks_count,
        desc="Vector Indexing",
        position=0
    )

    has_records = True
    page_no = 1
    inserted_items_count = 0
    idx = 0

    while has_records:
        page_chunks = await chunk_model.get_project_chunks(project_id=project.project_id, page=page_no)

        if not page_chunks or len(page_chunks) == 0:
            has_records = False
            break

        chunks_ids = [c.chunk_id for c in page_chunks]
        idx += len(page_chunks)

        is_inserted = await nlp_controller.index_into_vector_db(
            project=project,
            chunks=page_chunks,
            chunks_ids=chunks_ids
        )

        progress_bar.update(len(page_chunks))

        inserted_items_count += len(page_chunks)
        page_no += 1

        if not is_inserted:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, detail=ResponseSignal.INSERT_INTO_VECTORDB_ERROR.value)

    progress_bar.close()
    
    await vectordb_client.disconnect()

    return {
        "message": ResponseSignal.INSERT_INTO_VECTORDB_SUCCESS.value,
        "inserted items count": inserted_items_count,
        "total pages": page_no - 1
    }


@nlp_router.get('/index/info/{project_name}', status_code=status.HTTP_200_OK)
async def get_project_info(request: Request, project_name: str, current_user = Depends(get_current_user), app_settings: Settings = Depends(get_settings)):
    vectordb_client = request.app.vectordb_provider_factory.create(
        provider=app_settings.VECTOR_DB_BACKEND,
        current_user=current_user,
        project_name=project_name
    )
    
    _ = await vectordb_client.connect()

    nlp_controller = NLPController(
        db_client=request.app.db_client,
        embedding_client=request.app.embedding_client,
        generation_client=request.app.generation_client,
        vectordb_client=vectordb_client,
        template_parser=request.app.template_parser,
        summary_template_parser=request.app.summary_template_parser,
        voice_transcription_client=request.app.voice_transcription_client
    )

    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    project = await project_model.get_project(project_name=project_name)

    collection_info = await nlp_controller.get_vector_db_collection_info(project=project)

    await vectordb_client.disconnect()

    return {
        "message": ResponseSignal.VECTORDB_COLLECTION_RETRIEVED.value,
        "collection_info": collection_info
    }


@nlp_router.post('/index/search/{project_name}')
async def search_index(request: Request, project_name: str, search_request: SearchRequest, current_user = Depends(get_current_user), app_settings: Settings = Depends(get_settings)):
    vectordb_client = request.app.vectordb_provider_factory.create(
            provider=app_settings.VECTOR_DB_BACKEND,
            current_user=current_user,
            project_name=project_name
        )
        
    _ = await vectordb_client.connect()
    
    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    
    project = await project_model.get_project(project_name=project_name)
    
    nlp_controller = NLPController(
        db_client=request.app.db_client,
        embedding_client=request.app.embedding_client,
        generation_client=request.app.generation_client,
        vectordb_client=vectordb_client,
        template_parser=request.app.template_parser,
        summary_template_parser=request.app.summary_template_parser,
        voice_transcription_client=request.app.voice_transcription_client
    )

    results = await nlp_controller.search_vector_db_collection(project=project, text=search_request.text, limit=search_request.limit)

    if not results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=ResponseSignal.VECTOR_SEARCH_FAILED.value)

    await vectordb_client.disconnect()

    return {
        "message": ResponseSignal.VECTOR_SEARCH_SUCCESS.value,
        "results length": len(results),
        "results": [result for result in results]
    }



@nlp_router.post('/index/answer/{project_name}')
@limiter.limit("20/minute")
async def answer_rag(request: Request, project_name: str, generate_request: GenerateRequest, current_user = Depends(get_current_user), app_settings: Settings = Depends(get_settings)):
    vectordb_client = request.app.vectordb_provider_factory.create(
            provider=app_settings.VECTOR_DB_BACKEND,
            current_user=current_user,
            project_name=project_name
        )
        
    _ = await vectordb_client.connect()
    
    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    chat_model = await ChatModel.create_instance(current_user=current_user, db_client=request.app.db_client)    
    message_model = await MessageModel.create_instance(current_user=current_user, db_client=request.app.db_client)    
    
    project = await project_model.get_project(project_name=project_name)
    chat = await chat_model.get_project_chat(project_id=project.project_id)
    total_messages_count = await message_model.get_total_message_count(chat_id=chat.chat_id)
        
    nlp_controller = NLPController(
        db_client=request.app.db_client,
        embedding_client=request.app.embedding_client,
        generation_client=request.app.generation_client,
        vectordb_client=vectordb_client,
        template_parser=request.app.template_parser,
        summary_template_parser=request.app.summary_template_parser,
        voice_transcription_client=request.app.voice_transcription_client
    )

    last_chat_messages = await message_model.get_last_chat_messages(chat_id=chat.chat_id)
    summary = await chat_model.get_chat_summary(chat=chat)

    answer, full_prompt, chat_history = await nlp_controller.answer_rag_question(
        project=project,
        query=generate_request.text,
        last_messages=last_chat_messages,
        summary=summary,
        limit=generate_request.limit
    )

    if not answer:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail= ResponseSignal.RAG_ANSWER_ERROR.value)

    # store user message in database
    user_message = Message(
        role = GroqAiEnum.USER.value,
        content = generate_request.text,
        message_order=total_messages_count+1,
        chat_id = chat.chat_id
    )

    _ = await message_model.create_message(message=user_message)
    
    total_messages_count = await message_model.get_total_message_count(chat_id=chat.chat_id)
    
    # store ai message in database
    ai_message = Message(
        role = GroqAiEnum.ASSISTANT.value,
        content = answer,
        message_order=total_messages_count+1,
        chat_id = chat.chat_id
    )

    _ = await message_model.create_message(message=ai_message)

    total_messages_count = await message_model.get_total_message_count(chat_id=chat.chat_id)
    
    # update old summary if chat message exceed 10 messages
    if total_messages_count > 0 and total_messages_count % 10 == 0:
        summary = await nlp_controller.summarize_conversation(conversation=last_chat_messages, old_summary=summary)
        _ = await chat_model.update_chat_summary(chat_id=chat.chat_id, new_summary=summary)
    
    await vectordb_client.disconnect()

    return {
        "message": ResponseSignal.RAG_ANSWER_SUCCESS.value,
        "respond": answer,
    }


@nlp_router.post('/index/answer/stream/{project_name}')
@limiter.limit("20/minute")
async def answer_rag_stream(request: Request, project_name: str, generate_request: GenerateRequest, current_user = Depends(get_current_user), app_settings: Settings = Depends(get_settings)):
    vectordb_client = request.app.vectordb_provider_factory.create(
            provider=app_settings.VECTOR_DB_BACKEND,
            current_user=current_user,
            project_name=project_name
        )
        
    _ = await vectordb_client.connect()
    
    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    chat_model = await ChatModel.create_instance(current_user=current_user, db_client=request.app.db_client)    
    message_model = await MessageModel.create_instance(current_user=current_user, db_client=request.app.db_client)    
    
    project = await project_model.get_project(project_name=project_name)
    chat = await chat_model.get_project_chat(project_id=project.project_id)
    total_messages_count = await message_model.get_total_message_count(chat_id=chat.chat_id)
        
    nlp_controller = NLPController(
        db_client=request.app.db_client,
        embedding_client=request.app.embedding_client,
        generation_client=request.app.generation_client,
        vectordb_client=vectordb_client,
        template_parser=request.app.template_parser,
        summary_template_parser=request.app.summary_template_parser,
        voice_transcription_client=request.app.voice_transcription_client
    )

    last_chat_messages = await message_model.get_last_chat_messages(chat_id=chat.chat_id)
    summary = await chat_model.get_chat_summary(chat=chat)

    stream_generator, full_prompt, chat_history = await nlp_controller.answer_rag_question_stream(
        project=project,
        query=generate_request.text,
        last_messages=last_chat_messages,
        summary=summary,
        limit=generate_request.limit
    )

    async def sse_event_stream():
        full_answer = ""
        try:
            async for token in stream_generator:
                full_answer += token
                yield f"data: {json.dumps({'text': token})}\n\n"

            yield "data: [DONE]\n\n"

            if full_answer.strip():
                # store user message in database
                user_message = Message(
                    role=GroqAiEnum.USER.value,
                    content=generate_request.text,
                    message_order=total_messages_count+1,
                    chat_id=chat.chat_id
                )
                await message_model.create_message(message=user_message)

                count = await message_model.get_total_message_count(chat_id=chat.chat_id)

                # store ai message in database
                ai_message = Message(
                    role=GroqAiEnum.ASSISTANT.value,
                    content=full_answer,
                    message_order=count+1,
                    chat_id=chat.chat_id
                )
                await message_model.create_message(message=ai_message)

                count = await message_model.get_total_message_count(chat_id=chat.chat_id)

                # update old summary if chat message exceed 10 messages
                if count > 0 and count % 10 == 0:
                    latest_messages = await message_model.get_last_chat_messages(chat_id=chat.chat_id)
                    new_summary = await nlp_controller.summarize_conversation(conversation=latest_messages, old_summary=summary)
                    await chat_model.update_chat_summary(chat_id=chat.chat_id, new_summary=new_summary)

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            await vectordb_client.disconnect()

    return StreamingResponse(
        sse_event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream"
        }
    )



@nlp_router.post('/index/voice/answer/stream/{project_name}')
@limiter.limit("20/minute")
async def answer_voice_stream(request: Request, project_name: str, user_voice: UploadFile, current_user = Depends(get_current_user), app_settings: Settings = Depends(get_settings)):
    vectordb_client = request.app.vectordb_provider_factory.create(
            provider=app_settings.VECTOR_DB_BACKEND,
            current_user=current_user,
            project_name=project_name
        )
        
    _ = await vectordb_client.connect()

    project_model = await ProjectModel.create_instance(current_user=current_user, db_client=request.app.db_client)
    chat_model = await ChatModel.create_instance(current_user=current_user, db_client=request.app.db_client)    
    message_model = await MessageModel.create_instance(current_user=current_user, db_client=request.app.db_client)    
    
    project = await project_model.get_project(project_name=project_name)
    chat = await chat_model.get_project_chat(project_id=project.project_id)
    total_messages_count = await message_model.get_total_message_count(chat_id=chat.chat_id)
        
    nlp_controller = NLPController(
        db_client=request.app.db_client,
        embedding_client=request.app.embedding_client,
        generation_client=request.app.generation_client,
        vectordb_client=vectordb_client,
        template_parser=request.app.template_parser,
        summary_template_parser=request.app.summary_template_parser,
        voice_transcription_client=request.app.voice_transcription_client
    )

    last_chat_messages = await message_model.get_last_chat_messages(chat_id=chat.chat_id)
    summary = await chat_model.get_chat_summary(chat=chat)

    try:
        transcription, stream_generator, full_prompt, chat_history = await nlp_controller.answer_voice_stream(
            project=project,
            user_voice=user_voice,
            last_messages=last_chat_messages,
            summary=summary,
            limit=3
        )
    except ValueError as ve:
        await vectordb_client.disconnect()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        await vectordb_client.disconnect()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Voice processing failed: {str(e)}")

    async def sse_event_stream():
        full_answer = ""
        try:
            async for token in stream_generator:
                full_answer += token
                yield f"data: {json.dumps({'text': token})}\n\n"

            yield "data: [DONE]\n\n"

            if full_answer.strip():
                # store user message in database
                user_message = Message(
                    role=GroqAiEnum.USER.value,
                    content=transcription if transcription and transcription.strip() else "[Voice Query]",
                    message_order=total_messages_count + 1,
                    chat_id=chat.chat_id
                )
                await message_model.create_message(message=user_message)

                count = await message_model.get_total_message_count(chat_id=chat.chat_id)

                # store ai message in database
                ai_message = Message(
                    role=GroqAiEnum.ASSISTANT.value,
                    content=full_answer,
                    message_order=count + 1,
                    chat_id=chat.chat_id
                )
                await message_model.create_message(message=ai_message)

                count = await message_model.get_total_message_count(chat_id=chat.chat_id)

                # update old summary if chat message exceed 10 messages
                if count > 0 and count % 10 == 0:
                    latest_messages = await message_model.get_last_chat_messages(chat_id=chat.chat_id)
                    new_summary = await nlp_controller.summarize_conversation(conversation=latest_messages, old_summary=summary)
                    await chat_model.update_chat_summary(chat_id=chat.chat_id, new_summary=new_summary)

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            await vectordb_client.disconnect()

    return StreamingResponse(
        sse_event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream"
        }
    )
