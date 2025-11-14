import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /api/blocks - Obtener todos los bloques
router.get('/', async (req, res) => {
  try {
    // Intentar leer el archivo JSON de bloques
    // Primero intentar desde el directorio del backend
    const blocksPath = path.join(__dirname, '../../data/toy_car_blocks.json');
    
    // Si no existe, intentar desde el directorio público del frontend (si está disponible)
    let blocks = [];
    
    try {
      if (fs.existsSync(blocksPath)) {
        const fileContent = fs.readFileSync(blocksPath, 'utf8');
        blocks = JSON.parse(fileContent);
        console.log(`✅ Bloques cargados desde archivo: ${blocks.length} bloques`);
      } else {
        console.warn('⚠️ Archivo de bloques no encontrado en:', blocksPath);
        // Devolver array vacío si no se encuentra el archivo
        blocks = [];
      }
    } catch (fileError) {
      console.error('❌ Error al leer archivo de bloques:', fileError);
      blocks = [];
    }

    // Si no hay bloques, devolver array vacío
    if (!Array.isArray(blocks)) {
      blocks = [];
    }

    res.json(blocks);
  } catch (error) {
    console.error('Error al obtener bloques:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener bloques',
      error: error.message,
      blocks: [], // Devolver array vacío en caso de error
    });
  }
});

export default router;

