# Reporte de Avance - Semana 09
**Responsable:** Ximena Zambrano Chala
**Equipo:** EduTrack (G1)
**Fecha:** 28 de Septiembre - 04 de Octubre de 2026

## 1. Tareas Realizadas

Durante la Semana 9 nos enfocamos en la reestructuración del API Gateway para mejorar la eficiencia y disminuir el consumo de recursos (CPU/RAM).

*   **Migración de API Gateway:** Se eliminó la implementación anterior basada en Spring Boot / Java y se reemplazó por un servidor perimetral **NGINX**.
*   **Configuración de Reverse Proxy:** Se crearon las reglas de enrutamiento (routing) en `nginx.conf` para despachar el tráfico hacia los microservicios internos (`academic` y `identity`).
*   **Manejo de CORS y Rate Limiting:** Se habilitó soporte nativo de CORS a nivel de Gateway y se implementó limitación de peticiones (rate limiting) por zona e IP para proteger la infraestructura.
*   **Validación Estructural de JWT:** Se delegó la validación estricta a cada microservicio bajo un esquema descentralizado, pero el NGINX descarta requests no autorizados si carecen del token.

## 2. Bloqueos o Impedimentos
No se presentaron bloqueos críticos. La configuración de NGINX en Docker requirió ajustes en los puertos debido a conflictos con la red local, pero fue solucionado asignando puertos limpios en el contenedor.

## 3. Trabajo Pendiente
Integrar los siguientes microservicios (`attendance` y `notifications`) al upstream de NGINX tan pronto como estén operativos.
