# CP1 - Attack Surface Map (EduTrack)

Sources: `05-architecture/overview.md`, `ADR-006-api-gateway-jwt.md`, `ADR-004-message-broker.md`, `07-api/contracts/openapi/communication-service.yaml` and `08-diagrams/diagrams/source/erd-communication.mmd` of `educk-docs`.

## 1. Data-flow diagram with trust boundaries

My boundary is **TB2b** (highlighted in red).

```mermaid
flowchart LR
  P[Parent / Teacher browser]
  A[Admin browser]

  subgraph TB1 [TB1 internet -> edge]
    PORT[educk-front + portals<br/>communication / academic / attendance / identity]
    GW[educk-api-gateway :8080<br/>JWT validation]
  end

  subgraph INTERNAL [internal docker network]
    ID[educk-identity-api :8081]
    AC[educk-academic-api :8082]
    AT[educk-attendance-api :8083]
    CM[educk-communication-api :8085]
    WK[educk-worker / notifications :8084]
    MQ[[RabbitMQ edutrack.events]]
    IDB[(educk-identity-db)]
    ADB[(educk-academic-db)]
    TDB[(educk-attendance-db)]
    CDB[(educk-communication-db :5435<br/>conversations, messages,<br/>teacher_availability)]
  end

  SMTP[external email / push provider]

  P -->|HTTPS| PORT
  A -->|HTTPS| PORT
  PORT -->|HTTPS + Bearer JWT| GW
  GW -->|TB2a REST + X-User-Id| ID
  GW -->|TB2c REST + X-User-Id| AC
  GW -->|TB2d REST + X-User-Id| AT
  GW ==>|TB2b REST + X-User-Id / X-User-Role| CM
  ID -->|TB4 SQL| IDB
  AC -->|TB4 SQL| ADB
  AT -->|TB4 SQL| TDB
  CM -->|TB4 SQL| CDB
  AC -.->|TB3 AMQP GradeCreated| MQ
  AT -.->|TB3 AMQP StudentAbsent| MQ
  CM -.->|TB3 AMQP MessageSentEvent| MQ
  MQ -.->|TB3 consume| WK
  WK -->|TB5 HTTPS| SMTP

  linkStyle 6 stroke:#d00,stroke-width:4px
  style CM stroke:#d00,stroke-width:3px
```

| ID | Trust boundary | Owner |
|---|---|---|
| TB1 | Internet -> portals / `educk-api-gateway` | team |
| TB2a-d | `educk-api-gateway` -> each backend API | TB2d @CelesteDussan (#64) |
| **TB2b** | **`educk-api-gateway` -> `educk-communication-api`** | **@XimenaChala (#66)** |
| TB3 | Services <-> RabbitMQ <-> `educk-worker` | team |
| TB4 | Each service -> its own database | team |
| TB5 | `educk-worker` -> external email / push provider | team |

## 2. Asset inventory (communication domain)

| # | Asset | Where it lives | Classification |
|---|---|---|---|
| 1 | Message `content` between parent and teacher (may mention a minor's health or behavior) | `messages.content` in `educk-communication-db`, in transit on TB2b | Restricted |
| 2 | JWT access token of the parent / teacher | Browser storage, `Authorization` header up to the gateway | Restricted |
| 3 | `X-User-Id` / `X-User-Role` identity headers | Added by `educk-api-gateway`, read by `educk-communication-api` | Confidential |
| 4 | Conversation membership (`parent_id`, `teacher_id`, `subject_id`) | `conversations` table | Confidential |
| 5 | Teacher schedule | `teacher_availability` table | Internal |
| 6 | `MessageSentEvent` payload (ids, no body) | RabbitMQ exchange `edutrack.events` | Internal |
| 7 | OpenAPI contract `communication-service.yaml` | `educk-docs` repo | Public |

## 3. Entry points of my boundary (TB2b)

| Entry point | Called by | Authentication today |
|---|---|---|
| `GET /conversations` | portal via `educk-api-gateway` | JWT checked at the gateway; service trusts `X-User-Id` |
| `POST /conversations` | parent via gateway | JWT at gateway; no role check documented in the service |
| `GET /conversations/{conversationId}/messages` | parent / teacher via gateway | JWT at gateway; no ownership check documented |
| `POST /conversations/{conversationId}/messages` | parent / teacher via gateway | JWT at gateway; no ownership check documented |
| TCP port 8085 on the docker network | any container on the same network | **none** (ADR-006: internal network is trusted) |
