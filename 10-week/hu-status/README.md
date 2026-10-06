# Reporte de Avance - Semana 10
**Responsable:** Ximena Zambrano Chala
**Equipo:** EduTrack (G1)
**Fecha:** 05 de Octubre - 11 de Octubre de 2026

## 1. Tareas Realizadas

Durante la Semana 10, realizamos una auditoría profunda de la arquitectura y la gobernanza del proyecto para alinear al equipo 100% con los lineamientos oficiales (Anexo J) estipulados por el profesor.

*   **Auditoría y Recuperación Histórica:** Se detectó que algunas ramas antiguas habían sido borradas al completar los PRs (squash/merge). Se ejecutó un proceso de `git reflog` y `git branch` para restaurar todo el historial de ramas perdidas en todos los repositorios (cumpliendo la regla estricta de no borrar historial para la trazabilidad de notas).
*   **Alineación Arquitectónica (Anexo J):** Se reescribió el documento de arquitectura `ADR-003` para transicionar formalmente de "Database per Service" a un esquema más eficiente: **Single Instance per Engine with a Schema per Domain**.
*   **Refactorización de Infraestructura PostgreSQL:** El repositorio `educk-infra` fue renombrado a `educk-infra-postgres`. Se refactorizó el `docker-compose.yml` para levantar un único contenedor de PostgreSQL 16 que provee esquemas independientes lógicos para `identity`, `academic`, `attendance` y `notifications` mediante scripts de inicialización SQL automáticos.
*   **Incorporación de MongoDB:** Se creó y configuró un nuevo repositorio `educk-infra-mongo` dedicado a levantar el motor documental NoSQL para manejar el dominio de `communication`.
*   **Validación de Pruebas:** Se actualizó `smoke_test.py` y `.env.example` consolidando las pruebas de puertos y de carga para reflejar la nueva topología simplificada y ahorrar recursos de máquina.

## 2. Bloqueos o Impedimentos
Para aplicar la nueva infraestructura, el profesor debía autorizar el cambio y crear los repositorios a nivel de organización (`code-corhuila`). Se redactaron y escalaron formalmente los Issues en `educk-docs`, los cuales fueron aprobados y aprovisionados rápidamente, permitiendo continuar con el Sprint sin retrasos prolongados.

## 3. Trabajo Pendiente
Continuar el ciclo de revisión de PRs de UI (`educk-front`) e iniciar las pruebas de integración entre los microservicios, el NGINX y las nuevas bases de datos compartidas.
