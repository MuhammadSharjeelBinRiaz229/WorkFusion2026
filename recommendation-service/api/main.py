from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ranking.weighted_ranker import rank_job_for_seeker, rank_candidate_for_job

app = FastAPI(
    title="WorkFusion Recommendation Engine",
    description="AI service utilizing TF-IDF and Cosine Similarity to calculate job and candidate matching scores.",
    version="1.0"
)

# ==========================================
# PYDANTIC MODEL SCHEMAS
# ==========================================

class SeekerModel(BaseModel):
    id: str
    skills: List[str]
    portfolio: str
    experience: int
    preferredCategory: Optional[str] = ""
    city: str
    availability: Optional[str] = ""
    rating: float = 5.0
    reviewCount: int = 0

class JobModel(BaseModel):
    id: str
    title: str
    description: str
    requiredSkills: List[str]
    category: str
    serviceType: str
    workType: str
    experienceRequired: int
    location: str
    remoteAllowed: bool = False
    budget: float

class JobsRecommendationRequest(BaseModel):
    seeker: SeekerModel
    jobs: List[JobModel]

class CandidatesRecommendationRequest(BaseModel):
    job: JobModel
    candidates: List[SeekerModel]

# ==========================================
# ENDPOINTS
# ==========================================

@app.get("/health")
def health_check():
    return {"status": "online", "service": "WorkFusion AI Recommendation Service"}

@app.post("/api/recommend/jobs")
def recommend_jobs(payload: JobsRecommendationRequest):
    try:
      seeker_dict = payload.seeker.model_dump()
      recommendations = []
      
      for job in payload.jobs:
          job_dict = job.model_dump()
          match = rank_job_for_seeker(seeker_dict, job_dict)
          recommendations.append(match)
          
      return {"success": True, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal matching computation failed: {str(e)}")

@app.post("/api/recommend/candidates")
def recommend_candidates(payload: CandidatesRecommendationRequest):
    try:
      job_dict = payload.job.model_dump()
      recommendations = []
      
      for candidate in payload.candidates:
          candidate_dict = candidate.model_dump()
          match = rank_candidate_for_job(job_dict, candidate_dict)
          recommendations.append(match)
          
      return {"success": True, "recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal matching computation failed: {str(e)}")
