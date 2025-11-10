import * as THREE from 'three';
import isMobileDevice from '../Utils/Device.js'; // Asegúrate de que exista esta función

export default class ThirdPersonCamera {
    constructor(experience, target) {
        this.experience = experience
        this.camera = experience.camera.instance
        this.target = target

        const isMobile = isMobileDevice()

        // Distancia y altura adaptada
        this.offset = isMobile
            ? new THREE.Vector3(0, 3.5, -7)  // móvil: más alto y atrás
            : new THREE.Vector3(0, 2.5, -5)

        // Fijar altura para evitar sacudidas
        this.fixedY = isMobile ? 3.5 : 2.5
    }

    update() {
        if (!this.target) return

        // Si OrbitControls está activo (usuario moviendo mouse), no sobrescribir
        const orbitControls = this.experience.camera?.controls
        if (orbitControls && orbitControls.enabled) {
            // Permitir que OrbitControls maneje la cámara
            // Pero mantener el target cerca del robot para que pueda orbitar alrededor
            const basePosition = this.target.position.clone()
            orbitControls.target.lerp(basePosition, 0.1)
            return
        }

        const basePosition = this.target.position.clone()

        // Dirección del robot
        const direction = new THREE.Vector3(0, 0, 1).applyEuler(this.target.rotation).normalize()

        // Fijar cámara a una altura constante (no sigue saltos ni choques verticales)
        const cameraPosition = new THREE.Vector3(
            basePosition.x + direction.x * this.offset.z,
            this.fixedY,
            basePosition.z + direction.z * this.offset.z
        )

        this.camera.position.lerp(cameraPosition, 0.15)

        // Siempre mirar al centro del robot (con altura fija)
        const lookAt = basePosition.clone().add(new THREE.Vector3(0, 1.2, 0))
        this.camera.lookAt(lookAt)
    }
}
