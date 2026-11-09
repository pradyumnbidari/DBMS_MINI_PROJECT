# Extended SkillSync ER Diagram (MySQL)

The original six tables are still present. These six new supporting tables extend the full project.

```mermaid
erDiagram
  students ||--o{ student_skills : knows
  skills ||--o{ student_skills : mapped
  careers ||--o{ career_skills : requires
  skills ||--o{ career_skills : appears
  students ||--o{ projects : builds
  students ||--o| app_users : owns_login
  app_users ||--o{ mentor_assignments : mentors
  students ||--o{ mentor_assignments : receives
  students ||--o{ certifications : earns
  students ||--o{ learning_progress : tracks
  skills ||--o{ learning_progress : practices
  students ||--o{ recommendation_history : receives
  careers ||--o{ recommendation_history : ranked
  app_users ||--o{ audit_logs : performs
  students { int student_id PK
    string full_name
    string email UK
    string branch }
  skills { int skill_id PK
    string skill_name
    int hours_per_level }
  student_skills { int student_id FK
    int skill_id FK
    int proficiency }
  careers { int career_id PK
    string career_name }
  career_skills { int career_id FK
    int skill_id FK
    int required_level
    int importance }
  projects { int project_id PK
    int student_id FK
    string project_title }
  app_users { int user_id PK
    string email UK
    string password_hash
    string role
    int student_id FK }
  mentor_assignments { int mentor_user_id FK
    int student_id FK }
  certifications { int certification_id PK
    int student_id FK
    string title }
  learning_progress { int progress_id PK
    int student_id FK
    int skill_id FK
    decimal hours }
  recommendation_history { bigint history_id PK
    int student_id FK
    int career_id FK
    decimal readiness_percent }
  audit_logs { bigint audit_id PK
    int actor_user_id FK
    string action }
```

**MongoDB:** `skillsync_nosql.mentor_feedback`, a separate document collection with nested recommended skills and mentor notes. Cross-database association is by `student_id` in new documents, falling back to the previous name-only demo record when needed.
