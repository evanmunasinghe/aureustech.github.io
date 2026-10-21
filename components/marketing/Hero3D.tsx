"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Hero3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return;
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.25, 6.4);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xfff3d6, 0x0a0a0d, 0.7);
    const key = new THREE.DirectionalLight(0xffe6a8, 1.7);
    key.position.set(4, 5, 6);
    const rim = new THREE.PointLight(0xf2c14e, 7, 22, 2);
    rim.position.set(-4, -1.5, -3);
    scene.add(hemi, key, rim);

    const group = new THREE.Group();
    scene.add(group);

    const gemGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4a62a,
      metalness: 0.86,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      emissive: 0x3a2606,
      emissiveIntensity: 0.4,
      flatShading: true,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    group.add(gem);

    const edgesGeo = new THREE.EdgesGeometry(gemGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.55 });
    const wire = new THREE.LineSegments(edgesGeo, edgesMat);
    wire.scale.setScalar(1.006);
    group.add(wire);

    const ringGeo = new THREE.TorusGeometry(2.55, 0.012, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.32 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.35;
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = Math.PI / 1.7;
    ring2.rotation.y = Math.PI / 4;
    ring2.scale.setScalar(1.24);
    group.add(ring, ring2);

    const particleCount = 420;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 3.1 + Math.random() * 2.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf2c14e,
      size: 0.028,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      if (prefersReduced) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 });
    io.observe(container);

    let targetX = 0;
    let targetY = 0;
    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove);

    let frameId = 0;
    const clock = new THREE.Clock();
    let autoYaw = 0;
    let mouseYaw = 0;
    let mousePitch = 0;

    const render = () => {
      const t = clock.getElapsedTime();
      autoYaw += 0.0026;
      mouseYaw += (targetX * 0.5 - mouseYaw) * 0.03;
      mousePitch += (targetY * 0.3 - mousePitch) * 0.045;
      group.rotation.y = autoYaw + mouseYaw;
      group.rotation.x = mousePitch;
      group.position.y = Math.sin(t * 0.6) * 0.12;
      particles.rotation.y -= 0.0006;
      ring.rotation.z += 0.0009;
      ring2.rotation.z -= 0.0007;
      renderer.render(scene, camera);
    };

    if (prefersReduced) {
      group.rotation.set(0.28, 0.6, 0);
      render();
    } else {
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (visible) render();
      };
      animate();
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      io.disconnect();
      gemGeo.dispose();
      gemMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="hero-3d" ref={mountRef} aria-hidden="true" />;
}
