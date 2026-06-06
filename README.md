# 📋 Control de Visitas — Manufacturas Eliot S.A.

Sistema web para el registro y seguimiento de visitas de representantes comerciales a clientes. Incluye geolocalización, dashboard con métricas, reportes exportables y gestión de usuarios con roles.

---

## 🚀 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | HTML + CSS + JavaScript (vanilla) |
| Backend | Node.js — Vercel Serverless Functions |
| Base de datos | MariaDB / MySQL |
| Hosting | Vercel (gratis) |

---

## 📁 Estructura del proyecto

```
jornada_visitas/
├── jornada_laboral.html     ← Aplicación web completa
├── vercel.json              ← Configuración de rutas Vercel
├── package.json             ← Dependencias Node.js
├── .gitignore               ← Archivos excluidos de Git
└── api/
    ├── _db.js               ← Conexión compartida a MySQL
    ├── load.js              ← GET  /api/load
    ├── login.js             ← POST /api/login
    ├── empleados.js         ← CRUD /api/empleados
    ├── clientes.js          ← CRUD /api/clientes
    ├── visitas.js           ← CRUD /api/visitas
    └── cuentas.js           ← CRUD /api/cuentas
```

---

## 🗄️ Base de datos

### Tablas requeridas

Ejecuta este script SQL en tu base de datos MariaDB/MySQL para crear las tablas:

```sql
CREATE TABLE IF NOT EXISTS empleados (
  id        BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(255) NOT NULL,
  cargo     VARCHAR(255) DEFAULT 'Representante',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clientes (
  id        BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(255) NOT NULL,
  contacto  VARCHAR(255) DEFAULT '—',
  direccion VARCHAR(500) DEFAULT 'Sin dirección',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cuentas (
  id        BIGINT AUTO_INCREMENT PRIMARY KEY,
  username  VARCHAR(100) UNIQUE NOT NULL,
  password  VARCHAR(255) NOT NULL,
  rol       VARCHAR(50)  DEFAULT 'rep',
  emp_id    BIGINT       DEFAULT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (emp_id) REFERENCES empleados(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS visitas (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  visit_id    VARCHAR(50) UNIQUE NOT NULL,
  emp_id      BIGINT DEFAULT NULL,
  cliente_id  BIGINT DEFAULT NULL,
  objetivo    VARCHAR(255),
  entrada     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  salida      DATETIME DEFAULT NULL,
  entrada_lat DOUBLE DEFAULT NULL,
  entrada_lng DOUBLE DEFAULT NULL,
  entrada_acc INT    DEFAULT NULL,
  salida_lat  DOUBLE DEFAULT NULL,
  salida_lng  DOUBLE DEFAULT NULL,
  creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (emp_id)     REFERENCES empleados(id) ON DELETE SET NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cuentas por defecto
INSERT IGNORE INTO cuentas (username, password, rol) VALUES
  ('admin',      '1234', 'admin'),
  ('supervisor', '1234', 'supervisor'),
  ('rep1',       '1234', 'rep');
```

---

## ⚙️ Variables de entorno

Configura estas variables en **Vercel → Settings → Environment Variables**:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DB_HOST` | Host del servidor MySQL | `mysql.tuhosting.com` |
| `DB_PORT` | Puerto MySQL | `3306` |
| `DB_USER` | Usuario de la base de datos | `eliot_user` |
| `DB_PASSWORD` | Contraseña de la base de datos | `tu_contraseña` |
| `DB_NAME` | Nombre de la base de datos | `eliot_visitas` |

> ⚠️ **Nunca subas estas credenciales al repositorio.** Usa siempre variables de entorno.

---

## 🌐 Despliegue en Vercel

### Primera vez

1. Crea una cuenta en [vercel.com](https://vercel.com) con tu cuenta de GitHub
2. Clic en **Add New Project**
3. Importa el repositorio `jornada_visitas`
4. En **Environment Variables** agrega las 5 variables de la tabla anterior
5. Clic en **Deploy**

Tu app quedará disponible en:
```
https://jornada-visitas.vercel.app
```

### Actualizar después de cambios

```bash
git add .
git commit -m "descripción del cambio"
git push origin Master
```
Vercel redespliega automáticamente en ~1 minuto.

---

## 👥 Roles de usuario

| Rol | Permisos |
|---|---|
| **Administrador** | Acceso completo — registrar visitas, ver todo el historial, reportes, gestionar clientes, empleados, cuentas y editar registros |
| **Supervisor** | Registrar visitas, ver todo el historial, reportes y gestionar clientes |
| **Representante** | Solo registrar sus propias visitas y ver su propio historial |

### Credenciales por defecto
```
Usuario: admin       Contraseña: 1234
Usuario: supervisor  Contraseña: 1234
Usuario: rep1        Contraseña: 1234
```
> ⚠️ Cambia estas contraseñas después del primer login.

---

## ✨ Funcionalidades

- ✅ Login con roles y sesión persistente
- ✅ Dashboard con métricas, gráficas y actividad reciente
- ✅ Registro de entrada/salida con geolocalización GPS
- ✅ ID único por visita (formato `VIS-AAMMDD-0001`)
- ✅ Objetivo de visita configurable
- ✅ Historial completo con enlace a Google Maps
- ✅ Reportes filtrables por fecha, representante y cliente
- ✅ Exportación a CSV
- ✅ Gestión de clientes y representantes
- ✅ Edición de registros (solo administrador)
- ✅ Diseño responsive para móvil y escritorio

---

## 📞 Soporte

**Manufacturas Eliot S.A.**
