# Week 13 Workshop - Threat Modeling and Security Backlog (EduTrack)

<!-- CONFIG-START -->
- FULL_NAME: Ximena Del Pilar Zambrano Chala
- GITHUB_USER: XimenaChala
- TEAM: EduTrack
- DOCS_REPO: https://github.com/code-corhuila/educk-docs
- BOUNDARY: educk-api-gateway -> educk-communication-api (inbound HTTP)
- CLAIM_ISSUE: https://github.com/code-corhuila/educk-docs/issues/66
- REFLECTION_DOC: https://docs.google.com/document/d/15PNtt4mSsoqddjXmfGP9EjrgSMKK0zzOBRbX11UQuNs/edit?usp=sharing
- LIBRARY_BOOK: Andrew S. Tanenbaum, Maarten van Steen. Sistemas distribuidos: principios y paradigmas. 2nd ed. Pearson Educacion, 2008. Call number: 004.36 T164s2
- LIBRARY_RECORD_TIME: 19:15
- STORIES: https://github.com/code-corhuila/educk-docs/issues/71, https://github.com/code-corhuila/educk-docs/issues/72, https://github.com/code-corhuila/educk-docs/issues/73
<!-- CONFIG-END -->

## Boundary

Requests from parents and teachers enter through `educk-api-gateway` (port 8080), which validates the JWT (ADR-006) and forwards them to `educk-communication-api` (port 8085) with the `X-User-Id` and `X-User-Role` headers. The service then reads and writes the `conversations` and `messages` tables.

I chose this boundary because the communication module is my domain in the team and it is the point where a message from outside becomes trusted internal data.

## Refined Security Backlog (CP7)

| Issue | Threat | Priority | Risk | Title | Related |
|---|:---:|:---:|:---:|---|---|
| [#71](https://github.com/code-corhuila/educk-docs/issues/71) | I | P0 | 9 | Object ownership check on conversations and messages | Related to #68 (Attendance student read authorization) |
| [#72](https://github.com/code-corhuila/educk-docs/issues/72) | S | P1 | 6 | Caller authentication and JWT verification in communication-api | Related to #69 (Principal-bound caller identity) |
| [#73](https://github.com/code-corhuila/educk-docs/issues/73) | T | P1 | 6 | Prevent sender_id spoofing in conversation messages | Related to #69 (Principal-bound actor attribution) |


