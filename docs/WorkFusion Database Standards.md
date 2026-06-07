**WorkFusion Database Standards & Data Engineering Rules**

Version: 1.0\
Status: Master Database Rules\
Priority: Critical\
Applies To: MongoDB + Mongoose

**1. Purpose**

This document defines the database engineering standards for WorkFusion.

It establishes how data should be stored, accessed, validated,
optimized, and maintained.

The database must be designed for long-term scalability rather than
short-term convenience.

**2. Database Philosophy**

The database is the foundation of the application.

Good database design should produce:

-   High Performance

-   Data Integrity

-   Scalability

-   Maintainability

-   AI Compatibility

Never design collections based only on current requirements.

Always consider future expansion.

**3. Database Technology**

Database:

-   MongoDB Atlas

ODM:

-   Mongoose

Architecture:

Document-based

**4. Naming Convention**

Collections:

Good

users

jobs

applications

messages

Bad

UserTable

JobData

myCollection

abc

Fields:

Good

fullName

profileCompletion

recommendedScore

Bad

x

abc

data1

**5. Collection Standards**

Every collection must contain:

\_id

createdAt

updatedAt

Whenever appropriate include:

status

**6. IDs**

Always use Mongo ObjectId references.

Do NOT duplicate entire objects unnecessarily.

Example:

Good

application

↓

jobId

↓

userId

Bad

Store complete job object inside application.

**7. Relationships**

Employer

↓

Jobs

↓

Applications

↓

Service Seeker

↓

Interview

↓

Chat

↓

Messages

↓

Review

**8. Soft Delete**

Prefer:

status:

Active

Deleted

instead of permanently deleting records whenever feasible.

**9. Index Strategy**

Create indexes for:

-   email

-   title

-   category

-   location

-   skills

-   status

Avoid unnecessary indexes.

**10. Validation**

Every schema should validate:

-   Required fields

-   Length

-   Type

-   Enum values

Never rely only on frontend validation.

**11. Enumerations**

Example

Status

Draft

Open

Closed

Role

Employer

Service Seeker

Admin

Avoid magic strings throughout the codebase.

**12. Arrays**

Store arrays only when appropriate.

Example

skills

languages

certifications

Avoid deeply nested arrays.

**13. Embedded vs Referenced Data**

Embed:

Small immutable data.

Reference:

Large reusable entities.

Rule:

If data changes independently,

use references.

**14. AI Compatibility**

Database should expose structured data for:

-   Skills

-   Experience

-   Reviews

-   Portfolio

-   Category

-   Availability

AI should not depend on messy text fields.

**15. Resume Storage**

Store:

resumeUrl

NOT

Entire resume binary.

**16. Portfolio Storage**

Store:

title

description

technologies

github

demo

images

**17. Search Optimization**

Support search by:

-   title

-   category

-   skills

-   city

-   employer

-   service type

**18. Pagination**

Every query should support:

page

limit

sort

search

Never return unlimited records.

**19. Sorting**

Support:

-   newest

-   oldest

-   highestBudget

-   bestMatch

**20. Transactions**

Future support should allow transactions for:

-   Hiring

-   Reviews

-   Notifications

Critical operations should remain consistent.

**21. Audit Trail**

Maintain logs for:

-   Login

-   Register

-   Job Creation

-   Application

-   Interview

-   Hiring

-   Review

Never delete audit logs unnecessarily.

**22. Backup Strategy**

Recommended:

Daily

↓

Weekly

↓

Monthly

Backups should be automated.

**23. Seed Data Rules**

Generate realistic data.

Employers:

15+

Service Seekers:

25+

Jobs:

40+

Applications:

60+

Messages:

100+

Reviews:

50+

Notifications:

100+

Data should represent realistic scenarios.

**24. Performance Rules**

Always:

-   Use indexes

-   Use pagination

-   Avoid N+1 style queries

-   Return only required fields

Avoid loading unnecessary data.

**25. Future Compatibility**

Database architecture should support:

-   Payments

-   Enterprise Accounts

-   Organizations

-   Mobile Apps

-   AI Resume Parser

-   AI Career Coach

-   AI Interview Assistant

without redesign.

**26. Security Rules**

Never store:

-   Plain text passwords

-   Secrets

-   API Keys

Passwords must always be hashed.

Sensitive information should never be exposed in API responses.

**27. Data Integrity Rules**

Every relationship should maintain consistency.

Deleting a job should not create orphaned records.

Application status transitions should be validated.

**28. Data Lifecycle**

Create

↓

Validate

↓

Store

↓

Update

↓

Archive

↓

Soft Delete

Never bypass validation.

**29. Definition of Good Database Design**

A good database:

-   Minimizes redundancy

-   Maximizes consistency

-   Supports AI

-   Supports analytics

-   Supports future growth

**30. Master Directive**

The WorkFusion database must be designed as if it will eventually store
millions of records.

Whenever multiple schema designs are possible, always choose the one
that best supports:

1.  Scalability

2.  Maintainability

3.  Performance

4.  Data Integrity

5.  AI Integration

Never sacrifice architecture for short-term implementation convenience.
