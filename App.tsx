import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { PROJECTS, modalState, closeModal } from './data/config';

const TypingText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 40); // speed

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      <span className="animate-blink">|</span>
    </span>
  );
};

const ModalOverlay = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleOpen = (e: any) => {
      setActiveId(e.detail);
      // Small delay to allow DOM to render before starting CSS transition
      setTimeout(() => setIsVisible(true), 10);
    };
    const handleClose = () => {
      setIsVisible(false);
      // Wait for transition to finish before unmounting
      setTimeout(() => setActiveId(null), 300);
    };
    modalState.addEventListener('open', handleOpen);
    modalState.addEventListener('close', handleClose);
    return () => {
      modalState.removeEventListener('open', handleOpen);
      modalState.removeEventListener('close', handleClose);
    };
  }, []);

  if (!activeId) return null;

  const project = PROJECTS.find(p => p.id === activeId);
  if (!project) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#010102]/80 backdrop-blur-sm pointer-events-auto transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onClick={closeModal}
    >
      <div
        className={`w-[90vw] max-w-[96vw] sm:max-w-lg md:max-w-2xl p-6 sm:p-8 md:p-12 max-h-[92vh] overflow-y-auto bg-[#010102]/95 backdrop-blur-xl border border-[#00f0ff]/50 shadow-[0_0_40px_rgba(0,240,255,0.2)] text-[#e2e8f0] font-mono select-none flex flex-col gap-4 md:gap-6 relative transition-all duration-300 transform will-change-transform ${isVisible ? 'opacity-100 translate-y-0 scale-100 animate-boot' : 'opacity-0 translate-y-4 scale-[0.98]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start border-b border-[#00f0ff]/40 pb-4 gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-[#00f0ff] font-bold tracking-[0.1em] md:tracking-[0.2em] text-base sm:text-lg md:text-3xl font-syncopate drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] whitespace-normal break-words">
              <TypingText text={project.title} />
            </h3>
            <span className="text-xs md:text-sm text-[#00f0ff]/80 tracking-widest block mt-2">ID::[{project.id}]</span>
          </div>
          <button
            onClick={closeModal}
            className="text-[#00f0ff] hover:text-white transition-colors p-2 font-bold text-lg sm:text-xl cursor-pointer mt-2 sm:mt-0"
            aria-label="Close description"
          >
            [X]
          </button>
        </div>
        <p className="text-sm md:text-lg leading-relaxed text-gray-300 font-sans tracking-wide whitespace-pre-wrap">
          {project.description}
        </p>
        {project.technicalData ? (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-2">
            {project.technicalData.map(tech => (
              <span key={tech} className="text-[10px] md:text-xs px-3 py-1.5 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 tracking-widest shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                {tech}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4">
            {project.githubProfileUrl && (
              <a
                href={project.githubProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-4 py-2 text-xs md:text-sm border border-[#00f0ff] text-[#00f0ff] tracking-widest overflow-hidden group transition-all duration-300 hover:text-black hover:bg-[#00f0ff]"
              >
                <span className="absolute inset-0 bg-[#00f0ff]/10 opacity-0 group-hover:opacity-100 blur-md transition duration-300"></span>
                <span className="absolute inset-0 pointer-events-none">
                  <span className="absolute w-full h-[2px] bg-[#00f0ff] animate-scan"></span>
                </span>
                <span className="relative z-10">[ GITHUB_PROFILE ]</span>
              </a>
            )}
            {project.linkedInProfileUrl && (
              <a
                href={project.linkedInProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative px-4 py-2 text-xs md:text-sm border border-[#00f0ff]/60 text-[#00f0ff]/80 tracking-widest overflow-hidden group transition-all duration-300 hover:text-black hover:bg-[#00f0ff]"
              >
                <span className="absolute inset-0 bg-[#00f0ff]/10 opacity-0 group-hover:opacity-100 blur-md transition duration-300"></span>
                <span className="absolute inset-0 pointer-events-none">
                  <span className="absolute w-full h-[2px] bg-[#00f0ff] animate-scan"></span>
                </span>
                <span className="relative z-10">[ LINKEDIN_PROFILE ]</span>
              </a>
            )}
          </div>
        )}
        {(project.liveUrl || project.githubUrl) && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4 mb-2 flex-wrap items-center justify-center">

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full sm:w-auto px-4 py-2 text-xs md:text-sm border border-[#00f0ff] text-[#00f0ff] tracking-widest overflow-hidden group transition-all duration-300 hover:text-black hover:bg-[#00f0ff]"
              >
                {/* Glow layer */}
                <span className="absolute inset-0 bg-[#00f0ff]/10 opacity-0 group-hover:opacity-100 blur-md transition duration-300"></span>

                {/* Scan line */}
                <span className="absolute inset-0 pointer-events-none">
                  <span className="absolute w-full h-[2px] bg-[#00f0ff] animate-scan"></span>
                </span>

                {/* Text */}
                <span className="relative z-10">[ LIVE_SYSTEM ]</span>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full sm:w-auto px-4 py-2 text-xs md:text-sm border border-[#00f0ff]/60 text-[#00f0ff]/80 tracking-widest overflow-hidden group transition-all duration-300 hover:text-black hover:bg-[#00f0ff]"
              >
                {/* Glow layer */}
                <span className="absolute inset-0 bg-[#00f0ff]/10 opacity-0 group-hover:opacity-100 blur-md transition duration-300"></span>

                {/* Scan line */}
                <span className="absolute inset-0 pointer-events-none">
                  <span className="absolute w-full h-[2px] bg-[#00f0ff] animate-scan"></span>
                </span>

                {/* Text */}
                <span className="relative z-10">[ SOURCE_CODE ]</span>
              </a>
            )}

          </div>
        )}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff]"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00f0ff]"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00f0ff]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00f0ff]"></div>
      </div>
    </div>
  );
};

const SystemLoader = () => {
  const [progress, setProgress] = useState(0);
  const [hexData, setHexData] = useState("0x000000");

  useEffect(() => {
    // Simulate system initialization/consciousness gain
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Non-linear loading curve
        return prev + Math.random() * 5;
      });

      // Random hex generation for "boot" aesthetic
      setHexData(`0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')}`);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#010102] text-white">
      <div className="w-72 md:w-96 h-1 bg-gray-900 relative overflow-hidden rounded-full shadow-[0_0_10px_rgba(0,240,255,0.2)]">
        <div
          className="absolute left-0 top-0 h-full bg-[#00f0ff] transition-all duration-300 ease-out shadow-[0_0_15px_rgba(0,240,255,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="font-mono text-xs md:text-sm tracking-[0.3em] text-[#00f0ff] animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
          INITIALIZING REALITY ENGINE... {Math.min(100, Math.floor(progress))}%
        </div>
        <div className="font-mono text-[10px] md:text-xs text-[#38bdf8] tracking-widest opacity-80">
          MEMORY::ADDR::{hexData}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth <= 640);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 2500); // Wait for "consciousness"
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return <SystemLoader />;

  return (
    <div className="w-full h-full relative bg-[#010102]">
      <ModalOverlay />
      <Overlay />
      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={[1, 2]} // Adaptive DPR
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
            alpha: false
          }}
          camera={{ position: [0, 0, 5], fov: isMobile ? 55 : 45 }}
        >
          {/* Background color managed by Canvas to prevent transparency issues */}
          <color attach="background" args={['#010102']} />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default App;