**WorkFusion Coding Standards & Engineering Principles**

Version: 1.0\
Status: Master Coding Standards\
Priority: Critical\
Applies To: Entire Project

**1. Purpose**

This document defines the coding standards and engineering principles
for WorkFusion.

Every developer and AI agent must follow these rules.

If any implementation conflicts with these standards, these standards
take precedence.

**2. Engineering Philosophy**

The objective is NOT to write code.

The objective is to build excellent software.

Always optimize for:

-   Scalability

-   Maintainability

-   Readability

-   Security

-   Performance

Never optimize only for speed.

**3. Clean Code Principles**

Code should be:

-   Simple

-   Readable

-   Predictable

-   Modular

-   Testable

Good code should explain itself.

**4. SOLID Principles**

Always follow:

**S**

Single Responsibility Principle

Each class or function should have one responsibility.

**O**

Open Closed Principle

Code should be open for extension but closed for modification.

**L**

Liskov Substitution Principle

Child classes should replace parent classes without breaking behavior.

**I**

Interface Segregation Principle

Prefer multiple focused interfaces over one large interface.

**D**

Dependency Inversion Principle

Depend on abstractions rather than implementations.

**5. DRY Principle**

Never duplicate logic.

Bad:

calculateScore()

calculateScoreAgain()

Good:

calculateScore()

Reuse existing functions.

**6. KISS Principle**

Keep implementations simple.

Avoid unnecessary complexity.

Simple architecture is better than clever architecture.

**7. File Size**

Target:

Functions:

\<50 lines

Components:

\<300 lines

Services:

\<400 lines

Large files should be divided into smaller modules.

**8. Function Rules**

Functions should:

-   Perform one task

-   Return predictable values

-   Be reusable

Bad

createUpdateDeleteJob()

Good

createJob()

updateJob()

deleteJob()

**9. Naming Convention**

Variables:

Good

recommendedJobs

profileCompletion

candidateScore

Bad

x

abc

temp

data1

**10. Folder Naming**

Use:

components

controllers

services

middleware

models

Avoid:

MyFolder

Stuff

Misc

**11. Component Rules**

Each component should:

-   Have one responsibility

-   Be reusable

-   Be independent

Never create giant components.

**12. React Rules**

Pages should:

-   Assemble components

Components should:

-   Render UI

Hooks should:

-   Manage reusable logic

Business logic belongs in backend.

**13. Backend Rules**

Controllers:

Receive request

↓

Call service

↓

Return response

Services:

Contain business logic.

Repositories:

Handle database operations.

**14. Error Handling**

Never:

catch(error){

console.log(error)

}

Instead:

Catch

↓

Log

↓

Handle

↓

Return standard response

**15. Magic Values**

Never:

if(score\>87)

Use:

const MATCH_THRESHOLD=87

**16. Environment Variables**

Never hardcode:

-   Secrets

-   URLs

-   Keys

-   Tokens

Always use:

.env

**17. Comments**

Avoid obvious comments.

Bad

//increment i

i++

Good

Explain WHY not WHAT.

**18. Async Rules**

Always use:

-   async

-   await

Avoid nested callbacks.

**19. API Calls**

Never call APIs directly inside multiple components.

Use service layer.

Example:

components

↓

services/api.ts

↓

backend

**20. Database Rules**

Never duplicate data.

Always:

-   Validate

-   Index

-   Optimize

**21. TypeScript Rules**

Avoid:

any

Prefer:

Interfaces

Types

Generics

**22. UI Rules**

Never hardcode spacing everywhere.

Use design tokens.

Maintain consistency.

**23. Security Rules**

Always:

-   Validate input

-   Escape output

-   Hash passwords

-   Verify JWT

Never trust client input.

**24. Git Commit Rules**

Use:

feat:

fix:

refactor:

docs:

style:

test:

Example:

feat: implement AI recommendation module

**25. Testing Rules**

Every feature should be tested for:

-   Happy path

-   Edge cases

-   Invalid input

-   Authorization

-   Performance

**26. Refactoring Rules**

Refactor when:

-   Duplicate logic exists

-   Complexity increases

-   Readability decreases

Do not refactor working architecture without clear benefit.

**27. Logging Rules**

Log:

-   Authentication

-   Job Creation

-   Applications

-   Interviews

-   Messages

-   Reviews

-   AI Requests

Do not log passwords or secrets.

**28. Performance Rules**

Optimize:

-   Queries

-   Components

-   Rendering

-   Images

-   Pagination

Avoid unnecessary API calls.

**29. Definition of Good Code**

Good code should be:

-   Easy to read

-   Easy to maintain

-   Easy to extend

-   Easy to test

A new developer should understand it quickly.

**30. Master Directive**

Before writing any code, ask:

-   Is this scalable?

-   Is this maintainable?

-   Is this secure?

-   Is this reusable?

-   Is this the best long-term solution?

If the answer to any question is **No**, redesign the implementation
before proceeding.

The goal of WorkFusion is not merely to function---it is to exemplify
production-grade software engineering.
