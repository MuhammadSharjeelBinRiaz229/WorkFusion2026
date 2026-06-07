import sys
import os
import unittest

# Adjust path to import modules from recommendation-service/
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from preprocessing.text_cleaner import clean_text
from similarity.similarity_calculator import compute_similarity, compute_list_similarity
from ranking.weighted_ranker import rank_job_for_seeker, rank_candidate_for_job

class TestRecommendationEngine(unittest.TestCase):
    
    # 1. TEXT PREPROCESSING
    def test_clean_text(self):
        raw_text = "I am a Senior MERN developer working with React & Node.js!"
        cleaned = clean_text(raw_text)
        # Verify lowercasing, punctuation removal, and stopword filters
        self.assertNotIn("i", cleaned.split())
        self.assertNotIn("am", cleaned.split())
        self.assertIn("senior", cleaned.split())
        self.assertIn("mern", cleaned.split())
        self.assertIn("react", cleaned.split())

    # 2. SIMILARITY MATH
    def test_similarity_calculator(self):
        text_a = "React Node.js MongoDB"
        text_b = "React MongoDB"
        text_c = "Plumbing pipe fixing"
        
        sim_ab = compute_similarity(text_a, text_b)
        sim_ac = compute_similarity(text_a, text_c)
        
        self.assertGreater(sim_ab, 0.0)
        self.assertEqual(sim_ac, 0.0) # Completely different vocabularies
        self.assertLess(sim_ab, 1.0)

    # 3. WEIGHTED RANKING MATH
    def test_weighted_ranking(self):
        seeker = {
            "id": "seeker_123",
            "skills": ["React", "Node.js", "TypeScript"],
            "portfolio": "Build standard SaaS dashboard integrated with Node API.",
            "experience": 4,
            "preferredCategory": "Web Development",
            "city": "Islamabad",
            "availability": "Immediate full-time",
            "rating": 5.0,
            "reviewCount": 2
        }
        
        job_matching = {
            "id": "job_match",
            "title": "React and Node Developer needed",
            "description": "Build custom dashboard panels. Requires React, Node, and TypeScript skills.",
            "requiredSkills": ["React", "Node.js", "TypeScript"],
            "category": "Web Development",
            "serviceType": "Online",
            "workType": "Full-Time",
            "experienceRequired": 3,
            "location": "Islamabad",
            "remoteAllowed": True,
            "budget": 100000
        }
        
        job_mismatch = {
            "id": "job_mismatch",
            "title": "Urgent Pipe repair and plumbing help",
            "description": "Fix leakages in home water pipelines.",
            "requiredSkills": ["Plumbing", "Leak Fixing"],
            "category": "Sanitary Services",
            "serviceType": "Physical",
            "workType": "Hourly",
            "experienceRequired": 5,
            "location": "Lahore",
            "remoteAllowed": False,
            "budget": 3000
        }
        
        match_result = rank_job_for_seeker(seeker, job_matching)
        mismatch_result = rank_job_for_seeker(seeker, job_mismatch)
        
        self.assertGreater(match_result["score"], 80) # Strong match
        self.assertLess(mismatch_result["score"], 30) # Very poor match
        
        # Verify explainable AI match reasons are filled
        self.assertGreater(len(match_result["reason"]), 0)
        self.assertIn("✓ Experience meets or exceeds requirement", match_result["reason"])

if __name__ == "__main__":
    unittest.main()
