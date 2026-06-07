**WorkFusion Complete UI Pages Specification**

Version: 1.0\
Status: Master UI Pages Document\
Priority: Critical

**Purpose**

This document defines every page that should exist inside WorkFusion.

Every page should be fully functional and interconnected.

No placeholder pages should exist.

**Public Pages**

**Home**

Contains:

-   Hero

-   Search

-   Categories

-   Features

-   Statistics

-   Testimonials

-   FAQ

-   Footer

**About**

Contains:

-   Mission

-   Vision

-   Features

-   Team (optional)

-   Contact

**Categories**

Displays:

-   Software Development

-   Graphic Design

-   Marketing

-   Electrician

-   Plumbing

-   Photography

-   Tutoring

-   Cleaning

Clicking a category filters jobs.

**Browse Jobs**

Contains:

-   Search Bar

-   Filters

-   Sorting

-   Pagination

-   Job Cards

**Job Details**

Displays:

-   Title

-   Description

-   Employer

-   Skills

-   Budget

-   Experience

-   Location

-   Apply Button

Also display:

Similar Jobs

AI Match Score

**Authentication Pages**

**Login**

Fields:

-   Email

-   Password

Buttons:

-   Login

-   Forgot Password

**Register**

Step 1

Choose Role

-   Employer

or

-   Service Seeker

Step 2

Dynamic Registration Form

**Forgot Password**

Email

↓

Reset Link

**Employer Pages**

**Dashboard**

Widgets:

-   Active Jobs

-   Applicants

-   Interviews

-   Hired

-   Notifications

Charts:

-   Weekly Applications

-   Hiring Trend

**Post Job**

Wizard:

Basic Info

↓

Requirements

↓

Budget

↓

Preview

↓

Publish

**My Jobs**

Each job card:

-   Status

-   Applicants

-   Views

-   Analytics

Actions:

-   Edit

-   Pause

-   Close

-   Delete

**Applicants**

Display:

-   Photo

-   Name

-   Match Score

-   Rating

-   Experience

Buttons:

-   View

-   Interview

-   Hire

-   Reject

**Employer Profile**

Sections:

-   Company

-   Logo

-   Description

-   Reviews

-   Analytics

**Service Seeker Pages**

**Dashboard**

Cards:

-   Recommended Jobs

-   Saved Jobs

-   Applications

-   Interviews

-   Profile Score

**Browse Jobs**

Search

↓

Filter

↓

AI Match

↓

Apply

**Recommended Jobs**

Every recommendation displays:

-   Score

-   Reason

-   Apply

Example:

React Developer

96%

Why?

✓ React matched

✓ Portfolio matched

**Saved Jobs**

Display saved jobs.

Buttons:

-   Apply

-   Remove

**Applications**

Timeline:

Applied

↓

Reviewed

↓

Interview

↓

Accepted

↓

Completed

**Profile**

Contains:

-   Personal Info

-   Skills

-   Education

-   Experience

-   Portfolio

-   Resume

**Portfolio**

Projects:

-   Images

-   Description

-   Technologies

-   Demo

-   GitHub

**Shared Pages**

**Messaging**

Messaging only enabled after Interview status.

Layout:

Sidebar

↓

Chat

↓

Input

Supports:

-   Text

-   Images

-   PDF

**Notifications**

Grouped:

-   Today

-   Yesterday

-   Older

**Settings**

Tabs:

-   Account

-   Security

-   Preferences

**Admin Pages**

**Dashboard**

Cards:

-   Users

-   Jobs

-   Applications

-   Reports

Charts:

-   User Growth

-   Job Growth

-   Category Distribution

**Manage Users**

Actions:

-   View

-   Suspend

-   Activate

-   Delete

**Manage Jobs**

Actions:

-   View

-   Edit

-   Remove

**Categories**

CRUD operations.

**Reports**

Display:

-   Abuse Reports

-   Spam Reports

-   Analytics

**Error Pages**

Support:

-   404

-   403

-   500

Each should include:

-   Illustration

-   Message

-   Return Home Button

**Loading States**

Every page must have:

-   Skeleton

-   Spinner

-   Progressive loading

**Empty States**

Every page must display:

-   Illustration

-   Message

-   CTA

instead of blank content.

**Final Directive**

Every page should look and behave like a production SaaS application.

Navigation should be intuitive, responsive, and consistent across the
entire platform.
