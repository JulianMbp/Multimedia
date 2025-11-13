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

### Niveles del Juego

#### Obtener todos los niveles
```
GET /api/levels
```

Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "levelNumber": 1,
      "coinsCount": 10,
      "enemiesCount": 1,
      "description": "Nivel 1: Ciudad Toy Car",
      "isActive": true
    }
  ],
  "count": 3
}
```

#### Obtener configuración de un nivel específico
```
GET /api/levels/:levelId
```

Ejemplo: `GET /api/levels/1`

Respuesta:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "levelNumber": 1,
    "coinsCount": 10,
    "enemiesCount": 1,
    "description": "Nivel 1: Ciudad Toy Car",
    "isActive": true
  }
}
```

#### Obtener cantidad de coins de un nivel
```
GET /api/levels/:levelId/coins-count
```

Ejemplo: `GET /api/levels/1/coins-count`

Respuesta:
```json
{
  "success": true,
  "levelNumber": 1,
  "coinsCount": 10
}
```

### Puntuaciones del Juego

#### Guardar puntuación (Requiere autenticación)
```
POST /api/scores
Authorization: Bearer <token>
Content-Type: application/json

{
  "totalPoints": 150,
  "pointsByLevel": {
    "level1": 50,
    "level2": 60,
    "level3": 40
  },
  "gameTime": 1200.5  // opcional, en segundos
}
```

Respuesta:
```json
{
  "success": true,
  "message": "Puntuación guardada exitosamente",
  "data": {
    "_id": "...",
    "user": {
      "_id": "...",
      "email": "usuario@example.com",
      "name": "Nombre Usuario"
    },
    "totalPoints": 150,
    "pointsByLevel": {
      "level1": 50,
      "level2": 60,
      "level3": 40
    },
    "gameTime": 1200.5,
    "completedAt": "2025-11-12T...",
    "createdAt": "2025-11-12T...",
    "updatedAt": "2025-11-12T..."
  }
}
```

#### Obtener ranking global
```
GET /api/scores?limit=10
```

Parámetros opcionales:
- `limit`: Número de resultados (1-100, por defecto 10)

Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "user": {
        "_id": "...",
        "email": "usuario1@example.com",
        "name": "Usuario 1"
      },
      "totalPoints": 200,
      "pointsByLevel": {
        "level1": 70,
        "level2": 80,
        "level3": 50
      },
      "completedAt": "2025-11-12T...",
      "createdAt": "2025-11-12T..."
    }
  ],
  "count": 10
}
```

#### Obtener puntuaciones del usuario actual (Requiere autenticación)
```
GET /api/scores/me
Authorization: Bearer <token>
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "scores": [
      {
        "_id": "...",
        "totalPoints": 150,
        "pointsByLevel": {
          "level1": 50,
          "level2": 60,
          "level3": 40
        },
        "completedAt": "2025-11-12T...",
        "createdAt": "2025-11-12T..."
      }
    ],
    "bestScore": {
      "_id": "...",
      "totalPoints": 200,
      "pointsByLevel": {
        "level1": 70,
        "level2": 80,
        "level3": 50
      },
      "user": {
        "_id": "...",
        "email": "usuario@example.com",
        "name": "Nombre Usuario"
      }
    },
    "totalGames": 5
  }
}
```

#### Obtener mejor puntuación del usuario actual (Requiere autenticación)
```
GET /api/scores/best
Authorization: Bearer <token>
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "user": {
      "_id": "...",
      "email": "usuario@example.com",
      "name": "Nombre Usuario"
    },
    "totalPoints": 200,
    "pointsByLevel": {
      "level1": 70,
      "level2": 80,
      "level3": 50
    },
    "completedAt": "2025-11-12T...",
    "createdAt": "2025-11-12T..."
  }
}
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
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuración de MongoDB
│   ├── models/
│   │   ├── User.js           # Modelo de Usuario
│   │   ├── Level.js          # Modelo de Niveles del Juego
│   │   └── GameScore.js      # Modelo de Puntuaciones del Juego
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticación JWT
│   ├── routes/
│   │   ├── auth.routes.js    # Rutas de autenticación
│   │   ├── levels.routes.js  # Rutas de niveles
│   │   ├── scores.routes.js  # Rutas de puntuaciones
│   │   └── index.js          # Rutas principales
│   ├── scripts/
│   │   └── seedLevels.js     # Script para poblar niveles iniciales
│   └── server.js             # Archivo principal del servidor
├── docker-compose.yml         # Configuración de Docker
├── Dockerfile                # Imagen Docker
├── package.json              # Dependencias del proyecto
└── .env                      # Variables de entorno (crear manualmente)
```

## 🛠️ Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con watch
- `npm start`: Inicia el servidor en modo producción
- `npm run seed:levels`: Pobla la base de datos con datos iniciales de niveles (ejecutar después de la primera instalación)
  - **Si usas Docker:** Ejecuta desde dentro del contenedor: `docker exec backend-express npm run seed:levels`
  - **Si NO usas Docker:** Ejecuta directamente: `npm run seed:levels` (asegúrate de que tu `.env` tenga `MONGODB_URI` con `localhost` como host)

## ⚠️ Notas Importantes

- **Cambiar JWT_SECRET en producción:** Asegúrate de cambiar el `JWT_SECRET` en el archivo `.env` por un valor seguro y aleatorio en producción.
- **Credenciales de MongoDB:** Las credenciales por defecto son para desarrollo. Cambia las credenciales en producción.
- **Puertos:** Por defecto, el servidor corre en el puerto 3000 y MongoDB en el 27017. Ajusta según tus necesidades.

## 📄 Licencia

MIT

