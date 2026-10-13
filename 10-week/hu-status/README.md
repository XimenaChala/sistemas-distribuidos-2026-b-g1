# Weekly Status - Week 10 (Release Corte 2 / MVP 2)

**Full Name:** Ximena Del Pilar Zambrano Chala  
**Role:** Tech Lead / Frontend & Infrastructure Architect  
**Status:** MVP 2 Shipped & Tagged `v2.0.0`

---

## 1. User Stories & Core Epics (Historias de Usuario)
- **[HU-004-COMMS]** Arquitectura y subida del servicio `educk-communication-api` adaptado a persistencia documental MongoDB (Anexo J).
- **[HU-INFRA-002]** Aislamiento estricto de PostgreSQL multi-esquema (`identity_schema`, `academic_schema`, `attendance`) en una única instancia (`educk-infra`) con usuarios de aplicación sin privilegios administrativos.
- **[HU-REL-001]** Empaque, versionamiento semántico y publicación de tags oficiales `v2.0.0` en los 20 repositorios de la organización.
- **[HU-GOV-001]** Gobernanza estricta Git-Flow por ambiente (`develop` -> `qa` -> `release.2.x.x` -> `main`) mediante promociones exclusivas con `git cherry-pick -x <commit-id>`.
- **[HU-CI-003]** Hardening y límites de consumo en GitHub Actions (`concurrency: cancel-in-progress: true`, `timeout-minutes: 10`, filtro `develop`/`qa`).

---

## 2. PRs & Commits (Evidencia de Contribución Individual)
### Backend & Infraestructura:
* **educk-communication-api:** 
  - [PR #3](https://github.com/code-corhuila/educk-communication-api/pull/3) - `feat(communication): integrate MongoDB repository adapter and REST endpoints` (393 lines, Clean Code, Hexagonal Architecture)
  - [PR #4](https://github.com/code-corhuila/educk-communication-api/pull/4) - `chore(deploy): add containerization Dockerfile and Compose service`
  - [PR #5](https://github.com/code-corhuila/educk-communication-api/pull/5) - `qa(communication): promote HU-004 pure domain, MongoDB persistence and compose service to QA` (Cherry-pick `-x`)
  - **Tag `v2.0.0`** publicado en GitHub.
* **educk-infra:**
  - [PR #12](https://github.com/code-corhuila/educk-infra/pull/12) - `fix(infra): enforce Annex J instance and domain isolation`
  - [PR #13](https://github.com/code-corhuila/educk-infra/pull/13) - `fix(infra): restore Redis, RabbitMQ services and integrate communication-api in compose`
  - **Tag `v2.0.0`** publicado en GitHub.
* **educk-academic-portal:**
  - [PR #12](https://github.com/code-corhuila/educk-academic-portal/pull/12) - `Release 2.x.x: Final integration for Academic API and UI`
  - [Release v2.0.0](https://github.com/code-corhuila/educk-academic-portal/releases/tag/v2.0.0) en `main`.
* **educk-attendance-portal:**
  - [PR #13](https://github.com/code-corhuila/educk-attendance-portal/pull/13) - `Release 2.x.x: Final integration for Attendance API`
  - [Release v2.0.0](https://github.com/code-corhuila/educk-attendance-portal/releases/tag/v2.0.0) en `main`.
* **educk-docs:**
  - [PR #57](https://github.com/code-corhuila/educk-docs/pull/57) - `docs(release): distinguish verified MVP 2 progress from delivery gates`
  - [PR #59](https://github.com/code-corhuila/educk-docs/pull/59) - `docs(architecture): clarify Annex J runtime verification`
  - **release.md** con inventario completo de commits y tags de los 20 repositorios.

---

## 3. Ceremonias de Scrum y Flujo de Trabajo
- **Sprint Planning:** Definición del alcance del MVP 2 y asignación de tareas Anexo J.
- **Daily Standups:** Monitoreo del estado de Postgres, MongoDB y portales en Docker.
- **Sprint Review & Demo:** Preparación de la sustentación de 8 minutos y verificación de degradación elegante (Graceful Degradation) ante caída inducida de servicios.
- **Sprint Retrospective:** Validación del cumplimiento de los Quality Gates (< 400 líneas por PR, Conventional Commits en inglés con `Why:`).
