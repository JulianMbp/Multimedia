# Backend Express con MongoDB y JWT

Backend desarrollado con Express.js, MongoDB y autenticación JWT. Incluye registro y login de usuarios con encriptación de contraseñas usando bcryptjs.

## 🚀 Características

- ✅ Express.js como framework
- ✅ MongoDB con Mongoose
- ✅ Autenticación JWT
- ✅ Encriptación de contraseñas con bcryptjs
- ✅ Docker Compose para desarrollo
- ✅ Validación de datos con express-validator

## 📋 Requisitos Previos

- Node.js 18 o superior
- Docker y Docker Compose (opcional, para usar con Docker)

## 🔧 Instalación

### Opción 1: Sin Docker (Desarrollo Local)

1. Clona el repositorio o navega a la carpeta del proyecto:
```bash
cd Bakcned-new
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
NODE_ENV=development
PORT=3000

MONGODB_URI=mongodb://admin:admin123@localhost:27017/multimedia_db?authSource=admin

JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h
```

4. Asegúrate de tener MongoDB corriendo localmente en el puerto 27017, o ajusta la URI en el `.env`.

5. Inicia el servidor:
```bash
npm run dev
```

### Opción 2: Con Docker Compose

1. Asegúrate de tener Docker y Docker Compose instalados.

2. Crea el archivo `.env` con las credenciales (ver arriba).

3. Inicia los servicios con Docker Compose:
```bash
docker-compose up -d
```

Esto iniciará:
- MongoDB en el puerto 27017
- El servidor Express en el puerto 3000

4. Para ver los logs:
```bash
docker-compose logs -f
```

5. Para detener los servicios:
```bash
docker-compose down
```

## 📝 Credenciales de MongoDB

Las credenciales configuradas en Docker Compose son:
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Base de datos:** `multimedia_db`

Estas credenciales están configuradas en el archivo `docker-compose.yml` y deben coincidir con las del archivo `.env`.

## 🔌 Endpoints de la API

### Health Check
```
GET /api/health
```

### Registro de Usuario
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "name": "Nombre Usuario" // opcional
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Obtener Perfil (Requiere autenticación)
```
GET /api/auth/me
Authorization: Bearer <token>
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. Después de hacer login o registro, recibirás un token que debes incluir en el header `Authorization` como `Bearer <token>` para acceder a rutas protegidas.

### Ejemplo de uso del token:
```bash
curl -H "Authorization: Bearer tu_token_aqui" http://localhost:3000/api/auth/me
```

## 🔒 Seguridad

- Las contraseñas se encriptan usando bcryptjs con un salt de 10 rondas
- Los tokens JWT tienen una expiración configurable (por defecto 24 horas)
- Las contraseñas no se devuelven en las respuestas del API
- Validación de datos en los endpoints de registro y login

## 📁 Estructura del Proyecto

```
Bakcned-new/
├── src/
│   ├── config/
│   │   └── database.js       # Configuración de MongoDB
│   ├── models/
│   │   └── User.js           # Modelo de Usuario
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticación JWT
│   ├── routes/
│   │   ├── auth.routes.js    # Rutas de autenticación
│   │   └── index.js          # Rutas principales
│   └── server.js             # Archivo principal del servidor
├── docker-compose.yml         # Configuración de Docker
├── Dockerfile                # Imagen Docker
├── package.json              # Dependencias del proyecto
└── .env                      # Variables de entorno (crear manualmente)
```

## 🛠️ Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con watch
- `npm start`: Inicia el servidor en modo producción

## ⚠️ Notas Importantes

- **Cambiar JWT_SECRET en producción:** Asegúrate de cambiar el `JWT_SECRET` en el archivo `.env` por un valor seguro y aleatorio en producción.
- **Credenciales de MongoDB:** Las credenciales por defecto son para desarrollo. Cambia las credenciales en producción.
- **Puertos:** Por defecto, el servidor corre en el puerto 3000 y MongoDB en el 27017. Ajusta según tus necesidades.

## 📄 Licencia

MIT

