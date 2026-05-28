# PetShop - Documentación General del Sistema

## 📋 Descripción del Sistema

PetShop es una aplicación web completa para la gestión de una tienda de mascotas. El sistema permite a los usuarios explorar, buscar y adquirir productos para sus mascotas, con un backend robusto que maneja la lógica de negocio, autenticación, pagos y comunicaciones por correo electrónico.

La aplicación está compuesta por dos repositorios principales:
- **petshop-back**: Backend desarrollado en Python
- **petshop-front**: Frontend desarrollado en Vue.js

---

## 🛠️ Tecnologías Usadas

### Backend (petshop-back)
- **Lenguaje**: Python (100%)
- **Hosting**: Render
- **Base de Datos**: PostgreSQL (Render)
- **Características**:
  - API RESTful
  - Autenticación y autorización
  - Gestión de usuarios y productos
  - Procesamiento de pagos
  - Sistema de correos electrónicos

### Frontend (petshop-front)
- **Lenguaje**: Vue.js (84.8%)
- **JavaScript**: 13.4%
- **CSS**: 1.4%
- **HTML**: 0.4%
- **Hosting**: Vercel
- **Características**:
  - Interfaz responsiva
  - Navegación fluida
  - Consumo de API REST
  - Gestión de estado

---

## 🌐 URLs del Sistema

### Backend
- **URL Producción**: `https://petshop-back-wyre.onrender.com`
- **Plataforma**: Render

### Frontend
- **URL Producción**: `https://petshop-front-cyan.vercel.app/`
- **Plataforma**: Vercel

### Base de Datos
- **URL Interna**: `postgresql://petshop_7fb5_user:gLUVPkpC6xDw1siN4J6kwtdTnAJCUetp@dpg-d8b5t7pakrks73dde1ug-a/petshop_7fb5`
- **URL Externa**: `postgresql://petshop_7fb5_user:gLUVPkpC6xDw1siN4J6kwtdTnAJCUetp@dpg-d8b5t7pakrks73dde1ug-a.ohio-postgres.render.com/petshop_7fb5`
- **Plataforma**: PostgreSQL en Render (Región: Ohio)

---

## 🔌 Endpoints API

### Estructura General
La API del backend está disponible en: `https://petshop-back-wyre.onrender.com`

### Endpoints Principales (Referencial)
```
GET    /api/productos          - Obtener lista de productos
GET    /api/productos/<id>     - Obtener producto específico
POST   /api/auth/login         - Autenticación de usuario
POST   /api/auth/register      - Registro de nuevo usuario
POST   /api/carrito            - Gestionar carrito
POST   /api/pedidos            - Crear pedido
GET    /api/pedidos/<id>       - Obtener detalles del pedido
POST   /api/pago               - Procesar pago
GET    /api/perfil            - Obtener perfil de usuario
PUT    /api/perfil            - Actualizar perfil de usuario
```

**Nota**: Para una documentación completa de endpoints, consultar el repositorio `petshop-back`.

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend)                    │
│              https://petshop-front-cyan.                │
│                    vercel.app/                          │
│    Vue.js | JavaScript | CSS | HTML                     │
│                  (Vercel Hosting)                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     │ (VITE_BACKEND_URL)
┌────────────────────▼────────────────────────────────────┐
│                   SERVIDOR (Backend)                     │
│         https://petshop-back-wyre.onrender.com          │
│              Python REST API                            │
│           (Render Hosting - Autenticación)              │
│         (Mailjet para notificaciones)                   │
└────────────────────┬────────────────────────────────────┘
                     │ PostgreSQL Driver
                     │ (DB_HOST, DB_PORT, etc.)
┌────────────────────▼────────────────────────────────────┐
│                  BASE DE DATOS                           │
│                  PostgreSQL                              │
│    dpg-d8b5t7pakrks73dde1ug-a.ohio-postgres.            │
│         render.com (Render Hosting)                      │
│              (Region: Ohio)                              │
└─────────────────────────────────────────────────────────┘
```

### Componentes del Sistema

1. **Frontend (Vue.js en Vercel)**
   - Interfaz de usuario
   - Gestión del estado local
   - Consumo de API REST
   - Routing y navegación

2. **Backend (Python en Render)**
   - Lógica de negocio
   - Autenticación y autorización
   - Gestión de base de datos
   - Procesamiento de pagos
   - Envío de correos electrónicos

3. **Base de Datos (PostgreSQL en Render)**
   - Almacenamiento persistente
   - Integridad de datos
   - Respaldos automáticos

---

## 🔐 Seguridad

### Variables de Entorno Backend (petshop-back)

El backend utiliza las siguientes variables de entorno configuradas en Render:

| Variable | Descripción |
|----------|-------------|
| `DB_HOST` | Host del servidor PostgreSQL |
| `DB_NAME` | Nombre de la base de datos |
| `DB_PASSWORD` | Contraseña del usuario de BD |
| `DB_PORT` | Puerto del servidor PostgreSQL |
| `DB_USERNAME` | Usuario de la base de datos |
| `FRONTEND_URL` | URL del frontend (validación CORS) |
| `MAILJET_API_KEY` | Clave API de Mailjet |
| `MAILJET_API_SECRET` | Secreto API de Mailjet |
| `PYTHON_VERSION` | Versión de Python requerida |

### Variables de Entorno Frontend (petshop-front)

El frontend utiliza la siguiente variable de entorno configurada en Vercel:

| Variable | Descripción |
|----------|-------------|
| `VITE_BACKEND_URL` | URL del backend para llamadas API |

### Medidas de Seguridad Implementadas

- **Autenticación**: Sistema de login seguro en el backend
- **CORS**: Validación de origen (FRONTEND_URL)
- **Variables de Entorno**: Credenciales almacenadas de forma segura
- **HTTPS**: Todas las comunicaciones están encriptadas
- **Base de Datos**: Credenciales protegidas en Render
- **Email**: Integración con Mailjet para envío seguro de correos

---

## 🚀 Plataformas de Hosting

### Render
- **Servicios Alojados**:
  - Backend (Peticiones API)
  - Base de Datos PostgreSQL
  - Ubicación: Ohio
- **Beneficios**:
  - Hosting automático
  - Variables de entorno seguras
  - Base de datos gestionada
  - Escalabilidad automática

### Vercel
- **Servicios Alojados**:
  - Frontend Vue.js
- **Beneficios**:
  - Despliegue automático desde Git
  - CDN global
  - Optimización automática
  - Vistas previas de Pull Requests

### Mailjet
- **Servicio**: Envío de correos electrónicos
- **Uso**: Notificaciones a usuarios (confirmaciones, recuperación de contraseña, etc.)
- **Credenciales**: Almacenadas como variables de entorno en Render

---

## 📱 Flujo de Funcionamiento

1. **Usuario accede al Frontend**
   - Abre `https://petshop-front-cyan.vercel.app/`
   - Carga interfaz Vue.js desde Vercel (CDN global)

2. **Frontend Realiza Peticiones**
   - Utiliza `VITE_BACKEND_URL` para conectarse al backend
   - `https://petshop-back-wyre.onrender.com`

3. **Backend Procesa Solicitudes**
   - Valida autenticación
   - Accede a PostgreSQL usando credenciales seguras
   - Ejecuta lógica de negocio
   - Envía correos a través de Mailjet si es necesario

4. **Respuesta al Frontend**
   - Backend devuelve datos en formato JSON
   - Frontend actualiza la interfaz

---

## 📚 Información Adicional

### Repositorios
- **Backend**: [AngelAmador384/petshop-back](https://github.com/AngelAmador384/petshop-back)
- **Frontend**: [AngelAmador384/petshop-front](https://github.com/AngelAmador384/petshop-front)

---

**Última actualización**: 2026-05-28

