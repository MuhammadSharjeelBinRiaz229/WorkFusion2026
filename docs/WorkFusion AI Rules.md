**WorkFusion AI Rules**

Version: 1.0\
Status: Master AI Rules Specification\
Priority: Highest

**Purpose**

This document defines how the Artificial Intelligence module of
WorkFusion should operate.

The AI engine must be modular, explainable, scalable, and deterministic.

**AI Philosophy**

The AI should assist users, not replace human decision-making.

It should:

-   Recommend

-   Rank

-   Analyze

-   Explain

It should never make irreversible decisions automatically.

**AI Pipeline**

Input Data

↓

Preprocessing

↓

TF-IDF Vectorization

↓

Cosine Similarity

↓

Weighted Ranking

↓

Recommendation

↓

Explanation

**AI Responsibilities**

The AI module is responsible for:

-   Job Recommendation

-   Candidate Recommendation

-   Match Score

-   Candidate Ranking

-   Skill Gap Analysis

-   Recommendation Explanation

The AI module is **not** responsible for:

-   Authentication

-   Authorization

-   Database CRUD

-   UI rendering

**Input Data**

For Service Seekers:

-   Skills

-   Experience

-   Resume

-   Portfolio

-   Education

-   Reviews

-   Preferred Category

For Jobs:

-   Title

-   Description

-   Required Skills

-   Category

-   Work Type

-   Location

-   Experience Required

**Text Preprocessing**

Every text should undergo:

Lowercase

↓

Remove punctuation

↓

Remove stopwords

↓

Tokenization

↓

Normalization

↓

TF-IDF Vectorization

**TF-IDF Rules**

TF-IDF should convert:

-   Job Descriptions

-   Skills

-   Resume Text

-   Portfolio Descriptions

into numerical vectors for comparison.

**Cosine Similarity**

Similarity calculation:

Job Vector

×

Candidate Vector

↓

Cosine Similarity

↓

Match Score

Example:

0.94

↓

94%

**Weighted Ranking**

Final ranking should use multiple factors:

  -----------------------------------------------------------------------
  **Feature**                                **Weight**
  ------------------------------------------ ----------------------------
  Skills                                     45%

  Portfolio                                  15%

  Experience                                 10%

  Reviews                                    10%

  Category                                   10%

  Location                                   5%

  Availability                               5%
  -----------------------------------------------------------------------

Weights should be configurable.

**Explainable AI**

Never show only:

96%

Always show:

96%

Reason

✓ React matched

✓ Node matched

✓ Portfolio matched

✓ Experience matched

**Skill Gap Analysis**

Example:

Job requires:

-   React

-   Node

-   Docker

-   AWS

Candidate has:

-   React

-   Node

Output:

Match Score

88%

Missing Skills

❌ Docker

❌ AWS

**Candidate Ranking**

Employers should see applicants ranked using:

-   Skills

-   Portfolio

-   Experience

-   Reviews

-   Availability

-   Category Match

Never rank randomly.

**Job Recommendation**

Service Seekers should receive:

-   Top 5 Jobs

-   Top 10 Jobs

-   Top 20 Jobs

sorted by highest score.

**Portfolio Analysis**

Portfolio projects should improve recommendations.

Projects with relevant technologies should increase the match score.

**Review Score**

Candidates with:

-   Better ratings

-   More completed jobs

-   Positive reviews

should rank higher.

**Location Score**

For physical jobs:

Location should significantly affect ranking.

For remote jobs:

Location should have minimal impact.

**API Endpoints**

POST /api/v1/recommend/jobs

Returns:

-   Match Score

-   Recommendation Reason

-   Missing Skills

POST /api/v1/recommend/candidates

Returns:

-   Ranked Candidates

-   Match Score

-   Explanation

**Performance Rules**

Do not retrain the model for every request.

Reuse:

-   Cached Vectorizer

-   Cached Vocabulary

-   Cached Model

Optimize for fast inference.

**Failure Handling**

If the AI service is unavailable:

Fallback strategy:

Latest Jobs

↓

Popular Jobs

↓

Category-Based Jobs

The platform should continue functioning.

**Future Compatibility**

The architecture should support:

-   Resume Parser

-   AI Career Coach

-   AI Interview Assistant

-   Salary Prediction

-   Semantic Search

-   SBERT

-   BERT

-   LLM-based Ranking

without redesign.

**Master Directive**

The AI recommendation engine is the flagship feature of WorkFusion.

Every recommendation must be:

-   Accurate

-   Explainable

-   Deterministic

-   Fast

-   Scalable

-   Fair

Never generate arbitrary scores or opaque rankings. The AI should help
users understand **why** a recommendation was made and how they can
improve their compatibility.
