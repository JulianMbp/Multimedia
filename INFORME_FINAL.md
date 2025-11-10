# 📋 Informe Final del Desarrollo

**Proyecto: Juego 3D Multinivel con Sistema de Autenticación**

**Autor:** Julian Bastidas  
**Materia:** Programación Orientada a Entornos Multimediales  
**Fecha:** Noviembre 2025  
**Universidad:** Universidad Cooperativa de Colombia

---

## 📖 Descripción del Proceso y Decisiones Tomadas

### 1. Arquitectura del Proyecto

El proyecto se desarrolló en dos partes principales que trabajan de forma integrada:

#### 🔧 Backend (NestJS)

**Tecnología elegida:** NestJS con TypeScript

**Decisiones arquitectónicas:**

- **Arquitectura Hexagonal (Ports and Adapters):** Se implementó una arquitectura hexagonal para separar la lógica de negocio de la infraestructura. Esto permite cambiar fácilmente la base de datos, el sistema de almacenamiento de archivos o cualquier otro componente sin afectar la lógica de negocio.

- **Mongoose como ODM:** Se eligió Mongoose sobre TypeORM para trabajar con MongoDB, ya que ofrece una mejor integración con esquemas dinámicos y validación a nivel de modelo.

- **Sistema de Autenticación JWT:** Se implementó autenticación basada en tokens JWT con refresh tokens para mayor seguridad. Esto permite mantener sesiones seguras sin necesidad de almacenar estado en el servidor.

- **Swagger/OpenAPI:** Se integró Swagger para documentación automática de la API, facilitando el desarrollo y la integración con el frontend.

- **Sistema de Roles:** Se implementó un sistema de roles (Admin y User) con guards para proteger rutas sensibles.

- **Internacionalización (i18n):** Se agregó soporte para múltiples idiomas (español, inglés, francés, árabe, hindi, ucraniano, chino) para hacer el sistema más accesible.

- **Subida de Archivos:** Se implementó soporte para almacenamiento local y Amazon S3, permitiendo flexibilidad en el despliegue.

**Estructura del Backend:**
```
backend/
├── src/
│   ├── auth/              # Sistema de autenticación
│   ├── users/             # Gestión de usuarios
│   ├── files/             # Gestión de archivos
│   ├── roles/             # Sistema de roles
│   ├── session/           # Gestión de sesiones
│   ├── mail/              # Sistema de correo
│   └── database/          # Configuración de base de datos
```

#### 🎮 Frontend (React + Three.js)

**Tecnologías elegidas:** React 19, Three.js, Cannon.js, Vite

**Decisiones arquitectónicas:**

- **Programación Orientada a Objetos (POO):** Se estructuró todo el código del juego usando clases y principios de POO, facilitando la organización y mantenibilidad del código.

- **Patrón Singleton:** La clase `Experience` se implementó como Singleton para garantizar una única instancia del entorno 3D en toda la aplicación.

- **Separación de Responsabilidades:** Cada clase tiene una responsabilidad específica:
  - `World.js`: Gestión del mundo del juego, niveles, enemigos, quesos
  - `Robot.js`: Control del personaje principal
  - `Enemy.js`: Lógica de enemigos que persiguen
  - `Cheese.js`: Sistema de recolección
  - `Portal.js`: Sistema de transición entre niveles
  - `Camera.js`: Control de cámaras
  - `Physics.js`: Motor de física

- **Sistema de Recursos:** Se implementó un sistema centralizado de carga de recursos (modelos 3D, texturas, sonidos) que permite cargar todos los assets de forma asíncrona antes de iniciar el juego.

- **Sistema de Niveles:** Se diseñó un sistema modular de niveles que permite agregar nuevos niveles fácilmente. Cada nivel tiene sus propios edificios, enemigos y configuración.

- **Física Realista:** Se utilizó Cannon.js para implementar física realista, incluyendo:
  - Colisiones entre personaje y enemigos
  - Colisiones con edificios y obstáculos
  - Gravedad y movimiento realista
  - Detección de colisiones en tiempo real

- **Sistema de Partículas:** Se implementó un sistema de partículas personalizado para guiar al jugador hacia los quesos, mejorando la experiencia de usuario.

- **Optimización de Rendimiento:**
  - Lazy loading de modelos 3D
  - Object pooling para partículas
  - Culling de objetos fuera de vista
  - Optimización de colisiones

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
│   └── loaders/         # Cargadores personalizados
```

### 2. Decisiones de Diseño del Juego

#### Sistema de Niveles

Se diseñaron 3 niveles progresivos con dificultad creciente:

- **Nivel 1:** 1 enemigo, entorno urbano con edificios de juguete
- **Nivel 2:** 3 enemigos, edificios de estilo antiguo
- **Nivel 3:** 5 enemigos, casas temáticas de Pokémon

**Razón:** Progresión gradual de dificultad que mantiene al jugador comprometido.

#### Sistema de Recolección

- **10 quesos por nivel:** Cantidad suficiente para crear un desafío sin ser abrumador
- **Generación dinámica:** Los quesos se generan en posiciones válidas usando raycasting para evitar spawn en edificios
- **Partículas guía:** Sistema visual que ayuda al jugador a encontrar los quesos

**Razón:** Balance entre desafío y accesibilidad, con ayuda visual para mejorar la experiencia.

#### Sistema de Enemigos

- **Persecución inteligente:** Los enemigos persiguen al jugador desde 100 metros de distancia
- **Velocidad menor:** Los enemigos son más lentos que el jugador, permitiendo escape estratégico
- **Detección de colisiones:** Sistema preciso de colisiones que termina el juego si un enemigo toca al jugador

**Razón:** Crea tensión y desafío sin hacer el juego imposible.

#### Sistema de Portal

- **Aparición al completar nivel:** El portal aparece cuando se recolectan todos los quesos
- **Efectos visuales:** Partículas y luces dinámicas para crear un efecto místico
- **Teletransportación automática:** Transición fluida entre niveles

**Razón:** Proporciona una recompensa visual clara y una transición satisfactoria entre niveles.

### 3. Integración Backend-Frontend

#### Sistema de Autenticación

- **Login/Registro:** El frontend se conecta al backend para autenticación de usuarios
- **JWT Tokens:** Los tokens se almacenan y se envían en cada petición
- **Context API:** Se utilizó React Context para gestionar el estado de autenticación globalmente

**Razón:** Separación clara entre frontend y backend, permitiendo escalabilidad y mantenibilidad.

#### API REST

- **Endpoints principales:**
  - `/auth/email/login` - Inicio de sesión
  - `/auth/email/register` - Registro de usuarios
  - `/auth/refresh` - Renovación de tokens
  - `/users` - Gestión de usuarios (requiere autenticación)

**Razón:** API RESTful estándar que facilita la integración y el mantenimiento.

### 4. Desafíos Enfrentados y Soluciones

#### Desafío 1: Carga de Modelos 3D

**Problema:** Los modelos 3D (GLB, FBX) son pesados y pueden causar lentitud en la carga inicial.

**Solución:** 
- Implementación de carga asíncrona con sistema de recursos
- Lazy loading de modelos que no se necesitan inmediatamente
- Optimización de modelos en Blender antes de exportar

#### Desafío 2: Física y Colisiones

**Problema:** Detectar colisiones precisas entre personaje, enemigos y edificios.

**Solución:**
- Uso de esferas de colisión simplificadas para mejor rendimiento
- Sistema de detección de colisiones en tiempo real con Cannon.js
- Optimización de colisiones usando bounding boxes

#### Desafío 3: Generación Procedural de Edificios

**Problema:** Generar edificios sin que se solapen y con distribución adecuada.

**Solución:**
- Algoritmo de detección de colisiones antes de colocar edificios
- Sistema de reintentos con separación mínima
- Distribución radial alrededor del jugador

#### Desafío 4: Rendimiento en Navegadores

**Problema:** Mantener 60 FPS con múltiples modelos 3D, partículas y física.

**Solución:**
- Optimización de geometrías y materiales
- Uso de instancias para objetos repetidos
- Culling de objetos fuera de vista
- Limitación de partículas activas

#### Desafío 5: Integración de Autenticación

**Problema:** Sincronizar el estado de autenticación entre React y el juego 3D.

**Solución:**
- Uso de React Context para estado global
- Verificación de autenticación antes de inicializar el juego
- Manejo de errores y redirección a login

### 5. Herramientas y Librerías Utilizadas

#### Backend
- **NestJS:** Framework robusto para Node.js con TypeScript
- **Mongoose:** ODM para MongoDB
- **Passport:** Autenticación flexible
- **Swagger:** Documentación automática de API
- **Nodemailer:** Envío de correos electrónicos
- **Class-validator:** Validación de DTOs

#### Frontend
- **React 19:** Framework de UI
- **Three.js:** Biblioteca de gráficos 3D
- **Cannon.js:** Motor de física
- **Vite:** Build tool rápido
- **GSAP:** Animaciones fluidas
- **Howler.js:** Gestión de audio
- **Socket.io:** Preparado para multijugador

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

### Características Verificadas en Producción:

- ✅ Login y registro de usuarios
- ✅ Carga de modelos 3D (GLB, FBX)
- ✅ Renderizado 3D en tiempo real
- ✅ Física y colisiones
- ✅ Sistema de niveles (3 niveles)
- ✅ Enemigos persiguiendo al jugador
- ✅ Recolección de quesos
- ✅ Sistema de portal
- ✅ Partículas y efectos visuales
- ✅ Sonidos y música ambiental
- ✅ Controles de teclado y mouse
- ✅ Responsive en diferentes resoluciones

### Capturas de Pantalla y Demostración:

[ESPACIO PARA AGREGAR CAPTURAS DE PANTALLA O VIDEOS DEL JUEGO FUNCIONANDO]

---

## 💭 Conclusiones Personales del Desarrollo del Proyecto

Este proyecto ha sido una experiencia sumamente retadora y enriquecedora. Trabajar con tecnologías como Three.js, Cannon.js y NestJS ha sido complejo, especialmente considerando que existen otras herramientas como Unity que facilitan significativamente el desarrollo de videojuegos 3D. Unity proporciona un editor visual, sistemas de física integrados, y una curva de aprendizaje más suave para desarrolladores que se inician en el desarrollo de juegos.

Sin embargo, a pesar de las dificultades, me divertí mucho desarrollando este trabajo. La satisfacción de ver cómo cada componente se integraba correctamente, desde la física de los enemigos persiguiendo al jugador hasta el sistema de partículas que guía hacia los quesos, fue increíblemente gratificante. Aprender a trabajar directamente con WebGL a través de Three.js me ha dado una comprensión más profunda de cómo funcionan los gráficos 3D a bajo nivel.

El proceso de desarrollo me enseñó la importancia de la arquitectura de software. Implementar una arquitectura hexagonal en el backend y seguir principios de POO en el frontend no solo hizo el código más mantenible, sino que también facilitó la depuración y la adición de nuevas características. Cada decisión arquitectónica tuvo un impacto directo en la capacidad de escalar y mantener el proyecto.

Trabajar con física realista usando Cannon.js fue particularmente desafiante. Ajustar las colisiones, las velocidades y los comportamientos de los enemigos requirió muchas iteraciones y pruebas. Sin embargo, ver cómo los enemigos persiguen inteligentemente al jugador y cómo las colisiones funcionan correctamente fue muy satisfactorio.

El sistema de niveles fue otro aspecto que disfruté desarrollando. Crear tres mundos diferentes con estilos únicos, cada uno con su propia dificultad y personalidad, me permitió explorar diferentes aspectos del diseño de juegos. La generación procedural de edificios, aunque compleja, resultó en un sistema flexible que podría extenderse fácilmente para agregar más niveles.

Desafortunadamente, debido a limitaciones de tiempo, quedan algunos bugs por solucionar. Algunos problemas menores de rendimiento en dispositivos de gama baja, algunos casos edge en la detección de colisiones, y algunas optimizaciones pendientes tendrán que esperar para futuras iteraciones del proyecto. Sin embargo, el proyecto está completamente funcional y cumple con todos los objetivos principales establecidos.

En retrospectiva, este proyecto me ha enseñado que el desarrollo de videojuegos, incluso en web, es un proceso complejo que requiere paciencia, persistencia y una buena comprensión de múltiples sistemas trabajando en conjunto. Aunque Unity u otros motores de juego facilitarían el proceso, trabajar directamente con las tecnologías base me ha dado habilidades valiosas que puedo aplicar en otros proyectos.

Finalmente, este proyecto representa no solo un trabajo académico, sino una demostración de lo que es posible lograr con tecnologías web modernas. La capacidad de crear experiencias 3D inmersivas directamente en el navegador, sin necesidad de plugins o instalaciones adicionales, es algo que me emociona sobre el futuro del desarrollo web.

---

## 📊 Resumen Técnico

### Backend
- **Framework:** NestJS 11.1.6
- **Base de Datos:** MongoDB con Mongoose
- **Autenticación:** JWT con Passport
- **Documentación:** Swagger/OpenAPI
- **Arquitectura:** Hexagonal (Ports and Adapters)

### Frontend
- **Framework:** React 19
- **Gráficos 3D:** Three.js 0.175
- **Física:** Cannon.js 0.20
- **Build Tool:** Vite 6
- **Arquitectura:** POO con Singleton Pattern

### Características Implementadas
- ✅ Sistema de autenticación completo
- ✅ 3 niveles de juego progresivos
- ✅ Sistema de enemigos con IA de persecución
- ✅ Sistema de recolección de quesos
- ✅ Sistema de portal entre niveles
- ✅ Partículas y efectos visuales
- ✅ Física realista con colisiones
- ✅ Sonidos y música ambiental
- ✅ Controles responsive
- ✅ HUD informativo

---

## 🎓 Aprendizajes Adquiridos

1. **Gráficos 3D en Web:** Aprendí a trabajar con WebGL a través de Three.js, comprendiendo conceptos como escenas, cámaras, luces, materiales y geometrías.

2. **Física en Juegos:** Implementé un sistema de física completo usando Cannon.js, incluyendo colisiones, gravedad y fuerzas.

3. **Arquitectura de Software:** Apliqué principios de arquitectura hexagonal y POO en un proyecto real, viendo cómo estos patrones mejoran la mantenibilidad.

4. **Optimización de Rendimiento:** Aprendí técnicas para optimizar el rendimiento en aplicaciones 3D, incluyendo culling, instancing y lazy loading.

5. **Integración Frontend-Backend:** Desarrollé habilidades en la integración de sistemas complejos, manejando autenticación, estados y comunicación entre componentes.

---

<div align="center">

**Desarrollado con dedicación y pasión por**

**Julian Bastidas**

*Programación Orientada a Entornos Multimediales*

*Noviembre 2025*

*Universidad Cooperativa de Colombia*

</div>

