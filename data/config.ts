export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technicalData?: string[];
  coordinates: [number, number, number]; // spatial position;
  liveUrl?: string;
  githubUrl?: string;
  githubProfileUrl?: string;
  linkedInProfileUrl?: string;
}

export interface CognitiveIdentity {
  name: string;
  role: string[];
  philosophy: string;
  corePrinciples: string[];
}

export const IDENTITY: CognitiveIdentity = {
  name: "DHRUV CHAUHAN",
  role: ["AI MERN ENGINEER", "FULL STACK DEVELOPER"],
  philosophy: "ARCHITECTING INTELLIGENT WEB ECOSYSTEMS",
  corePrinciples: [
    "AI-DRIVEN EXPERIENCES",
    "SCALABLE MERN ARCHITECTURE",
    "SEAMLESS USER INTERFACES"
  ]
};

export const PROJECTS: Project[] = [
  {
    id: "P-01",
    title: "SYSTEM_IDENTITY",
    category: "ABOUT THE DEVELOPER",
    description: "I am Dhruv Chauhan, an AI-focused full stack engineer building production-grade systems. I specialize in backend architecture, asynchronous processing, and integrating large language models into real-world applications with scalable design.",
    technicalData: ["MERN STACK", "AI INTEGRATION", "SYSTEM ARCHITECTURE"],
    coordinates: [0, -1, -5]
  },
  {
    id: "P-02",
    title: "[ NEUROOPS_AI ]",
    category: "AI DEVOPS SYSTEM",
    description: "AI-powered DevOps copilot that automates pull request analysis and risk detection. Built a microservices-based architecture that listens to GitHub webhooks, queues PR events using Redis (BullMQ), processes code diffs via worker services, and generates structured AI reviews with risk scoring.",
    technicalData: ["NODE.JS", "MONGODB", "REDIS", "BULLMQ", "DOCKER", "GITHUB API", "LLM"],
    coordinates: [2, 1, -25],
    liveUrl: "https://neuroops-dashboard.vercel.app",
    githubUrl: "https://github.com/dcpro8/neuroops-backend"
  },
  {
    id: "P-03",
    title: "[ NEUROFORGE_AI ]",
    category: "AI PRODUCT BLUEPRINT BUILDER",
    description: "AI-powered product builder that transforms raw ideas into structured engineering blueprints. Enforces strict JSON output across features, database design, APIs, UI structure, and roadmap generation. Designed for rapid ideation, consistency, and secure AI integration using a production-ready backend.",
    technicalData: ["REACT", "TYPESCRIPT", "NODE.JS", "EXPRESS", "MONGODB", "AI API"],
    coordinates: [-2, -2, -45],
    liveUrl: "https://neuroforge-frontend-319apyxh9-dcpro8s-projects.vercel.app",
    githubUrl: "https://github.com/dcpro8/neuroforge-backend"
  },
  {
    id: "P-04",
    title: "INITIATE_CONTACT",
    category: "COMMUNICATION PROTOCOL",
    description: "Available for collaboration, system design, and AI product development.\n\nEmail: autopilotlabs369@gmail.com\nGitHub: github.com/dcpro8\nLinkedIn: linkedin.com/in/dhruv-chauhan",
    githubProfileUrl: "https://github.com/dcpro8",
    linkedInProfileUrl: "https://linkedin.com/in/dhruv-chauhan",
    coordinates: [0, 0, -65]
  }
];

export const THEME = {
  colors: {
    void: "#010102",
    signal: "#ffffff",
    dim: "#333333",
    accent: "#a1a1aa" // Zinc-400
  }
};

// Simple event bus for modal state
export const modalState = new EventTarget();
export const openModal = (projectId: string) => {
  modalState.dispatchEvent(new CustomEvent('open', { detail: projectId }));
};
export const closeModal = () => {
  modalState.dispatchEvent(new Event('close'));
};