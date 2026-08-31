import { Article, Category, User, AdSlot, AdUnit, AnalyticsData, MediaItem, NotificationJob } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Technology', slug: 'technology', description: 'Computing, software, gadgets, and tech breakthroughs', color: '#2563eb', iconName: 'Cpu', postCount: 28, isFeatured: true },
  { id: 'cat-2', name: 'AI', slug: 'ai', description: 'Artificial intelligence, LLMs, neural engines & autonomous systems', color: '#7c3aed', iconName: 'Bot', postCount: 42, isFeatured: true },
  { id: 'cat-3', name: 'Jobs', slug: 'jobs', description: 'Career openings, hiring trends, tech layoffs & remote work', color: '#059669', iconName: 'Briefcase', postCount: 19, isFeatured: true },
  { id: 'cat-4', name: 'Cyber Security', slug: 'cyber-security', description: 'Threat intel, zero-days, encryption & cloud defense', color: '#dc2626', iconName: 'ShieldAlert', postCount: 15, isFeatured: true },
  { id: 'cat-5', name: 'Automobile', slug: 'automobile', description: 'Global automotive innovations, concept cars & motorsports', color: '#ea580c', iconName: 'Car', postCount: 18, isFeatured: true },
  { id: 'cat-6', name: 'EV', slug: 'ev', description: 'Electric vehicles, next-gen batteries & charging grids', color: '#0d9488', iconName: 'Zap', postCount: 22, isFeatured: true },
  { id: 'cat-7', name: 'Cars', slug: 'cars', description: 'Sedans, SUVs, hypercars, road tests & buyer guides', color: '#475569', iconName: 'Compass', postCount: 14 },
  { id: 'cat-8', name: 'Bikes', slug: 'bikes', description: 'Superbikes, commuter e-bikes & adventure touring', color: '#ca8a04', iconName: 'Flame', postCount: 11 },
  { id: 'cat-9', name: 'Business', slug: 'business', description: 'Global corporate strategy, M&A, startups & venture capital', color: '#0284c7', iconName: 'TrendingUp', postCount: 31, isFeatured: true },
  { id: 'cat-10', name: 'Finance', slug: 'finance', description: 'Markets, fintech, cryptocurrencies & central bank policy', color: '#16a34a', iconName: 'Coins', postCount: 25, isFeatured: true },
  { id: 'cat-11', name: 'Entertainment', slug: 'entertainment', description: 'Global cinema, streaming wars, OTT & music industry', color: '#db2777', iconName: 'Film', postCount: 20 },
  { id: 'cat-12', name: 'Bollywood', slug: 'bollywood', description: 'Indian cinema releases, box office metrics & celebrity news', color: '#e11d48', iconName: 'Sparkles', postCount: 17 },
  { id: 'cat-13', name: 'Sports', slug: 'sports', description: 'Cricket championships, Premier League, F1, Olympics & stats', color: '#15803d', iconName: 'Trophy', postCount: 29 },
  { id: 'cat-14', name: 'Health', slug: 'health', description: 'Biotech, longevity research, medicine, wellness & nutrition', color: '#0891b2', iconName: 'Activity', postCount: 16 },
  { id: 'cat-15', name: 'Education', slug: 'education', description: 'EdTech, higher academia, entrance tests & digital learning', color: '#4f46e5', iconName: 'GraduationCap', postCount: 12 },
  { id: 'cat-16', name: 'Lifestyle', slug: 'lifestyle', description: 'Modern travel, architecture, culinary arts & work-life balance', color: '#9333ea', iconName: 'Coffee', postCount: 14 },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Elena Vance',
    email: 'elena.vance@presscore.io',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Editor-in-Chief & Founder. 15+ years covering deep tech disruption and global digital transformation.',
    permissions: ['all', 'manage_users', 'publish_posts', 'edit_posts', 'manage_ads', 'manage_seo', 'manage_settings'],
    createdAt: '2025-01-15',
    articlesCount: 48,
  },
  {
    id: 'usr-2',
    name: 'Marcus Chen',
    email: 'marcus.chen@presscore.io',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Senior Technology & AI Editor. Former algorithmic engineer turned investigative science writer.',
    permissions: ['publish_posts', 'edit_posts', 'delete_posts', 'manage_media', 'manage_seo'],
    createdAt: '2025-02-10',
    articlesCount: 32,
  },
  {
    id: 'usr-3',
    name: 'Aria Thorne',
    email: 'aria.t@presscore.io',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    bio: 'Automotive & EV Columnist. Specialist in next-gen solid-state batteries and autonomous mobility.',
    permissions: ['create_posts', 'edit_own_posts', 'upload_media'],
    createdAt: '2025-03-01',
    articlesCount: 19,
  },
  {
    id: 'usr-4',
    name: 'Devon Patel',
    email: 'devon.p@presscore.io',
    role: 'contributor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bio: 'Finance & Career Analyst. Tracking corporate hiring cycles, venture rounds, and economic policy.',
    permissions: ['create_posts', 'submit_for_review'],
    createdAt: '2025-04-12',
    articlesCount: 8,
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Autonomous AI Agents Surge in Enterprise: The Next Wave of Workplace Transformation',
    slug: 'autonomous-ai-agents-surge-enterprise-workplace-transformation',
    excerpt: 'Enterprises worldwide are deploying multi-agent reasoning networks to automate high-complexity workflows, driving a 40% jump in operational velocity.',
    category: 'AI',
    subCategory: 'Enterprise Intelligence',
    tags: ['AI', 'Enterprise', 'Automation', 'Machine Learning', 'Future of Work'],
    author: {
      id: 'usr-2',
      name: 'Marcus Chen',
      role: 'Senior Technology Editor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Investigative tech analyst.'
    },
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Neural orchestration architectures are replacing static software pipelines across Fortune 500 operations.',
    status: 'published',
    publishedAt: '2026-08-31T06:15:00.000Z',
    updatedAt: '2026-08-31T06:45:00.000Z',
    readTimeMinutes: 5,
    views: 14820,
    likes: 642,
    shares: 284,
    bookmarksCount: 410,
    isBreaking: true,
    isTrending: true,
    isEditorPick: true,
    inshortsSummary: 'Autonomous multi-agent AI ecosystems are fundamentally replacing static business software. Global enterprise surveys reveal a 40% surge in throughput for compliance, software verification, and customer intelligence. Industry leaders project autonomous agents will coordinate over $1.2T in digital supply chains by 2028, fundamentally redefining knowledge worker roles.',
    seo: {
      metaTitle: 'Autonomous AI Agents in Enterprise: 2026 Workplace Transformation Report',
      metaDescription: 'How multi-agent AI architectures are revolutionizing enterprise workflows, slashing cycle times by 40%, and redefining knowledge work.',
      focusKeywords: ['autonomous AI agents', 'enterprise AI 2026', 'workplace automation', 'generative AI operations'],
      googleNewsHeadline: 'Autonomous AI Agents Accelerate in Enterprise: 40% Efficiency Gains Reported',
      seoScore: 96,
      readabilityScore: 91,
      schemaType: 'NewsArticle',
      recommendations: [
        'Excellent inclusion of data points in opening paragraphs.',
        'High semantic density for enterprise AI keywords.',
        'Structured schema ready for Google Discover carousel.'
      ]
    },
    content: `## The Rise of Agentic Architectures

Over the past six months, the enterprise technology landscape has crossed a critical threshold: the transition from single-prompt chatbots to **autonomous multi-agent coordination frameworks**. Organizations are no longer satisfied with static question-and-answer interfaces; they are operationalizing autonomous software entities capable of reasoning, validating, and executing complex multi-step objectives without continuous human micromanagement.

### Why Deterministic Pipelines are Yielding to Autonomous Teams

Traditional enterprise software relies on rigid decision trees. When an edge case arises, human operators must intervene. In contrast, modern agentic swarms:

- **Deconstruct Macro Objectives**: An orchestration model breaks complex initiatives into parallel sub-tasks.
- **Self-Correct in Real Time**: Sub-agents cross-verify output against strict internal guardrails before executing database transactions.
- **Interface Natively with Legacy Systems**: Utilizing tool-use protocols, agents write SQL queries, ping ERP APIs, and draft executive summaries seamlessly.

> "We are moving from an era where software was a passive tool to an era where software is an active, collaborative colleague with verifiable accountability." — Dr. Jonathan Vance, Director of Applied Systems

\`\`\`json
{
  "agentTopology": "hierarchical-mesh",
  "consensusProtocol": "multi-evaluator-check",
  "averageTaskLatencyMs": 340,
  "accuracyRate": 0.994
}
\`\`\`

## Economic Impact and Workforce Evolution

Recent industry filings indicate that early enterprise adopters have compressed quarterly financial reconciliations from three weeks to under forty-eight hours. However, this velocity shift brings urgent governance requirements.

1. **Auditability & Traceability**: Every agent decision node must be logged with tamper-evident cryptographic proofs.
2. **Human-in-the-Loop Thresholds**: High-liability actions (such as capital disbursements exceeding set bounds) mandate explicit cryptographic signing from designated human supervisors.
3. **Reskilling Imperatives**: The highest-performing teams are actively retraining domain specialists to act as "Agent Directors" rather than manual data processors.

### What Lies Ahead

As frontier models become faster and lighter, edge-deployed agent networks will begin orchestrating physical robotic cells and real-time logistics. For decision-makers, the mandate is clear: build robust data scaffolding today to support autonomous execution tomorrow.`,
    comments: [
      {
        id: 'c-1',
        articleId: 'art-1',
        userName: 'Siddharth Nair',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        content: 'The section on cryptographic audit trails is spot on. Without deterministic logging, enterprise compliance teams will never sign off on autonomous deployments.',
        createdAt: '2 hours ago',
        likes: 18,
        replies: [
          {
            id: 'c-1-1',
            articleId: 'art-1',
            userName: 'Marcus Chen',
            userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            content: 'Exactly, Siddharth. In fact, EU and US regulatory frameworks are already drafting mandatory provenance requirements for autonomous agent commits.',
            createdAt: '1 hour ago',
            likes: 9
          }
        ]
      },
      {
        id: 'c-2',
        articleId: 'art-1',
        userName: 'Clara Oswald',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        content: 'Fascinating breakdown. We implemented agentic ticket triage last month and saw customer response times drop by 65%.',
        createdAt: '35 mins ago',
        likes: 7
      }
    ]
  },
  {
    id: 'art-2',
    title: 'Solid-State Battery Breakthrough: Next-Gen EVs Set for 900-Mile Range on 10-Minute Charge',
    slug: 'solid-state-battery-breakthrough-900-mile-ev-range',
    excerpt: 'Breakthrough ceramic electrolytes eliminate dendrite degradation, opening the floodgates for mass manufacturing of ultra-dense solid-state cells.',
    category: 'EV',
    subCategory: 'Battery Tech',
    tags: ['EV', 'Automobile', 'Battery Tech', 'Clean Energy', 'Technology'],
    author: {
      id: 'usr-3',
      name: 'Aria Thorne',
      role: 'Automotive & EV Columnist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Silicon-doped solid electrolytes achieve unprecedented volumetric energy densities above 500 Wh/kg.',
    status: 'published',
    publishedAt: '2026-08-31T05:30:00.000Z',
    updatedAt: '2026-08-31T05:50:00.000Z',
    readTimeMinutes: 4,
    views: 11200,
    likes: 512,
    shares: 310,
    bookmarksCount: 290,
    isBreaking: false,
    isTrending: true,
    isEditorPick: true,
    inshortsSummary: 'Commercial solid-state battery manufacturing has taken a massive leap forward. A new ceramic-matrix cell achieves 520 Wh/kg energy density, enabling 900 miles of driving range on a single charge. Thermal runaway risks are virtually eliminated, allowing high-voltage 800V DC hypercharging from 10% to 80% in just under 10 minutes.',
    seo: {
      metaTitle: '900-Mile Solid-State EV Battery Breakthrough Unveiled',
      metaDescription: 'New solid-state ceramic electrolyte batteries achieve 520 Wh/kg density, delivering 900 miles of EV range with 10-minute fast charging.',
      focusKeywords: ['solid state battery', 'EV range breakthrough', 'fast charging 10 minutes', 'electric vehicles 2026'],
      googleNewsHeadline: 'Solid-State Battery Milestone: 900 Miles Range and 10-Minute Hypercharging',
      seoScore: 94,
      readabilityScore: 89,
      schemaType: 'NewsArticle'
    },
    content: `## The Solid-State Revolution Arrives

Automotive engineers have long heralded the solid-state battery as the holy grail of electric mobility. Today, pilot production data from major manufacturing consortia confirms that the primary technical hurdles—interfacial resistance and dendrite short-circuiting—have been systematically resolved.

### Key Metrics of the Breakthrough Cell

- **Energy Density**: 520 Wh/kg (vs ~270 Wh/kg in current lithium-ion packs).
- **Charging Curve**: 10% to 80% State of Charge in **9 minutes, 45 seconds** without thermal degradation.
- **Cycle Longevity**: Retains 91% capacity after 3,000 deep charge-discharge cycles.
- **Operating Temperature Range**: Stable from -35°C to 65°C without auxiliary heating.

> "By replacing flammable liquid solvent electrolytes with an elastic inorganic ceramic barrier, we have eliminated thermal runaway while doubling volumetric efficiency." — Dr. Helga Lindqvist, Chief Materials Scientist

### Commercial Timeline and Consumer Impact

Automakers have already scheduled flagship sedan and SUV platforms for delivery starting early next year. With range anxiety effectively neutralized, global charging infrastructure can transition from massive parking-lot banks to high-throughput highway transit corridors reminiscent of traditional fueling stations.`,
    comments: [
      {
        id: 'c-3',
        articleId: 'art-2',
        userName: 'Kenji Sato',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        content: 'If production yields hold at scale, this completely resets the competitive landscape between ICE and EV.',
        createdAt: '4 hours ago',
        likes: 12
      }
    ]
  },
  {
    id: 'art-3',
    title: 'Global Tech Hiring Index: High-Impact Roles in Demand as AI Specialization Dominates 2026',
    slug: 'global-tech-hiring-index-ai-specialization-2026',
    excerpt: 'New employment data highlights record-breaking compensation for AI alignment researchers, distributed systems architects, and cyber resilience engineers.',
    category: 'Jobs',
    subCategory: 'Career Trends',
    tags: ['Jobs', 'Technology', 'AI', 'Business', 'Career'],
    author: {
      id: 'usr-4',
      name: 'Devon Patel',
      role: 'Finance & Career Analyst',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Engineering compensation packages are pivoting toward systems orchestration, security validation, and AI alignment specialists.',
    status: 'published',
    publishedAt: '2026-08-30T14:20:00.000Z',
    updatedAt: '2026-08-30T16:00:00.000Z',
    readTimeMinutes: 4,
    views: 8940,
    likes: 388,
    shares: 195,
    bookmarksCount: 320,
    isBreaking: false,
    isTrending: false,
    isEditorPick: true,
    inshortsSummary: 'The 2026 Global Tech Hiring Index reveals a dramatic bifurcation in software talent markets. While junior manual coding roles face automated contraction, compensation for AI alignment engineers, distributed GPU systems architects, and security red-teamers has surged by 28% year-over-year. Remote-first compensation parity has solidified across top-tier international hubs.',
    seo: {
      metaTitle: '2026 Tech Hiring Index: Top In-Demand Engineering & AI Roles',
      metaDescription: 'Comprehensive report on global tech hiring trends, high-paying AI engineering roles, and compensation benchmarks for 2026.',
      focusKeywords: ['tech jobs 2026', 'AI engineer salaries', 'remote software hiring', 'cyber security careers'],
      googleNewsHeadline: 'Tech Hiring Index 2026: AI Specialization Drives 28% Salary Premium',
      seoScore: 92,
      readabilityScore: 88,
      schemaType: 'NewsArticle'
    },
    content: `## Shifting Realities in Tech Employment

The global software engineering employment landscape is undergoing its most profound reallocation in two decades. Aggregate headcount figures conceal a crucial dynamic: the rapid replacement of boilerplate programming with high-leverage systems orchestration and safety architecture.

### Top 5 Most In-Demand Profiles in 2026

1. **AI Safety & Alignment Engineers**: Designing verifiable containment protocols and bias auditing algorithms ($240k–$420k base).
2. **Distributed GPU Infrastructure Architects**: Optimizing cluster interconnects, kernel scheduling, and memory bandwidth across tens of thousands of compute nodes.
3. **Autonomous Systems Integration Leads**: Bridging foundational models with legacy industrial hardware and banking ledgers.
4. **Post-Quantum Cryptography Analysts**: Upgrading enterprise cipher suites to NIST-approved post-quantum standards.
5. **Applied Domain Translators**: Medical, legal, and financial veterans who translate deep industry requirements into structured validation datasets.

## The Remote Work Equilibrium

Following years of corporate policy oscillations, 72% of top-tier software organizations have established formal hybrid or remote-first agreements. Compensation parity across global time zones has narrowed the geographic wage gap significantly, driving venture-backed hiring into expanding hubs in Bangalore, Warsaw, São Paulo, and Austin.`,
    comments: []
  },
  {
    id: 'art-4',
    title: 'Zero-Day Threat Defense: How Post-Quantum Encryption is Securing Global Financial Rails',
    slug: 'post-quantum-encryption-securing-global-financial-rails',
    excerpt: 'Central banks and tier-1 clearinghouses accelerate quantum-resistant cryptographic upgrades to defend against harvest-now, decrypt-later threats.',
    category: 'Cyber Security',
    subCategory: 'Quantum Defense',
    tags: ['Cyber Security', 'Finance', 'Technology', 'Encryption'],
    author: {
      id: 'usr-1',
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Lattice-based cryptography algorithms are replacing RSA and ECC standards across cross-border settlement networks.',
    status: 'published',
    publishedAt: '2026-08-30T10:00:00.000Z',
    updatedAt: '2026-08-30T11:15:00.000Z',
    readTimeMinutes: 6,
    views: 7420,
    likes: 290,
    shares: 140,
    bookmarksCount: 210,
    inshortsSummary: 'Global financial networks have fast-tracked migration to lattice-based post-quantum cryptography. With quantum hardware milestones threatening traditional RSA key exchanges, international payment consortiums have successfully deployed ML-KEM algorithms across 40,000 real-time nodes, neutralizing state-sponsored "Harvest Now, Decrypt Later" espionage campaigns.',
    seo: {
      metaTitle: 'Post-Quantum Encryption Upgrades Secure Global Banking Rails',
      metaDescription: 'How central clearinghouses and international banks are rolling out lattice-based cryptography to neutralize quantum decryption threats.',
      focusKeywords: ['post quantum cryptography', 'cyber security banking', 'quantum resistant encryption', 'NIST lattice algorithms'],
      googleNewsHeadline: 'Banks Deploy Post-Quantum Cryptography Across Global Settlement Rails',
      seoScore: 95,
      readabilityScore: 86,
      schemaType: 'NewsArticle'
    },
    content: `## The Race Against Cryptographic Obsolescence

For decades, the global financial system has relied on the mathematical difficulty of prime factorization (RSA) and discrete logarithms (ECC) to encrypt trillions in daily transactions. With quantum testbeds scaling qubit counts, the window to prevent catastrophic systemic exposure has narrowed.

### The Strategy: Lattice-Based Cryptographic Standardization

Leading financial networks have completed the first nationwide transition to NIST-standardized lattice schemes, specifically **ML-KEM (formerly Kyber)** for key encapsulation and **ML-DSA (Dilithium)** for digital signatures.

- **Resistant to Shor\'s Algorithm**: High-dimensional geometric lattices remain computationally intractable for both classical supercomputers and fault-tolerant quantum processors.
- **Zero-Latency Overhead**: Optimized hardware accelerators execute lattice key exchanges in under 1.2 milliseconds.
- **Backward Compatibility**: Hybrid certificates encapsulate both classical elliptic curves and post-quantum keys during the multi-year transitional window.

### Looking Ahead

As financial regulators establish mandatory compliance dates for end-to-end post-quantum compliance, focus shifts to consumer mobile banking applications, hardware tokens, and decentralized ledger networks.`,
    comments: []
  },
  {
    id: 'art-5',
    title: 'Box Office Resurgence: Immersive Cinema and High-Frame-Rate Projection Drive Historic Returns',
    slug: 'box-office-resurgence-immersive-cinema-returns',
    excerpt: 'Theatrical distribution hits record quarterly revenues as audiences favor sensory-rich IMAX laser formats, curated event experiences, and original epics.',
    category: 'Entertainment',
    subCategory: 'Cinema Trends',
    tags: ['Entertainment', 'Bollywood', 'Business', 'Lifestyle'],
    author: {
      id: 'usr-1',
      name: 'Elena Vance',
      role: 'Editor-in-Chief',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Premium large format screens now account for over 38% of global opening weekend box office receipts.',
    status: 'published',
    publishedAt: '2026-08-29T18:00:00.000Z',
    updatedAt: '2026-08-29T18:30:00.000Z',
    readTimeMinutes: 3,
    views: 6310,
    likes: 312,
    shares: 180,
    bookmarksCount: 95,
    inshortsSummary: 'Global theatrical box office receipts have rebounded to pre-pandemic highs, driven by premium immersive formats. Audiences are overwhelmingly selecting IMAX Laser, Dolby Cinema, and curated event screenings over home streaming for tentpole releases. Premium large format auditoriums generated 42% higher revenue per seat, prompting major studio reinvestment in spectacle cinema.',
    seo: {
      metaTitle: 'Global Box Office Hits Record Highs Fueled by Immersive Formats',
      metaDescription: 'How IMAX laser technology, premium audio, and event-based spectacle storytelling are revitalizing the global theatrical movie industry.',
      focusKeywords: ['box office 2026', 'IMAX revenue surge', 'cinema industry trends', 'movie theater resurgence'],
      googleNewsHeadline: 'Box Office Hits Record High as Premium Immersive Theaters Dominate',
      seoScore: 91,
      readabilityScore: 92,
      schemaType: 'NewsArticle'
    },
    content: `## The Spectacle Effect

Reports of the death of the movie theater were premature. New quarterly financial disclosures from multinational theater chains demonstrate that cinema has completed a decisive evolution from a casual commodity into an experiential luxury outing.

### The Numbers Behind the Revival

- **Premium Large Format (PLF) Share**: Accounts for 39% of total global gross despite representing only 14% of physical screens.
- **Average Concession Spend**: Up 24%, driven by curated artisanal menus and limited-edition collector merchandise.
- **Repeat Attendance**: 32% of survey respondents viewed blockbuster features in theaters more than once during the primary theatrical run.

### Why Streaming Fatigue Favors the Big Screen

Industry analysts observe that saturated streaming libraries have caused content choice paralysis at home. In contrast, the cinematic environment offers undivided sensory immersion, spatial Dolby Atmos audio, and communal cultural bonding that living rooms cannot replicate.`,
    comments: []
  },
  {
    id: 'art-6',
    title: 'Fintech 3.0: Unified Cross-Border QR Rails Eliminate Multi-Currency Remittance Friction',
    slug: 'fintech-cross-border-qr-rails-remittance-friction',
    excerpt: 'Southeast Asian and South Asian interlinked payment protocols enable instant merchant settlement with near-zero foreign exchange spreads.',
    category: 'Finance',
    subCategory: 'Digital Banking',
    tags: ['Finance', 'Business', 'Technology', 'Jobs'],
    author: {
      id: 'usr-4',
      name: 'Devon Patel',
      role: 'Finance Analyst',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    featuredImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Real-time bilateral settlement networks enable cross-border travelers and micro-merchants to bypass traditional card interchange fees.',
    status: 'published',
    publishedAt: '2026-08-29T12:00:00.000Z',
    updatedAt: '2026-08-29T12:45:00.000Z',
    readTimeMinutes: 4,
    views: 5120,
    likes: 215,
    shares: 98,
    bookmarksCount: 145,
    inshortsSummary: 'Unified instant payment rails like UPI, PayNow, and PromptPay have achieved complete cross-border interoperability. Travelers and migrant workers can now scan native merchant QR codes across 12 countries with instantaneous settlement at wholesale interbank FX rates, effectively dismantling legacy 3% credit card processing fees.',
    seo: {
      metaTitle: 'Cross-Border Real-Time QR Payments Transform Global Remittances',
      metaDescription: 'How interlinked real-time payment rails are cutting international transfer costs to zero and empowering small merchants worldwide.',
      focusKeywords: ['cross border payments', 'UPI PayNow linkage', 'instant remittance', 'fintech 2026'],
      googleNewsHeadline: 'Cross-Border QR Rails Deliver Instant Settlement and Wholesale FX Rates',
      seoScore: 93,
      readabilityScore: 90,
      schemaType: 'NewsArticle'
    },
    content: `## Dismantling Legacy Payment Tollbooths

For decades, international retail payments and peer-to-peer remittances were burdened by multi-hop correspondent banking, T+3 settlement latency, and opaque foreign exchange markups reaching 5-7%. Today, bilateral real-time payment rail integrations have dismantled those barriers.

### Instant Settlement Architecture

1. **Direct Central Bank Gateway**: Central banks maintain pre-funded liquidity corridors, settling transactions via ISO 20022 message streams in 800 milliseconds.
2. **Wholesale Interbank FX**: End users receive live mid-market exchange rates without hidden tourist markups.
3. **Zero Card Hardware Required**: Local street vendors and boutique hotels accept international payments using standard printed QR placards.

### The Competitive Response

Traditional card schemes and legacy wire transfer operators are reacting by cutting fees and launching proprietary instant payment APIs. However, the open, sovereign-backed network architecture continues to gain market share across expanding regional trading blocs.`,
    comments: []
  }
];

export const INITIAL_ADS: AdSlot[] = [
  {
    id: 'ad-top-leaderboard',
    name: 'Top Header Leaderboard (728x90 / Responsive)',
    type: 'leaderboard',
    enabled: true,
    cpm: 4.85,
    impressions: 48200,
    clicks: 1420,
    revenue: 233.77,
    advertiserName: 'Google Cloud & AI Studio Solutions',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80',
    targetUrl: 'https://ai.google.dev'
  },
  {
    id: 'ad-article-infeed',
    name: 'In-Article Native Sponsored Unit',
    type: 'in_article',
    enabled: true,
    cpm: 6.20,
    impressions: 31400,
    clicks: 1890,
    revenue: 194.68,
    advertiserName: 'NextGen Autonomous Workflows',
    bannerImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    targetUrl: 'https://cloud.google.com'
  },
  {
    id: 'ad-sidebar-sticky',
    name: 'Sidebar Sticky Skyscraper (300x600)',
    type: 'sidebar',
    enabled: true,
    cpm: 3.90,
    impressions: 22100,
    clicks: 840,
    revenue: 86.19,
    advertiserName: 'CyberShield Quantum Firewall Pro',
    bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80',
    targetUrl: 'https://security.google.com'
  }
];

export const INITIAL_ANALYTICS: AnalyticsData = {
  totalViews: 142850,
  uniqueVisitors: 68420,
  readTimeAvgMinutes: 3.8,
  sharesCount: 5410,
  aiTokensUsed: 1845200,
  newsletterSubscribers: 14250,
  estimatedRevenue: 1248.50,
  realtimeActiveUsers: 342,
  dailyViews: [
    { date: 'Aug 25', views: 18200, visitors: 8900 },
    { date: 'Aug 26', views: 21400, visitors: 10400 },
    { date: 'Aug 27', views: 19800, visitors: 9600 },
    { date: 'Aug 28', views: 24500, visitors: 11800 },
    { date: 'Aug 29', views: 26800, visitors: 13100 },
    { date: 'Aug 30', views: 29400, visitors: 14200 },
    { date: 'Aug 31', views: 31200, visitors: 15420 },
  ],
  topCategories: [
    { category: 'AI', count: 42, percentage: 38 },
    { category: 'Technology', count: 28, percentage: 24 },
    { category: 'EV', count: 22, percentage: 16 },
    { category: 'Finance', count: 25, percentage: 12 },
    { category: 'Jobs', count: 19, percentage: 10 },
  ],
  trafficSources: [
    { source: 'Google News / Search', percentage: 48, color: '#2563eb' },
    { source: 'WhatsApp Shares & Direct', percentage: 26, color: '#16a34a' },
    { source: 'Social (X / LinkedIn / Reddit)', percentage: 16, color: '#9333ea' },
    { source: 'Email Newsletter', percentage: 10, color: '#ea580c' },
  ],
  deviceBreakdown: [
    { device: 'Mobile', percentage: 64 },
    { device: 'Desktop', percentage: 31 },
    { device: 'Tablet', percentage: 5 },
  ]
};

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    filename: 'ai-agents-enterprise.jpg',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    folder: 'articles',
    sizeBytes: 420100,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-08-31',
    altText: 'Autonomous AI agents neural cluster visualization',
    dimensions: '1920x1080'
  },
  {
    id: 'med-2',
    filename: 'solid-state-ev-pack.jpg',
    url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
    folder: 'articles',
    sizeBytes: 512000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-08-31',
    altText: 'Electric vehicle hypercharger battery pack testbed',
    dimensions: '1920x1080'
  },
  {
    id: 'med-3',
    filename: 'post-quantum-encryption.jpg',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    folder: 'seo-images',
    sizeBytes: 380400,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-08-30',
    altText: 'Server racks with cryptographic quantum lattice visual',
    dimensions: '1600x900'
  },
  {
    id: 'med-4',
    filename: 'tech-careers-office.jpg',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    folder: 'articles',
    sizeBytes: 460000,
    mimeType: 'image/jpeg',
    uploadedAt: '2026-08-30',
    altText: 'Engineering team collaborating on architecture roadmap',
    dimensions: '1920x1080'
  }
];

export const MOCK_CATEGORIES = INITIAL_CATEGORIES;
export const MOCK_USERS = INITIAL_USERS;
export const MOCK_ARTICLES = INITIAL_ARTICLES;

export const MOCK_ADS: AdUnit[] = [
  {
    id: 'ad-top-leaderboard',
    name: 'Top Header Leaderboard (728x90)',
    placement: 'leaderboard',
    slotCode: 'slot-hdr-72890',
    dimensions: '728x90',
    isActive: true,
    impressions: 48200,
    clicks: 1420,
    revenueUsd: 233.77,
  },
  {
    id: 'ad-article-infeed',
    name: 'In-Article Native Sponsored Unit',
    placement: 'in_article',
    slotCode: 'slot-art-native',
    dimensions: '300x250 / Fluid',
    isActive: true,
    impressions: 31400,
    clicks: 1890,
    revenueUsd: 194.68,
  },
  {
    id: 'ad-sidebar-sticky',
    name: 'Sidebar Sticky Skyscraper (300x600)',
    placement: 'sidebar',
    slotCode: 'slot-sb-sticky',
    dimensions: '300x600',
    isActive: true,
    impressions: 22100,
    clicks: 840,
    revenueUsd: 86.19,
  }
];

export const MOCK_MEDIA = INITIAL_MEDIA;
export const MOCK_ANALYTICS = INITIAL_ANALYTICS;

