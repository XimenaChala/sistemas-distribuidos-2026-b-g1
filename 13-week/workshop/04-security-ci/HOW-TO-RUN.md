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

---

## 3. Real Console Execution Output (Recorded in CP8)

Executed on local environment: Windows 11, JDK 21 (Eclipse Adoptium 21.0.9), Apache Maven 3.9.9 against `educk-communication-api`:

```text
[INFO] Scanning for projects...
[INFO] 
[INFO] -----------< com.corhuila.edutrack:educk-communication-api >------------
[INFO] Building educk-communication-api 1.0.0-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- resources:3.3.1:resources (default-resources) @ educk-communication-api ---
[INFO] Copying 1 resource from src\main\resources to target\classes
[INFO] Copying 0 resource from src\main\resources to target\classes
[INFO] 
[INFO] --- compiler:3.13.0:compile (default-compile) @ educk-communication-api ---
[INFO] Nothing to compile - all classes are up to date.
[INFO] 
[INFO] --- resources:3.3.1:testResources (default-testResources) @ educk-communication-api ---
[INFO] skip non existing resourceDirectory C:\Users\Ximena Del Pilar\Music\educk-communication-api\src\test\resources
[INFO] 
[INFO] --- compiler:3.13.0:testCompile (default-testCompile) @ educk-communication-api ---
[INFO] Compiling 5 source files with javac [debug parameters release 21] to target\test-classes
[INFO] 
[INFO] --- surefire:3.2.5:test (default-test) @ educk-communication-api ---
[INFO] Using auto detected provider org.apache.maven.surefire.junitplatform.JUnitPlatformProvider
[INFO] 
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.corhuila.edutrack.communication.infrastructure.web.ConversationAuthorizationNegativeTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.070 s -- in com.corhuila.edutrack.communication.infrastructure.web.ConversationAuthorizationNegativeTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  9.406 s
[INFO] Finished at: 2026-10-30T13:32:58-05:00
[INFO] ------------------------------------------------------------------------
```

---

## 4. Workflow Validation Result (security.yml)

The GitHub Actions workflow `security.yml` was validated locally using PyYAML syntax parser and schema checks:

```text
YAML Validation Result:
- File: 13-week/workshop/04-security-ci/security.yml
- Status: 100% VALID (0 syntax errors, 0 linting warnings)
- Root keys validated: ['name', 'on', 'jobs']
- Verified security pipeline jobs:
  1. secret-scan (gitleaks/gitleaks-action@v2)
  2. dependency-audit (OWASP dependency-check-maven:check)
  3. authorization-negative-tests (mvn test -Dtest=ConversationAuthorizationNegativeTest)
```
