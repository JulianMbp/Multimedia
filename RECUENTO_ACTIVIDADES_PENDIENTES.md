# 📋 Recuento de Actividades Pendientes

**Proyecto:** Juego 3D Multinivel  
**Estado:** Desplegado en Vercel  
**Fecha:** Noviembre 2025

---

## 📊 Resumen Ejecutivo

Este documento detalla el estado de cada actividad requerida, identificando qué está completado, qué está parcialmente implementado y qué falta por desarrollar.

---

## 1. ✅ Crear 3 niveles en Blender que permitan conectarse al recoger todos los coins

### Estado: **PARCIALMENTE COMPLETADO** ⚠️

#### ✅ Lo que SÍ está implementado:
- ✅ 3 niveles están implementados en el código (`currentLevel = 1, 2, 3`)
- ✅ Sistema de generación de edificios por nivel (`generateLevel2Buildings()`, `generateLevel3Buildings()`)
- ✅ Edificios diferentes por nivel (Toy Car, Mundo Antiguo, Casas Pokémon)
- ✅ Carga de modelos desde archivo JSON (`toy_car_blocks.json`)

#### ❌ Lo que FALTA:
1. **Clasificación en JSON con Roles:**
   - ❌ El archivo `toy_car_blocks.json` NO tiene el campo `Role` para clasificar objetos
   - ❌ No se distingue entre `Role="default"` y `Role="finalPrize"` en el JSON
   - ❌ Los objetos no están etiquetados por nivel en el JSON

2. **Estructura del JSON:**
   - ❌ Falta agregar el campo `Role` a cada objeto en `toy_car_blocks.json`
   - ❌ Falta agregar el campo `Level` para indicar a qué nivel pertenece cada objeto
   - ❌ Ejemplo de estructura requerida:
   ```json
   {
     "name": "building_003",
     "x": 14.3581,
     "y": 130.8988,
     "z": -0.0088,
     "Role": "default",
     "Level": 1
   }
   ```

3. **Conexión entre niveles:**
   - ⚠️ El portal aparece al completar todos los quesos, pero no verifica si todos los coins del JSON fueron recolectados
   - ❌ No hay validación de que todos los objetos con `Role="default"` hayan sido recolectados antes de activar el portal

---

## 2. ⚠️ Activar teletransporte entre niveles

### Estado: **PARCIALMENTE COMPLETADO** ⚠️

#### ✅ Lo que SÍ está implementado:
- ✅ Portal se crea al completar todos los quesos (`onAllCheesesCollected()`)
- ✅ Portal tiene efectos visuales (partículas, luces, anillos)
- ✅ Portal tiene sonido (aunque básico)
- ✅ Sistema de teletransporte entre niveles (`startLevel2()`, `startLevel3()`)
- ✅ Portal aparece en la posición de spawn

#### ❌ Lo que FALTA:
1. **Efectos de Vórtice Matemáticos:**
   - ❌ El portal NO tiene efectos de vórtice matemáticos avanzados
   - ❌ Falta implementar scripts matemáticos que presenten un vórtice (como se vio en clases)
   - ❌ El portal actual solo tiene rotaciones simples y partículas básicas
   - ❌ Necesita efectos de distorsión visual, curvatura del espacio, y animaciones de vórtice más complejas

2. **Validación con Roles del JSON:**
   - ❌ El portal NO verifica las etiquetas `Role="default"` o `Role="finalPrize"` del JSON
   - ❌ No hay validación de que todos los objetos con `Role="default"` hayan sido recolectados
   - ❌ El portal se activa solo con los quesos generados dinámicamente, no con los coins del JSON

3. **Finalización del Juego:**
   - ⚠️ Al completar el nivel 3, el portal aparece pero NO muestra la suma total de puntos
   - ❌ Falta implementar pantalla final con suma total de puntos de todos los niveles
   - ❌ No hay validación de si existen niveles adicionales antes de finalizar

**Archivos a modificar:**
- `game-project/src/Experience/World/Portal.js` - Agregar efectos de vórtice matemáticos
- `game-project/src/Experience/World/World.js` - Validar Roles del JSON antes de activar portal
- `game-project/src/Experience/World/World.js` - Mostrar pantalla final con puntos totales

---

## 3. ⚠️ Actualizar el HUD (Frontend)

### Estado: **PARCIALMENTE COMPLETADO** ⚠️

#### ✅ Lo que SÍ está implementado:
- ✅ Contador de quesos visible (`createCheeseCounter()`)
- ✅ El contador muestra: `🧀 Nivel ${this.currentLevel} - Quesos: ${this.cheesesCollected}/${this.maxCheeses}`
- ✅ HUD básico con puntos (aunque oculto en `CircularMenu.js`)

#### ❌ Lo que FALTA:
1. **Indicación del Nivel Actual:**
   - ⚠️ El nivel se muestra en el contador de quesos, pero NO hay un indicador visible separado del nivel
   - ❌ Falta un elemento HUD dedicado que muestre claramente "Nivel 1", "Nivel 2", "Nivel 3"
   - ❌ El indicador de nivel debe ser más prominente y visible

2. **Suma de Puntos Totales:**
   - ❌ NO hay contador de puntos totales acumulados entre niveles
   - ❌ El sistema actual solo cuenta puntos por nivel, no acumula entre niveles
   - ❌ Falta mostrar "Puntos Totales: X" en el HUD
   - ❌ Los puntos se reinician al cambiar de nivel en lugar de acumularse

3. **Evidencia del HUD:**
   - ❌ Falta captura de pantalla del HUD actualizado para el documento final
   - ❌ El HUD de puntos está oculto (`display: 'none'` en `CircularMenu.js`)

**Archivos a modificar:**
- `game-project/src/controls/CircularMenu.js` - Agregar indicador de nivel visible
- `game-project/src/Experience/World/World.js` - Implementar acumulación de puntos totales
- `game-project/src/Experience/World/World.js` - Mostrar puntos totales en HUD

---

## 4. ❌ Extender la lógica de puntos (Backend)

### Estado: **NO COMPLETADO** ❌

#### ❌ Lo que FALTA:
1. **Cantidad de Coins desde Base de Datos:**
   - ❌ La cantidad de cubos de puntuación (coins) por nivel NO se define dinámicamente desde la base de datos
   - ❌ Actualmente está hardcodeado: `this.maxCheeses = 10`
   - ❌ No hay endpoint del backend que devuelva la cantidad de coins por nivel
   - ❌ No hay lectura desde MongoDB de la configuración de coins

2. **Archivos que necesitan modificación:**
   - ❌ `game-project/src/Experience/World/Prize.js` - No lee desde BD
   - ❌ `game-project/src/loaders/ToyCarLoader.js` - No lee cantidad de coins desde BD
   - ❌ `game-project/src/Experience/World/World.js` - `maxCheeses` está hardcodeado

3. **Backend necesario:**
   - ❌ Falta endpoint en el backend: `GET /api/levels/:levelId/coins-count`
   - ❌ Falta modelo/schema en MongoDB para almacenar configuración de niveles
   - ❌ Falta lógica en el backend para devolver cantidad de coins por nivel

**Tareas pendientes:**
1. Crear schema en MongoDB para configuración de niveles
2. Crear endpoint en backend para obtener cantidad de coins por nivel
3. Modificar frontend para leer desde el backend en lugar de usar valores hardcodeados
4. Implementar fallback a valores por defecto si el backend no está disponible

---

## 5. ⚠️ Ajustar personaje, enemigo, coin

### Estado: **PARCIALMENTE COMPLETADO** ⚠️

#### ✅ Lo que SÍ está implementado:
- ✅ Personaje principal (Robot) con animaciones
- ✅ Enemigos persiguen al jugador
- ✅ Enemigos tienen animaciones (walking, running)
- ✅ Sistema de enemigos por nivel (1, 3, 5 enemigos)
- ✅ Coins/quesos se generan dinámicamente

#### ❌ Lo que FALTA:
1. **Nuevo Jugador con Animaciones:**
   - ⚠️ Hay un personaje (Robot), pero falta verificar si tiene "diferentes animaciones"
   - ❌ No está claro si el personaje tiene animaciones de correr, caminar, saltar, etc.
   - ❌ Falta activar/verificar todas las animaciones del personaje

2. **Enemigo con Animaciones Internas:**
   - ⚠️ Los enemigos persiguen, pero falta verificar animaciones internas completas
   - ❌ Falta verificar que el lobo/enemigo tenga animaciones de correr cuando persigue
   - ❌ Falta verificar que el enemigo se detenga cuando el jugador está lejos
   - ❌ Las animaciones deben activarse según la interacción del jugador

3. **Mínimo 10 Coins por Nivel:**
   - ✅ Actualmente hay 10 quesos por nivel (`maxCheeses = 10`)
   - ⚠️ Pero estos son quesos generados dinámicamente, NO los coins del JSON
   - ❌ Falta verificar que haya mínimo 10 coins del JSON por nivel
   - ❌ Los coins del JSON (`Role="default"`) no se están contando

4. **Enemigos por Nivel:**
   - ✅ Nivel 1: 1 enemigo (implementado)
   - ✅ Nivel 2: 3 enemigos (implementado)
   - ✅ Nivel 3: 5 enemigos (implementado)

**Archivos a verificar/modificar:**
- `game-project/src/Experience/World/Robot.js` - Verificar todas las animaciones
- `game-project/src/Experience/World/Enemy.js` - Mejorar animaciones según interacción
- `game-project/src/Experience/World/World.js` - Verificar que haya 10+ coins del JSON por nivel

---

## 6. ⚠️ Ajustar esquemas visuales - Carteles

### Estado: **PARCIALMENTE COMPLETADO** ⚠️

#### ✅ Lo que SÍ está implementado:
- ✅ Código para cargar texturas en carteles (línea 181-207 de `ToyCarLoader.js`)
- ✅ Sistema para detectar objetos con nombre "Cube" y aplicar texturas
- ✅ Textura `/textures/ima1.jpg` se carga en los carteles

#### ❌ Lo que FALTA:
1. **4 Carteles por Nivel:**
   - ❌ NO hay garantía de que haya exactamente 4 carteles por nivel
   - ❌ El código actual solo aplica textura a objetos llamados "Cube", pero no controla la cantidad
   - ❌ Falta verificar que cada nivel tenga exactamente 4 carteles visibles
   - ❌ Falta posicionar estratégicamente 4 carteles en cada nivel

2. **Imágenes en Carteles:**
   - ⚠️ Solo hay una textura: `/textures/ima1.jpg`
   - ❌ Falta agregar más texturas para los 4 carteles de cada nivel (12 carteles en total)
   - ❌ Falta crear o agregar imágenes relacionadas con el juego para cada cartel
   - ❌ Los carteles deben ser "vistosos" y relacionados con el juego

3. **Distribución de Carteles:**
   - ❌ Falta lógica para distribuir 4 carteles por nivel
   - ❌ Falta verificar que los carteles estén visibles y bien posicionados

**Archivos a modificar:**
- `game-project/src/loaders/ToyCarLoader.js` - Línea 181, mejorar lógica de carteles
- `game-project/public/textures/` - Agregar más imágenes para carteles
- `game-project/src/Experience/World/World.js` - Verificar cantidad de carteles por nivel

---

## 7. ⚠️ Integrar Json Web Token

### Estado: **PARCIALMENTE COMPLETADO** ⚠️

#### ✅ Lo que SÍ está implementado:
- ✅ Backend tiene autenticación JWT (`backend/src/routes/auth.routes.js`)
- ✅ Frontend tiene sistema de login (`game-project/src/components/Login.jsx`)
- ✅ Contexto de autenticación (`game-project/src/context/AuthContext.jsx`)
- ✅ El juego solo se inicia si el usuario está autenticado (`App.jsx`)
- ✅ Backdoor para desarrollo (acceso sin backend)

#### ❌ Lo que FALTA:
1. **Requisito Obligatorio de Autenticación:**
   - ⚠️ Actualmente hay un backdoor que permite acceso sin autenticación
   - ❌ Cuando el backend está disponible, el acceso DEBE ser obligatorio
   - ❌ Falta validar que el token JWT sea válido antes de iniciar el juego
   - ❌ Falta middleware que verifique el token en cada petición del juego

2. **Integración Completa:**
   - ⚠️ El frontend puede funcionar sin backend (backdoor)
   - ❌ Cuando el backend está conectado, debe ser requisito clave
   - ❌ Falta deshabilitar el backdoor en producción
   - ❌ Falta validación de token expirado

3. **Seguridad:**
   - ❌ El backdoor está activo incluso cuando el backend está disponible
   - ❌ Falta lógica para detectar si el backend está disponible y requerir autenticación
   - ❌ Falta manejo de tokens expirados

**Archivos a modificar:**
- `game-project/src/services/authService.js` - Mejorar lógica de backdoor
- `game-project/src/App.jsx` - Validar token antes de iniciar juego
- `game-project/src/context/AuthContext.jsx` - Validar token periódicamente

---

## 8. ✅ Publicación y trabajo colaborativo

### Estado: **COMPLETADO** ✅

#### ✅ Lo que SÍ está implementado:
- ✅ Proyecto desplegado en Vercel (confirmado por el usuario)
- ✅ Frontend funcionando independientemente
- ✅ Archivo `toy_car_blocks.json` en `public/data/` para funcionar sin backend
- ✅ README.md completo con descripción, funcionalidades e instrucciones
- ✅ Estructura del proyecto documentada

#### ⚠️ Lo que podría faltar:
1. **Evidencia de Trabajo Colaborativo:**
   - ⚠️ Falta verificar historial de commits en Git
   - ⚠️ Falta evidencia de pull requests
   - ⚠️ Falta verificar que haya commits de múltiples colaboradores
   - ⚠️ Esta parte es clave para la calificación

2. **README.md:**
   - ✅ Descripción del proyecto - COMPLETADO
   - ✅ Funcionalidades implementadas - COMPLETADO
   - ✅ Instrucciones de instalación - COMPLETADO
   - ✅ Instrucciones de despliegue - COMPLETADO

**Tareas pendientes:**
- Verificar historial de Git (`git log`)
- Documentar commits colaborativos
- Agregar evidencia de pull requests al documento final

---

## 📊 Resumen por Estado

### ✅ Completado (1 actividad):
- 8. Publicación y trabajo colaborativo

### ⚠️ Parcialmente Completado (5 actividades):
- 1. Crear 3 niveles en Blender
- 2. Activar teletransporte entre niveles
- 3. Actualizar el HUD
- 5. Ajustar personaje, enemigo, coin
- 6. Ajustar esquemas visuales
- 7. Integrar JWT

### ❌ No Completado (1 actividad):
- 4. Extender la lógica de puntos (Backend)

---

## 🎯 Prioridades de Implementación

### Alta Prioridad:
1. **Actividad 4:** Extender lógica de puntos desde backend (crítico)
2. **Actividad 2:** Efectos de vórtice matemáticos en portal
3. **Actividad 3:** HUD con nivel actual y puntos totales

### Media Prioridad:
4. **Actividad 1:** Clasificar objetos en JSON con Roles
5. **Actividad 7:** Hacer JWT obligatorio cuando backend está disponible
6. **Actividad 5:** Verificar animaciones completas de personaje y enemigo

### Baja Prioridad:
7. **Actividad 6:** Asegurar 4 carteles por nivel con imágenes

---

## 📝 Notas Adicionales

1. **Archivo JSON:** El archivo `toy_car_blocks.json` necesita ser actualizado con los campos `Role` y `Level` para cada objeto.

2. **Backend:** Se necesita crear endpoints y schemas en MongoDB para la configuración de niveles y cantidad de coins.

3. **HUD:** El HUD de puntos está oculto en `CircularMenu.js`, necesita ser visible y mostrar información completa.

4. **Portal:** Los efectos de vórtice matemáticos requieren implementación de shaders o animaciones complejas con Three.js.

5. **Evidencia:** Se necesitan capturas de pantalla del HUD actualizado y evidencia de trabajo colaborativo en Git.

---

**Última actualización:** Noviembre 2025  
**Estado del proyecto:** Desplegado en Vercel, funcional pero con mejoras pendientes

