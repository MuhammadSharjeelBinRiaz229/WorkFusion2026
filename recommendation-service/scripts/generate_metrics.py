import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Adjust path to import modules from recommendation-service/
script_dir = os.path.dirname(os.path.abspath(__file__))
base_dir = os.path.dirname(script_dir)
sys.path.append(base_dir)

from similarity.similarity_calculator import compute_list_similarity
from ranking.weighted_ranker import rank_job_for_seeker

# Create docs/images directory if it doesn't exist
images_dir = os.path.join(os.path.dirname(base_dir), "docs", "images")
os.makedirs(images_dir, exist_ok=True)

# 1. Define Seed Dataset of Service Seekers and Jobs
seekers = [
    {
        "id": "seeker_1",
        "name": "Muhammad Ali",
        "skills": ["React", "Node.js", "MongoDB", "Express", "TypeScript"],
        "portfolio": "Built standard SaaS dashboard integrated with Node API, custom e-commerce web app.",
        "experience": 4,
        "preferredCategory": "Software Development",
        "city": "Islamabad",
        "availability": "Immediate full-time",
        "rating": 4.8,
        "reviewCount": 8
    },
    {
        "id": "seeker_2",
        "name": "Ayesha Khan",
        "skills": ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Wireframing"],
        "portfolio": "Designed mobile UI mockups for a fintech app, landing page wireframes.",
        "experience": 3,
        "preferredCategory": "Graphic Design",
        "city": "Lahore",
        "availability": "part-time contract",
        "rating": 4.2,
        "reviewCount": 4
    },
    {
        "id": "seeker_3",
        "name": "Sajid Mahmood",
        "skills": ["Plumbing", "Water Pipeline", "Leak Fixing", "Sanitary fitting"],
        "portfolio": "Installed residential pipelines, solved high-pressure water pipe leakages.",
        "experience": 5,
        "preferredCategory": "Plumbing",
        "city": "Rawalpindi",
        "availability": "hourly physical",
        "rating": 4.6,
        "reviewCount": 12
    },
    {
        "id": "seeker_4",
        "name": "Zainab Raza",
        "skills": ["Python", "Machine Learning", "scikit-learn", "pandas", "numpy", "TensorFlow"],
        "portfolio": "Developed predictive classification models and natural language recommendation engine.",
        "experience": 6,
        "preferredCategory": "Software Development",
        "city": "Karachi",
        "availability": "Immediate full-time",
        "rating": 4.9,
        "reviewCount": 15
    },
    {
        "id": "seeker_5",
        "name": "Bilal Ahmed",
        "skills": ["SEO", "Google Ads", "Content Writing", "SMM", "Copywriting"],
        "portfolio": "Optimized corporate website search ranking, managed paid social ad campaigns.",
        "experience": 2,
        "preferredCategory": "Marketing",
        "city": "Islamabad",
        "availability": "Immediate full-time",
        "rating": 4.0,
        "reviewCount": 2
    }
]

jobs = [
    {
        "id": "job_1",
        "title": "MERN Stack Developer",
        "description": "Requires React, Node, and TypeScript skills to build dashboard panels and API integrations.",
        "requiredSkills": ["React", "Node.js", "TypeScript", "MongoDB"],
        "category": "Software Development",
        "serviceType": "Online",
        "workType": "Full-Time",
        "experienceRequired": 3,
        "location": "Islamabad",
        "remoteAllowed": True,
        "budget": 120000
    },
    {
        "id": "job_2",
        "title": "UI/UX Designer",
        "description": "Looking for a Figma designer to build high-fidelity wireframes and interactive prototypes.",
        "requiredSkills": ["Figma", "Adobe XD", "Wireframing"],
        "category": "Graphic Design",
        "serviceType": "Physical",
        "workType": "Part-Time",
        "experienceRequired": 3,
        "location": "Lahore",
        "remoteAllowed": False,
        "budget": 60000
    },
    {
        "id": "job_3",
        "title": "Sanitary Piping & Plumbing Help",
        "description": "Urgent help needed to fix domestic pipeline leakage and install new sanitary items.",
        "requiredSkills": ["Plumbing", "Leak Fixing", "Water Pipeline"],
        "category": "Plumbing",
        "serviceType": "Physical",
        "workType": "Hourly",
        "experienceRequired": 2,
        "location": "Rawalpindi",
        "remoteAllowed": False,
        "budget": 5000
    },
    {
        "id": "job_4",
        "title": "Machine Learning Engineer",
        "description": "Requires python, pandas, and scikit-learn experience to build recommendation services.",
        "requiredSkills": ["Python", "Machine Learning", "scikit-learn", "pandas"],
        "category": "Software Development",
        "serviceType": "Online",
        "workType": "Full-Time",
        "experienceRequired": 4,
        "location": "Islamabad",
        "remoteAllowed": True,
        "budget": 180000
    },
    {
        "id": "job_5",
        "title": "SEO & Digital Marketing Officer",
        "description": "Run search engine optimization campaigns, Google PPC advertisements, and manage SMM.",
        "requiredSkills": ["SEO", "Google Ads", "SMM"],
        "category": "Marketing",
        "serviceType": "Physical",
        "workType": "Full-Time",
        "experienceRequired": 3,
        "location": "Karachi",
        "remoteAllowed": False,
        "budget": 80000
    }
]

# Ground Truth Relevance Matrix (Binary relevance)
# relevance_matrix[seeker_idx][job_idx] = 1 if relevant, 0 if not
relevance_matrix = np.array([
    [1, 0, 0, 1, 0],  # Muhammad Ali (Software preferred) -> Job 1 (MERN), Job 4 (ML) are Software Development
    [0, 1, 0, 0, 0],  # Ayesha Khan (Graphic preferred) -> Job 2 (UX) is Graphic Design
    [0, 0, 1, 0, 0],  # Sajid Mahmood (Plumbing preferred) -> Job 3 (Plumbing) is Plumbing
    [1, 0, 0, 1, 0],  # Zainab Raza (Software preferred) -> Job 1 (MERN), Job 4 (ML) are Software Development
    [0, 0, 0, 0, 1]   # Bilal Ahmed (Marketing preferred) -> Job 5 (Marketing) is Marketing
])

# 2. Run Weighted Ranking and Compute Score Grid
scores_grid = np.zeros((len(seekers), len(jobs)))
similarity_grid = np.zeros((len(seekers), len(jobs))) # pure skill cosine similarity

for s_idx, seeker in enumerate(seekers):
    for j_idx, job in enumerate(jobs):
        # Weighted Ranking score
        res = rank_job_for_seeker(seeker, job)
        scores_grid[s_idx, j_idx] = res["score"]
        
        # Pure Skill Cosine Similarity scaled to 100
        seeker_skills = seeker.get("skills", [])
        job_skills = job.get("requiredSkills", [])
        sim = compute_list_similarity(seeker_skills, job_skills)
        similarity_grid[s_idx, j_idx] = int(round(sim * 100))

# 3. Calculate Ranking Evaluation Metrics
def calculate_metrics(scores, relevance):
    map_scores = []
    mrr_scores = []
    
    for i in range(len(seekers)):
        seeker_scores = scores[i]
        seeker_rel = relevance[i]
        
        # Sort jobs by matching score in descending order
        sorted_indices = np.argsort(-seeker_scores)
        sorted_rel = seeker_rel[sorted_indices]
        
        # Calculate Average Precision (AP)
        num_relevant = np.sum(seeker_rel)
        if num_relevant == 0:
            continue
            
        hits = 0
        sum_precision = 0.0
        for rank, rel in enumerate(sorted_rel):
            if rel == 1:
                hits += 1
                precision = hits / (rank + 1)
                sum_precision += precision
                
        ap = sum_precision / num_relevant
        map_scores.append(ap)
        
        # Calculate Reciprocal Rank (RR)
        first_rel_rank = np.where(sorted_rel == 1)[0]
        if len(first_rel_rank) > 0:
            mrr_scores.append(1.0 / (first_rel_rank[0] + 1))
        else:
            mrr_scores.append(0.0)
            
    return np.mean(map_scores), np.mean(mrr_scores)

map_val, mrr_val = calculate_metrics(scores_grid, relevance_matrix)

# Print metrics to console
print(f"Mean Average Precision (MAP): {map_val:.4f}")
print(f"Mean Reciprocal Rank (MRR): {mrr_val:.4f}")

true_match_scores = scores_grid[relevance_matrix == 1]
mismatch_scores = scores_grid[relevance_matrix == 0]
print(f"Average True Match Score: {np.mean(true_match_scores):.2f}%")
print(f"Average Mismatch Score: {np.mean(mismatch_scores):.2f}%")
print(f"Discriminative Margin: {np.mean(true_match_scores) - np.mean(mismatch_scores):.2f}%")

# 4. Generate Visualizations

# Set theme for plots
sns.set_theme(style="whitegrid")
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Liberation Sans']

# Plot 1: Seeker-Job Match Heatmap
plt.figure(figsize=(10, 7))
seeker_names = [s["name"] for s in seekers]
job_titles = [j["title"] for j in jobs]

df_heatmap = pd.DataFrame(scores_grid, index=seeker_names, columns=job_titles)
sns.heatmap(df_heatmap, annot=True, cmap="Blues", fmt=".0f", cbar_kws={'label': 'Match Score (%)'}, 
            linewidths=.5, annot_kws={"size": 12, "weight": "bold"})
plt.title("WorkFusion AI Match Score Heatmap\n(Weighted Multi-Factor Model)", fontsize=16, pad=15, weight="bold")
plt.xlabel("Job Vacancies", fontsize=12, labelpad=10)
plt.ylabel("Service Seekers", fontsize=12, labelpad=10)
plt.xticks(rotation=15, ha='right')
plt.tight_layout()
plt.savefig(os.path.join(images_dir, "match_heatmap.png"), dpi=300)
plt.close()

# Plot 2: Cosine Similarity vs. Weighted Match Score
# We compare Seeker 1 (Muhammad Ali) across all 5 jobs
plt.figure(figsize=(10, 6))
jobs_short = ["MERN Dev\n(Islamabad)", "UI/UX\n(Lahore)", "Plumbing\n(Rawalpindi)", "ML Dev\n(Islamabad)", "SEO\n(Karachi)"]
df_compare = pd.DataFrame({
    'Job': jobs_short * 2,
    'Score': list(similarity_grid[0]) + list(scores_grid[0]),
    'Method': ['Pure Skill TF-IDF Cosine Similarity'] * 5 + ['WorkFusion Weighted Multi-Factor Score'] * 5
})

ax = sns.barplot(x='Job', y='Score', hue='Method', data=df_compare, palette="muted")
plt.title("Comparison: Pure Skill Cosine Similarity vs. Weighted Match Score\n(For Seeker: Muhammad Ali)", fontsize=14, pad=15, weight="bold")
plt.ylabel("Score (%)", fontsize=12)
plt.xlabel("Job Vacancy & Location", fontsize=12)
plt.ylim(0, 110)

# Add values on top of bars
for p in ax.patches:
    height = p.get_height()
    if height > 0:
        ax.annotate(f'{height:.0f}%',
                    (p.get_x() + p.get_width() / 2., height),
                    ha='center', va='bottom',
                    xytext=(0, 3),
                    textcoords='offset points',
                    fontsize=9, weight="bold")

plt.legend(loc="upper right")
plt.tight_layout()
plt.savefig(os.path.join(images_dir, "similarity_comparison.png"), dpi=300)
plt.close()

# Plot 3: Match Score Component Breakdown (Muhammad Ali vs MERN Stack Developer)
# We manually decompose the score components based on weighted_ranker's math
# Muhammad Ali (Seeker 1) vs Job 1 (MERN Islamabad):
# 1. Skills: Seeker has ["React", "Node.js", "MongoDB", "Express", "TypeScript"], Job requires ["React", "Node.js", "TypeScript", "MongoDB"].
#    Overlap = 4/4 = 1.0 (similarity is 1.0). Score = 1.0 * 45 = 45.0
# 2. Portfolio: Description contains dashboard panels, react, node, typescript. Seeker portfolio: "Built standard SaaS dashboard integrated with Node API, custom e-commerce web app."
#    Let's compute actual similarity. We can get it or approximate it from the code execution, but we'll use actual run results:
#    In this match, portfolio score is approximately 15 points (strong match).
# 3. Experience: Seeker 4 yrs, Job requires 3 yrs. meets requirement -> Score = 10.0
# 4. Reviews: Seeker rating 4.8. Sim = (4.8 - 1.0)/4.0 = 0.95. Score = 0.95 * 10 = 9.5
# 5. Category: Software Development matches Software Development -> Score = 10.0
# 6. Location: Seeker in Islamabad, Job in Islamabad, Remote Allowed -> Score = 5.0
# 7. Availability: Seeker has "Immediate full-time", Job workType is "Full-Time" -> Score = 5.0
# Let's get the exact breakdown using code calculation or reasonable outputs.

# We will run the components manually to get exact graph values
seeker_1 = seekers[0]
job_1 = jobs[0]

# Let's re-run calculations explicitly
skills_sim = compute_list_similarity(seeker_1["skills"], job_1["requiredSkills"])
skills_contrib = skills_sim * 45

# Portfolio Sim
from similarity.similarity_calculator import compute_similarity
port_sim = compute_similarity(seeker_1["portfolio"], job_1["description"])
port_contrib = port_sim * 15

# Experience
exp_sim = min(float(seeker_1["experience"]) / float(job_1["experienceRequired"]), 1.5)
if exp_sim > 1.0: exp_sim = 1.0
exp_contrib = exp_sim * 10

# Reviews
rating_sim = max((float(seeker_1["rating"]) - 1.0) / 4.0, 0.0)
reviews_contrib = rating_sim * 10

# Category
cat_contrib = 10.0 # matches

# Location
loc_contrib = 5.0 # same city & remote

# Availability
avail_contrib = 5.0 # matches

components = {
    'Skills Match\n(Max 45%)': skills_contrib,
    'Portfolio\n(Max 15%)': port_contrib,
    'Experience\n(Max 10%)': exp_contrib,
    'Reviews/Rating\n(Max 10%)': reviews_contrib,
    'Category\n(Max 10%)': cat_contrib,
    'Location\n(Max 5%)': loc_contrib,
    'Availability\n(Max 5%)': avail_contrib
}

plt.figure(figsize=(10, 5))
colors = sns.color_palette("viridis", len(components))
bars = plt.bar(components.keys(), components.values(), color=colors, edgecolor='grey', width=0.6)

plt.title("Weighted Multi-Factor Score Component Breakdown\n(Match: Muhammad Ali vs. MERN Stack Developer)", fontsize=14, pad=15, weight="bold")
plt.ylabel("Contributed Points", fontsize=12)
plt.ylim(0, 50)

# Add values on top of bars
for bar in bars:
    height = bar.get_height()
    plt.annotate(f'{height:.1f}',
                (bar.get_x() + bar.get_width() / 2., height),
                ha='center', va='bottom',
                xytext=(0, 3),
                textcoords='offset points',
                fontsize=10, weight="bold")

plt.tight_layout()
plt.savefig(os.path.join(images_dir, "score_breakdown.png"), dpi=300)
plt.close()

print("All plots generated and saved to docs/images/")
