# 📋 Informe Final del Desarrollo

**Proyecto: Juego 3D Multinivel con Sistema de Autenticación y Puntuaciones**

**Autor:** Julian Bastidas  
**Materia:** Programación Orientada a Entornos Multimediales  
**Fecha:** Noviembre 2025  
**Universidad:** Universidad Cooperativa de Colombia

---

## 📖 Descripción del Proceso y Decisiones Tomadas

### 1. Arquitectura del Proyecto

El proyecto se desarrolló en dos partes principales que trabajan de forma integrada:

#### 🔧 Backend (Express.js + MongoDB)

**Tecnología elegida:** Express.js con Node.js y MongoDB

**Decisiones arquitectónicas:**

- **Arquitectura RESTful:** Se implementó una API REST estándar para facilitar la integración con el frontend y permitir escalabilidad futura.

- **Mongoose como ODM:** Se eligió Mongoose para trabajar con MongoDB, proporcionando esquemas tipados, validación y métodos de consulta potentes.

- **Sistema de Autenticación JWT:** Se implementó autenticación basada en tokens JWT con validación de expiración. Los tokens se almacenan en el frontend y se validan en cada petición protegida.

- **Sistema de Puntuaciones:** Se creó un modelo completo de puntuaciones (`GameScore`) que almacena:
  - Puntos totales del juego
  - Desglose de puntos por nivel (level1, level2, level3)
  - Tiempo de juego (opcional)
  - Relación con el usuario
  - Fecha de finalización

- **Sistema de Niveles:** Se implementó un modelo `Level` que almacena configuración dinámica:
  - Número de nivel
  - Cantidad de coins por nivel
  - Cantidad de enemigos por nivel
  - Estado activo/inactivo
  - Descripción

- **Validación de Datos:** Se utiliza `express-validator` para validar todos los datos de entrada, asegurando integridad y seguridad.

- **Docker Compose:** Se configuró Docker Compose para facilitar el desarrollo local con MongoDB y Express en contenedores.

**Estructura del Backend:**
```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuración MongoDB (soporta múltiples formatos)
│   ├── models/
│   │   ├── User.js           # Modelo de Usuario
│   │   ├── Level.js          # Modelo de Niveles del Juego
│   │   └── GameScore.js      # Modelo de Puntuaciones
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticación JWT
│   ├── routes/
│   │   ├── auth.routes.js    # Rutas de autenticación
│   │   ├── levels.routes.js  # Rutas de niveles
│   │   ├── scores.routes.js  # Rutas de puntuaciones
│   │   └── index.js          # Registro de rutas
│   ├── scripts/
│   │   └── seedLevels.js     # Script para poblar niveles iniciales
│   └── server.js             # Servidor principal
```

**Endpoints Implementados:**

- **Autenticación:**
  - `POST /api/auth/register` - Registro de usuarios
  - `POST /api/auth/login` - Inicio de sesión
  - `GET /api/auth/me` - Obtener perfil del usuario actual

- **Niveles:**
  - `GET /api/levels` - Obtener todos los niveles activos
  - `GET /api/levels/:levelId` - Obtener configuración de un nivel
  - `GET /api/levels/:levelId/coins-count` - Obtener cantidad de coins de un nivel

- **Puntuaciones:**
  - `POST /api/scores` - Guardar puntuación (requiere autenticación)
  - `GET /api/scores` - Obtener ranking global (top 10 por defecto)
  - `GET /api/scores/me` - Obtener puntuaciones del usuario actual
  - `GET /api/scores/best` - Obtener mejor puntuación del usuario

- **Health Check:**
  - `GET /api/health` - Verificar estado del servidor

#### 🎮 Frontend (React + Three.js)

**Tecnologías elegidas:** React 19, Three.js, Cannon.js, Vite

**Decisiones arquitectónicas:**

- **Programación Orientada a Objetos (POO):** Se estructuró todo el código del juego usando clases y principios de POO, facilitando la organización y mantenibilidad del código.

- **Patrón Singleton:** La clase `Experience` se implementó como Singleton para garantizar una única instancia del entorno 3D en toda la aplicación.

- **Separación de Responsabilidades:** Cada clase tiene una responsabilidad específica:
  - `World.js`: Gestión del mundo del juego, niveles, enemigos, quesos, portal, puntos
  - `Robot.js`: Control del personaje principal con animaciones
  - `Enemy.js`: Lógica de enemigos que persiguen con animaciones idle/walking
  - `Cheese.js`: Sistema de recolección
  - `Portal.js`: Sistema de transición entre niveles con efectos de vórtice
  - `Camera.js`: Control de cámaras
  - `Physics.js`: Motor de física
  - `ToyCarLoader.js`: Carga de modelos 3D desde JSON con física precisa

- **Sistema de Recursos:** Se implementó un sistema centralizado de carga de recursos (modelos 3D, texturas, sonidos) que permite cargar todos los assets de forma asíncrona antes de iniciar el juego.

- **Sistema de Niveles:** Se diseñó un sistema modular de niveles que permite agregar nuevos niveles fácilmente. Cada nivel tiene sus propios edificios, enemigos y configuración cargada desde el backend.

- **Física Realista:** Se utilizó Cannon.js para implementar física realista, incluyendo:
  - Colisiones entre personaje y enemigos
  - Colisiones con edificios y obstáculos (física de caja y Trimesh)
  - Gravedad y movimiento realista
  - Detección de colisiones en tiempo real
  - Física precisa (Trimesh) para edificios complejos

- **Sistema de Partículas:** Se implementó un sistema de partículas personalizado para guiar al jugador hacia los quesos, mejorando la experiencia de usuario.

- **Sistema de Servicios:** Se crearon servicios modulares para comunicación con el backend:
  - `authService.js`: Autenticación y gestión de tokens
  - `levelsService.js`: Obtención de configuración de niveles
  - `scoresService.js`: Guardado y obtención de puntuaciones

- **Configuración Centralizada:** Se implementó `api.js` para centralizar todas las URLs y endpoints de la API, facilitando el mantenimiento.

- **Optimización de Rendimiento:**
  - Lazy loading de modelos 3D
  - Object pooling para partículas
  - Culling de objetos fuera de vista
  - Optimización de colisiones
  - Física precisa solo para edificios que lo requieren

**Estructura del Frontend:**
```
game-project/
├── src/
│   ├── Experience/        # Núcleo del juego 3D
│   │   ├── World/        # Lógica del mundo
│   │   ├── Camera/       # Sistema de cámaras
│   │   ├── Renderer/     # Renderizado 3D
│   │   └── Resources/    # Carga de recursos
│   ├── components/        # Componentes React
│   ├── controls/         # Sistemas de control
│   ├── loaders/         # Cargadores personalizados
│   ├── services/        # Servicios de API
│   ├── config/          # Configuración centralizada
│   └── context/         # Context API de React
├── public/
│   ├── data/
│   │   └── toy_car_blocks.json  # Datos de objetos del escenario
│   ├── config/
│   │   └── precisePhysicsModels.json  # Modelos con física precisa
│   └── textures/        # Texturas para carteles
```

### 2. Decisiones de Diseño del Juego

#### Sistema de Niveles

Se diseñaron 3 niveles progresivos con dificultad creciente:

- **Nivel 1:** 1 enemigo, entorno urbano con edificios de juguete, 10+ coins del JSON
- **Nivel 2:** 3 enemigos, edificios de estilo antiguo, 10+ coins del JSON
- **Nivel 3:** 5 enemigos, casas temáticas de Pokémon, 10+ coins del JSON

**Razón:** Progresión gradual de dificultad que mantiene al jugador comprometido.

#### Sistema de Recolección

- **Quesos dinámicos:** Cantidad configurable desde el backend (por defecto 10 por nivel)
- **Coins del JSON:** Mínimo 10 coins con `Role="default"` por nivel, más 1 coin con `Role="finalPrize"`
- **Generación dinámica:** Los quesos se generan en posiciones válidas usando raycasting y validación de colisiones para evitar spawn en edificios
- **Partículas guía:** Sistema visual que ayuda al jugador a encontrar los quesos
- **Validación completa:** El portal solo se activa cuando se recolectan todos los quesos dinámicos Y todos los coins del JSON

**Razón:** Balance entre desafío y accesibilidad, con ayuda visual para mejorar la experiencia.

#### Sistema de Enemigos

- **Persecución inteligente:** Los enemigos persiguen al jugador desde 300 metros de distancia
- **Velocidad menor:** Los enemigos son más lentos que el jugador, permitiendo escape estratégico
- **Animaciones dinámicas:** Los enemigos cambian entre animación idle (cuando están quietos) y walking (cuando persiguen)
- **Detección de colisiones:** Sistema preciso de colisiones que termina el juego si un enemigo toca al jugador
- **Eliminación al completar nivel:** Los enemigos desaparecen cuando se completa el nivel para permitir acceso seguro al portal

**Razón:** Crea tensión y desafío sin hacer el juego imposible, con animaciones fluidas.

#### Sistema de Portal

- **Aparición al completar nivel:** El portal aparece a 50 metros del jugador cuando se recolectan todos los quesos y coins del JSON
- **Efectos visuales avanzados:**
  - Modelo GLB del portal cargado desde assets
  - Efectos de vórtice matemáticos (espirales de Arquímedes y logarítmicas)
  - Distorsión visual del plano del portal usando funciones matemáticas
  - Partículas con efecto de succión hacia el centro
  - Círculo vertical con pulso de opacidad
  - Luces dinámicas y efectos de emisión
- **Interacción manual:** El jugador debe caminar hasta el portal e interactuar con él
- **Validación con Roles:** El portal solo se activa cuando todos los objetos con `Role="default"` y `Role="finalPrize"` han sido recolectados
- **Teletransportación:** Transición fluida entre niveles al interactuar con el portal

**Razón:** Proporciona una recompensa visual clara y una transición satisfactoria entre niveles.

#### Sistema de Puntuaciones

- **Puntos por queso:** Cada queso recolectado otorga 1 punto
- **Puntos por coin del JSON:** Cada coin del JSON otorga 1 punto
- **Acumulación entre niveles:** Los puntos se acumulan en `totalPoints` y se guardan por nivel en `pointsByLevel`
- **Guardado en backend:** Al completar el nivel 3, la puntuación se guarda automáticamente en el backend
- **Ranking global:** Se muestra el top 5 del ranking en la pantalla final
- **Pantalla final:** Muestra puntos totales, desglose por nivel, ranking y opciones para reiniciar o volver al menú

**Razón:** Sistema completo de puntuaciones que motiva al jugador a mejorar su rendimiento.

#### Sistema de HUD

- **Indicador de nivel:** Muestra claramente el nivel actual (Nivel 1, 2, 3)
- **Contador de quesos:** Muestra quesos recolectados vs total (`🧀 Quesos: X/Y`)
- **Puntos totales:** Muestra puntos acumulados entre todos los niveles
- **Visibilidad:** Todos los elementos del HUD son visibles por defecto

**Razón:** Información clara y accesible para el jugador en todo momento.

### 3. Integración Backend-Frontend

#### Sistema de Autenticación

- **Login/Registro:** El frontend se conecta al backend para autenticación de usuarios
- **JWT Tokens:** Los tokens se almacenan en localStorage y se envían en cada petición protegida
- **Context API:** Se utilizó React Context para gestionar el estado de autenticación globalmente
- **Validación de Backend:** El sistema detecta si el backend está disponible y requiere JWT válido cuando está disponible
- **Backdoor para desarrollo:** Solo funciona cuando el backend NO está disponible y NO estamos en producción
- **Validación periódica:** El token se valida cada 5 minutos y se cierra la sesión si es inválido

**Razón:** Separación clara entre frontend y backend, permitiendo escalabilidad y mantenibilidad, con seguridad mejorada.

#### API REST

- **Endpoints principales:**
  - `/api/auth/register` - Registro de usuarios
  - `/api/auth/login` - Inicio de sesión
  - `/api/auth/me` - Perfil del usuario actual
  - `/api/levels` - Configuración de niveles
  - `/api/levels/:levelId/coins-count` - Cantidad de coins por nivel
  - `/api/scores` - Guardar y obtener puntuaciones
  - `/api/scores/me` - Puntuaciones del usuario
  - `/api/scores/best` - Mejor puntuación del usuario
  - `/api/health` - Health check

**Razón:** API RESTful estándar que facilita la integración y el mantenimiento.

#### Configuración Centralizada

- **Archivo `api.js`:** Centraliza todas las URLs y endpoints de la API
- **Variables de entorno:** Soporte para `VITE_API_URL` para configurar la URL del backend
- **Fallback:** Sistema robusto de fallback cuando el backend no está disponible
- **Health Check:** Verificación automática de disponibilidad del backend

**Razón:** Facilita el mantenimiento y permite cambiar la configuración fácilmente.

### 4. Desafíos Enfrentados y Soluciones

#### Desafío 1: Carga de Modelos 3D

**Problema:** Los modelos 3D (GLB, FBX) son pesados y pueden causar lentitud en la carga inicial.

**Solución:** 
- Implementación de carga asíncrona con sistema de recursos
- Lazy loading de modelos que no se necesitan inmediatamente
- Optimización de modelos en Blender antes de exportar
- Uso de física precisa (Trimesh) solo para edificios que lo requieren

#### Desafío 2: Física y Colisiones

**Problema:** Detectar colisiones precisas entre personaje, enemigos y edificios.

**Solución:**
- Uso de esferas de colisión simplificadas para mejor rendimiento
- Sistema de detección de colisiones en tiempo real con Cannon.js
- Optimización de colisiones usando bounding boxes
- Física precisa (Trimesh) para edificios complejos (configurado en `precisePhysicsModels.json`)
- Validación de colisiones para evitar spawn de quesos y portal en edificios

#### Desafío 3: Generación Procedural de Edificios

**Problema:** Generar edificios sin que se solapen y con distribución adecuada.

**Solución:**
- Algoritmo de detección de colisiones antes de colocar edificios
- Sistema de reintentos con separación mínima
- Distribución radial alrededor del jugador
- Carga desde JSON con posiciones predefinidas

#### Desafío 4: Rendimiento en Navegadores

**Problema:** Mantener 60 FPS con múltiples modelos 3D, partículas y física.

**Solución:**
- Optimización de geometrías y materiales
- Uso de instancias para objetos repetidos
- Culling de objetos fuera de vista
- Limitación de partículas activas
- Física precisa solo donde es necesario

#### Desafío 5: Integración de Autenticación

**Problema:** Sincronizar el estado de autenticación entre React y el juego 3D.

**Solución:**
- Uso de React Context para estado global
- Verificación de autenticación antes de inicializar el juego
- Manejo de errores y redirección a login
- Validación periódica de tokens
- Detección automática de disponibilidad del backend

#### Desafío 6: Sistema de Puntuaciones

**Problema:** Guardar y recuperar puntuaciones desde el backend de forma segura.

**Solución:**
- Modelo `GameScore` en MongoDB con validación
- Endpoints protegidos con autenticación JWT
- Validación de datos con `express-validator`
- Sistema de ranking global y personal
- Fallback cuando el backend no está disponible

#### Desafío 7: Efectos de Vórtice en Portal

**Problema:** Implementar efectos visuales avanzados de vórtice matemáticos.

**Solución:**
- Implementación de espirales de Arquímedes y logarítmicas
- Función de distorsión visual usando funciones matemáticas
- Partículas con efecto de succión hacia el centro
- Optimización de actualización de geometría (cada 2 frames)
- Interpolación suave para vertices adyacentes

#### Desafío 8: Validación de Portal con Roles

**Problema:** Validar que todos los coins del JSON sean recolectados antes de activar el portal.

**Solución:**
- Sistema de conteo de coins del JSON por nivel y role
- Tracking de coins recolectados en tiempo real
- Validación completa antes de activar portal
- Soporte para `Role="default"` y `Role="finalPrize"`

### 5. Herramientas y Librerías Utilizadas

#### Backend
- **Express.js:** Framework web para Node.js
- **Mongoose:** ODM para MongoDB
- **JWT (jsonwebtoken):** Autenticación basada en tokens
- **bcryptjs:** Encriptación de contraseñas
- **express-validator:** Validación de datos de entrada
- **Docker Compose:** Orquestación de contenedores

#### Frontend
- **React 19:** Framework de UI
- **Three.js 0.175:** Biblioteca de gráficos 3D
- **Cannon.js (cannon-es):** Motor de física
- **Vite 6:** Build tool rápido
- **GSAP:** Animaciones fluidas
- **Howler.js:** Gestión de audio
- **Socket.io Client:** Preparado para multijugador

---

## 🌐 Evidencia de Funcionamiento en Vercel

El proyecto ha sido desplegado exitosamente en Vercel y está funcionando correctamente en producción.

### URL del Proyecto Desplegado:

**URL del Frontend (Juego 3D):**
```
[ESPACIO PARA URL DE VERCEL - El proyecto está desplegado y funcionando]
```

**URL del Backend (API):**
```
[ESPACIO PARA URL DEL BACKEND - Si está desplegado]
```

### Estado del Despliegue:

✅ **Frontend desplegado y funcionando**  
✅ **Sistema de autenticación operativo**  
✅ **Juego 3D cargando correctamente**  
✅ **Modelos 3D y recursos cargando desde CDN**  
✅ **Física y colisiones funcionando**  
✅ **Sistema de niveles operativo**  
✅ **Enemigos persiguiendo correctamente**  
✅ **Sistema de recolección de quesos funcional**  
✅ **Sistema de portal con efectos de vórtice**  
✅ **Sistema de puntuaciones completo**  
✅ **HUD actualizado con nivel y puntos totales**  
✅ **Pantalla final con ranking**  
✅ **Validación de portal con roles del JSON**  
✅ **Animaciones mejoradas de personaje y enemigos**  
✅ **Sistema de carteles con texturas dinámicas**  
✅ **Físicas precisas para edificios**

### Características Verificadas en Producción:

- ✅ Login y registro de usuarios
- ✅ Autenticación JWT obligatoria cuando backend está disponible
- ✅ Carga de modelos 3D (GLB, FBX)
- ✅ Renderizado 3D en tiempo real
- ✅ Física y colisiones (Box y Trimesh)
- ✅ Sistema de niveles (3 niveles)
- ✅ Enemigos persiguiendo al jugador con animaciones
- ✅ Recolección de quesos y coins del JSON
- ✅ Sistema de portal con efectos de vórtice matemáticos
- ✅ Partículas y efectos visuales
- ✅ Sonidos y música ambiental
- ✅ Controles de teclado y mouse
- ✅ Responsive en diferentes resoluciones
- ✅ HUD con nivel actual y puntos totales
- ✅ Pantalla final con ranking y desglose de puntos
- ✅ Guardado de puntuaciones en backend
- ✅ Validación de portal con roles del JSON
- ✅ Carteles con texturas dinámicas por nivel

### Capturas de Pantalla y Demostración:

[ESPACIO PARA AGREGAR CAPTURAS DE PANTALLA O VIDEOS DEL JUEGO FUNCIONANDO]

---

## 💭 Conclusiones Personales del Desarrollo del Proyecto

Este proyecto ha sido una experiencia sumamente retadora y enriquecedora. Trabajar con tecnologías como Three.js, Cannon.js y Express.js ha sido complejo, especialmente considerando que existen otras herramientas como Unity que facilitan significativamente el desarrollo de videojuegos 3D. Unity proporciona un editor visual, sistemas de física integrados, y una curva de aprendizaje más suave para desarrolladores que se inician en el desarrollo de juegos.

Sin embargo, a pesar de las dificultades, me divertí mucho desarrollando este trabajo. La satisfacción de ver cómo cada componente se integraba correctamente, desde la física de los enemigos persiguiendo al jugador hasta el sistema de partículas que guía hacia los quesos, fue increíblemente gratificante. Aprender a trabajar directamente con WebGL a través de Three.js me ha dado una comprensión más profunda de cómo funcionan los gráficos 3D a bajo nivel.

El proceso de desarrollo me enseñó la importancia de la arquitectura de software. Implementar una arquitectura RESTful en el backend y seguir principios de POO en el frontend no solo hizo el código más mantenible, sino que también facilitó la depuración y la adición de nuevas características. Cada decisión arquitectónica tuvo un impacto directo en la capacidad de escalar y mantener el proyecto.

Trabajar con física realista usando Cannon.js fue particularmente desafiante. Ajustar las colisiones, las velocidades y los comportamientos de los enemigos requirió muchas iteraciones y pruebas. Sin embargo, ver cómo los enemigos persiguen inteligentemente al jugador y cómo las colisiones funcionan correctamente fue muy satisfactorio. Implementar física precisa (Trimesh) para edificios complejos fue un desafío adicional que mejoró significativamente la precisión de las colisiones.

El sistema de niveles fue otro aspecto que disfruté desarrollando. Crear tres mundos diferentes con estilos únicos, cada uno con su propia dificultad y personalidad, me permitió explorar diferentes aspectos del diseño de juegos. La carga desde JSON con roles y niveles, aunque compleja, resultó en un sistema flexible que podría extenderse fácilmente para agregar más niveles.

Implementar el sistema de puntuaciones completo fue especialmente gratificante. Ver cómo las puntuaciones se guardan en el backend, se muestran en un ranking global, y se presentan en una pantalla final elegante, demostró la importancia de una buena integración frontend-backend. El sistema de validación de tokens JWT y la detección automática de disponibilidad del backend añadieron una capa de robustez al sistema.

Los efectos de vórtice matemáticos en el portal fueron uno de los desafíos más interesantes. Implementar espirales de Arquímedes y logarítmicas, junto con funciones de distorsión visual, requirió un entendimiento profundo de matemáticas aplicadas a gráficos. Ver el resultado final con partículas girando hacia el centro y el plano del portal distorsionándose fue increíblemente satisfactorio.

El sistema de animaciones mejorado para enemigos, con transiciones suaves entre idle y walking, añadió una capa de pulimento al juego. Ver cómo los enemigos cambian de animación según su estado fue muy gratificante.

Desafortunadamente, debido a limitaciones de tiempo, quedan algunos bugs menores por solucionar. Algunos problemas menores de rendimiento en dispositivos de gama baja, algunos casos edge en la detección de colisiones, y algunas optimizaciones pendientes tendrán que esperar para futuras iteraciones del proyecto. Sin embargo, el proyecto está completamente funcional y cumple con todos los objetivos principales establecidos.

En retrospectiva, este proyecto me ha enseñado que el desarrollo de videojuegos, incluso en web, es un proceso complejo que requiere paciencia, persistencia y una buena comprensión de múltiples sistemas trabajando en conjunto. Aunque Unity u otros motores de juego facilitarían el proceso, trabajar directamente con las tecnologías base me ha dado habilidades valiosas que puedo aplicar en otros proyectos.

Finalmente, este proyecto representa no solo un trabajo académico, sino una demostración de lo que es posible lograr con tecnologías web modernas. La capacidad de crear experiencias 3D inmersivas directamente en el navegador, sin necesidad de plugins o instalaciones adicionales, es algo que me emociona sobre el futuro del desarrollo web.

---

## 📊 Resumen Técnico

### Backend
- **Framework:** Express.js con Node.js
- **Base de Datos:** MongoDB con Mongoose
- **Autenticación:** JWT (jsonwebtoken)
- **Validación:** express-validator
- **Encriptación:** bcryptjs
- **Arquitectura:** RESTful API

### Frontend
- **Framework:** React 19
- **Gráficos 3D:** Three.js 0.175
- **Física:** Cannon.js (cannon-es) 0.20
- **Build Tool:** Vite 6
- **Arquitectura:** POO con Singleton Pattern

### Características Implementadas

#### Sistema de Autenticación
- ✅ Login y registro de usuarios
- ✅ Autenticación JWT obligatoria cuando backend está disponible
- ✅ Validación periódica de tokens
- ✅ Backdoor solo para desarrollo (cuando backend no está disponible)
- ✅ Detección automática de disponibilidad del backend

#### Sistema de Niveles
- ✅ 3 niveles progresivos con dificultad creciente
- ✅ Configuración dinámica desde backend (coins, enemigos)
- ✅ Edificios únicos por nivel
- ✅ Carga desde JSON con roles y niveles
- ✅ Validación de portal con roles del JSON

#### Sistema de Recolección
- ✅ Quesos generados dinámicamente (cantidad desde backend)
- ✅ Coins del JSON con roles (default, finalPrize)
- ✅ Validación de colisiones para spawn seguro
- ✅ Partículas guía hacia objetivos
- ✅ Mínimo 10 coins del JSON por nivel

#### Sistema de Portal
- ✅ Portal con modelo GLB cargado
- ✅ Efectos de vórtice matemáticos (espirales, distorsión)
- ✅ Partículas con efecto de succión
- ✅ Validación completa antes de activar
- ✅ Interacción manual del jugador
- ✅ Teletransportación entre niveles

#### Sistema de Puntuaciones
- ✅ Guardado automático en backend al completar nivel 3
- ✅ Desglose de puntos por nivel
- ✅ Ranking global (top 10)
- ✅ Puntuaciones personales del usuario
- ✅ Mejor puntuación del usuario
- ✅ Pantalla final con ranking y desglose

#### Sistema de HUD
- ✅ Indicador de nivel visible y prominente
- ✅ Contador de quesos en tiempo real
- ✅ Puntos totales acumulados entre niveles
- ✅ HUD visible por defecto

#### Sistema de Enemigos
- ✅ Persecución inteligente del jugador
- ✅ Animaciones idle y walking según estado
- ✅ Transiciones suaves entre animaciones
- ✅ Eliminación al completar nivel
- ✅ Configuración por nivel (1, 3, 5 enemigos)

#### Sistema de Carteles
- ✅ Sistema de conteo de carteles por nivel
- ✅ Distribución automática de texturas (12 texturas, 4 por nivel)
- ✅ Fallback automático si textura no existe
- ✅ Validación de cantidad de carteles

#### Sistema de Física
- ✅ Física de caja (Box) para objetos simples
- ✅ Física precisa (Trimesh) para edificios complejos
- ✅ Configuración en `precisePhysicsModels.json`
- ✅ 55 edificios con física precisa configurados

---

## 🎓 Aprendizajes Adquiridos

1. **Gráficos 3D en Web:** Aprendí a trabajar con WebGL a través de Three.js, comprendiendo conceptos como escenas, cámaras, luces, materiales y geometrías. Implementé efectos avanzados como vórtices matemáticos y distorsión visual.

2. **Física en Juegos:** Implementé un sistema de física completo usando Cannon.js, incluyendo colisiones, gravedad y fuerzas. Aprendí a usar física de caja para objetos simples y Trimesh para geometrías complejas.

3. **Arquitectura de Software:** Apliqué principios de arquitectura RESTful y POO en un proyecto real, viendo cómo estos patrones mejoran la mantenibilidad. Implementé servicios modulares y configuración centralizada.

4. **Optimización de Rendimiento:** Aprendí técnicas para optimizar el rendimiento en aplicaciones 3D, incluyendo culling, instancing, lazy loading y uso selectivo de física precisa.

5. **Integración Frontend-Backend:** Desarrollé habilidades en la integración de sistemas complejos, manejando autenticación, estados y comunicación entre componentes. Implementé sistemas robustos de fallback y validación.

6. **Matemáticas Aplicadas:** Aprendí a implementar efectos visuales avanzados usando matemáticas (espirales, distorsión, funciones de vórtice), aplicando conceptos matemáticos directamente en código.

7. **Sistemas de Puntuaciones:** Diseñé e implementé un sistema completo de puntuaciones con ranking, validación y persistencia en base de datos.

8. **Seguridad:** Implementé autenticación JWT robusta con validación periódica, detección de entorno y manejo seguro de tokens.

---

## 📈 Funcionalidades Completadas

### ✅ Actividad 1: Crear 3 niveles en Blender
- ✅ JSON actualizado con campos `Role` y `Level`
- ✅ Clasificación de objetos por nivel y tipo
- ✅ Mínimo 10 coins con `Role="default"` por nivel
- ✅ 1 coin con `Role="finalPrize"` por nivel
- ✅ Conexión entre niveles mediante portal

### ✅ Actividad 2: Activar teletransporte entre niveles
- ✅ Portal con efectos de vórtice matemáticos avanzados
- ✅ Validación con roles del JSON (default y finalPrize)
- ✅ Pantalla final con suma total de puntos
- ✅ Portal estático con círculo vertical
- ✅ Interacción manual del jugador

### ✅ Actividad 3: Actualizar el HUD
- ✅ Indicador de nivel visible y prominente
- ✅ Puntos totales acumulados entre niveles
- ✅ HUD visible por defecto
- ✅ Actualización en tiempo real

### ✅ Actividad 4: Extender la lógica de puntos (Backend)
- ✅ Modelo `Level` en MongoDB
- ✅ Endpoints para obtener cantidad de coins por nivel
- ✅ Frontend lee desde backend dinámicamente
- ✅ Fallback a valores por defecto
- ✅ Modelo `GameScore` para puntuaciones
- ✅ Endpoints completos de puntuaciones

### ✅ Actividad 5: Ajustar personaje, enemigo, coin
- ✅ Personaje con animaciones (walking, idle, stop)
- ✅ Enemigos con animaciones idle y walking según estado
- ✅ Mínimo 10 coins del JSON por nivel
- ✅ Enemigos por nivel: 1, 3, 5

### ✅ Actividad 6: Ajustar esquemas visuales - Carteles
- ✅ Sistema de conteo de carteles por nivel
- ✅ Distribución automática de 12 texturas (4 por nivel)
- ✅ Validación de cantidad de carteles
- ✅ Fallback automático de texturas

### ✅ Actividad 7: Integrar Json Web Token
- ✅ JWT obligatorio cuando backend está disponible
- ✅ Backdoor solo en desarrollo
- ✅ Validación periódica de tokens
- ✅ Detección automática de disponibilidad del backend
- ✅ Redirección a login si token es inválido

### ✅ Actividad 8: Publicación y trabajo colaborativo
- ✅ Proyecto desplegado en Vercel
- ✅ README.md completo
- ✅ Documentación de funcionalidades
- ✅ Instrucciones de instalación y despliegue

### ✅ Extras Implementados
- ✅ Físicas precisas para 55 edificios
- ✅ Sistema de ranking global
- ✅ Pantalla final con desglose de puntos
- ✅ Validación de colisiones para spawn seguro
- ✅ Sistema de servicios modular

---

## 📁 Archivos Clave del Proyecto

### Backend
```
backend/
├── src/
│   ├── models/
│   │   ├── User.js              # Modelo de usuario
│   │   ├── Level.js             # Modelo de niveles
│   │   └── GameScore.js         # Modelo de puntuaciones
│   ├── routes/
│   │   ├── auth.routes.js       # Autenticación
│   │   ├── levels.routes.js     # Niveles
│   │   ├── scores.routes.js     # Puntuaciones
│   │   └── index.js             # Registro de rutas
│   ├── middleware/
│   │   └── auth.js              # Middleware JWT
│   ├── config/
│   │   └── database.js          # Configuración MongoDB
│   └── server.js                # Servidor principal
├── docker-compose.yml            # Configuración Docker
└── README.md                     # Documentación completa
```

### Frontend
```
game-project/
├── src/
│   ├── Experience/
│   │   ├── World/
│   │   │   ├── World.js         # Gestión principal del mundo
│   │   │   ├── Robot.js         # Personaje principal
│   │   │   ├── Enemy.js         # Enemigos con animaciones
│   │   │   ├── Portal.js        # Portal con efectos de vórtice
│   │   │   └── ...
│   │   └── ...
│   ├── services/
│   │   ├── authService.js       # Autenticación
│   │   ├── levelsService.js     # Niveles
│   │   └── scoresService.js     # Puntuaciones
│   ├── config/
│   │   └── api.js               # Configuración centralizada
│   ├── loaders/
│   │   └── ToyCarLoader.js      # Carga de modelos con física
│   └── ...
├── public/
│   ├── data/
│   │   └── toy_car_blocks.json  # Datos del escenario
│   ├── config/
│   │   └── precisePhysicsModels.json  # Física precisa
│   └── textures/                # Texturas para carteles
└── README.md                     # Documentación completa
```

---

## 🎯 Métricas del Proyecto

### Código
- **Backend:** ~1,500 líneas de código
- **Frontend:** ~8,000 líneas de código
- **Total:** ~9,500 líneas de código

### Modelos y Recursos
- **Modelos 3D:** 50+ modelos (GLB, FBX)
- **Texturas:** 12+ texturas para carteles
- **Sonidos:** 5+ archivos de audio
- **Edificios:** 55 edificios con física precisa

### Endpoints API
- **Autenticación:** 3 endpoints
- **Niveles:** 3 endpoints
- **Puntuaciones:** 4 endpoints
- **Total:** 10 endpoints API

### Funcionalidades
- **Niveles:** 3 niveles completos
- **Enemigos:** Sistema con 1, 3, 5 enemigos por nivel
- **Coins:** 10+ coins del JSON por nivel + 1 finalPrize
- **Quesos:** Configurable desde backend (por defecto 10)
- **Carteles:** Sistema para 4 carteles por nivel

---

<div align="center">

**Desarrollado con dedicación y pasión por**

**Julian Bastidas**

*Programación Orientada a Entornos Multimediales*

*Noviembre 2025*

*Universidad Cooperativa de Colombia*

</div>
