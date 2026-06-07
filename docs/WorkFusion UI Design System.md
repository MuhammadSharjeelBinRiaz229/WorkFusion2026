**WorkFusion UI Design System & Design Language**

Version: 1.0\
Status: Master UI Design System\
Priority: Critical\
Applies To: Entire Frontend

**1. Purpose**

This document defines the official design language of WorkFusion.

Every page, component, animation, spacing rule, and interaction must
follow this specification.

The goal is to create a premium product that feels like a funded startup
rather than a student project.

**2. Design Philosophy**

The UI should communicate:

-   Professionalism

-   Simplicity

-   Trust

-   Speed

-   Intelligence

The interface should feel modern without unnecessary complexity.

**3. Inspiration**

The design language should take inspiration from:

-   Linear

-   Vercel

-   Stripe

-   Apple

-   Notion

-   Framer

Do **NOT** imitate old Bootstrap admin dashboards.

**4. Design Principles**

Every screen should be:

-   Clean

-   Minimal

-   Spacious

-   Responsive

-   Accessible

Avoid clutter.

**5. Color Palette**

**Primary**

#10B981

**Secondary**

#0F172A

**Background**

#FFFFFF

**Surface**

#F8FAFC

**Success**

#22C55E

**Warning**

#F59E0B

**Error**

#EF4444

**Border**

#E2E8F0

**6. Typography**

Primary Font:

-   Inter

Alternative:

-   Geist

Fallback:

-   system-ui

**Heading Sizes**

H1

48px

H2

36px

H3

30px

H4

24px

Body

16px

Caption

14px

**7. Border Radius**

Cards

12px

Buttons

10px

Inputs

10px

Dialogs

16px

**8. Shadows**

Prefer subtle shadows.

Never use heavy shadows.

Example:

shadow-sm

shadow-md

Avoid:

shadow-2xl everywhere

**9. Spacing System**

Use an 8px spacing system.

Examples:

8

16

24

32

40

48

64

Avoid random spacing values.

**10. Buttons**

Primary

Filled

Secondary

Outline

Danger

Red

Ghost

Transparent

Loading

Spinner

Disabled

Reduced opacity

**11. Inputs**

Every input should have:

-   Label

-   Placeholder

-   Validation

-   Error Message

Example:

Email

\[\_\_\_\_\_\_\_\_\_\_\_\_\]

Invalid email

**12. Cards**

Cards should include:

-   Padding

-   Border

-   Hover Effect

-   Smooth Animation

Never make cards cluttered.

**13. Icons**

Use:

Lucide Icons

Maintain consistent icon size.

**14. Tables**

Support:

-   Pagination

-   Search

-   Sorting

-   Empty State

Avoid horizontal scrolling whenever possible.

**15. Forms**

Multi-step forms should use:

Step 1

↓

Step 2

↓

Step 3

↓

Review

↓

Submit

Never overwhelm users with large forms.

**16. Navigation**

Navbar:

-   Logo

-   Home

-   Jobs

-   Categories

-   About

-   Login/Register

Authenticated:

-   Dashboard

-   Notifications

-   Profile

-   Logout

**17. Sidebar**

Sections:

Dashboard

Jobs

Applications

Messages

Notifications

Analytics

Profile

Settings

Logout

**18. Dashboard Cards**

Each card should display:

-   Icon

-   Title

-   Value

-   Trend

Example:

Applications

245

↑ 12%

**19. Job Card**

Display:

-   Title

-   Employer

-   Location

-   Budget

-   Skills

-   Match Score

Buttons:

Apply

Save

**20. Candidate Card**

Display:

-   Photo

-   Name

-   Rating

-   Experience

-   Match Score

Buttons:

View

Interview

Hire

**21. Recommendation Card**

Example:

React Developer

96% Match

Why?

✓ React matched

✓ Portfolio matched

✓ Experience matched

Recommendations should always be explainable.

**22. Empty States**

Every page should have an empty state.

Example:

No jobs found.

Browse Jobs

Never leave blank pages.

**23. Loading States**

Use:

-   Skeleton loaders

-   Button loaders

-   Card loaders

Avoid blank white screens.

**24. Error States**

Display:

-   Friendly illustration

-   Error message

-   Retry button

**25. Animations**

Use Framer Motion.

Allowed:

-   Fade

-   Slide

-   Scale

Avoid excessive animations.

**26. Responsive Design**

Support:

-   Mobile

-   Tablet

-   Laptop

-   Desktop

No layout should break.

**27. Accessibility**

Support:

-   Keyboard navigation

-   Screen readers

-   Focus states

-   ARIA labels

**28. Dark Mode**

Architecture should support future dark mode.

Never hardcode colors directly inside components.

Use theme variables.

**29. Design Rules**

Always:

-   Maintain consistency

-   Use reusable components

-   Follow spacing system

-   Follow typography hierarchy

Never:

-   Mix multiple design styles

-   Use random colors

-   Create inconsistent layouts

**30. Master Directive**

Every interface should make users think:

**\"This looks like a real startup product.\"**

When choosing between:

-   A simple but ordinary design

or

-   A polished, modern, premium design

always choose the premium design while maintaining performance,
accessibility, and usability.
