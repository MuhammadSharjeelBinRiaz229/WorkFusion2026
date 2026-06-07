**WorkFusion AI Recommendation Engine Specification**

Version: 1.0\
Status: Master AI Document\
Priority: Critical\
Applies To: Python Recommendation Service

**1. Purpose**

This document defines the complete Artificial Intelligence architecture
of WorkFusion.

The AI system is responsible for intelligently matching:

-   Jobs to Service Seekers

-   Service Seekers to Employers

using Natural Language Processing and Machine Learning techniques.

The recommendation engine should improve hiring efficiency while
remaining transparent and explainable.

**2. AI Philosophy**

The AI should assist human decision making.

It should never behave like a black box.

Every recommendation should explain:

-   Why it was recommended

-   Which skills matched

-   Which requirements matched

-   Which areas are missing

Example:

React Developer

96% Match

Reason:

✓ React matched

✓ Node matched

✓ Portfolio matched

✓ Experience matched

**3. AI Technology Stack**

Language

-   Python

Libraries

-   scikit-learn

-   pandas

-   numpy

-   joblib

Algorithms

-   TF-IDF Vectorization

-   Cosine Similarity

-   Weighted Ranking

Future Compatible

-   Sentence Transformers

-   SBERT

-   BERT

-   LLM Ranking

**4. Architecture**

Frontend

↓

Node Backend

↓

Python AI API

↓

Preprocessing

↓

TF-IDF

↓

Cosine Similarity

↓

Weighted Ranking

↓

Response

↓

Frontend

**5. Responsibilities**

The AI service owns:

-   Job Recommendation

-   Candidate Recommendation

-   Ranking

-   Match Score

-   Explainable AI

-   Skill Gap Analysis

The AI service should NOT:

-   Authenticate users

-   Modify database

-   Handle frontend logic

**6. Recommendation Types**

**Type 1**

Job Recommendation

Service Seeker

↓

AI

↓

Recommended Jobs

**Type 2**

Candidate Recommendation

Employer

↓

AI

↓

Recommended Candidates

**7. Input Data**

**Job Data**

Contains:

-   Title

-   Description

-   Skills

-   Category

-   Work Type

-   Service Type

-   Experience Required

**User Data**

Contains:

-   Skills

-   Portfolio

-   Experience

-   Education

-   Bio

-   Preferred Category

-   Preferred Work Type

**8. Text Preprocessing**

Perform:

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

Vectorization

**9. TF-IDF Vectorization**

Convert text documents into numerical vectors.

Example

Job:

React

Node

MongoDB

User:

React

MongoDB

Express

Transform into TF-IDF vectors.

**10. Cosine Similarity**

Compute similarity between vectors.

Job Vector

×

User Vector

↓

Similarity Score

Example:

0.94

=

94%

**11. Weighted Ranking**

Final recommendation should NOT depend solely on cosine similarity.

Use weighted scoring.

**Proposed Weights**

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

**12. Skills Matching**

Use:

TF-IDF

-   

Cosine Similarity

to compare:

-   Required Skills

-   User Skills

**13. Portfolio Matching**

Convert portfolio projects into text.

Example:

Inventory System

Restaurant Website

E-commerce Platform

React

Node

MongoDB

Then compare using TF-IDF.

**14. Experience Score**

Example:

Employer:

3 Years

Candidate:

5 Years

Result:

High Score

**15. Category Score**

Example:

Employer:

Software Development

Candidate:

Software Development

Result:

100%

**16. Location Score**

Example:

Employer:

Islamabad

Candidate:

Rawalpindi

Result:

High Similarity

Remote jobs should always receive high compatibility.

**17. Review Score**

Candidates with:

-   Better ratings

-   More completed jobs

-   More reviews

should rank higher.

**18. Final Formula**

Final Score =

0.45 × Skills

\+

0.15 × Portfolio

\+

0.10 × Experience

\+

0.10 × Reviews

\+

0.10 × Category

\+

0.05 × Location

\+

0.05 × Availability

**19. Top-N Recommendation**

The system should generate:

-   Top 5

-   Top 10

-   Top 20

-   Top 50

recommendations.

Results must be sorted descending.

**20. Explainable AI**

Every recommendation should include reasons.

Example:

96% Match

Reason:

✓ React matched

✓ Node matched

✓ MongoDB matched

✓ Portfolio matched

✓ Experience matched

**21. Skill Gap Analysis**

Example:

Job requires:

-   React

-   Node

-   MongoDB

-   Docker

-   AWS

Candidate has:

-   React

-   Node

-   MongoDB

Display:

Match Score

88%

Missing Skills

❌ Docker

❌ AWS

**22. Employer AI Dashboard**

Display:

-   Best Candidate

-   Average Match Score

-   Top Skills

-   Hiring Insights

**23. Service Seeker AI Dashboard**

Display:

-   Profile Score

-   Recommended Jobs

-   Missing Skills

-   Suggested Learning Areas

**24. API Endpoints**

Job Recommendation

POST

/api/recommend/jobs

Candidate Recommendation

POST

/api/recommend/candidates

**25. Response Format**

{

\"success\": true,

\"recommendations\": \[

{

\"score\": 96,

\"reason\": \[

\"React matched\",

\"Portfolio matched\",

\"Experience matched\"

\]

}

\]

}

**26. Performance**

Optimize using:

-   Cached vectorizer

-   Cached vocabulary

-   Efficient preprocessing

Avoid rebuilding the model for every request.

**27. Future AI Features**

Architecture should support:

-   Resume Parser

-   Career Coach

-   Interview Assistant

-   Salary Prediction

-   Portfolio Analyzer

-   Semantic Search

-   LLM-based Ranking

without redesign.

**28. AI Rules**

Always:

-   Explain recommendations

-   Use structured scoring

-   Return deterministic results

-   Log inference requests

Never:

-   Return random scores

-   Use opaque ranking

-   Hide recommendation reasons

**29. Success Criteria**

The recommendation engine should:

-   Improve matching quality

-   Reduce hiring time

-   Increase relevance

-   Provide explainable results

-   Be modular and scalable

**30. Master Directive**

The AI module should function as an independent intelligent service.

Whenever there is a choice between:

Simple Similarity

or

Explainable Intelligent Ranking

always choose the latter.

The recommendation engine should become one of the defining features of
WorkFusion and be designed for future evolution into an advanced AI
hiring assistant.
