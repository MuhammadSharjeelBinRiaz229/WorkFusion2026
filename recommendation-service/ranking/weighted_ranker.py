from similarity.similarity_calculator import compute_similarity, compute_list_similarity

# Adjacency mapping for Twin Cities in Pakistan
TWIN_CITIES = {"islamabad": "rawalpindi", "rawalpindi": "islamabad"}

def rank_job_for_seeker(seeker: dict, job: dict) -> dict:
    """
    Ranks a single job against a seeker profile.
    Returns a dict: { "jobId": str, "score": int, "reason": list, "missingSkills": list }
    """
    reasons = []
    
    # 1. Skills Match (45%)
    seeker_skills = [s.lower() for s in seeker.get("skills", [])]
    job_skills = [s.lower() for s in job.get("requiredSkills", [])]
    
    skills_sim = compute_list_similarity(seeker_skills, job_skills)
    skills_score = skills_sim * 45
    
    # Track exact matches and missing skills
    exact_matches = [s for s in job.get("requiredSkills", []) if s.lower() in seeker_skills]
    missing_skills = [s for s in job.get("requiredSkills", []) if s.lower() not in seeker_skills]
    
    if len(exact_matches) > 0:
        reasons.append(f"✓ Matched {len(exact_matches)} of {len(job.get('requiredSkills', []))} required skills")
    
    # 2. Portfolio Match (15%)
    portfolio_text = seeker.get("portfolio", "")
    job_desc = job.get("description", "")
    
    portfolio_sim = compute_similarity(portfolio_text, job_desc)
    portfolio_score = portfolio_sim * 15
    if portfolio_sim > 0.3:
        reasons.append("✓ Portfolio projects match job scope")
        
    # 3. Experience Match (10%)
    seeker_exp = seeker.get("experience", 0)
    job_exp = job.get("experienceRequired", 0)
    
    if job_exp <= 0:
        exp_sim = 1.0
    else:
        exp_sim = min(float(seeker_exp) / float(job_exp), 1.5)
        if exp_sim > 1.0:
            exp_sim = 1.0
            
    exp_score = exp_sim * 10
    if seeker_exp >= job_exp:
        reasons.append("✓ Experience meets or exceeds requirement")
    else:
        reasons.append(f"• Candidate has {seeker_exp}y experience (job requires {job_exp}y)")

    # 4. Reviews & Ratings Match (10%)
    seeker_rating = seeker.get("rating", 5.0)
    # Scale: 1.0 - 5.0 rating maps to 0.0 - 10.0 score
    rating_sim = max((float(seeker_rating) - 1.0) / 4.0, 0.0)
    reviews_score = rating_sim * 10
    if seeker_rating >= 4.0:
        reasons.append(f"✓ Highly rated profile ({seeker_rating}/5.0)")

    # 5. Category Match (10%)
    seeker_pref_cat = seeker.get("preferredCategory", "").lower()
    job_cat = job.get("category", "").lower()
    
    cat_sim = 0.0
    if seeker_pref_cat and job_cat:
        if seeker_pref_cat in job_cat or job_cat in seeker_pref_cat:
            cat_sim = 1.0
            reasons.append("✓ Matches preferred job category")
            
    cat_score = cat_sim * 10

    # 6. Location Match (5%)
    seeker_city = seeker.get("city", "").strip().lower()
    job_loc = job.get("location", "").strip().lower()
    is_remote = job.get("remoteAllowed", False) or job.get("serviceType", "").lower() == "online"
    
    loc_sim = 0.0
    if is_remote:
        loc_sim = 1.0
        reasons.append("✓ Supports online / remote work style")
    elif seeker_city and job_loc:
        if seeker_city == job_loc:
            loc_sim = 1.0
            reasons.append(f"✓ Located in same city ({seeker.get('city')})")
        elif TWIN_CITIES.get(seeker_city) == job_loc:
            loc_sim = 0.8
            reasons.append("✓ Proximity match (Twin Cities Islamabad/Rawalpindi)")
            
    loc_score = loc_sim * 5

    # 7. Availability Match (5%)
    seeker_avail = seeker.get("availability", "").lower()
    job_work_type = job.get("workType", "").lower()
    
    avail_sim = 0.5 # default moderate match
    if seeker_avail and job_work_type:
        if job_work_type in seeker_avail:
            avail_sim = 1.0
            reasons.append("✓ Matches availability preferences")
            
    avail_score = avail_sim * 5

    # Calculate final score
    final_score = int(round(skills_score + portfolio_score + exp_score + reviews_score + cat_score + loc_score + avail_score))
    # Cap score boundaries
    final_score = min(max(final_score, 10), 99)

    return {
      "jobId": job.get("id"),
      "score": final_score,
      "reason": reasons[:5], # Return top 5 distinct explanation details
      "missingSkills": missing_skills
    }

def rank_candidate_for_job(job: dict, candidate: dict) -> dict:
    """
    Ranks a candidate against a job (inverse wrapper of rank_job_for_seeker).
    Returns a dict: { "candidateId": str, "score": int, "reason": list, "missingSkills": list }
    """
    match = rank_job_for_seeker(candidate, job)
    return {
        "candidateId": candidate.get("id"),
        "score": match["score"],
        "reason": match["reason"],
        "missingSkills": match["missingSkills"]
    }
