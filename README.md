# 🧠 MicroEpilepsia — Simulador de Microservicios Médicos

Sistema modular de microservicios diseñado para simular el flujo completo de atención médica básica: autenticación, registro de paciente, diagnóstico MRI y asignación de materiales.

El objetivo es ofrecer una solución sencilla, modular y didáctica que cumpla con atributos de calidad clave (seguridad, latencia y mantenibilidad) y que sea fácilmente desplegable en entornos locales o cloud.

---

## ⚙️ Microservicios

### 🔐 `auth-servicio` (Django)
- Recibe una `access_key` secreta y entrega un **token JWT**.
- Si el token es válido, puede ser usado para acceder a los demás servicios.
- Puerto: `8000`

### 👤 `paciente-servicio` (Django)
- Registra nuevos pacientes.
- Almacena nombre, edad y género.
- Protegido por JWT.
- Puerto: `8001`

### 🧠 `mri-servicio` (Node.js)
- Simula un diagnóstico MRI aleatorio (`positivo` o `negativo`).
- Protegido por JWT.
- Puerto: `5004`

### 🎒 `materiales-service` (Node.js)
- Asigna un material disponible desde una base SQLite.
- Cambia su estado a "no disponible" cuando es asignado.
- Protegido por JWT.
- Puerto: `5003`

### 🌐 `gateway` (Node.js + Express)
- Recibe todas las solicitudes del frontend.
- Valida JWT y reenvía a los microservicios correspondientes.
- Puerto: `8080`

### 💻 `frontend` (React)
- Interfaz de usuario amigable.
- Permite probar el flujo completo (autenticarse, registrar, diagnosticar, asignar).
- Muestra logs en tiempo real.
- Puerto: `3000`

---

## 🚀 ¿Qué hace el sistema?

- ✅ Verifica acceso con clave secreta
- ✅ Emite token JWT con rol y expiración
- ✅ Permite registrar pacientes
- ✅ Simula un diagnóstico MRI
- ✅ Asigna un material disponible
- ✅ Orquesta todo desde el frontend
- ✅ Muestra errores y logs de seguridad

---

## 🐳 Despliegue Local con Docker Compose

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/microepilepsia.git
cd microepilepsia
```

2. Asegúrate de tener Docker y Docker Compose instalados.

3. Ejecuta:

```bash
docker compose up --build -d
```

4. Accede a:
- 🌐 Frontend: http://localhost:3000  
- 🧪 API Gateway: http://localhost:8080  
- Cada microservicio también expone su propio puerto (ver arriba)

---

## 🧪 Pruebas Rápidas con `curl`

```bash
# 1. Obtener token (clave por defecto)
curl -X POST http://localhost:8080/api/acceso -H "Content-Type: application/json" -d "{"access_key": "clave-secreta-super123"}"

# 2. Registrar paciente
curl -X POST http://localhost:8080/api/pacientes/registrar -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d "{"nombre": "Juan", "edad": 30, "genero": "masculino"}"

# 3. Diagnóstico MRI
curl -X POST http://localhost:8080/api/diagnosticos/mri -H "Authorization: Bearer <TOKEN>"

# 4. Asignar material
curl -X GET http://localhost:8080/api/materiales/asignar -H "Authorization: Bearer <TOKEN>"
```

---

## 🧠 ASRs cumplidos

### Seguridad
> Solo usuarios con clave válida obtienen token JWT. Todos los servicios validan el token antes de ejecutar una acción.

### Latencia
> Todas las operaciones se simulan con respuesta < 1s.

### Modificabilidad
> El sistema permite agregar microservicios nuevos en menos de 12 horas:
- Crear nuevo Dockerfile
- Añadir al `docker-compose.yml`
- Registrar ruta en `gateway`
- Conectar desde frontend si aplica
