# How to Run Security Verification and Negative Authorization Tests

## 1. Covered Security Story and Acceptance Criteria

- **User Story:** `[security] Object ownership check on conversations and messages` (Issue [#71](https://github.com/code-corhuila/educk-docs/issues/71), PR [#70](https://github.com/code-corhuila/educk-docs/pull/70)).
- **STRIDE Threat:** Information Disclosure (IDOR / Direct Object Reference). Risk 9, Priority P0.
- **Criteria Covered:**
  - Criteria 1: When an authenticated caller queries `GET /conversations/{conversationId}/messages` (or `GET /api/v1/messages/conversation`) and is neither the conversation's `parent_id` nor `teacher_id`, the request is rejected with `403 Forbidden`.
  - Criteria 2: An automated test runs in CI pipeline (`security.yml`) to enforce this guardrail.
- **Literature Citation:** Andrew S. Tanenbaum & Maarten van Steen (2008), *Sistemas distribuidos: principios y paradigmas*, 2nd ed. Chapter 9, Section 9.3: Access Control and Protection Domains (p. 412).

---

## 2. Local Execution

### Prerequisites
- JDK 21 (Eclipse Adoptium / Temurin LTS)
- Apache Maven 3.9+

### Execution Command
Copy `ConversationAuthorizationNegativeTest.java` to `educk-communication-api/src/test/java/com/corhuila/edutrack/communication/infrastructure/web/` and execute:

```bash
mvn test -Dtest=ConversationAuthorizationNegativeTest
```

### Expected Output
```text
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.corhuila.edutrack.communication.infrastructure.web.ConversationAuthorizationNegativeTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.042 s -- in com.corhuila.edutrack.communication.infrastructure.web.ConversationAuthorizationNegativeTest
[INFO]
[INFO] Results:
[INFO]
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```
