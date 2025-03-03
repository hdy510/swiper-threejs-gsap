import * as THREE from './node_modules/three/build/three.module.js';
import gsap from './node_modules/gsap/src/index.js';

document.addEventListener('DOMContentLoaded', function () {
  // Swiper 설정
  const swiper = new Swiper('.swiper', {
      direction: 'vertical',
      mousewheel: { invert: false },
      on: {
          slideChange: function () {
              if (this.activeIndex === 1) { // Slide 2에 도착했을 때
                  gsap.to(cube.position, { x: -2, duration: 1, ease: "power2.out" }); // 부드러운 이동
              } else {
                  gsap.to(cube.position, { x: 0, duration: 1, ease: "power2.out" }); // 원래 위치로 돌아오기
              }
          }
      }
  });

  // Three.js 설정
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const canvas = document.getElementById('threeCanvas1');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 박스(큐브) 추가
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 조명 추가
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // 애니메이션 루프
  function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
  }
  animate();

  // 창 크기 변경 시 대응
  window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
  });
});