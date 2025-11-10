
import * as THREE from 'three'
import MobileControls from '../../controls/MobileControls.js'
import ToyCarLoader from '../../loaders/ToyCarLoader.js'
import AmbientSound from './AmbientSound.js'
import Cheese from './Cheese.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import Road from './Road.js'
import Robot from './Robot.js'
import Sound from './Sound.js'
import ThirdPersonCamera from './ThirdPersonCamera.js'


export default class World {
    constructor(experience) {
        this.experience = experience
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Sonidos
        this.coinSound = new Sound('/sounds/coin.ogg')
        this.ambientSound = new AmbientSound('/sounds/ambiente.mp3')
        this.winner = new Sound('/sounds/winner.mp3')

        this.allowPrizePickup = false
        this.hasMoved = false
        
        // Sistema de quesos
        this.cheeses = []
        this.maxCheeses = 10
        this.cheeseModel = null

        // Permitimos recoger premios tras 2s
        setTimeout(() => {
            this.allowPrizePickup = true
            console.log('✅ Ahora se pueden recoger premios')
        }, 2000)

        // Cuando todo esté cargado...
        this.resources.on('ready', async () => {
            // 1️⃣ Mundo base
            this.floor = new Floor(this.experience)
            this.environment = new Environment(this.experience)

            this.loader = new ToyCarLoader(this.experience)
            await this.loader.loadFromAPI()
            
            // 🛣️ Crear vía después de cargar los edificios
            const buildingPositions = this.loader.getBuildingPositions?.() || []
            console.log(`🛣️ Creando vía con ${buildingPositions.length} posiciones de edificios`)
            if (buildingPositions.length > 0) {
                this.road = new Road(this.experience, buildingPositions)
            } else {
                console.warn('⚠️ No se encontraron posiciones de edificios para crear la vía')
            }

            // 2️⃣ Personajes
            this.fox = new Fox(this.experience)
            this.robot = new Robot(this.experience)
            
            // 🧀 Inicializar sistema de quesos
            this.cheeseModel = this.resources.items.cheeseModel
            if (this.cheeseModel) {
                // Generar el primer queso después de un pequeño delay
                setTimeout(() => {
                    this.generateCheese()
                }, 1000)
            } else {
                console.warn('⚠️ Modelo de queso no encontrado')
            }

            this.experience.tracker.showCancelButton()
            //Registrando experiencia VR con el robot
            this.experience.vr.bindCharacter(this.robot)
            this.thirdPersonCamera = new ThirdPersonCamera(this.experience, this.robot.group)

            // 3️⃣ Cámara
            this.thirdPersonCamera = new ThirdPersonCamera(this.experience, this.robot.group)

            // 4️⃣ Controles móviles (tras crear robot)
            this.mobileControls = new MobileControls({
                onUp: (pressed) => { this.experience.keyboard.keys.up = pressed },
                onDown: (pressed) => { this.experience.keyboard.keys.down = pressed },
                onLeft: (pressed) => { this.experience.keyboard.keys.left = pressed },
                onRight: (pressed) => { this.experience.keyboard.keys.right = pressed }
            })


        })

    }

    toggleAudio() {
        this.ambientSound.toggle()
    }

    update(delta) {
        // Actualiza personajes y cámara
        this.fox?.update()
        this.robot?.update()

        if (this.thirdPersonCamera && this.experience.isThirdPerson && !this.experience.renderer.instance.xr.isPresenting) {
            this.thirdPersonCamera.update()
        }

        // Gira premios
        this.loader?.prizes?.forEach(p => p.update(delta))
        
        // Actualiza quesos
        this.cheeses?.forEach(c => c.update(delta))


        // Lógica de recogida
        if (!this.allowPrizePickup || !this.loader || !this.robot) return

        const pos = this.robot.body.position
        const speed = this.robot.body.velocity.length()
        const moved = speed > 0.5

        this.loader.prizes.forEach((prize, idx) => {
            if (prize.collected || !prize.pivot) return

            const dist = prize.pivot.position.distanceTo(pos)
            if (dist < 1.2 && moved) {
                prize.collect()
                this.loader.prizes.splice(idx, 1)

                // ✅ Incrementar puntos
                this.points = (this.points || 0) + 1
                this.robot.points = this.points

                // 🧹 Limpiar obstáculos
                if (this.experience.raycaster?.removeRandomObstacles) {
                    const reduction = 0.2 + Math.random() * 0.1
                    this.experience.raycaster.removeRandomObstacles(reduction)
                }

                this.coinSound.play()
                this.experience.menu.setStatus?.(`🎖️ Puntos: ${this.points}`)
                console.log(`🟡 Premio recogido. Total: ${this.points}`)
            }
        })

        // 🧀 Lógica de recogida de quesos
        if (this.allowPrizePickup && this.robot && this.cheeses) {
            const robotPos = this.robot.body.position
            const speed = this.robot.body.velocity.length()
            const moved = speed > 0.5

            this.cheeses.forEach((cheese, idx) => {
                if (cheese.collected || !cheese.pivot) return

                const dist = cheese.pivot.position.distanceTo(robotPos)
                if (dist < 1.2 && moved) {
                    cheese.collect()
                    this.cheeses.splice(idx, 1)
                    
                    console.log(`🧀 Queso recogido. Quedan: ${this.maxCheeses - this.cheeses.length}`)
                    
                    // Generar un nuevo queso si no hemos alcanzado el máximo
                    if (this.cheeses.length < this.maxCheeses) {
                        setTimeout(() => {
                            this.generateCheese()
                        }, 500)
                    }
                }
            })
        }

        // ✅ Evaluar fuera del bucle de premios
        if (this.points === 14 && !this.experience.tracker.finished) {
            const elapsed = this.experience.tracker.stop()
            this.experience.tracker.saveTime(elapsed)
            this.experience.tracker.showEndGameModal(elapsed)

            this.experience.obstacleWavesDisabled = true
            clearTimeout(this.experience.obstacleWaveTimeout)
            this.experience.raycaster?.removeAllObstacles()
            this.winner.play()
        }

    }
    
    generateCheese() {
        if (!this.cheeseModel || !this.robot || this.cheeses.length >= this.maxCheeses) {
            return
        }
        
        // Obtener posición del robot
        const robotPos = this.robot.body.position
        
        // Intentar generar un queso en una posición válida
        let attempts = 0
        const maxAttempts = 50
        
        while (attempts < maxAttempts) {
            // Generar posición aleatoria alrededor del robot (radio de 1 metro = distancia de 1-3 unidades)
            const angle = Math.random() * Math.PI * 2
            const distance = 1 + Math.random() * 2 // Entre 1 y 3 metros del robot
            const x = robotPos.x + Math.cos(angle) * distance
            const z = robotPos.z + Math.sin(angle) * distance
            const y = 0.3 // Ligeramente sobre el suelo
            
            // Verificar que no esté encima de un edificio
            // Usar raycaster desde arriba hacia abajo para detectar edificios
            const raycaster = new THREE.Raycaster()
            const fromAbove = new THREE.Vector3(x, 50, z) // Desde arriba
            const direction = new THREE.Vector3(0, -1, 0) // Hacia abajo
            raycaster.set(fromAbove, direction)
            
            // Obtener todos los meshes de edificios de la escena
            const buildingMeshes = []
            this.scene.traverse((child) => {
                // Buscar meshes que sean edificios (excluir suelo, vía, robot, zorro)
                if (child instanceof THREE.Mesh && 
                    child !== this.floor?.mesh && 
                    child !== this.road?.mesh &&
                    child.parent !== this.robot?.group &&
                    child.parent !== this.robot?.model &&
                    child.parent !== this.fox?.model) {
                    buildingMeshes.push(child)
                }
            })
            
            // Verificar intersecciones con edificios
            const intersects = raycaster.intersectObjects(buildingMeshes, true)
            
            // Si hay intersección con un edificio a una altura mayor a 0.5, no es válido
            let isOnBuilding = false
            if (intersects.length > 0) {
                for (const intersect of intersects) {
                    if (intersect.point.y > 0.5) {
                        isOnBuilding = true
                        break
                    }
                }
            }
            
            if (isOnBuilding) {
                attempts++
                continue
            }
            
            // Verificar que no esté muy cerca de otros quesos
            let tooClose = false
            for (const existingCheese of this.cheeses) {
                if (existingCheese.pivot) {
                    const dist = new THREE.Vector3(x, y, z).distanceTo(existingCheese.pivot.position)
                    if (dist < 1.5) {
                        tooClose = true
                        break
                    }
                }
            }
            
            if (tooClose) {
                attempts++
                continue
            }
            
            // Posición válida, crear el queso
            const cheese = new Cheese({
                model: this.cheeseModel.scene,
                position: new THREE.Vector3(x, y, z),
                scene: this.scene
            })
            this.cheeses.push(cheese)
            console.log(`🧀 Queso generado en: (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`)
            return
        }
        
        console.warn('⚠️ No se pudo generar queso después de múltiples intentos')
    }

}
