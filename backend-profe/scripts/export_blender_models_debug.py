"""
Script de Blender con DEBUG para exportar modelos GLB
Exporta coordenadas NORMALIZADAS al origen (0,0,0)
"""

import bpy
import os
import json
import traceback

# ============================================
# CONFIGURACIÓN
# ============================================
export_path = r"/Users/julianbastidas/multimedia/game-project/public/models/toycar"
json_path = r"/Users/julianbastidas/multimedia/game-project/public/data/toy_car_blocks.json"

print("=" * 60)
print("🚀 EXPORTACIÓN DESDE BLENDER (MODO DEBUG)")
print("=" * 60)

# Verificar que Blender está en modo OBJECT
if bpy.context.mode != 'OBJECT':
    print(f"⚠️  Cambiando modo a OBJECT (modo actual: {bpy.context.mode})")
    bpy.ops.object.mode_set(mode='OBJECT')

# Verificar selección
all_objects = bpy.context.selected_objects
print(f"📦 Objetos seleccionados (total): {len(all_objects)}")

# Filtrar solo MESH
selected = [obj for obj in all_objects if obj.type == 'MESH']
print(f"📦 Objetos tipo MESH: {len(selected)}")

if not selected:
    print("❌ ERROR: No hay objetos MESH seleccionados")
    print("   Tipos de objetos seleccionados:")
    for obj in all_objects:
        print(f"      - {obj.name}: tipo {obj.type}")
    print("\n   Por favor, selecciona objetos de tipo MESH")
else:
    print(f"✅ {len(selected)} objetos MESH seleccionados:")
    for i, obj in enumerate(selected[:10], 1):  # Mostrar primeros 10
        print(f"   {i}. {obj.name}")
    if len(selected) > 10:
        print(f"   ... y {len(selected) - 10} más")

# Verificar que la ruta existe
print(f"\n📁 Ruta de exportación: {export_path}")
if not os.path.exists(export_path):
    print(f"⚠️  La carpeta no existe, se creará: {export_path}")
    try:
        os.makedirs(export_path, exist_ok=True)
        print(f"✅ Carpeta creada")
    except Exception as e:
        print(f"❌ Error creando carpeta: {e}")
        exit(1)
else:
    print(f"✅ La carpeta existe")

# Verificar permisos de escritura
test_file = os.path.join(export_path, "test_write.txt")
try:
    with open(test_file, "w") as f:
        f.write("test")
    os.remove(test_file)
    print(f"✅ Permisos de escritura: OK")
except Exception as e:
    print(f"❌ Sin permisos de escritura: {e}")
    exit(1)

# Recolectar posiciones originales
print(f"\n📊 Recolectando posiciones...")
positions_data = []
for obj in selected:
    loc = obj.matrix_world.translation
    positions_data.append({
        'name': obj.name,
        'x': loc.x,
        'y': loc.y,
        'z': loc.z
    })
    print(f"   {obj.name}: ({loc.x:.2f}, {loc.y:.2f}, {loc.z:.2f})")

# Calcular centro
if positions_data:
    center_x = sum(p['x'] for p in positions_data) / len(positions_data)
    center_y = sum(p['y'] for p in positions_data) / len(positions_data)
    center_z = sum(p['z'] for p in positions_data) / len(positions_data)
    print(f"\n📍 Centro calculado: ({center_x:.2f}, {center_y:.2f}, {center_z:.2f})")

# Crear directorios
os.makedirs(export_path, exist_ok=True)
os.makedirs(os.path.dirname(json_path), exist_ok=True)

# Exportar y normalizar
print(f"\n📦 Exportando modelos GLB...")
positions = []
exported = 0
failed = 0

for i, obj in enumerate(selected, 1):
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
        
        print(f"\n[{i}/{len(selected)}] Exportando: {obj.name} -> {name}.glb")
        
        # Asegurar que solo este objeto esté seleccionado
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        
        # Verificar que el objeto está seleccionado
        if obj.name not in [o.name for o in bpy.context.selected_objects]:
            print(f"   ⚠️  Advertencia: El objeto no se seleccionó correctamente")
            continue
        
        filepath = os.path.join(export_path, f"{name}.glb")
        print(f"   📁 Ruta: {filepath}")
        
        # Exportar GLB
        try:
            bpy.ops.export_scene.gltf(
                filepath=filepath,
                use_selection=True,
                export_format='GLB',
                export_apply=False,
                export_yup=True
            )
            
            # Verificar que el archivo se creó
            if os.path.exists(filepath):
                file_size = os.path.getsize(filepath)
                print(f"   ✅ Exportado: {file_size} bytes")
                exported += 1
            else:
                print(f"   ❌ El archivo no se creó")
                failed += 1
                
        except Exception as export_error:
            print(f"   ❌ Error al exportar: {export_error}")
            print(f"   📋 Detalles: {traceback.format_exc()}")
            failed += 1
        
    except Exception as e:
        print(f"   ❌ Error procesando {obj.name}: {e}")
        print(f"   📋 Detalles: {traceback.format_exc()}")
        failed += 1

# Guardar JSON
print(f"\n💾 Guardando JSON...")
try:
    with open(json_path, "w") as f:
        json.dump(positions, f, indent=4)
    print(f"✅ JSON guardado: {json_path}")
    print(f"   {len(positions)} posiciones guardadas")
except Exception as e:
    print(f"❌ Error guardando JSON: {e}")
    print(f"📋 Detalles: {traceback.format_exc()}")

# Resumen final
print("\n" + "=" * 60)
print("📊 RESUMEN")
print("=" * 60)
print(f"✅ Exportados exitosamente: {exported}/{len(selected)}")
print(f"❌ Fallos: {failed}")
print(f"📄 Posiciones en JSON: {len(positions)}")

if exported > 0:
    # Verificar archivos creados
    glb_files = [f for f in os.listdir(export_path) if f.endswith('.glb')]
    print(f"📦 Archivos GLB en carpeta: {len(glb_files)}")
    if len(glb_files) > 0:
        print(f"   Primeros archivos:")
        for f in glb_files[:5]:
            size = os.path.getsize(os.path.join(export_path, f))
            print(f"      - {f} ({size} bytes)")

print("=" * 60)

