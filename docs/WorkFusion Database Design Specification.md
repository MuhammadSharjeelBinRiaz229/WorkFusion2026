**WorkFusion Database Design Specification**

Version: 1.0\
Status: Master Database Document\
Priority: Critical\
Applies To: Backend & AI Service

**1. Purpose**

This document defines the complete database architecture for WorkFusion.

The database should be designed for:

-   Scalability

-   Maintainability

-   Performance

-   Security

-   AI Integration

The schema should support future expansion without requiring major
redesign.

**2. Database Philosophy**

The database should:

-   Minimize redundancy

-   Maximize consistency

-   Support AI recommendation

-   Support analytics

-   Support future features

-   Maintain logical relationships

MongoDB should be used with Mongoose ODM.

**3. Database Collections**

Users

Jobs

Applications

Chats

Messages

Reviews

Notifications

Bookmarks

Categories

Skills

Portfolios

ActivityLogs

Recommendations

**4. User Collection**

Represents:

-   Employer

-   Service Seeker

-   Admin

**Fields**

\_id

fullName

email

password

phone

role

profilePicture

bio

city

address

skills

experience

education

languages

certifications

portfolio

resume

availability

preferredWorkType

rating

reviewCount

profileCompletion

isVerified

status

createdAt

updatedAt

**Roles**

Employer

Service Seeker

Admin

**Status**

Active

Inactive

Suspended

**Indexes**

email

role

city

skills

**5. Job Collection**

Every job belongs to one Employer.

**Fields**

\_id

title

description

category

subcategory

serviceType

workType

requiredSkills

experienceRequired

budget

currency

location

remoteAllowed

vacancies

deadline

status

employerId

createdAt

updatedAt

**Service Type**

Online

Physical

Hybrid

**Work Type**

Hourly

Monthly

Project

Part-Time

Full-Time

**Status**

Draft

Open

Paused

Closed

**Indexes**

title

category

location

status

requiredSkills

**6. Application Collection**

Each application connects:

Job

↓

Service Seeker

**Fields**

\_id

jobId

seekerId

proposal

resume

portfolio

expectedSalary

availability

status

matchScore

createdAt

updatedAt

**Status Flow**

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

**7. Category Collection**

\_id

name

description

icon

parentCategory

status

Examples

Software Development

Graphic Design

Electrician

Photography

Plumbing

Cleaning

Tutoring

Mechanic

**8. Skills Collection**

\_id

name

category

Examples

React

Node

MongoDB

Express

Tailwind

Docker

AWS

**9. Portfolio Collection**

\_id

userId

title

description

technologies

images

github

demo

createdAt

**10. Chat Collection**

Chat should only exist after Interview status.

Fields

\_id

jobId

employerId

seekerId

status

createdAt

**11. Message Collection**

\_id

chatId

senderId

type

message

attachment

seen

createdAt

**Message Types**

Text

Image

PDF

Resume

Portfolio

**12. Review Collection**

\_id

jobId

reviewer

receiver

rating

comment

createdAt

**Rating**

1

2

3

4

5

**13. Notification Collection**

\_id

userId

title

body

type

read

createdAt

**Types**

Application

Interview

Accepted

Rejected

Recommendation

Message

System

**14. Bookmark Collection**

\_id

userId

jobId

createdAt

**15. Recommendation Collection**

Stores AI generated recommendations.

\_id

userId

jobId

score

reason

generatedAt

Example

Job

React Developer

Score

96%

Reason

React matched

Portfolio matched

Remote matched

**16. Activity Log Collection**

\_id

userId

action

entity

entityId

createdAt

Examples

Login

Logout

Created Job

Applied Job

Updated Profile

Sent Message

Completed Job

**17. Relationships**

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

Completion

↓

Reviews

**18. Database Rules**

Never duplicate information.

Store references instead of repeated objects where appropriate.

Always use timestamps.

Always validate before saving.

**19. Search Optimization**

Indexes should support:

-   Keyword Search

-   Category Search

-   Skills Search

-   Location Search

-   Status Search

**20. Pagination Strategy**

Every collection should support:

page

limit

sort

search

Never return unlimited records.

**21. AI Requirements**

The database should provide sufficient information for AI ranking.

AI should use:

-   Skills

-   Portfolio

-   Experience

-   Reviews

-   Category

-   Location

-   Availability

The database must therefore preserve these attributes in structured
form.

**22. Seed Data Requirements**

Automatically generate:

15 Employers

25 Service Seekers

40 Jobs

60 Applications

50 Reviews

100 Messages

100 Notifications

The generated data should represent realistic hiring scenarios.

**23. Future Expansion**

The schema should support future additions such as:

-   Payment System

-   Subscription Plans

-   Video Interviews

-   Resume Parser

-   Career Coach

-   AI Interview Assistant

-   Enterprise Organizations

without requiring major structural redesign.

**24. Master Directive**

The WorkFusion database should be designed for long-term scalability
rather than short-term convenience.

Whenever multiple schema designs are possible, prefer the one that
maximizes:

1.  Maintainability

2.  Scalability

3.  Performance

4.  Data Integrity

5.  AI Compatibility
