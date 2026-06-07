**WorkFusion API Guidelines & Standards**

Version: 1.0\
Status: Master API Specification\
Priority: Critical

**Purpose**

This document defines the API standards for WorkFusion.

Every API endpoint must follow these standards.

No exceptions.

**API Philosophy**

APIs should be:

-   Predictable

-   RESTful

-   Consistent

-   Versionable

-   Secure

-   Easy to consume

**Base URL**

Development

/api/v1

Future

/api/v2

Never expose APIs without versioning.

**Naming Convention**

Good

GET /jobs

GET /jobs/:id

POST /jobs

PUT /jobs/:id

DELETE /jobs/:id

Bad

/getJobs

/createJob

/updateJob

/deleteJob

Use nouns instead of verbs.

**HTTP Methods**

GET

Retrieve data

POST

Create data

PUT

Replace data

PATCH

Partial update

DELETE

Delete data

**Response Format**

Every response must follow:

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

Never return random response structures.

**Status Codes**

200

OK

201

Created

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

409

Conflict

422

Validation Error

500

Internal Server Error

**Authentication**

Protected routes require:

Authorization:

Bearer \<JWT\>

Never pass tokens in query parameters.

**Authorization**

Roles:

-   Employer

-   Service Seeker

-   Admin

Middleware should validate role before controller execution.

**Pagination**

Every list endpoint supports:

?page=

&limit=

&sort=

&search=

Example

/jobs?page=1&limit=10

**Filtering**

Support:

-   category

-   city

-   skills

-   workType

-   serviceType

-   budget

**Sorting**

Allow:

-   newest

-   oldest

-   highestBudget

-   bestMatch

**Validation**

Validate:

-   Request Body

-   Query Parameters

-   Route Parameters

Never trust client input.

**Error Handling**

Never expose:

-   Stack trace

-   Internal database errors

-   Environment variables

Return user-friendly messages.

**File Upload**

Supported:

-   Resume

-   Portfolio

-   Images

-   PDF

Unsupported files should be rejected.

**AI Endpoints**

POST

/api/v1/recommend/jobs

Returns:

Recommended jobs.

POST

/api/v1/recommend/candidates

Returns:

Recommended candidates.

**Logging**

Log:

-   endpoint

-   user

-   timestamp

-   IP

-   status

**Rate Limiting**

Apply limits to:

-   Login

-   Register

-   Recommendation API

-   File Upload

**Security**

Always use:

-   JWT

-   Helmet

-   CORS

-   bcrypt

-   Rate Limiter

Never expose secrets.

**Documentation**

Every endpoint should define:

-   Purpose

-   Request

-   Response

-   Validation

-   Authorization

-   Example

**Master Directive**

Every API in WorkFusion must feel like it belongs to one professionally
designed system.

Consistency is more important than convenience.

Never create one-off API styles or response formats.
