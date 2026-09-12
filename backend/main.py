from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import agent_tools

app = FastAPI(title='Crypto Autopsy API')

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change in production
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InvestigateRequest(BaseModel):
    symbol: str

@app.get('/')
def read_root():
    return {'message': 'Crypto Autopsy API is running'}

@app.post('/api/investigate')
def investigate_token(req: InvestigateRequest):
    """
    Triggers the Agent to investigate a specific token.
    """
    symbol = req.symbol.upper()
    
    # Run the orchestration (Agent)
    evidence = agent_tools.generate_evidence_graph(symbol)
    
    if "error" in evidence:
        raise HTTPException(status_code=400, detail=evidence["error"])
        
    return {
        "status": "success",
        "data": evidence
    }

import doctor_agent

class ChatRequest(BaseModel):
    message: str
    token_context: str = None

@app.post('/api/chat')
def chat(req: ChatRequest):
    """
    Doctor Agent chat endpoint.
    """
    response = doctor_agent.chat_with_doctor(req.message, req.token_context)
    return response
