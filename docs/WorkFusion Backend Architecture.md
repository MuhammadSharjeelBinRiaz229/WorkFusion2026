**WorkFusion Backend Architecture & API Specification**

Version: 1.0\
Status: Master Backend Document\
Priority: Critical\
Applies To: Node.js + Express + MongoDB

**1. Purpose**

This document defines the backend architecture of WorkFusion.

The backend is the core of the platform and is responsible for:

-   Business Logic

-   Authentication

-   Authorization

-   Validation

-   Database Operations

-   AI Communication

-   Notifications

-   Activity Logging

The frontend should only consume APIs.

**2. Backend Philosophy**

The backend is the **single source of truth**.

Never place business logic inside:

-   React Components

-   Pages

-   Client-side Hooks

Business logic belongs only inside the backend.

**3. Technology Stack**

Runtime

-   Node.js

Framework

-   Express.js

Language

-   TypeScript

Database

-   MongoDB Atlas

ODM

-   Mongoose

Authentication

-   JWT

-   Refresh Token

Password Hashing

-   bcrypt

Validation

-   Zod / express-validator

Security

-   Helmet

-   CORS

-   Rate Limiter

**4. Backend Folder Structure**

server/

src/

config/

controllers/

services/

repositories/

models/

routes/

middleware/

validators/

utils/

constants/

seed/

jobs/

tests/

**5. Layered Architecture**

Request

↓

Route

↓

Middleware

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

MongoDB

↓

Response

**6. Responsibilities**

**Routes**

Responsible for:

-   Endpoint registration

-   Middleware chaining

Should NOT contain:

-   Business logic

**Controllers**

Responsible for:

-   Receiving request

-   Calling service

-   Returning response

Should NOT contain:

-   Database queries

-   Complex logic

**Services**

Responsible for:

-   Business rules

-   Decision making

-   Processing

Should contain:

-   Core application logic

**Repositories**

Responsible for:

-   MongoDB operations

Only repositories should communicate with models.

**Models**

Responsible for:

-   Schema definition

Nothing else.

**7. Authentication Module**

Supports:

-   Register

-   Login

-   Logout

-   Refresh Token

**Register Flow**

User

↓

Validate

↓

Check duplicate

↓

Hash Password

↓

Create Account

↓

Generate Token

↓

Return Response

**Login Flow**

Email

↓

Password

↓

Compare Hash

↓

Generate JWT

↓

Generate Refresh Token

↓

Success

**8. Authorization**

Three roles:

Employer

Service Seeker

Admin

Every protected endpoint must verify:

-   Authentication

AND

-   Authorization

**9. Employer Module**

Employer can:

-   Create Job

-   Edit Job

-   Delete Job

-   Pause Job

-   Close Job

-   View Applicants

-   Interview Applicant

-   Hire Applicant

-   Reject Applicant

**10. Service Seeker Module**

Can:

-   Update Profile

-   Upload Resume

-   Upload Portfolio

-   Browse Jobs

-   Save Jobs

-   Apply

-   View Recommendations

-   Chat

-   Review Employer

**11. Admin Module**

Admin can:

-   Manage Users

-   Manage Jobs

-   Manage Categories

-   Manage Reports

-   View Logs

-   Moderate Platform

**12. Job Lifecycle**

Draft

↓

Open

↓

Applications

↓

Interview

↓

Accepted

↓

Completed

↓

Archived

**13. Application Lifecycle**

Applied

↓

Pending

↓

Reviewed

↓

Interview

↓

Accepted

↓

Hired

↓

Completed

or

Rejected

**14. Messaging Rules**

Messaging is NOT available immediately.

It becomes available only when:

Application Status

↓

Interview

↓

Chat Enabled

**15. Chat Module**

Supports:

-   Text

-   Images

-   PDFs

-   Resume

-   Portfolio

Future:

-   Voice

-   Video

**16. Review Module**

After completion:

Employer reviews Seeker.

Seeker reviews Employer.

Rating:

1

2

3

4

5

**17. Notification Module**

Triggers:

-   Registration

-   Application

-   Interview

-   Acceptance

-   Rejection

-   Recommendation

-   Message

**18. Bookmark Module**

Supports:

-   Save Job

-   Remove Job

-   View Saved Jobs

**19. Search Module**

Supports:

-   Keyword

-   Category

-   Skills

-   Location

-   Budget

-   Work Type

Sorting:

-   Best Match

-   Newest

-   Oldest

-   Highest Budget

**20. Recommendation Integration**

Node should NEVER calculate recommendations.

Flow:

Node

↓

Python API

↓

Recommendation Engine

↓

Return JSON

↓

Frontend

**21. Standard API Response**

Success

{

\"success\": true,

\"message\": \"Success\",

\"data\": {}

}

Failure

{

\"success\": false,

\"message\": \"Validation failed\",

\"errors\": \[\]

}

**22. Error Handling**

Centralized.

Never expose internal errors.

Always log:

-   Error

-   Route

-   User

-   Timestamp

**23. Logging**

Maintain logs for:

-   Register

-   Login

-   Logout

-   Create Job

-   Update Job

-   Delete Job

-   Apply

-   Interview

-   Hire

-   Reject

-   Message

-   Review

**24. Security**

Implement:

-   JWT

-   Refresh Token

-   bcrypt

-   Helmet

-   CORS

-   Rate Limiter

-   Input Sanitization

Never hardcode secrets.

Use environment variables.

**25. Performance**

Optimize:

-   Database indexes

-   Pagination

-   Lean queries

-   Efficient filtering

Never return unlimited datasets.

**26. Pagination**

Every listing endpoint supports:

page

limit

sort

search

**27. Seed Data**

Automatically generate:

-   15 Employers

-   25 Service Seekers

-   40 Jobs

-   60 Applications

-   50 Reviews

-   100 Messages

-   100 Notifications

The data should simulate realistic hiring scenarios.

**28. Testing Requirements**

Every module must include:

-   Unit Tests

-   API Tests

-   Integration Tests

-   Validation Tests

-   Security Tests

**29. Future Compatibility**

The backend architecture should support future:

-   Payment Integration

-   WebSockets

-   Docker

-   Kubernetes

-   Redis

-   Mobile Applications

-   Enterprise Accounts

without significant redesign.

**30. Master Directive**

The backend must be designed as if WorkFusion will serve millions of
users.

When choosing between:

Simple Implementation

or

Scalable Architecture

Always choose the scalable architecture.

The backend is the foundation of WorkFusion and must remain modular,
secure, maintainable, and production-ready.
