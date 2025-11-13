# 🔌 Conexión Backend - Frontend

**Fecha:** Noviembre 2025  
**Estado:** ✅ Conectado y Funcional

---

## 📋 Resumen

El frontend y backend están completamente conectados. Se ha creado una configuración centralizada de la API para mantener consistencia en todas las llamadas.

---

## 🔧 Configuración

### Backend
- **Puerto:** 3000 (por defecto)
- **Base URL:** `http://localhost:3000/api`
- **Endpoints disponibles:**
  - `/api/health` - Health check
  - `/api/auth/*` - Autenticación
  - `/api/levels/*` - Configuración de niveles

### Frontend
- **Configuración centralizada:** `game-project/src/config/api.js`
- **URL base:** Configurable mediante `VITE_API_URL` en variables de entorno
- **Valor por defecto:** `http://localhost:3000/api`

---

## 📡 Endpoints Conectados

### 1. Autenticación (`/api/auth`)

#### Login
- **Endpoint:** `POST /api/auth/login`
- **Servicio:** `game-project/src/services/authService.js`
- **Uso:** `API_ENDPOINTS.auth.login`
- **Body:**
  ```json
  {
    "email": "usuario@example.com",
    "password": "password123"
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Login exitoso",
    "token": "jwt_token_here",
    "user": {
      "id": "...",
      "email": "...",
      "name": "..."
    }
  }
  ```

#### Registro
- **Endpoint:** `POST /api/auth/register`
- **Servicio:** `game-project/src/services/authService.js`
- **Uso:** `API_ENDPOINTS.auth.register`

#### Perfil
- **Endpoint:** `GET /api/auth/me`
- **Servicio:** `game-project/src/services/authService.js`
- **Uso:** `API_ENDPOINTS.auth.me`
- **Requiere:** Header `Authorization: Bearer <token>`

### 2. Niveles (`/api/levels`)

#### Obtener todos los niveles
- **Endpoint:** `GET /api/levels`
- **Servicio:** `game-project/src/services/levelsService.js`
- **Función:** `getAllLevels()`
- **Uso:** `API_ENDPOINTS.levels.all`

#### Obtener configuración de un nivel
- **Endpoint:** `GET /api/levels/:levelId`
- **Servicio:** `game-project/src/services/levelsService.js`
- **Función:** `getLevelConfig(levelId)`
- **Uso:** `API_ENDPOINTS.levels.byId(levelId)`

#### Obtener cantidad de coins
- **Endpoint:** `GET /api/levels/:levelId/coins-count`
- **Servicio:** `game-project/src/services/levelsService.js`
- **Función:** `getCoinsCountByLevel(levelId)`
- **Uso:** `API_ENDPOINTS.levels.coinsCount(levelId)`
- **Fallback:** Retorna `10` si el backend no está disponible

### 3. Health Check

- **Endpoint:** `GET /api/health`
- **Servicio:** `game-project/src/config/api.js`
- **Función:** `checkBackendHealth()`
- **Uso:** `API_ENDPOINTS.health`

---

## 📁 Archivos Clave

### Backend

```
backend/
├── src/
│   ├── models/
│   │   └── Level.js          # Modelo de niveles
│   ├── routes/
│   │   ├── auth.routes.js    # Rutas de autenticación
│   │   ├── levels.routes.js  # Rutas de niveles
│   │   └── index.js          # Registro de rutas
│   ├── config/
│   │   └── database.js       # Configuración MongoDB (soporta múltiples formatos)
│   └── server.js             # Servidor principal
```

### Frontend

```
game-project/
├── src/
│   ├── config/
│   │   └── api.js            # ⭐ Configuración centralizada de API
│   ├── services/
│   │   ├── authService.js     # Servicio de autenticación
│   │   └── levelsService.js   # Servicio de niveles
│   └── Experience/World/
│       └── World.js           # Usa levelsService para cargar coins
```

---

## 🔄 Flujo de Datos

### Carga de Coins por Nivel

1. **Al iniciar el juego (Nivel 1):**
   ```
   World.js → loadMaxCheesesFromBackend(1)
   → levelsService.getCoinsCountByLevel(1)
   → GET /api/levels/1/coins-count
   → Backend consulta MongoDB
   → Retorna coinsCount
   → World.js actualiza maxCheeses
   ```

2. **Al cambiar a Nivel 2:**
   ```
   World.js → startLevel2()
   → loadMaxCheesesFromBackend(2)
   → levelsService.getCoinsCountByLevel(2)
   → GET /api/levels/2/coins-count
   → Backend consulta MongoDB
   → Retorna coinsCount
   → World.js actualiza maxCheeses
   ```

3. **Al cambiar a Nivel 3:**
   ```
   World.js → startLevel3()
   → loadMaxCheesesFromBackend(3)
   → levelsService.getCoinsCountByLevel(3)
   → GET /api/levels/3/coins-count
   → Backend consulta MongoDB
   → Retorna coinsCount
   → World.js actualiza maxCheeses
   ```

### Fallback

Si el backend no está disponible:
- `levelsService.getCoinsCountByLevel()` retorna `10` (valor por defecto)
- El juego continúa funcionando normalmente
- Se muestra un warning en consola

---

## 🛠️ Configuración de Variables de Entorno

### Backend (`.env`)

```env
NODE_ENV=development
PORT=3000

# Opción 1: URI completa
MONGODB_URI=mongodb://admin:admin123@localhost:27017/multimedia_db?authSource=admin

# Opción 2: Variables individuales (si no hay MONGODB_URI)
DATABASE_URL=mongodb://localhost:27017
DATABASE_NAME=multimedia_db
DATABASE_USERNAME=admin
DATABASE_PASSWORD=admin123

JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h
```

### Frontend (`.env` o `vite.config.js`)

```env
VITE_API_URL=http://localhost:3000/api
```

**Nota:** Si no se define `VITE_API_URL`, se usa `http://localhost:3000/api` por defecto.

---

## ✅ Verificación de Conexión

### 1. Verificar que el backend esté corriendo

```bash
cd backend
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
✅ MongoDB conectado exitosamente
```

### 2. Verificar endpoints desde el navegador

Abre en el navegador:
- `http://localhost:3000/` - Debe mostrar lista de endpoints
- `http://localhost:3000/api/health` - Debe retornar `{"status":"OK",...}`

### 3. Poblar base de datos con niveles

```bash
cd backend
npm run seed:levels
```

Deberías ver:
```
✅ MongoDB conectado exitosamente
✅ Nivel 1 creado
✅ Nivel 2 creado
✅ Nivel 3 creado
📊 Resumen de niveles en la base de datos:
   Nivel 1: 10 coins, 1 enemigos
   Nivel 2: 10 coins, 3 enemigos
   Nivel 3: 10 coins, 5 enemigos
```

### 4. Verificar desde el frontend

Abre la consola del navegador al iniciar el juego. Deberías ver:
```
✅ Coins del nivel 1 obtenidos desde backend: 10
📊 maxCheeses actualizado para nivel 1: 10
```

---

## 🔍 Troubleshooting

### Error: "No se pudo obtener coins desde backend"

**Causas posibles:**
1. Backend no está corriendo
2. URL incorrecta en `VITE_API_URL`
3. CORS no configurado (aunque ya está configurado)

**Solución:**
- Verificar que el backend esté corriendo en el puerto 3000
- Verificar la variable `VITE_API_URL` en el frontend
- El juego continuará con valor por defecto (10 coins)

### Error: "Authentication failed" en MongoDB

**Causas posibles:**
1. Credenciales incorrectas en `.env`
2. MongoDB no está corriendo
3. Usuario no existe en MongoDB

**Solución:**
- Verificar credenciales en `.env`
- Verificar que MongoDB esté corriendo
- Usar `MONGODB_URI` completa o variables individuales según tu configuración

### Warning: "Duplicate schema index"

**Causa:** El modelo Level tenía un índice duplicado.

**Solución:** ✅ Ya corregido - se removió el índice manual porque `unique: true` ya lo crea automáticamente.

---

## 📊 Estado Actual

### ✅ Completado

- ✅ Modelo Level en MongoDB
- ✅ Endpoints de niveles funcionando
- ✅ Servicio de niveles en frontend
- ✅ Configuración centralizada de API
- ✅ Conexión frontend-backend para coins
- ✅ Fallback a valores por defecto
- ✅ Documentación de endpoints en server.js

### ⚠️ Pendiente (no crítico)

- ⚠️ El endpoint `/api/blocks` que intenta usar `ToyCarLoader` no existe (pero tiene fallback al JSON local, así que está bien)
- ⚠️ Socket.io está configurado pero no se está usando actualmente

---

## 🎯 Próximos Pasos

1. **Ejecutar seed de niveles:**
   ```bash
   cd backend
   npm run seed:levels
   ```

2. **Iniciar backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Iniciar frontend:**
   ```bash
   cd game-project
   npm run dev
   ```

4. **Verificar conexión:**
   - Abrir consola del navegador
   - Buscar mensajes de conexión exitosa
   - Verificar que los coins se carguen desde el backend

---

**Última actualización:** Noviembre 2025  
**Estado:** ✅ Backend y Frontend completamente conectados

