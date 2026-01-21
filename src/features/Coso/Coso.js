import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ChatPanel from "./ChatPanel";
import styles from "./Coso.module.scss";
import { Stack } from "@mui/material";

const Coso = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const controlsRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    rotationX: 0,
    rotationY: 0,
    zoom: 5,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = controlsRef.current.zoom;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(10, 10, 7);
    scene.add(directionalLight);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      require("./1.glb"),
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);
        modelRef.current = model;

        // Animation loop
        const animation = () => {
          requestAnimationFrame(animation);

          if (modelRef.current) {
            modelRef.current.rotation.x = controlsRef.current.rotationX;
            modelRef.current.rotation.y = controlsRef.current.rotationY;
          }

          renderer.render(scene, camera);
        };
        animation();
      },
      (progress) => {
        console.log(
          "Loading progress:",
          (progress.loaded / progress.total) * 100 + "%",
        );
      },
      (error) => {
        console.error("Error loading model:", error);
      },
    );

    // Mouse controls
    const handleMouseDown = (e) => {
      controlsRef.current.isDown = true;
      controlsRef.current.startX = e.clientX;
      controlsRef.current.startY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!controlsRef.current.isDown) return;

      const deltaX = e.clientX - controlsRef.current.startX;
      const deltaY = e.clientY - controlsRef.current.startY;

      controlsRef.current.rotationY += deltaX * 0.005;
      controlsRef.current.rotationX += deltaY * 0.005;

      controlsRef.current.startX = e.clientX;
      controlsRef.current.startY = e.clientY;
    };

    const handleMouseUp = () => {
      controlsRef.current.isDown = false;
    };

    // Touch controls
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        controlsRef.current.isDown = true;
        controlsRef.current.startX = e.touches[0].clientX;
        controlsRef.current.startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!controlsRef.current.isDown || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - controlsRef.current.startX;
      const deltaY = e.touches[0].clientY - controlsRef.current.startY;

      controlsRef.current.rotationY += deltaX * 0.005;
      controlsRef.current.rotationX += deltaY * 0.005;

      controlsRef.current.startX = e.touches[0].clientX;
      controlsRef.current.startY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      controlsRef.current.isDown = false;
    };

    // Scroll zoom control
    const handleWheel = (e) => {
      e.preventDefault();

      const zoomSpeed = 0.1;
      const direction = e.deltaY > 0 ? 1 : -1; // Scroll down = zoom out, scroll up = zoom in
      const newZoom = controlsRef.current.zoom + direction * zoomSpeed;

      // Clamp zoom between 1 and 15
      controlsRef.current.zoom = Math.max(1, Math.min(15, newZoom));
      if (cameraRef.current) {
        cameraRef.current.position.z = controlsRef.current.zoom;
      }
    };

    // Touch pinch zoom control
    let lastTouchDistance = 0;
    const getTouchDistance = (touches) => {
      if (touches.length !== 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchZoom = (e) => {
      if (e.touches.length === 2) {
        const touchDistance = getTouchDistance(e.touches);

        if (lastTouchDistance > 0) {
          const zoomDelta = (lastTouchDistance - touchDistance) * 0.01;
          const newZoom = controlsRef.current.zoom + zoomDelta;
          controlsRef.current.zoom = Math.max(1, Math.min(15, newZoom));

          if (cameraRef.current) {
            cameraRef.current.position.z = controlsRef.current.zoom;
          }
        }

        lastTouchDistance = touchDistance;
      }
    };

    const handleTouchZoomEnd = () => {
      lastTouchDistance = 0;
    };

    // Add event listeners
    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("mouseleave", handleMouseUp);
    renderer.domElement.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    renderer.domElement.addEventListener("touchstart", handleTouchStart);
    renderer.domElement.addEventListener("touchmove", handleTouchMove);
    renderer.domElement.addEventListener("touchmove", handleTouchZoom, {
      passive: false,
    });
    renderer.domElement.addEventListener("touchend", handleTouchEnd);
    renderer.domElement.addEventListener("touchend", handleTouchZoomEnd);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("mouseleave", handleMouseUp);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      renderer.domElement.removeEventListener("touchstart", handleTouchStart);
      renderer.domElement.removeEventListener("touchmove", handleTouchMove);
      renderer.domElement.removeEventListener("touchmove", handleTouchZoom);
      renderer.domElement.removeEventListener("touchend", handleTouchEnd);
      renderer.domElement.removeEventListener("touchend", handleTouchZoomEnd);

      if (
        containerRef.current &&
        renderer.domElement.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <Stack direction="row" spacing={2} height={300}>
      <ChatPanel />
      <div ref={containerRef} className={styles.container} />;
    </Stack>
  );
};

export default Coso;
