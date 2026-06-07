**WorkFusion Seed Data & Demo Environment Specification**

Version: 1.0\
Status: Master Seeding Rules\
Priority: High\
Applies To: Development, Testing, Demonstration

**1. Purpose**

This document defines how demo data should be generated for WorkFusion.

The objective is to make the application look and behave like a real
production platform.

No page should appear empty during demonstration.

**2. Philosophy**

The seeded data should simulate a real employment marketplace.

Users should believe that the platform has been actively used for
months.

Never generate unrealistic dummy data.

Bad:

Test User

ABC

xyz@gmail.com

Good:

Muhammad Ali

Senior MERN Developer

Islamabad

**3. Employer Accounts**

Generate at least:

20 Employers

Examples:

-   TechNova Solutions

-   ByteForge Technologies

-   PixelCraft Studio

-   Nexa Digital

-   Alpha Builders

-   Vision Marketing

-   Smart Electrical Services

-   Elite Tutors Academy

-   Urban Interiors

-   FutureSoft

Each employer should have:

-   Company Name

-   Logo

-   Description

-   Address

-   Website (optional)

-   Rating

-   Reviews

**4. Service Seeker Accounts**

Generate at least:

30 Service Seekers

Each should contain:

-   Full Name

-   Photo

-   Skills

-   Experience

-   Education

-   Resume

-   Portfolio

-   Languages

-   Rating

Example skills:

-   React

-   Node.js

-   Python

-   Flutter

-   Graphic Design

-   Photography

-   Plumbing

-   Electrician

**5. Admin Account**

Create one default admin:

Role:

Admin

Capabilities:

-   Manage users

-   Manage jobs

-   Manage reports

-   View analytics

**6. Jobs**

Generate:

40-50 Jobs

Mix:

**Online**

-   React Developer

-   MERN Stack Developer

-   UI Designer

-   Graphic Designer

-   Video Editor

**Physical**

-   Electrician

-   Plumber

-   AC Technician

-   Mechanic

-   Carpenter

**Hybrid**

-   Digital Marketing Executive

-   IT Support Engineer

-   Network Technician

**7. Salary Ranges**

Use realistic values.

Examples:

PKR 20,000

PKR 50,000

PKR 120,000

PKR 250,000

**8. Job Status Distribution**

Example:

Open

65%

Paused

10%

Closed

25%

**9. Applications**

Generate:

60-80 Applications

Statuses:

-   Applied

-   Pending

-   Reviewed

-   Interview

-   Accepted

-   Rejected

-   Hired

-   Completed

Distribution should appear realistic.

**10. AI Recommendations**

Every Service Seeker should receive:

Top 10 Recommended Jobs

Every Employer should receive:

Top Recommended Candidates

Each recommendation must include:

-   Match Score

-   Explanation

**11. Match Score Example**

React Developer

96%

Reason

✓ React matched

✓ Node matched

✓ Portfolio matched

✓ Experience matched

**12. Reviews**

Generate:

50 Reviews

Examples:

★★★★★

Excellent communication and timely delivery.

★★★★☆

Very skilled and professional.

★★★★★

Highly recommended for MERN projects.

**13. Messaging**

Generate:

100 Messages

Only for applications in:

Interview

status.

Conversation examples should look natural.

**14. Notifications**

Generate:

100 Notifications

Examples:

-   Your application was reviewed.

-   Interview scheduled.

-   New recommendation available.

-   Employer sent a message.

-   Profile reached 90% completion.

**15. Portfolio Projects**

Each developer should have 2-5 projects.

Examples:

-   E-commerce Platform

-   Hospital Management System

-   Restaurant Website

-   AI Chatbot

-   Inventory Management System

Each project should include:

-   Description

-   Technologies

-   Images

-   GitHub Link (dummy)

-   Live Demo (dummy)

**16. Resume Data**

Each resume should contain:

-   Summary

-   Education

-   Experience

-   Skills

-   Certifications

Do not leave resume fields empty.

**17. Analytics Data**

Employer Dashboard:

Display:

-   Job Views

-   Applicants

-   Interviews

-   Hires

Service Seeker Dashboard:

Display:

-   Applications

-   Recommendations

-   Saved Jobs

-   Profile Score

Admin Dashboard:

Display:

-   Total Users

-   Total Jobs

-   Total Applications

-   Growth Charts

**18. Categories**

Generate categories such as:

-   Software Development

-   Graphic Design

-   Marketing

-   Photography

-   Tutoring

-   Electrician

-   Plumbing

-   Cleaning

-   Mechanic

-   Construction

**19. Skills Dataset**

Generate at least:

100 Skills

Examples:

-   React

-   Next.js

-   Node.js

-   Express

-   MongoDB

-   TailwindCSS

-   Docker

-   AWS

-   Python

-   TensorFlow

**20. Cities**

Use realistic Pakistani cities:

-   Islamabad

-   Rawalpindi

-   Lahore

-   Karachi

-   Faisalabad

-   Peshawar

-   Multan

-   Sialkot

**21. Images**

Every profile should have:

-   Avatar

Every job:

-   Company Logo

Every portfolio:

-   Thumbnail

Never display broken images.

**22. Randomization Rules**

Data should appear natural.

Avoid:

User1

User2

User3

Prefer realistic names and varied profiles.

**23. Demo Readiness**

A person exploring the application should believe it is a live platform.

No page should display:

-   Empty tables

-   Empty charts

-   Empty recommendations

unless intentionally demonstrating an empty state.

**24. AI Testing Dataset**

The seeded data must be rich enough that TF-IDF and Cosine Similarity
produce meaningful recommendations.

Job descriptions, skills, and portfolios should contain realistic
keywords.

**25. Master Directive**

The seeded environment should make WorkFusion presentation-ready.

Every dashboard, table, chart, recommendation, and message should
contain realistic data that demonstrates the full capabilities of the
platform.

**The application should feel like an active startup with hundreds of
users, not a freshly created Final Year Project.**
