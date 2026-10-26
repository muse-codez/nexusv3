"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Original Three.js character for the Hire section, built from
// primitives only — no external model file. A small lime editor-bot:
// round head with big eyes, an antenna, a boxy body, and one arm
// that waves. It idles with a gentle bob and a slow blink, looks
// slightly toward the pointer, and stands still (one static frame)
// when the user prefers reduced motion.

export default function HireCharacter() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.2, 6);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xf7078e, 1.2);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    const lime = new THREE.MeshStandardMaterial({ color: 0xa3e635, roughness: 0.35 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });
    const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const pink = new THREE.MeshStandardMaterial({ color: 0xf7078e, roughness: 0.4 });

    const bot = new THREE.Group();
    scene.add(bot);

    // Body
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 0.5, 8, 24), lime);
    body.position.y = -0.35;
    bot.add(body);

    // Chest screen
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.38), dark);
    screen.position.set(0, -0.3, 0.58);
    bot.add(screen);
    const play = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 3), pink);
    play.rotation.z = -Math.PI / 2;
    play.position.set(0.02, -0.3, 0.6);
    bot.add(play);

    // Head
    const head = new THREE.Group();
    head.position.y = 0.95;
    bot.add(head);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 32), lime);
    skull.scale.set(1, 0.92, 0.95);
    head.add(skull);

    // Eyes (groups, so they can blink by scaling Y)
    const makeEye = (x: number) => {
      const g = new THREE.Group();
      g.position.set(x, 0.08, 0.62);
      const w = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 24), white);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), dark);
      pupil.position.z = 0.11;
      g.add(w, pupil);
      head.add(g);
      return g;
    };
    const eyeL = makeEye(-0.28);
    const eyeR = makeEye(0.28);

    // Smile — a partial torus, rotated so it reads as a smile
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 24, Math.PI), dark);
    smile.position.set(0, -0.18, 0.64);
    smile.rotation.z = Math.PI;
    head.add(smile);

    // Antenna with a pink tip
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 12), dark);
    stem.position.y = 0.85;
    head.add(stem);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), pink);
    tip.position.y = 1.08;
    head.add(tip);

    // Arms — right arm is the waving arm (pivot at the shoulder)
    const makeArm = (x: number) => {
      const pivot = new THREE.Group();
      pivot.position.set(x, -0.1, 0);
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.45, 8, 16), dark);
      arm.position.y = -0.35;
      pivot.add(arm);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 16), lime);
      hand.position.y = -0.7;
      pivot.add(hand);
      bot.add(pivot);
      return pivot;
    };
    const armL = makeArm(-0.85);
    const armR = makeArm(0.85);

    // Legs
    const makeLeg = (x: number) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.4, 12), dark);
      leg.position.set(x, -1.15, 0);
      bot.add(leg);
    };
    makeLeg(-0.3);
    makeLeg(0.3);

    // Soft shadow blob under the bot
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.38;
    scene.add(shadow);

    // Pointer look — head turns slightly toward the pointer
    let targetX = 0;
    let targetY = 0;
    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const renderFrame = (t: number) => {
      // Idle bob + wave + blink
      bot.position.y = Math.sin(t * 0.0016) * 0.08;
      bot.rotation.y = Math.sin(t * 0.0006) * 0.12;
      armR.rotation.z = -0.5 - Math.sin(t * 0.004) * 0.45;
      armL.rotation.z = 0.15 + Math.sin(t * 0.0016) * 0.05;
      // Blink every ~3s: eyes squash for 120ms
      const blink = (t % 3000) < 120 ? 0.15 : 1;
      eyeL.scale.y = blink;
      eyeR.scale.y = blink;
      // Head follows the pointer a little
      head.rotation.y += (targetX * 0.25 - head.rotation.y) * 0.06;
      head.rotation.x += (-targetY * 0.15 - head.rotation.x) * 0.06;
      renderer.render(scene, camera);
    };

    if (reduced) {
      armR.rotation.z = -0.7;
      renderFrame(0);
    } else {
      const loop = () => {
        renderFrame(clock.getElapsedTime() * 1000);
        raf = requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="mx-auto h-[340px] w-full max-w-[420px]"
      role="img"
      aria-label="A small lime 3D editor robot waving hello"
    />
  );
}
