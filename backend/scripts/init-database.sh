#!/bin/bash

# Script para inicializar la base de datos con las colecciones necesarias
# Este script ejecuta el seed de niveles

echo "🚀 Inicializando base de datos..."

# Verificar que el contenedor esté corriendo
if ! docker ps | grep -q "backend-express"; then
    echo "❌ Error: El contenedor backend-express no está corriendo"
    echo "💡 Ejecuta: docker compose up -d"
    exit 1
fi

# Ejecutar el seed de niveles
echo "📦 Ejecutando seed de niveles..."
docker exec backend-express npm run seed:levels

# Ejecutar el seed de bloques
echo "📦 Ejecutando seed de bloques..."
docker exec backend-express npm run seed:blocks

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Base de datos inicializada correctamente"
    echo ""
    echo "📊 Colecciones creadas:"
    echo "   - levels (con 3 niveles iniciales)"
    echo "   - blocks (bloques del juego cargados desde JSON)"
    echo ""
    echo "📦 Archivos de datos:"
    if [ -f "data/toy_car_blocks.json" ]; then
        BLOCKS_COUNT=$(cat data/toy_car_blocks.json | grep -o '"name"' | wc -l | tr -d ' ')
        echo "   ✅ toy_car_blocks.json ($BLOCKS_COUNT bloques) - Disponible en /api/blocks"
    else
        echo "   ⚠️  toy_car_blocks.json no encontrado"
        echo "   💡 Copia el archivo desde game-project/public/data/toy_car_blocks.json"
    fi
    echo ""
    echo "💡 Para verificar las colecciones, ejecuta:"
    echo "   docker exec -it backend-mongodb mongosh -u admin -p admin123 --authenticationDatabase=admin"
    echo "   use multimedia_db"
    echo "   show collections"
    echo "   db.levels.find()"
    echo ""
    echo "💡 Para verificar los bloques:"
    echo "   curl http://localhost:3000/api/blocks | jq 'length'"
else
    echo "❌ Error al inicializar la base de datos"
    exit 1
fi

