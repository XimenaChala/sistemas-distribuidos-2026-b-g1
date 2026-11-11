# ADR-C3-01: Cross-AZ Active-Standby RDS for PostgreSQL Deployment

## Status

Accepted

## Context

EduTrack manages mission-critical academic records, course enrollments, grade calculations, and student attendance logs that directly impact institutional compliance and student academic histories (as analyzed in section 4 of the architecture design note and documented in `05-architecture/decisions/records/ADR-003-database-per-service.md`). In the existing deployment model, databases run in standalone containers or single-node virtual machines, representing a catastrophic single point of failure. A single hypervisor crash, disk volume corruption, or localized availability zone outage halts all educational operations, and restoring from asynchronous snapshots risks several hours of permanent student grade and attendance data loss (violating our target RPO of 0 minutes and RTO under 2 minutes).

## Decision

We decide to provision and deploy Huawei Cloud Relational Database Service (RDS) for PostgreSQL 16 in a Multi-AZ Active-Standby configuration across Availability Zone 1 (`AZ 1`) and Availability Zone 2 (`AZ 2`) within the South America region (`sa-brazil-1`). All backend microservices (`identity-api`, `academic-service`, `attendance-service`, and `notifications-service`) connect to the database cluster via a virtual floating IP address (VIP). Transactional writes are committed using synchronous Write-Ahead Logging (WAL) replication between the primary node in AZ1 and the standby node in AZ2 before acknowledgment, ensuring zero data loss. In the event of primary node failure, Huawei Cloud automated health arbiters execute sub-minute failover, elevating the standby instance to primary and redirecting database traffic with zero manual intervention.

## Alternatives considered

- Self-Hosted PostgreSQL on Elastic Cloud Server (ECS) with Manual Streaming Replication: Rejected because managing custom replication scripts, Patroni failover orchestrators, and split-brain fencing mechanisms imposes severe administrative overhead on the development team and cannot reliably guarantee sub-two-minute failover without complex custom tooling.
- Single-AZ RDS PostgreSQL with Asynchronous Read Replicas: Rejected because read replicas utilize asynchronous replication; in a sudden localized data center outage, unapplied replication buffers would result in irrecoverable data loss (violating the RPO = 0 requirement), and promoting an asynchronous replica requires manual administrator intervention, violating RTO bounds.

## Consequences

- Positive: Guarantees zero data loss (RPO = 0 minutes) for critical educational records; delivers automated failover within 120 seconds (RTO under 2 minutes); provides automated point-in-time recovery, automated minor version patching, and hourly snapshot backups to Object Storage Service (OBS).
- Negative: Introduces higher monthly cloud operating costs compared to single-instance deployments due to dual-node compute and redundant storage provisioning; incurs a marginal latency overhead (typically 1 to 3 milliseconds) on transactional commits due to cross-AZ synchronous network round-trips.
