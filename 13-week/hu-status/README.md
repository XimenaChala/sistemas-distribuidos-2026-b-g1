<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Ximena Del Pilar Zambrano Chala
- GITHUB_USER: XimenaChala
- TEAM: EduTrack
- SPRINT_GOAL: Threat modeling (STRIDE) of inbound boundary between API Gateway and Communication API, security backlog creation, and CI security gates.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| ISSUE-71 | Object ownership check on conversations and messages | doing | https://github.com/code-corhuila/educk-docs/issues/71 |
| ISSUE-72 | Caller authentication and JWT verification in communication-api | todo | https://github.com/code-corhuila/educk-docs/issues/72 |
| ISSUE-73 | Prevent sender_id spoofing in conversation messages | todo | https://github.com/code-corhuila/educk-docs/issues/73 |

## 2. My individual contribution
- Claimed and modeled the trust boundary `educk-api-gateway -> educk-communication-api` (Issue #66).
- Mapped attack surface and system data flows with asset inventory (restricted, confidential, internal, public) in `01-attack-surface.md`.
- Completed STRIDE threat matrix (6 threats) with risk scoring, residual risk assessment, and physical book citations from Tanenbaum & Van Steen (2008) in `stride-XimenaChala.md` (PR #70).
- Addressed peer review feedback from @CelesteDussan on STRIDE PR #70 (commit `a90a6a3`), decoupling IDOR mitigation from raw headers and binding actor identity to the verified `SecurityContext` principal.
- Created and refined 3 security user stories in the team backlog with priority labels P0/P1, testable criteria, and cross-links to related stories (#71, #72, #73).
- Implemented CI security workflow proposal (`security.yml`), validated its syntax, and executed the automated negative authorization test (`ConversationAuthorizationNegativeTest.java`) locally with Maven (3 tests run, 0 failures).
- Conducted peer review on teammate @CelesteDussan's STRIDE PR #65.
- Documented project security implementation plan in the W13 reflection document.

## 3. Blockers and risks
- `educk-communication-api` currently trusts `X-User-Id` propagated by the gateway without caller re-authentication (ADR-006).

## 4. Plan for next week
- Implement the object ownership filter in `educk-communication-api` to prevent IDOR on conversation queries.
- Integrate Gitleaks and dependency vulnerability audits into the main team CI pipeline.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Claim Issue: https://github.com/code-corhuila/educk-docs/issues/66
- STRIDE PR: https://github.com/code-corhuila/educk-docs/pull/70
- STRIDE Review Response: https://github.com/code-corhuila/educk-docs/pull/70#issuecomment-6530514735
- Security Stories:
  - https://github.com/code-corhuila/educk-docs/issues/71
  - https://github.com/code-corhuila/educk-docs/issues/72
  - https://github.com/code-corhuila/educk-docs/issues/73
- Peer Review Comment: https://github.com/code-corhuila/educk-docs/pull/65#issuecomment-6484855833
- Workshop Folder: https://github.com/XimenaChala/sistemas-distribuidos-2026-b-g1/tree/main/13-week/workshop
- Reflection Doc: https://docs.google.com/document/d/15PNtt4mSsoqddjXmfGP9EjrgSMKK0zzOBRbX11UQuNs/edit?usp=sharing
