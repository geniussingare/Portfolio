export const profile = {
  name: "Ganesh Singare",
  firstName: "Ganesh",
  lastName: "Singare",
  title: "Backend Engineer",
  roles: [
    "Backend Engineer",
    "Java & Spring Boot Developer",
    "Microservices Architect",
    "AI / RAG Integrator",
  ],
  tagline:
    "I design and ship scalable, production-grade Java systems — from schema to API to deployment.",
  summary:
    "Backend Engineer with 3+ years of experience designing and shipping scalable, production-grade Java systems for enterprise and AI-integrated applications. Skilled in microservices architecture, high-throughput REST APIs, and secure, cloud-deployed services. Comfortable owning a feature end-to-end — from schema design through API implementation, testing, and deployment — with a strong focus on performance, reliability, and clean architecture.",
  location: "India",
  phone: "+91-8552926188",
  email: "geniussingare@gmail.com",
  linkedin: "https://linkedin.com/in/geniussingare",
  github: "https://github.com/geniussingare",
  resume: "/Ganesh_Singare_Resume.pdf",
};

export const stats = [
  { value: "3+", label: "Years building backends" },
  { value: "80%", label: "Faster search (60 s → 12 s)" },
  { value: "70%", label: "Faster test-case loading" },
  { value: "15", label: "Trace levels, no longer crashing" },
];

export type SkillGroup = {
  title: string;
  icon: string;
  items: string[];
  span?: "wide" | "tall";
};

export const skills: SkillGroup[] = [
  {
    title: "Backend",
    icon: "server",
    span: "wide",
    items: [
      "Spring Boot",
      "Spring MVC",
      "Spring Data JPA",
      "Hibernate",
      "REST APIs",
      "Microservices",
    ],
  },
  { title: "Languages", icon: "code", items: ["Java", "JavaScript", "SQL"] },
  {
    title: "Databases & Caching",
    icon: "database",
    items: ["MS SQL Server", "SQL Server Full-Text Search", "MySQL", "PostgreSQL", "Redis"],
  },
  {
    title: "AI / ML",
    icon: "sparkles",
    items: ["RAG Systems", "OpenAI API", "Semantic Search", "LLM Integration"],
  },
  {
    title: "Security",
    icon: "shield",
    items: ["Spring Security", "JWT", "OAuth2"],
  },
  {
    title: "Cloud & DevOps",
    icon: "cloud",
    items: ["AWS S3", "Docker", "Git", "Maven"],
  },
  {
    title: "Frontend",
    icon: "layout",
    items: ["React.js", "Redux", "Next.js"],
  },
  {
    title: "Testing & Tools",
    icon: "flask",
    items: ["JUnit", "Testcontainers", "Postman", "AQtime profiling"],
  },
  {
    title: "Core Concepts",
    icon: "cpu",
    span: "wide",
    items: [
      "OOP",
      "Data Structures & Algorithms",
      "Multithreading",
      "Distributed Systems",
      "System Design",
      "RESTful API Design",
      "Scalability",
      "Performance Optimization",
      "Query Optimization",
      "Legacy Modernization",
      "Agile / Scrum",
    ],
  },
];

export type Metric = { before: string; after: string; label: string };

export type WorkItem = {
  title: string;
  text: string;
  tags: string[];
  metric?: Metric;
};

export type Role = {
  role: string;
  period: string;
  accent: "violet" | "cyan";
  items: WorkItem[];
};

export const experience: {
  company: string;
  product: string;
  period: string;
  roles: Role[];
} = {
  company: "Novatech Software Pvt. Ltd.",
  product: "TopTeam — enterprise requirements & test management platform",
  period: "June 2023 — Present",
  roles: [
    {
      role: "Associate Software Developer",
      period: "Jun 2025 — Present",
      accent: "violet",
      items: [
        {
          title: "Traceability Engine",
          metric: { before: "Crashed", after: "~3.5 min", label: "15-level traces on large datasets" },
          text: "Re-designed the legacy traceability manager: replaced static “load-everything” queries with dynamic SQL that fetches only the requested filters and trace levels, and moved multi-level processing into SQL Server temp tables with de-duplication and reuse of traced links — with far lower server load.",
          tags: ["SQL Server", "Dynamic SQL", "Temp tables", "Query design"],
        },
        {
          title: "Test Management Performance",
          metric: { before: "~2.5 min", after: "<50 s", label: "Load time for 1,000 test cases (~70% faster)" },
          text: "Re-architected the module's backend using AQtime profiling and SQL query optimization.",
          tags: ["Profiling", "SQL optimization", "Backend architecture"],
        },
        {
          title: "AI Vector Context Framework (RAG)",
          text: "Built a framework integrated with the OpenAI API that retrieves relevant TopTeam artifacts as context, letting AI generate new artifacts, power semantic search and assist with requirements engineering.",
          tags: ["RAG", "OpenAI API", "Semantic search", "Vector context"],
        },
        {
          title: "Variant Management",
          text: "Owned the complete backend of a new feature assigned by the VP of Technology — configuring and categorizing requirements by product variant and generating new requirement sets per variant — working with the web team on the frontend.",
          tags: ["Feature ownership", "Data modelling", "Cross-team"],
        },
        {
          title: "Auditing & Versioning",
          text: "Introduced full audit trails and versioning in Test Management, giving compliance-driven customers change history and data integrity.",
          tags: ["Audit trails", "Versioning", "Data integrity"],
        },
        {
          title: "Jira & Azure DevOps Integrations",
          text: "Added comment synchronization and automated email alerts on sync success or failure.",
          tags: ["Jira", "Azure DevOps", "Integrations"],
        },
      ],
    },
    {
      role: "Junior Software Developer",
      period: "Jun 2023 — May 2025",
      accent: "cyan",
      items: [
        {
          title: "Full-Text Search",
          metric: { before: "60 s", after: "12 s", label: "Search time (80% faster, more accurate)" },
          text: "Built a background text-indexing service that moved TopTeam from legacy word-per-row search to SQL Server Full-Text Search, indexing records in real time on change without blocking the main thread.",
          tags: ["SQL Server FTS", "Background indexing", "Real-time"],
        },
        {
          title: "Email Notification Service",
          text: "Migrated the service from a legacy 3-tier architecture to REST and re-designed it as a scalable singleton background service any module can call to send real-time emails without affecting the main application.",
          tags: ["REST", "Background service", "Legacy migration"],
        },
        {
          title: "Server Monitoring Service",
          text: "Built a service that checks the health of the REST server and its background services through a 3-tier connector, diagnoses failures and sends system admins clear, log-backed error reports.",
          tags: ["Health checks", "Diagnostics", "Alerting"],
        },
        {
          title: "REST APIs, end to end",
          text: "Built new REST APIs and delivered features end to end on Microsoft SQL Server.",
          tags: ["REST APIs", "MS SQL Server", "End-to-end delivery"],
        },
      ],
    },
  ],
};

export type Project = {
  title: string;
  subtitle: string;
  badge: string;
  stack: string[];
  points: string[];
  repo?: string;
  live?: string;
  visual?: "orbit" | "architecture";
};

/** Featured projects get a large card with a visual; the rest render in a grid. */
export const featuredProjects: Project[] = [
  {
    title: "TheOrbit",
    subtitle: "A radial quick menu around your cursor",
    badge: "Featured · Desktop app · Rust",
    stack: ["Rust", "macOS", "Windows", "Linux (X11)", "GitHub Actions"],
    points: [
      "Hold right-click anywhere and a ring of apps and actions springs open around the pointer — release to run one.",
      "Native Rust with no web view: ~16 MB resident and 0% CPU while idle.",
      "Cross-platform core crates (macOS, Windows, Linux) designed for future mobile reuse.",
      "Configurable apps, websites, files, shortcuts and shell commands; motion respects the OS Reduce Motion setting.",
    ],
    repo: "https://github.com/geniussingare/theOrbit",
    live: "https://theorbit.vercel.app/",
    visual: "orbit",
  },
  {
    title: "E-Commerce Platform",
    subtitle: "End-to-end shopping application",
    badge: "Featured · Full-stack",
    stack: ["Java", "Spring Boot", "React", "MySQL", "JWT"],
    points: [
      "Full-stack app supporting product catalog, cart, and order workflows.",
      "REST APIs for user, product, and order management with clear separation of concerns.",
      "JWT authentication for secure, stateless access control.",
      "Optimized database schema and queries, improving response times under load.",
    ],
    visual: "architecture",
  },
];

export const moreProjects: Project[] = [
  {
    title: "Easy Mentor",
    subtitle: "Learning-platform REST API",
    badge: "Java",
    stack: ["Spring Boot", "Spring Security", "JWT", "Flyway", "OpenAPI"],
    points: [
      "Course → section → lesson model with quizzes, attempts, enrollments and per-lesson progress tracking.",
      "JWT authentication/authorization filters, password reset flow, versioned DB migrations and Swagger docs.",
    ],
    repo: "https://github.com/geniussingare/Easy_Mentor",
  },
  {
    title: "Music-Link",
    subtitle: "Universal music sharing",
    badge: "JavaScript",
    stack: ["React", "Vite", "Node.js", "Express", "Spotify API"],
    points: [
      "Paste a track link from any streaming service and resolve the same song on Spotify, Apple Music, Deezer, YouTube Music, JioSaavn and more.",
      "Express backend aggregating Spotify, Deezer and MusicBrainz with in-memory caching; artwork-driven theming.",
    ],
    repo: "https://github.com/geniussingare/SharePlay",
  },
  {
    title: "Dinosaur Exploder",
    subtitle: "Arcade shoot 'em up — feature work",
    badge: "Java",
    stack: ["Java", "FXGL", "Game dev"],
    points: [
      "Built gameplay features on a fork of the open-source Java/FXGL arcade game.",
      "Added cannon and weapon power-up drops, hold-to-auto-fire, and VS Code run docs.",
    ],
    repo: "https://github.com/geniussingare/dinosaur-exploder",
    live: "https://dinosaur-exploder.vercel.app/",
  },
];

export const achievements = [
  {
    title: "Cheers to Peers Award",
    date: "Jan 2025",
    detail: "Recognized for exceptional performance and consistent delivery.",
  },
];

export const education = {
  degree: "B.Tech in Computer Science & Engineering",
  school: "Dr. Babasaheb Ambedkar Technological University (DBATU)",
  period: "2020 — 2023",
  score: "CGPA 8.9 / 10",
};

export const certifications = [
  { title: "Full-Stack Development (MERN)", issuer: "100xDevs" },
  { title: "Android Application Development", issuer: "Internshala" },
];
