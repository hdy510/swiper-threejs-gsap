import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

document.addEventListener('DOMContentLoaded', function () {
    // Swiper 설정
    let xWingModel; // 모델 참조 변수
    let targetRotation = new THREE.Euler(1, 1, 0); // 목표 회전값 저장
    let targetPosition = new THREE.Vector3(-50, 0, -25); // 목표 위치값 저장

    const swiper = new Swiper('.swiper', {
        direction: 'vertical',
        mousewheel: { invert: false },
        on: {
            slideChange: function () {
                if (!xWingModel) return;

                if (this.activeIndex === 1) {
                    // Slide 2로 이동 시 목표 회전값 변경
                    targetRotation.set(0, Math.PI / 2, 0); // Y축 90도 회전
                    targetPosition.set(-2, 0, -25); // 위치도 변경
                } else {
                    // Slide 1로 이동 시 원래 상태로 복귀
                    targetRotation.set(1, 1, 0); // 원래 회전값
                    targetPosition.set(-50, 0, -25); // 원래 위치
                }
            },
        },
    });

    // Three.js 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, -10, 70);

    const canvas = document.getElementById('threeCanvas1');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 배경을 투명하게 설정
    scene.background = null;

    let mixer; // 애니메이션을 위한 변수
    const clock = new THREE.Clock();

    // GLTF 로더 추가
    const loader = new GLTFLoader();
    loader.load(
        'x-wing.glb',
        (gltf) => {
            xWingModel = gltf.scene;
            scene.add(xWingModel);

            // 초기 모델 위치, 회전, 크기 설정
            xWingModel.position.set(-50, 0, -25);
            xWingModel.rotation.set(0, 0, 0);
            xWingModel.scale.set(1, 1, 1);

            // 애니메이션이 포함된 경우 실행
            if (gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(xWingModel);
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            }
        },
        (xhr) => {
            console.log(`GLB 로딩 중... ${((xhr.loaded / xhr.total) * 100).toFixed(2)}% 완료`);
        },
        (error) => {
            console.error('GLB 로딩 실패:', error);
        }
    );

    // 조명 추가
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // 애니메이션 루프 (목표 값으로 부드럽게 보간)
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);

        // 📌 Three.js 내부 애니메이션 (lerp로 부드럽게 회전 & 이동)
        if (xWingModel) {
            // 부드럽게 위치 이동 (lerp 사용)
            xWingModel.position.lerp(targetPosition, 0.05);

            // 부드럽게 회전 적용
            xWingModel.rotation.x += (targetRotation.x - xWingModel.rotation.x) * 0.05;
            xWingModel.rotation.y += (targetRotation.y - xWingModel.rotation.y) * 0.05;
            xWingModel.rotation.z += (targetRotation.z - xWingModel.rotation.z) * 0.05;
        }

        renderer.render(scene, camera);
    }
    animate();

    // 창 크기 변경 대응
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });
});
