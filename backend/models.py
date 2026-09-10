from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    cmc_id = Column(Integer, unique=True, index=True)
    symbol = Column(String, index=True)
    name = Column(String)
    category = Column(String, nullable=True)

class DeathScore(Base):
    __tablename__ = "death_scores"

    id = Column(Integer, primary_key=True, index=True)
    token_id = Column(Integer, index=True)
    total_score = Column(Float)
    volume_score = Column(Float)
    liquidity_score = Column(Float)
    relative_score = Column(Float)
    market_cap_score = Column(Float, nullable=True)
    volatility_score = Column(Float, nullable=True)
    dex_score = Column(Float, nullable=True)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)
    token_id = Column(Integer, index=True)
    status = Column(String) # e.g., 'pending', 'completed'
    timeline_json = Column(Text)
    evidence_json = Column(Text)
    ai_diagnosis_text = Column(Text)
    doctor_orders_json = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
