# ADR-C3-02: Microservice Orchestration via Cloud Container Engine with Auto Scaling

## Status

Accepted

## Context

EduTrack backend services (`educk-api-gateway`, `identity-api`, `academic-service`, `attendance-service`, and `notifications-service`) experience severe, predictable demand variations throughout the academic day, as detailed in section 3 of the architecture design note and `05-architecture/overview.md`. Daily morning student check-ins generate acute burst traffic on attendance and gateway endpoints between 06:45 AM and 07:30 AM, while end-of-term grade publication triggers sustained multi-hour transaction volume across academic services. Deploying microservices on static virtual machines leads to substantial overprovisioning costs during idle evening hours or severe CPU throttling during unpredictable evaluation peaks.

## Decision

We decide to deploy all EduTrack microservices as containerized workloads orchestrated by Huawei Cloud Container Engine (CCE), backed by managed Kubernetes and integrated with the Horizontal Pod Autoscaler (HPA) and Cluster Auto Scaling (AS). Microservices are packaged into hardened, multi-stage OCI images stored in the SoftWare Repository for Container (SWR). Deployment manifests define Pod Disruption Budgets (PDB) and topology spread constraints to distribute replicas symmetrically across Availability Zone 1 and Availability Zone 2. Scaling policies dynamically adjust replica counts based on Cloud Eye metric thresholds (70 % CPU for the gateway, 300 req/s for the academic service, and 75 % memory for the attendance service), scaling out during registration peaks and scaling down to minimal baselines during school lulls.

## Alternatives considered

- Static Deployment on Elastic Cloud Server (ECS) Virtual Machines: Rejected because virtual machines take several minutes to boot and configure during sudden morning attendance traffic spikes; furthermore, maintaining fixed server capacity to handle peak grading loads wastes substantial compute expenditure during school vacations and nights.
- Complete Migration to Serverless FunctionGraph: Rejected because the core backend is built on Spring Boot 3.x with Java 21, which incurs notable cold-start latency penalties when instantiating JVM runtimes from cold states; additionally, relational database connection pooling from ephemeral serverless functions introduces connection exhaustion on backend PostgreSQL instances.

## Consequences

- Positive: Enables elastic resource utilization that matches operational expenditure directly to actual academic traffic; ensures rapid scale-out response times (under 20 seconds per container replica); provides built-in zero-downtime rolling updates with automatic rollback on readiness probe failures; guarantees resilient cross-AZ pod distribution.
- Negative: Introduces operational complexity associated with Kubernetes configuration management, container networking policies, and resource limit tuning; requires careful sizing of database connection pools to prevent autoscaled microservice replicas from saturating database connections.
