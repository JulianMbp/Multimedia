import * as THREE from 'three'

export default class CheeseParticles {
    constructor(scene, targetPosition) {
        this.scene = scene
        this.targetPosition = targetPosition
        this.particles = null
        
        this.create()
    }

    create() {
        const particleCount = 100 // Aumentar cantidad de partículas
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)
        
        // Color amarillo/dorado más brillante para las partículas
        const color = new THREE.Color(0xffd700)
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3
            
            // Posiciones iniciales aleatorias alrededor del target
            const radius = 2 + Math.random() * 3
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI
            
            positions[i3] = this.targetPosition.x + radius * Math.sin(phi) * Math.cos(theta)
            positions[i3 + 1] = this.targetPosition.y + 1 + radius * Math.sin(phi) * Math.sin(theta)
            positions[i3 + 2] = this.targetPosition.z + radius * Math.cos(phi)
            
            // Colores
            colors[i3] = color.r
            colors[i3 + 1] = color.g
            colors[i3 + 2] = color.b
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        
        const material = new THREE.PointsMaterial({
            size: 1.0, // Aumentar tamaño de 0.2 a 1.0 para mayor visibilidad
            vertexColors: true,
            transparent: true,
            opacity: 1.0, // Aumentar opacidad de 0.8 a 1.0
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true // Permitir que el tamaño varíe con la distancia
        })
        
        this.particles = new THREE.Points(geometry, material)
        this.scene.add(this.particles)
    }

    update(robotPosition) {
        if (!this.particles || !this.targetPosition) return
        
        const positions = this.particles.geometry.attributes.position.array
        const particleCount = positions.length / 3
        
        // Convertir robotPosition a Vector3 si es necesario
        const robotPos = robotPosition instanceof THREE.Vector3 
            ? robotPosition 
            : new THREE.Vector3(robotPosition.x, robotPosition.y, robotPosition.z)
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3
            
            // Mover partículas desde el robot hacia el queso (creando un efecto de guía)
            const currentPos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2])
            
            // Calcular dirección desde el robot hacia el queso
            const directionToCheese = new THREE.Vector3()
                .subVectors(this.targetPosition, robotPos)
                .normalize()
            
            // Mover partículas en la dirección del queso
            const speed = 0.1
            positions[i3] += directionToCheese.x * speed
            positions[i3 + 1] += directionToCheese.y * speed + 0.01 // Ligeramente hacia arriba
            positions[i3 + 2] += directionToCheese.z * speed
            
            // Si la partícula está muy lejos del queso o muy cerca, resetearla cerca del robot
            const distToTarget = currentPos.distanceTo(this.targetPosition)
            const distToRobot = currentPos.distanceTo(robotPos)
            
            if (distToTarget < 1 || distToRobot > 150) {
                // Resetear partícula cerca del robot, en dirección al queso
                const offset = directionToCheese.clone().multiplyScalar(5 + Math.random() * 5)
                positions[i3] = robotPos.x + offset.x
                positions[i3 + 1] = robotPos.y + 1 + Math.random() * 2
                positions[i3 + 2] = robotPos.z + offset.z
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true
    }

    setTarget(newTargetPosition) {
        this.targetPosition = newTargetPosition
    }

    remove() {
        if (this.particles) {
            this.scene.remove(this.particles)
            this.particles.geometry.dispose()
            this.particles.material.dispose()
        }
    }
}

