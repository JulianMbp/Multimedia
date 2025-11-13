# 📋 Plan de Implementación Detallado

**Proyecto:** Juego 3D Multinivel  
**Fecha:** Noviembre 2025  
**Enfoque:** Backend + Frontend

---

## 🎯 Estrategia General

Implementaremos las mejoras en orden de prioridad, trabajando primero en las funcionalidades críticas y luego en las mejoras visuales y de experiencia.

---

## 📝 PASO 1: Actualizar JSON con Roles y Levels

### Objetivo:
Agregar los campos `Role` y `Level` al archivo `toy_car_blocks.json` para clasificar correctamente los objetos por nivel y tipo.

### Descripción:
El archivo JSON actual solo tiene `name`, `x`, `y`, `z`. Necesitamos agregar:
- `Role`: "default" para coins normales, "finalPrize" para el premio final
- `Level`: 1, 2, o 3 para indicar a qué nivel pertenece cada objeto

### Tareas:

#### Backend:
- ❌ No requiere cambios en backend (este paso es solo frontend)

#### Frontend:
1. **Leer y analizar el JSON actual:**
   - Leer `game-project/public/data/toy_car_blocks.json`
   - Identificar qué objetos son edificios, coins, y otros elementos
   - Clasificar por nivel según su posición o nombre

2. **Actualizar estructura del JSON:**
   - Agregar campo `Role` a cada objeto:
     - `"Role": "default"` para coins normales
     - `"Role": "finalPrize"` para el último coin que activa el portal
     - `"Role": "building"` para edificios (opcional, para mejor organización)
   - Agregar campo `Level` a cada objeto:
     - `"Level": 1` para objetos del nivel 1
     - `"Level": 2` para objetos del nivel 2
     - `"Level": 3` para objetos del nivel 3

3. **Actualizar código que lee el JSON:**
   - Modificar `ToyCarLoader.js` para leer y filtrar por `Role` y `Level`
   - Implementar lógica para contar coins por nivel según `Role="default"`
   - Validar que haya mínimo 10 coins con `Role="default"` por nivel

### Archivos a modificar:
- `game-project/public/data/toy_car_blocks.json` - Agregar campos Role y Level
- `game-project/src/loaders/ToyCarLoader.js` - Leer y filtrar por Role y Level

### Criterios de éxito:
- ✅ Todos los objetos en el JSON tienen campo `Role`
- ✅ Todos los objetos en el JSON tienen campo `Level`
- ✅ Hay mínimo 10 objetos con `Role="default"` por nivel
- ✅ El código puede filtrar objetos por nivel y role
- ✅ El código puede contar coins por nivel

### Tiempo estimado: 30-45 minutos

---

## 📝 PASO 2: Extender lógica de puntos desde Backend

### Objetivo:
Crear endpoint en el backend que devuelva la cantidad de coins por nivel desde MongoDB, y modificar el frontend para leer esta información dinámicamente.

### Descripción:
Actualmente `maxCheeses = 10` está hardcodeado. Necesitamos que esta configuración venga de la base de datos.

### Tareas:

#### Backend:
1. **Crear modelo/schema en MongoDB:**
   - Crear `backend/src/models/Level.js`
   - Schema con: `levelNumber`, `coinsCount`, `enemiesCount`, `description`
   - Seed inicial con datos para niveles 1, 2, 3

2. **Crear endpoint:**
   - `GET /api/levels` - Obtener todos los niveles
   - `GET /api/levels/:levelId` - Obtener configuración de un nivel específico
   - `GET /api/levels/:levelId/coins-count` - Obtener solo cantidad de coins

3. **Crear rutas:**
   - Crear `backend/src/routes/levels.routes.js`
   - Registrar rutas en `backend/src/routes/index.js`

#### Frontend:
1. **Crear servicio para consumir API:**
   - Crear `game-project/src/services/levelsService.js`
   - Función para obtener coins count por nivel
   - Manejo de errores y fallback a valores por defecto

2. **Modificar World.js:**
   - Cargar `maxCheeses` desde el backend al iniciar cada nivel
   - Fallback a 10 si el backend no está disponible
   - Actualizar cuando cambie de nivel

3. **Modificar ToyCarLoader.js:**
   - Usar cantidad de coins desde backend para validar

### Archivos a crear:
- `backend/src/models/Level.js`
- `backend/src/routes/levels.routes.js`
- `game-project/src/services/levelsService.js`

### Archivos a modificar:
- `backend/src/routes/index.js`
- `backend/src/server.js` (si es necesario)
- `game-project/src/Experience/World/World.js`
- `game-project/src/loaders/ToyCarLoader.js`

### Criterios de éxito:
- ✅ Endpoint del backend devuelve cantidad de coins por nivel
- ✅ Frontend lee desde backend al iniciar cada nivel
- ✅ Fallback funciona si backend no está disponible
- ✅ Los valores se actualizan correctamente al cambiar de nivel

### Tiempo estimado: 1-2 horas

---

## 📝 PASO 3: Actualizar HUD con Nivel y Puntos Totales

### Objetivo:
Agregar indicador visible del nivel actual y contador de puntos totales acumulados entre niveles.

### Descripción:
El HUD actual muestra el nivel en el contador de quesos, pero necesita un indicador más prominente y un contador de puntos totales.

### Tareas:

#### Frontend:
1. **Agregar indicador de nivel visible:**
   - Crear elemento HUD dedicado en `CircularMenu.js` o `World.js`
   - Mostrar "Nivel 1", "Nivel 2", "Nivel 3" de forma prominente
   - Actualizar cuando cambie el nivel

2. **Implementar acumulación de puntos totales:**
   - Crear variable `totalPoints` en `World.js` que persista entre niveles
   - Sumar puntos de cada nivel al total
   - NO reiniciar puntos al cambiar de nivel

3. **Mostrar puntos totales en HUD:**
   - Crear elemento HUD para "Puntos Totales: X"
   - Actualizar en tiempo real cuando se recolecten coins
   - Mostrar de forma visible (no oculto)

4. **Hacer visible el HUD de puntos:**
   - Cambiar `display: 'none'` a `display: 'block'` en `CircularMenu.js`
   - Asegurar que el HUD sea visible y legible

### Archivos a modificar:
- `game-project/src/Experience/World/World.js`
- `game-project/src/controls/CircularMenu.js`

### Criterios de éxito:
- ✅ Indicador de nivel visible y prominente
- ✅ Puntos totales se acumulan entre niveles
- ✅ HUD muestra puntos totales en tiempo real
- ✅ HUD de puntos es visible (no oculto)

### Tiempo estimado: 45-60 minutos

---

## 📝 PASO 4: Validar Portal con Roles del JSON

### Objetivo:
Hacer que el portal solo se active cuando todos los coins con `Role="default"` del nivel actual hayan sido recolectados.

### Descripción:
Actualmente el portal se activa al completar los quesos generados dinámicamente. Necesitamos validar también los coins del JSON.

### Tareas:

#### Frontend:
1. **Contar coins del JSON por nivel:**
   - Filtrar objetos con `Role="default"` y `Level` igual al nivel actual
   - Contar cuántos coins hay en el JSON para el nivel actual

2. **Rastrear coins recolectados:**
   - Mantener contador de coins del JSON recolectados
   - Incrementar cuando se recolecte un coin con `Role="default"`

3. **Validar antes de activar portal:**
   - Verificar que todos los quesos dinámicos estén recolectados
   - Verificar que todos los coins del JSON con `Role="default"` estén recolectados
   - Solo activar portal si ambas condiciones se cumplen

4. **Manejar coins con Role="finalPrize":**
   - El último coin debe tener `Role="finalPrize"`
   - Este coin activa el portal cuando se recolecta

### Archivos a modificar:
- `game-project/src/Experience/World/World.js`
- `game-project/src/loaders/ToyCarLoader.js`

### Criterios de éxito:
- ✅ Portal solo se activa cuando todos los coins del JSON están recolectados
- ✅ Se valida correctamente `Role="default"` y `Role="finalPrize"`
- ✅ El contador de coins del JSON funciona correctamente

### Tiempo estimado: 45-60 minutos

---

## 📝 PASO 5: Efectos de Vórtice Matemáticos en Portal

### Objetivo:
Implementar efectos visuales de vórtice matemáticos avanzados en el portal usando funciones matemáticas.

### Descripción:
El portal actual tiene efectos básicos. Necesitamos agregar efectos de vórtice más complejos usando matemáticas (curvas espirales, distorsión, etc.).

### Tareas:

#### Frontend:
1. **Implementar funciones matemáticas de vórtice:**
   - Crear funciones para curvas espirales (espiral de Arquímedes, espiral logarítmica)
   - Implementar distorsión visual usando funciones seno/coseno
   - Crear efecto de "succión" visual hacia el centro

2. **Aplicar efectos al portal:**
   - Modificar partículas para seguir curvas espirales
   - Agregar distorsión al plano del portal
   - Crear efecto de rotación acelerada hacia el centro

3. **Optimizar rendimiento:**
   - Asegurar que los efectos no afecten el FPS
   - Usar técnicas de optimización si es necesario

### Archivos a modificar:
- `game-project/src/Experience/World/Portal.js`

### Criterios de éxito:
- ✅ Portal tiene efectos de vórtice matemáticos visibles
- ✅ Las partículas siguen curvas espirales
- ✅ Hay efecto de distorsión visual
- ✅ El rendimiento se mantiene estable

### Tiempo estimado: 1-2 horas

---

## 📝 PASO 6: Pantalla Final con Puntos Totales

### Objetivo:
Mostrar pantalla final con la suma total de puntos de todos los niveles cuando se complete el nivel 3.

### Descripción:
Al completar el nivel 3, debe aparecer una pantalla que muestre el total de puntos acumulados en todos los niveles.

### Tareas:

#### Frontend:
1. **Detectar finalización del juego:**
   - Verificar cuando se complete el nivel 3
   - Verificar que no haya más niveles

2. **Crear modal/pantalla final:**
   - Mostrar mensaje de felicitaciones
   - Mostrar "Puntos Totales: X"
   - Mostrar desglose por nivel (opcional)
   - Botón para reiniciar o salir

3. **Integrar con sistema existente:**
   - Usar el modal manager existente
   - Asegurar que se muestre correctamente

### Archivos a modificar:
- `game-project/src/Experience/World/World.js`
- `game-project/src/Experience/Utils/GameTracker.js` (si es necesario)

### Criterios de éxito:
- ✅ Pantalla final aparece al completar nivel 3
- ✅ Muestra puntos totales correctamente
- ✅ Modal es funcional y atractivo

### Tiempo estimado: 30-45 minutos

---

## 📝 PASO 7: Hacer JWT Obligatorio cuando Backend está Disponible

### Objetivo:
Hacer que la autenticación JWT sea obligatoria cuando el backend está disponible, deshabilitando el backdoor en producción.

### Descripción:
Actualmente hay un backdoor que permite acceso sin autenticación. Necesitamos que cuando el backend esté disponible, el JWT sea obligatorio.

### Tareas:

#### Frontend:
1. **Detectar disponibilidad del backend:**
   - Crear función para verificar si el backend está disponible
   - Hacer ping a `/api/health` al iniciar

2. **Modificar lógica de autenticación:**
   - Si backend está disponible: requerir JWT válido
   - Si backend NO está disponible: permitir backdoor (solo desarrollo)
   - Validar token antes de iniciar el juego

3. **Validar token periódicamente:**
   - Verificar token expirado
   - Redirigir a login si el token es inválido

4. **Deshabilitar backdoor en producción:**
   - Detectar entorno (desarrollo vs producción)
   - Solo permitir backdoor en desarrollo

### Archivos a modificar:
- `game-project/src/services/authService.js`
- `game-project/src/context/AuthContext.jsx`
- `game-project/src/App.jsx`

### Criterios de éxito:
- ✅ JWT es obligatorio cuando backend está disponible
- ✅ Backdoor solo funciona en desarrollo
- ✅ Token se valida antes de iniciar juego
- ✅ Redirección a login si token es inválido

### Tiempo estimado: 45-60 minutos

---

## 📝 PASO 8: Verificar y Mejorar Animaciones

### Objetivo:
Verificar que el personaje y enemigos tengan todas las animaciones necesarias y que se activen correctamente.

### Descripción:
Asegurar que el personaje tenga animaciones de caminar, correr, saltar, etc., y que los enemigos cambien de animación según su estado.

### Tareas:

#### Frontend:
1. **Verificar animaciones del personaje:**
   - Revisar `Robot.js` para ver qué animaciones tiene disponibles
   - Activar animación de caminar cuando se mueve
   - Activar animación de correr cuando corre
   - Activar animación de idle cuando está quieto

2. **Mejorar animaciones de enemigos:**
   - Verificar que enemigos tengan animación de correr cuando persiguen
   - Verificar que enemigos tengan animación de idle cuando están lejos
   - Asegurar transiciones suaves entre animaciones

3. **Probar animaciones:**
   - Probar todas las animaciones en diferentes situaciones
   - Asegurar que no haya glitches visuales

### Archivos a modificar:
- `game-project/src/Experience/World/Robot.js`
- `game-project/src/Experience/World/Enemy.js`

### Criterios de éxito:
- ✅ Personaje tiene animaciones de caminar, correr, idle
- ✅ Enemigos cambian de animación según su estado
- ✅ Animaciones son fluidas y sin glitches

### Tiempo estimado: 45-60 minutos

---

## 📝 PASO 9: Asegurar 4 Carteles por Nivel

### Objetivo:
Garantizar que cada nivel tenga exactamente 4 carteles visibles con imágenes relacionadas al juego.

### Descripción:
Actualmente no hay garantía de que haya 4 carteles por nivel. Necesitamos asegurar esto y agregar más texturas.

### Tareas:

#### Frontend:
1. **Contar carteles por nivel:**
   - Verificar cuántos objetos "Cube" hay por nivel en el JSON
   - Asegurar que haya exactamente 4 por nivel

2. **Agregar más texturas:**
   - Crear o agregar 12 imágenes (4 por nivel x 3 niveles)
   - Imágenes relacionadas con el juego
   - Guardar en `game-project/public/textures/`

3. **Distribuir texturas:**
   - Asignar diferentes texturas a cada cartel
   - Asegurar que los carteles sean visibles y bien posicionados

4. **Mejorar lógica de carga:**
   - Modificar `ToyCarLoader.js` para cargar diferentes texturas
   - Asegurar que cada cartel tenga una textura única

### Archivos a modificar:
- `game-project/src/loaders/ToyCarLoader.js`
- `game-project/public/data/toy_car_blocks.json` (si es necesario agregar más Cubes)

### Archivos a crear:
- `game-project/public/textures/ima2.jpg` hasta `ima12.jpg` (o nombres apropiados)

### Criterios de éxito:
- ✅ Cada nivel tiene exactamente 4 carteles
- ✅ Cada cartel tiene una textura diferente
- ✅ Los carteles son visibles y bien posicionados

### Tiempo estimado: 1-2 horas

---

## 📊 Resumen de Pasos

| Paso | Actividad | Prioridad | Tiempo Estimado |
|------|-----------|-----------|-----------------|
| 1 | Actualizar JSON con Roles y Levels | Media | 30-45 min |
| 2 | Extender lógica de puntos desde Backend | **Alta** | 1-2 horas |
| 3 | Actualizar HUD con Nivel y Puntos Totales | **Alta** | 45-60 min |
| 4 | Validar Portal con Roles del JSON | Media | 45-60 min |
| 5 | Efectos de Vórtice Matemáticos | **Alta** | 1-2 horas |
| 6 | Pantalla Final con Puntos Totales | Media | 30-45 min |
| 7 | Hacer JWT Obligatorio | Media | 45-60 min |
| 8 | Verificar Animaciones | Baja | 45-60 min |
| 9 | Asegurar 4 Carteles por Nivel | Baja | 1-2 horas |

**Tiempo total estimado:** 7-10 horas

---

## 🎯 Orden de Implementación Recomendado

1. **Paso 1** - Actualizar JSON (base para otros pasos)
2. **Paso 2** - Backend de puntos (crítico)
3. **Paso 3** - HUD (mejora visible importante)
4. **Paso 4** - Validar portal (depende del paso 1)
5. **Paso 5** - Efectos vórtice (mejora visual)
6. **Paso 6** - Pantalla final (completa la experiencia)
7. **Paso 7** - JWT obligatorio (seguridad)
8. **Paso 8** - Animaciones (polish)
9. **Paso 9** - Carteles (polish visual)

---

**Última actualización:** Noviembre 2025

