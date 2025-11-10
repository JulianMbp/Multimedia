"""
Script de Blender para exportar modelos GLB y generar JSON con posiciones
Optimizado para Three.js con normalización de coordenadas
"""

import bpy
import os
import json
from mathutils import Vector

# ============================================
# CONFIGURACIÓN - AJUSTA ESTAS RUTAS
# ============================================
export_path = r"/Users/julianbastidas/multimedia/game-project/public/models/toycar"
json_path = os.path.join(export_path, "toy_car_blocks.json")

# Opción: Normalizar coordenadas al origen (recomendado)
NORMALIZE_TO_ORIGIN = True

# Crear directorio si no existe
os.makedirs(export_path, exist_ok=True)

print("=" * 60)
print("🚀 INICIANDO EXPORTACIÓN DESDE BLENDER")
print("=" * 60)

# Configuración de Blender
depsgraph = bpy.context.evaluated_depsgraph_get()
bpy.context.view_layer.update()

# Verificar que hay objetos seleccionados
selected_objects = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']
if not selected_objects:
    print("❌ ERROR: No hay objetos MESH seleccionados")
    print("   Por favor, selecciona los objetos que quieres exportar")
else:
    print(f"✅ {len(selected_objects)} objetos seleccionados para exportar")

positions = []
all_positions = []

# Primera pasada: recolectar todas las posiciones para calcular el centro
print("\n📊 Primera pasada: Calculando centro de la escena...")
for obj in selected_objects:
    if obj.type != 'MESH':
        continue
    
    obj_eval = obj.evaluated_get(depsgraph)
    matrix_world = obj_eval.matrix_world
    loc = matrix_world.to_translation()
    all_positions.append((loc.x, loc.y, loc.z))

# Calcular centro de masa (promedio de todas las posiciones)
if all_positions and NORMALIZE_TO_ORIGIN:
    center_x = sum(p[0] for p in all_positions) / len(all_positions)
    center_y = sum(p[1] for p in all_positions) / len(all_positions)
    center_z = sum(p[2] for p in all_positions) / len(all_positions)
    print(f"📍 Centro calculado: ({center_x:.2f}, {center_y:.2f}, {center_z:.2f})")
    print(f"🔄 Normalizando coordenadas al origen (0, 0, 0)")
else:
    center_x = center_y = center_z = 0.0
    print("⚠️  Normalización deshabilitada, usando coordenadas originales")

# Segunda pasada: exportar modelos y guardar posiciones
print("\n📦 Segunda pasada: Exportando modelos...")
exported_count = 0
failed_count = 0

for obj in selected_objects:
    if obj.type != 'MESH':
        continue

    try:
        obj_eval = obj.evaluated_get(depsgraph)
        matrix_world = obj_eval.matrix_world
        loc = matrix_world.to_translation()

        # Nombre del objeto (normalizado)
        name = obj.name.lower().replace(" ", "_").replace(".", "_")
        
        # Conversión de coordenadas: Blender (Y-up) → Three.js (Y-up)
        # Blender: X, Y (up), Z
        # Three.js: X, Y (up), Z
        # NOTA: Si tus modelos están rotados o el sistema es diferente, ajusta aquí
        
        if NORMALIZE_TO_ORIGIN:
            # Normalizar: restar el centro para que el centro esté en (0,0,0)
            normalized_x = loc.x - center_x
            normalized_y = loc.y - center_y
            normalized_z = loc.z - center_z
        else:
            # Usar coordenadas originales
            normalized_x = loc.x
            normalized_y = loc.y
            normalized_z = loc.z

        # Para Three.js, generalmente:
        # - X se mantiene igual
        # - Y es la altura (Z de Blender si el modelo está rotado, o Y si no)
        # - Z es la profundidad (Y de Blender invertido si está rotado, o Z si no)
        # 
        # Si tus modelos están correctamente orientados en Blender, usa:
        pos = {
            "name": name,
            "x": normalized_x,
            "y": normalized_y,  # Altura (Y-up en ambos sistemas)
            "z": normalized_z   # Profundidad
        }
        
        # Si necesitas convertir coordenadas (por ejemplo, si Blender tiene Y-up pero Three.js necesita otra orientación):
        # Descomenta y ajusta según sea necesario:
        # pos = {
        #     "name": name,
        #     "x": normalized_x,
        #     "y": normalized_z,      # Z de Blender → Y de Three.js
        #     "z": -normalized_y      # Y de Blender → Z invertido de Three.js
        # }

        positions.append(pos)
        print(f"  ✅ {name}: ({pos['x']:.2f}, {pos['y']:.2f}, {pos['z']:.2f})")

        # Exportar modelo .glb individual
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj

        filepath = os.path.join(export_path, f"{name}.glb")
        
        # Exportar con configuración optimizada
        bpy.ops.export_scene.gltf(
            filepath=filepath,
            use_selection=True,
            export_format='GLB',
            export_apply=False,  # No aplicar transformaciones (mantener posición relativa)
            export_yup=True,     # Y-up (compatible con Three.js)
            export_colors=False,
            export_normals=True,
            export_materials='EXPORT'
        )
        
        exported_count += 1
        
    except Exception as e:
        print(f"  ❌ Error exportando {obj.name}: {str(e)}")
        failed_count += 1
        continue

# Guardar archivo JSON con las posiciones
print(f"\n💾 Guardando JSON con {len(positions)} posiciones...")
try:
    with open(json_path, "w", encoding='utf-8') as f:
        json.dump(positions, f, indent=4, ensure_ascii=False)
    print(f"✅ JSON guardado en: {json_path}")
except Exception as e:
    print(f"❌ Error guardando JSON: {str(e)}")

# Resumen final
print("\n" + "=" * 60)
print("📊 RESUMEN DE EXPORTACIÓN")
print("=" * 60)
print(f"✅ Modelos exportados: {exported_count}")
print(f"❌ Fallos: {failed_count}")
print(f"📄 Posiciones guardadas: {len(positions)}")

if positions:
    # Calcular rango de posiciones
    min_x = min(p['x'] for p in positions)
    max_x = max(p['x'] for p in positions)
    min_y = min(p['y'] for p in positions)
    max_y = max(p['y'] for p in positions)
    min_z = min(p['z'] for p in positions)
    max_z = max(p['z'] for p in positions)
    
    print(f"\n📍 Rango de posiciones:")
    print(f"   X: {min_x:.2f} a {max_x:.2f} (rango: {max_x - min_x:.2f})")
    print(f"   Y: {min_y:.2f} a {max_y:.2f} (rango: {max_y - min_y:.2f})")
    print(f"   Z: {min_z:.2f} a {max_z:.2f} (rango: {max_z - min_z:.2f})")
    
    # Verificar si hay objetos cerca del origen
    near_origin = [p for p in positions if abs(p['x']) < 50 and abs(p['y']) < 50 and abs(p['z']) < 50]
    print(f"🏠 Objetos cerca del origen (< 50 unidades): {len(near_origin)}")

print("\n✅ Exportación finalizada!")
print("=" * 60)

