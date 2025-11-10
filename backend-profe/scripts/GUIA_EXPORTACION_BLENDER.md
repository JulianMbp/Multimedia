# 🎨 Guía para Exportar Modelos desde Blender

## 📋 Pasos para Exportar tus Modelos

### 1️⃣ Preparar la Escena en Blender

1. **Abrir Blender** con tu escena que contiene todos los edificios/objetos
2. **Verificar que todos los objetos estén en la escena** (no ocultos)
3. **Asegurar que los objetos tengan nombres únicos** (evitar duplicados)

### 2️⃣ Seleccionar los Objetos a Exportar

**Opción A: Seleccionar todos los objetos**
- Presiona `A` (seleccionar todo)
- O en el menú: `Select > All`

**Opción B: Seleccionar objetos específicos**
- Mantén presionado `Shift` y haz clic en cada objeto que quieras exportar
- O usa `B` para selección por caja (box select)

### 3️⃣ Cargar el Script de Exportación

1. **Abrir el Editor de Texto en Blender:**
   - Ve a la pestaña `Scripting` (arriba)
   - O crea un nuevo espacio de trabajo con `Scripting`

2. **Cargar el script:**
   - Click en `Text > Open Text Block`
   - Navega a: `/Users/julianbastidas/multimedia/backend-profe/scripts/export_blender_models.py`
   - O copia y pega el contenido del script

3. **Ajustar la ruta de exportación (si es necesario):**
   ```python
   export_path = r"/Users/julianbastidas/multimedia/game-project/public/models/toycar"
   ```
   - Asegúrate de que esta ruta sea correcta
   - El script creará el directorio si no existe

### 4️⃣ Configurar Opciones (Opcional)

En el script, puedes ajustar:

```python
# Normalizar coordenadas al origen (recomendado: True)
NORMALIZE_TO_ORIGIN = True
```

- **`True`**: Los objetos se centrarán alrededor del origen (0, 0, 0)
- **`False`**: Se usarán las coordenadas originales de Blender

### 5️⃣ Ejecutar el Script

1. **Asegúrate de que tienes objetos seleccionados**
2. **Ejecuta el script:**
   - Click en el botón `Run Script` (▶️)
   - O presiona `Alt + P`

3. **Revisa la consola de Blender:**
   - Abre la consola: `Window > Toggle System Console` (Windows) o `Window > Toggle System Console` (Mac)
   - Verás el progreso de la exportación

### 6️⃣ Verificar los Resultados

El script creará:

1. **Archivos GLB** en: `/Users/julianbastidas/multimedia/game-project/public/models/toycar/`
   - Un archivo `.glb` por cada objeto seleccionado
   - Ejemplo: `building_001.glb`, `building_002.glb`, etc.

2. **Archivo JSON** en: `/Users/julianbastidas/multimedia/game-project/public/models/toycar/toy_car_blocks.json`
   - Contiene las posiciones de todos los objetos
   - Formato compatible con Three.js

### 7️⃣ Copiar el JSON al Proyecto

El archivo JSON debe estar en la carpeta `public/data/` del proyecto:

```bash
# Copiar el JSON generado a la carpeta data
cp /Users/julianbastidas/multimedia/game-project/public/models/toycar/toy_car_blocks.json \
   /Users/julianbastidas/multimedia/game-project/public/data/toy_car_blocks.json
```

O manualmente:
- Abre el archivo generado
- Copia su contenido
- Pégalo en: `game-project/public/data/toy_car_blocks.json`

## 🔧 Solución de Problemas

### ❌ Error: "No hay objetos MESH seleccionados"
- **Solución**: Asegúrate de seleccionar objetos que sean de tipo MESH
- Verifica que no estén ocultos (presiona `H` para mostrar/ocultar)

### ❌ Error: "Permission denied" al guardar
- **Solución**: Verifica que tengas permisos de escritura en la carpeta de destino
- O cambia la ruta `export_path` a una carpeta donde tengas permisos

### ❌ Los modelos no se ven en el juego
- **Verifica**: 
  1. Que los archivos GLB estén en `public/models/toycar/`
  2. Que el JSON esté en `public/data/toy_car_blocks.json`
  3. Que los nombres en el JSON coincidan con los nombres en `sources.js`
  4. Revisa la consola del navegador para ver errores

### ❌ Los objetos están en posiciones incorrectas
- **Solución**: 
  1. Verifica la conversión de coordenadas en el script
  2. Si Blender usa Y-up y Three.js también, las coordenadas deberían ser iguales
  3. Si necesitas rotar el modelo, ajusta la conversión en el script

## 📝 Notas Importantes

1. **Nombres de objetos**: 
   - Los nombres se convertirán a minúsculas
   - Los espacios se reemplazarán por guiones bajos
   - Ejemplo: `Building 001` → `building_001`

2. **Coordenadas normalizadas**:
   - Si `NORMALIZE_TO_ORIGIN = True`, todos los objetos se centrarán alrededor del origen
   - Esto es útil para que los objetos aparezcan cerca del robot (que está en 0, 0, 0)

3. **Exportación GLB**:
   - Los modelos se exportan individualmente
   - Se mantienen las transformaciones relativas
   - Se exportan materiales y normales

## 🎯 Ejemplo de Uso Rápido

1. Abre Blender
2. Selecciona todos los objetos (`A`)
3. Abre el script `export_blender_models.py`
4. Ajusta la ruta si es necesario
5. Ejecuta el script (`Alt + P`)
6. Copia el JSON a `public/data/toy_car_blocks.json`
7. Recarga el juego

¡Listo! 🎉

