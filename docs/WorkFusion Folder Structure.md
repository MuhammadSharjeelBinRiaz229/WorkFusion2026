**WorkFusion Folder Structure**

Version: 1.0\
Status: Master Folder Structure Specification\
Priority: Critical

**Purpose**

This document defines the official repository structure for WorkFusion.
Every file must have a clear responsibility and location. The
architecture should remain scalable, maintainable, and easy to
understand.

**Root Structure**

WorkFusion/

├── AGENTS.md

├── README.md

├── package.json

├── package-lock.json

├── .gitignore

├── .env.example

│

├── docs/

├── client/

├── server/

├── recommendation-service/

├── shared/

├── scripts/

├── tests/

└── assets/

**Documentation Folder**

docs/

01_PRODUCT.md

02_ARCHITECTURE.md

03_DATABASE.md

04_FRONTEND.md

05_BACKEND.md

06_AI.md

07_FEATURES.md

08_DEPLOYMENT.md

09_TESTING.md

10_FUTURE.md

11_API_GUIDELINES.md

12_CODING_STANDARDS.md

13_UI_DESIGN_SYSTEM.md

14_DATABASE_RULES.md

15_AI_RULES.md

16_DEVELOPMENT_WORKFLOW.md

17_FOLDER_STRUCTURE.md

18_SEEDING_RULES.md

19_UI_PAGES.md

**Frontend Structure**

client/

src/

app/

components/

hooks/

contexts/

layouts/

services/

types/

utils/

styles/

assets/

public/

**Components Structure**

components/

ui/

common/

dashboard/

jobs/

applications/

profile/

chat/

analytics/

notifications/

forms/

tables/

Each component should have a single responsibility.

**Backend Structure**

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

**Controllers**

controllers/

auth.controller.ts

job.controller.ts

application.controller.ts

chat.controller.ts

review.controller.ts

admin.controller.ts

Controllers should only receive requests and return responses.

**Services**

services/

auth.service.ts

job.service.ts

application.service.ts

chat.service.ts

recommendation.service.ts

Business logic belongs here.

**Repositories**

repositories/

user.repository.ts

job.repository.ts

application.repository.ts

message.repository.ts

review.repository.ts

Repositories communicate directly with MongoDB.

**Models**

models/

User.ts

Job.ts

Application.ts

Message.ts

Review.ts

Notification.ts

Category.ts

**Routes**

routes/

auth.routes.ts

job.routes.ts

application.routes.ts

chat.routes.ts

admin.routes.ts

**Middleware**

middleware/

auth.ts

role.ts

validation.ts

logger.ts

error.ts

**Recommendation Service**

recommendation-service/

api/

preprocessing/

vectorizer/

similarity/

ranking/

models/

utils/

tests/

**Shared Folder**

shared/

constants/

interfaces/

types/

schemas/

**Scripts**

scripts/

seed.ts

cleanup.ts

migration.ts

**Tests**

tests/

unit/

integration/

api/

security/

**Assets**

assets/

logos/

icons/

images/

illustrations/

**Development Flow**

Requirement

↓

Database

↓

Models

↓

Routes

↓

Controllers

↓

Services

↓

Frontend

↓

Testing

**Master Directive**

Every file must have a logical location.

Never create folders like:

-   misc/

-   temp/

-   random/

-   new/

The repository should remain clean, scalable, and maintainable for
long-term development.
