# Week 13 Workshop - Threat Modeling and Security Backlog (EduTrack)

<!-- CONFIG-START -->
- FULL_NAME: Ximena Del Pilar Zambrano Chala
- GITHUB_USER: XimenaChala
- TEAM: EduTrack
- DOCS_REPO: https://github.com/code-corhuila/educk-docs
- BOUNDARY: educk-api-gateway -> educk-communication-api (inbound HTTP)
- CLAIM_ISSUE: https://github.com/code-corhuila/educk-docs/issues/66
- REFLECTION_DOC: (pending - W13 Reflection - Ximena Del Pilar Zambrano Chala)
- LIBRARY_BOOK: Andrew S. Tanenbaum, Maarten van Steen. Sistemas distribuidos: principios y paradigmas. 2nd ed. Pearson Educacion, 2008. Call number: (pending)
- LIBRARY_RECORD_TIME: (filled in CP2)
- STORIES: https://github.com/code-corhuila/educk-docs/issues/71, https://github.com/code-corhuila/educk-docs/issues/72, https://github.com/code-corhuila/educk-docs/issues/73
<!-- CONFIG-END -->

## Boundary

Requests from parents and teachers enter through `educk-api-gateway` (port 8080), which validates the JWT (ADR-006) and forwards them to `educk-communication-api` (port 8085) with the `X-User-Id` and `X-User-Role` headers. The service then reads and writes the `conversations` and `messages` tables.

I chose this boundary because the communication module is my domain in the team and it is the point where a message from outside becomes trusted internal data.

