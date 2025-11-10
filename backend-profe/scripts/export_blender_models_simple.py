"""
Script SIMPLIFICADO de Blender para exportar modelos GLB
Exporta coordenadas NORMALIZADAS al origen (0,0,0)
"""

import bpy
import os
import json

# ============================================
# CONFIGURACIÓN
# ============================================
export_path = r"/Users/julianbastidas/multimedia/game-project/public/models/toycar"
json_path = r"/Users/julianbastidas/multimedia/game-project/public/data/toy_car_blocks.json"

print("=" * 60)
print("🚀 EXPORTACIÓN DESDE BLENDER")
print("=" * 60)

# Verificar selección
selected = [obj for obj in bpy.context.selected_objects if obj.type == 'MESH']
if not selected:
    print("❌ ERROR: Selecciona objetos MESH primero")
else:
    print(f"✅ {len(selected)} objetos seleccionados")

# Recolectar posiciones originales
positions_data = []
for obj in selected:
    loc = obj.matrix_world.translation
    positions_data.append({
        'name': obj.name,
        'x': loc.x,
        'y': loc.y,
        'z': loc.z
    })

# Calcular centro
if positions_data:
    center_x = sum(p['x'] for p in positions_data) / len(positions_data)
    center_y = sum(p['y'] for p in positions_data) / len(positions_data)
    center_z = sum(p['z'] for p in positions_data) / len(positions_data)
    print(f"📍 Centro: ({center_x:.2f}, {center_y:.2f}, {center_z:.2f})")

# Crear directorios
os.makedirs(export_path, exist_ok=True)
os.makedirs(os.path.dirname(json_path), exist_ok=True)

# Exportar y normalizar
positions = []
exported = 0

for obj in selected:
    try:
        name = obj.name.lower().replace(" ", "_").replace(".", "_")
        loc = obj.matrix_world.translation
        
        # Normalizar al origen
        x = loc.x - center_x
        y = loc.y - center_y
        z = loc.z - center_z
        
        positions.append({
            "name": name,
            "x": round(x, 4),
            "y": round(y, 4),
            "z": round(z, 4)
        })
        
        # Exportar GLB
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        
        filepath = os.path.join(export_path, f"{name}.glb")
        bpy.ops.export_scene.gltf(
            filepath=filepath,
            use_selection=True,
            export_format='GLB',
            export_apply=False
        )
        
        exported += 1
        print(f"  ✅ {name}: ({x:.2f}, {y:.2f}, {z:.2f})")
        
    except Exception as e:
        print(f"  ❌ Error en {obj.name}: {e}")

# Guardar JSON
with open(json_path, "w") as f:
    json.dump(positions, f, indent=4)

print(f"\n✅ Exportados: {exported}/{len(selected)}")
print(f"📄 JSON guardado: {json_path}")
print("=" * 60)

