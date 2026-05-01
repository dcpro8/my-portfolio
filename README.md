# Dhruv Chauhan — Cognitive Environment

A futuristic, interactive portfolio website I built with React, Vite, Three.js, and GSAP.

I present myself as an AI-focused full stack engineer through a 3D scroll-driven experience, interactive artifacts, and immersive visual overlays.

## 🚀 Project Overview

- **Framework:** React + Vite
- **3D Rendering:** @react-three/fiber + three.js
- **Visuals / Animation:** @react-three/drei + GSAP
- **Styling:** Tailwind CSS (via CDN) + custom CSS animations
- **Features:**
  - 3D scroll-controlled scene
  - interactive project artifacts with hover/click effects
  - modal detail overlays
  - custom shader-driven background veil
  - loading/boot screen

## ✨ What the site includes

- `App.tsx` — main app wrapper, boot loader, 3D canvas, and modal overlay logic
- `components/Scene.tsx` — scroll-based camera experience and lighting
- `components/CognitiveArtifacts.tsx` — 3D project artifacts, hover/click interactions, and modal triggers
- `components/DimensionalVeil.tsx` — custom shader field effect for the immersive background
- `components/Overlay.tsx` — on-screen identity text, nav hint, animated UI elements
- `data/config.ts` — portfolio content, project metadata, identity and modal state
- `index.html` — page metadata, Google Fonts, Tailwind CDN, and entry point

## 🧠 Portfolio content

The current portfolio scene includes:

1. **SYSTEM_IDENTITY** — My identity and core skillset
2. **NEUROOPS_AI** — AI DevOps automation platform with GitHub webhook and worker pipeline architecture
3. **NEUROFORGE_AI** — AI product builder for ideation, API design, and roadmap generation
4. **INITIATE_CONTACT** — contact section with email, GitHub, and LinkedIn details

```

## 📁 Repository structure

- `App.tsx`
- `index.tsx`
- `index.html`
- `index.css`
- `components/`
- `data/config.ts`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`

## 📌 Quick commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

---