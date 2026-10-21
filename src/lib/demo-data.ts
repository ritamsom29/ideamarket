export interface DemoStartup {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  stage: 'IDEA' | 'MVP' | 'EARLY_STAGE' | 'GROWTH' | 'SCALING' | 'ESTABLISHED'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SUSPENDED'
  fundingType: 'BOOTSTRAPPED' | 'ANGEL' | 'SEED' | 'SERIES_A' | 'SERIES_B' | 'SERIES_C_PLUS' | 'GRANT' | 'CROWDFUNDING'
  fundingGoalINR: number
  fundingRaisedINR: number
  equityOffered: number
  location: string
  websiteUrl: string
  logoUrl: string
  coverImageUrl: string
  problemStatement: string
  solutionDescription: string
  productDescription: string
  marketOpportunity: string
  businessModel: string
  competitiveAdvantage: string
  targetCustomers: string
  useOfFunds: string
  traction: string
  monthlyRevenue: number
  monthlyActiveUsers: number
  teamSize: number
  publishedAt: string
  founder: {
    id: string
    name: string
    email: string
    image: string
    bio: string
    location: string
  }
  industries: { id: string; name: string; slug: string }[]
  teamMembers: {
    id: string
    name: string
    role: string
    bio: string
    linkedinUrl?: string
  }[]
  documents: {
    id: string
    name: string
    fileUrl: string
    fileType: string
    fileSize: number
    isPublic: boolean
    description: string
  }[]
}

export interface DemoInvestor {
  id: string
  userId: string
  name: string
  email: string
  image: string
  organization: string
  designation: string
  bio: string
  location: string
  linkedinUrl: string
  minInvestmentINR: number
  maxInvestmentINR: number
  preferredStages: string[]
  geographicFocus: string[]
  investmentThesis: string
  isProfilePublic: boolean
  showInvestmentRange: boolean
  preferredIndustries: { id: string; name: string; slug: string }[]
}

export interface DemoMentor {
  id: string
  userId: string
  name: string
  email: string
  image: string
  headline: string
  bio: string
  location: string
  linkedinUrl: string
  yearsExperience: number
  isAvailable: boolean
  maxMentees: number
  mentorshipFocus: string
  isProfilePublic: boolean
  supportedIndustries: { id: string; name: string; slug: string }[]
  expertiseAreas: string[]
}

export const DEMO_INDUSTRIES = [
  { id: 'ind-1', name: 'Fintech & Payments', slug: 'fintech-payments', icon: 'Wallet', count: 1 },
  { id: 'ind-2', name: 'Healthtech & Medtech', slug: 'healthtech-medtech', icon: 'Activity', count: 1 },
  { id: 'ind-3', name: 'Agritech', slug: 'agritech', icon: 'Sprout', count: 1 },
  { id: 'ind-4', name: 'Edtech & Upskilling', slug: 'edtech-upskilling', icon: 'GraduationCap', count: 1 },
  { id: 'ind-5', name: 'Clean Energy & Climate', slug: 'clean-energy-climate', icon: 'Zap', count: 1 },
  { id: 'ind-6', name: 'SaaS & Enterprise Tech', slug: 'saas-enterprise-tech', icon: 'Cloud', count: 1 },
  { id: 'ind-7', name: 'AI & Deeptech', slug: 'ai-deeptech', icon: 'Cpu', count: 2 },
  { id: 'ind-8', name: 'Logistics & Supply Chain', slug: 'logistics-supply-chain', icon: 'Truck', count: 2 },
  { id: 'ind-9', name: 'E-commerce & D2C', slug: 'ecommerce-d2c', icon: 'ShoppingBag', count: 1 },
]

export const DEMO_STARTUPS: DemoStartup[] = [
  {
    id: 'startup-1',
    name: 'PayFlow India',
    slug: 'payflow-india',
    tagline: 'Instant working capital & micro-reconciliation for MSME merchants',
    description: 'PayFlow empowers Tier-2 and Tier-3 merchants with automated UPI QR reconciliation, daily payout settlements, and low-interest credit lines based on cash-flow underwriting.',
    stage: 'EARLY_STAGE',
    status: 'PUBLISHED',
    fundingType: 'SEED',
    fundingGoalINR: 25000000, // 2.5 Cr
    fundingRaisedINR: 7500000,
    equityOffered: 8.5,
    location: 'Bengaluru, Karnataka',
    websiteUrl: 'https://payflow-demo.in',
    logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150',
    coverImageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200',
    problemStatement: 'Over 63 million MSMEs in India struggle with delayed vendor payments and fragmented digital settlement streams across 15+ payment apps, causing severe liquidity shortages.',
    solutionDescription: 'Unified ledger and smart gateway providing instant T+0 merchant settlements coupled with algorithmic micro-credit directly embedded in the merchant app.',
    productDescription: 'Hardware-agnostic smart soundbox, POS terminal sync, and merchant mobile portal with instant WhatsApp invoicing and payment reminders.',
    marketOpportunity: 'Indian digital merchant payments market is projected to reach $10 Trillion by 2030, with merchant credit remaining an untapped $300B credit gap.',
    businessModel: '0.4% take-rate on processed merchant settlement volume and 2.5% origination fee on merchant credit disbursements via NBFC partner integrations.',
    competitiveAdvantage: 'Proprietary merchant transaction graph with 99.4% repayment rate and zero physical documentation requirement.',
    targetCustomers: 'Retail merchants, kirana stores, regional wholesalers, and franchise retail chains processing ₹2L-₹50L monthly turnover.',
    useOfFunds: '40% Engineering & UPI 2.0 AutoPay tech, 35% Merchant acquisition across 12 cities in South India, 25% Regulatory reserves & risk modeling.',
    traction: '₹14.2 Cr monthly GTV, 12,400 active merchants across Karnataka and Tamil Nadu, 42% Month-over-Month transaction volume growth.',
    monthlyRevenue: 580000,
    monthlyActiveUsers: 12400,
    teamSize: 14,
    publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    founder: {
      id: 'usr-aarav',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@payflow.in',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Serial fintech entrepreneur with 8 years of product leadership in digital payment gateways.',
      location: 'Bengaluru, Karnataka',
    },
    industries: [
      { id: 'ind-1', name: 'Fintech & Payments', slug: 'fintech-payments' },
      { id: 'ind-6', name: 'SaaS & Enterprise Tech', slug: 'saas-enterprise-tech' },
    ],
    teamMembers: [
      {
        id: 'tm-1',
        name: 'Aarav Sharma',
        role: 'Founder & CEO',
        bio: 'Ex-Lead Architect at major payments gateway, 8+ years building high-throughput payment switches.',
        linkedinUrl: 'https://linkedin.com/in/aarav-sharma-demo',
      },
      {
        id: 'tm-2',
        name: 'Kavish Goyal',
        role: 'Co-founder & CTO',
        bio: 'Distributed systems engineer with background in financial security and microservice scale.',
        linkedinUrl: 'https://linkedin.com/in/kavish-goyal-demo',
      },
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'PayFlow Executive Pitch Deck Q3',
        fileUrl: '#',
        fileType: 'application/pdf',
        fileSize: 4200000,
        isPublic: true,
        description: 'Comprehensive overview of problem, solution, unit economics, and 3-year financial projections.',
      },
      {
        id: 'doc-2',
        name: 'Financial Model & Cap Table',
        fileUrl: '#',
        fileType: 'application/pdf',
        fileSize: 1800000,
        isPublic: false,
        description: 'Confidential cap table and cohort retention metrics for verified investors only.',
      },
    ],
  },
  {
    id: 'startup-2',
    name: 'GreenGrid Mobility',
    slug: 'greengrid-mobility',
    tagline: 'Decentralized solar-powered EV swapping and ultra-fast charging stations',
    description: 'GreenGrid creates micro-grid EV battery swapping stations designed for 2-wheeler and 3-wheeler commercial delivery fleets, powered by rooftop solar generation.',
    stage: 'EARLY_STAGE',
    status: 'PUBLISHED',
    fundingType: 'SEED',
    fundingGoalINR: 50000000, // 5 Cr
    fundingRaisedINR: 12000000,
    equityOffered: 10.0,
    location: 'Pune, Maharashtra',
    websiteUrl: 'https://greengrid-mobility.in',
    logoUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=150',
    coverImageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200',
    problemStatement: 'Last-mile delivery EV riders lose 2 to 3 productive hours each shift waiting for traditional slow charging, crippling delivery earnings and vehicle ROI.',
    solutionDescription: 'Automated 90-second battery swap hubs powered by rooftop solar arrays with smart battery health telemetry and IoT locking.',
    productDescription: 'Standardized AIS-156 certified battery packs with smart swapping cabinets integrated into gig-worker fleet mobile apps.',
    marketOpportunity: 'India is projected to reach 30 million electric two-wheelers by 2030, with commercial delivery fleets adopting EVs at over 60% annually.',
    businessModel: 'Battery-as-a-Service (BaaS) subscription at ₹2,200/month plus per-swap energy tariffs with 48% gross margin.',
    competitiveAdvantage: 'Solar-integrated microgrids reduce grid electricity draw by 65%, shielding station operations from peak commercial power tariffs.',
    targetCustomers: 'Gig delivery workers (Zomato, Swiggy, Zepto, Blinkit) and commercial logistics delivery fleets.',
    useOfFunds: '50% Station fabrication & battery inventory, 30% Solar micro-grid installations across Pune, 20% Team expansion.',
    traction: '34 operating stations in Pune, 1,180 active fleet riders subscribed, over 140,000 completed swaps with 99.8% uptime.',
    monthlyRevenue: 940000,
    monthlyActiveUsers: 1180,
    teamSize: 18,
    publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    founder: {
      id: 'usr-priya',
      name: 'Priya Patel',
      email: 'priya.patel@greengrid.in',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      bio: 'IIT Bombay alumnus passionate about decentralized EV charging infrastructure.',
      location: 'Pune, Maharashtra',
    },
    industries: [
      { id: 'ind-5', name: 'Clean Energy & Climate', slug: 'clean-energy-climate' },
      { id: 'ind-8', name: 'Logistics & Supply Chain', slug: 'logistics-supply-chain' },
    ],
    teamMembers: [
      {
        id: 'tm-3',
        name: 'Priya Patel',
        role: 'Founder & CEO',
        bio: 'IIT Bombay Mechanical Engineering graduate, ex-Tata Motors EV powertrain team.',
        linkedinUrl: 'https://linkedin.com/in/priya-patel-demo',
      },
    ],
    documents: [
      {
        id: 'doc-3',
        name: 'GreenGrid Investor Pitch Deck',
        fileUrl: '#',
        fileType: 'application/pdf',
        fileSize: 5100000,
        isPublic: true,
        description: 'Fleet partnership metrics, unit economics per station, and solar payback schedule.',
      },
    ],
  },
  {
    id: 'startup-3',
    name: 'KisaanSetu Direct',
    slug: 'kisaansetu-direct',
    tagline: 'Farmgate algorithmic mandi pricing and direct wholesale fulfillment',
    description: 'KisaanSetu eliminates middleman margins for vegetable and grain growers by aggregating produce at village collection points and dispatching direct to food processors.',
    stage: 'MVP',
    status: 'PUBLISHED',
    fundingType: 'ANGEL',
    fundingGoalINR: 12000000, // 1.2 Cr
    fundingRaisedINR: 3000000,
    equityOffered: 12.0,
    location: 'Indore, Madhya Pradesh',
    websiteUrl: 'https://kisaansetu.in',
    logoUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=150',
    coverImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200',
    problemStatement: 'Farmers receive only 20-25% of the final consumer price for horticultural crops due to 5+ layers of intermediate commission agents.',
    solutionDescription: 'Direct farmgate pickup with digital grading, instant weight verification via IoT scales, and automated RTGS bank payouts within 2 hours.',
    productDescription: 'Multilingual voice-guided farmer mobile app paired with local micro-warehouse collection kiosks.',
    marketOpportunity: 'Indian agriculture produce market represents over $450B annually with direct-from-farm procurement growing rapidly.',
    businessModel: '6-8% fulfillment margin paid by institutional buyers for graded, standardized produce batches.',
    competitiveAdvantage: 'Hyperlocal village collection hubs managed by verified village entrepreneurs with minimal fixed capital expenditure.',
    targetCustomers: 'Commercial grain & vegetable farmers with 2-10 acre holdings, food processing companies, and institutional kitchen chains.',
    useOfFunds: '45% Setting up 25 village fulfillment kiosks, 30% Temperature-controlled logistics fleet leasing, 25% Tech platform.',
    traction: '850+ onboarded farming families across Malwa region, ₹48 Lakhs monthly produce turnover, 98% repeat dispatch rate.',
    monthlyRevenue: 320000,
    monthlyActiveUsers: 850,
    teamSize: 9,
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    founder: {
      id: 'usr-rohit',
      name: 'Rohit Verma',
      email: 'rohit.verma@kisaansetu.in',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Agritech innovator connecting smallholder farmers directly to mandi buyers.',
      location: 'Indore, Madhya Pradesh',
    },
    industries: [
      { id: 'ind-3', name: 'Agritech', slug: 'agritech' },
      { id: 'ind-8', name: 'Logistics & Supply Chain', slug: 'logistics-supply-chain' },
    ],
    teamMembers: [
      {
        id: 'tm-4',
        name: 'Rohit Verma',
        role: 'Founder & CEO',
        bio: 'B.Tech Ag-Engineering, 5 years field operations across Madhya Pradesh mandis.',
      },
    ],
    documents: [],
  },
  {
    id: 'startup-4',
    name: 'MediSync Intelligence',
    slug: 'medisync-intelligence',
    tagline: 'Autonomous clinical triage and diagnostic copilot for rural hospitals',
    description: 'MediSync deploys lightweight offline-capable AI models on hospital edge servers to help rural duty medical officers interpret CT scans, X-rays, and patient vitals in real time.',
    stage: 'GROWTH',
    status: 'PUBLISHED',
    fundingType: 'SERIES_A',
    fundingGoalINR: 80000000, // 8 Cr
    fundingRaisedINR: 22000000,
    equityOffered: 7.0,
    location: 'Hyderabad, Telangana',
    websiteUrl: 'https://medisync.ai',
    logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150',
    coverImageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200',
    problemStatement: 'Over 70% of district and rural hospitals in India lack full-time radiologists and critical care specialists, causing critical diagnostic delays in emergency trauma.',
    solutionDescription: 'FDA and CDSCO pre-certified computer vision models running locally on standard hospital PCs, alerting duty physicians to acute intracranial bleeds and pneumonia within 30 seconds.',
    productDescription: 'DICOM-compliant local edge appliance that syncs with existing PACS radiology hardware without requiring cloud internet bandwidth.',
    marketOpportunity: 'Tier-2 to Tier-4 healthcare diagnostic market in India spans over 45,000 private and government health facilities.',
    businessModel: 'Annual recurring software license of ₹4.5 Lakhs per hospital hospital bed ward, with per-scan tele-radiology second opinion surcharge.',
    competitiveAdvantage: 'Operates 100% locally on edge hardware with 97.2% diagnostic sensitivity validated in 12 multi-center Indian clinical trials.',
    targetCustomers: 'District hospitals, charitable trust medical institutes, and private nursing home chains.',
    useOfFunds: '40% Clinical trial completion for 3 new pathology modalities, 35% Sales team expansion in Andhra Pradesh & Maharashtra, 25% R&D.',
    traction: 'Deployed across 62 hospitals, over 280,000 emergency patient scans processed, ₹1.4 Cr annual recurring revenue.',
    monthlyRevenue: 1180000,
    monthlyActiveUsers: 480,
    teamSize: 22,
    publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    founder: {
      id: 'usr-ananya',
      name: 'Dr. Ananya Deshmukh',
      email: 'ananya.deshmukh@medisync.in',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      bio: 'MD Physician and healthcare technologist developing AI triage workflows for Tier 2 and Tier 3 hospitals.',
      location: 'Hyderabad, Telangana',
    },
    industries: [
      { id: 'ind-2', name: 'Healthtech & Medtech', slug: 'healthtech-medtech' },
      { id: 'ind-7', name: 'AI & Deeptech', slug: 'ai-deeptech' },
    ],
    teamMembers: [
      {
        id: 'tm-5',
        name: 'Dr. Ananya Deshmukh',
        role: 'Founder & Chief Medical Officer',
        bio: 'MD Internal Medicine (Osmania), AI in Healthcare Fellow (Stanford Online).',
      },
    ],
    documents: [],
  },
]

export const DEMO_INVESTORS: DemoInvestor[] = [
  {
    id: 'inv-1',
    userId: 'usr-rajesh',
    name: 'Rajesh Singhania',
    email: 'rajesh.singhania@apexventures.in',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    organization: 'Apex India Capital',
    designation: 'Managing Partner',
    bio: 'Early-stage angel and institutional syndicate lead backing visionary Indian tech founders in Fintech, SaaS, and B2B Commerce.',
    location: 'Mumbai, Maharashtra',
    linkedinUrl: 'https://linkedin.com/in/rajesh-singhania-demo',
    minInvestmentINR: 2500000,
    maxInvestmentINR: 50000000,
    preferredStages: ['SEED', 'EARLY_STAGE'],
    geographicFocus: ['Pan-India', 'Bengaluru', 'Mumbai', 'NCR'],
    investmentThesis: 'We partner with high-conviction teams building scalable software solutions addressing structural efficiencies in Indian commerce.',
    isProfilePublic: true,
    showInvestmentRange: true,
    preferredIndustries: [
      { id: 'ind-1', name: 'Fintech & Payments', slug: 'fintech-payments' },
      { id: 'ind-6', name: 'SaaS & Enterprise Tech', slug: 'saas-enterprise-tech' },
      { id: 'ind-7', name: 'AI & Deeptech', slug: 'ai-deeptech' },
    ],
  },
  {
    id: 'inv-2',
    userId: 'usr-meera',
    name: 'Meera Sundaram',
    email: 'meera.sundaram@bluestarcap.in',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    organization: 'BlueStar Ventures',
    designation: 'Partner - Climate & Health',
    bio: 'Impact investor focused on decarbonization, climate resilience, and scalable healthcare delivery across South Asia.',
    location: 'Bengaluru, Karnataka',
    linkedinUrl: 'https://linkedin.com/in/meera-sundaram-demo',
    minInvestmentINR: 5000000,
    maxInvestmentINR: 100000000,
    preferredStages: ['EARLY_STAGE', 'GROWTH'],
    geographicFocus: ['South India', 'Western India'],
    investmentThesis: 'Capital allocator backing defensible IP in cleantech transition and equitable diagnostic access.',
    isProfilePublic: true,
    showInvestmentRange: true,
    preferredIndustries: [
      { id: 'ind-5', name: 'Clean Energy & Climate', slug: 'clean-energy-climate' },
      { id: 'ind-2', name: 'Healthtech & Medtech', slug: 'healthtech-medtech' },
    ],
  },
  {
    id: 'inv-3',
    userId: 'usr-karan',
    name: 'Karan Kapoor',
    email: 'karan.kapoor@growthindia.in',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    organization: 'Growth India Partners',
    designation: 'Principal',
    bio: 'Growth-stage venture investor partnering with breakout B2B platforms, agritech supply networks, and logistics infrastructure.',
    location: 'Gurugram, Haryana',
    linkedinUrl: 'https://linkedin.com/in/karan-kapoor-demo',
    minInvestmentINR: 10000000,
    maxInvestmentINR: 150000000,
    preferredStages: ['GROWTH', 'SCALING'],
    geographicFocus: ['North India', 'Pan-India'],
    investmentThesis: 'Backing market leaders with proven product-market fit and capital-efficient gross unit margins.',
    isProfilePublic: true,
    showInvestmentRange: true,
    preferredIndustries: [
      { id: 'ind-3', name: 'Agritech', slug: 'agritech' },
      { id: 'ind-8', name: 'Logistics & Supply Chain', slug: 'logistics-supply-chain' },
      { id: 'ind-9', name: 'E-commerce & D2C', slug: 'ecommerce-d2c' },
    ],
  },
]

export const DEMO_MENTORS: DemoMentor[] = [
  {
    id: 'men-1',
    userId: 'usr-sanjay',
    name: 'Sanjay Mehta',
    email: 'sanjay.mehta@scaleadvisors.in',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    headline: 'Ex-VP Product at Unicorn E-commerce | Startup Advisor',
    bio: 'Over 18 years shaping product market fit, unit economics, and go-to-market scaling for consumer internet and tech platforms.',
    location: 'Gurugram, Haryana',
    linkedinUrl: 'https://linkedin.com/in/sanjay-mehta-demo',
    yearsExperience: 18,
    isAvailable: true,
    maxMentees: 5,
    mentorshipFocus: 'Product Strategy, Go-to-Market execution, fundraising narrative, and scaling initial traction.',
    isProfilePublic: true,
    supportedIndustries: [
      { id: 'ind-1', name: 'Fintech & Payments', slug: 'fintech-payments' },
      { id: 'ind-9', name: 'E-commerce & D2C', slug: 'ecommerce-d2c' },
      { id: 'ind-3', name: 'Agritech', slug: 'agritech' },
    ],
    expertiseAreas: ['Product-Market Fit', 'Unit Economics', 'Investor Pitching', 'Pricing Models'],
  },
  {
    id: 'men-2',
    userId: 'usr-kavita',
    name: 'Dr. Kavita Rao',
    email: 'kavita.rao@healthventures.in',
    image: 'https://images.unsplash.com/photo-1594824813511-209214437435?w=150',
    headline: 'Health Systems Strategist | Former Director of Clinical AI',
    bio: 'Advising healthtech founders on regulatory clearances, hospital pilot partnerships, and medical device compliance.',
    location: 'Chennai, Tamil Nadu',
    linkedinUrl: 'https://linkedin.com/in/kavita-rao-demo',
    yearsExperience: 15,
    isAvailable: true,
    maxMentees: 4,
    mentorshipFocus: 'Healthcare regulations, CDSCO certifications, clinical trials, and B2B hospital sales pipelines.',
    isProfilePublic: true,
    supportedIndustries: [
      { id: 'ind-2', name: 'Healthtech & Medtech', slug: 'healthtech-medtech' },
      { id: 'ind-7', name: 'AI & Deeptech', slug: 'ai-deeptech' },
    ],
    expertiseAreas: ['Regulatory Approvals', 'Clinical Validation', 'Hospital Partnerships', 'MedTech IP'],
  },
  {
    id: 'men-3',
    userId: 'usr-arun',
    name: 'Arun Nambiar',
    email: 'arun.nambiar@techmentor.in',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    headline: 'Fractional CTO & Cloud Architect | 20+ Years in Scaled Systems',
    bio: 'Helping early-stage startups design resilient system architectures, manage cloud infrastructure costs, and build high-performance engineering teams.',
    location: 'Bengaluru, Karnataka',
    linkedinUrl: 'https://linkedin.com/in/arun-nambiar-demo',
    yearsExperience: 20,
    isAvailable: true,
    maxMentees: 3,
    mentorshipFocus: 'System architecture, cloud cost optimization, tech team hiring, and DevOps pipelines.',
    isProfilePublic: true,
    supportedIndustries: [
      { id: 'ind-6', name: 'SaaS & Enterprise Tech', slug: 'saas-enterprise-tech' },
      { id: 'ind-7', name: 'AI & Deeptech', slug: 'ai-deeptech' },
    ],
    expertiseAreas: ['Cloud Architecture', 'DevOps & CI/CD', 'Engineering Leadership', 'Microservices'],
  },
]

export const DEMO_USERS_LIST = [
  {
    id: 'usr-admin',
    name: 'System Administrator',
    email: 'admin@ideamarket.in',
    role: 'ADMIN',
    isActive: true,
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-aarav',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@payflow.in',
    role: 'ENTREPRENEUR',
    isActive: true,
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-priya',
    name: 'Priya Patel',
    email: 'priya.patel@greengrid.in',
    role: 'ENTREPRENEUR',
    isActive: true,
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-rohan',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@kisaansetu.in',
    role: 'ENTREPRENEUR',
    isActive: true,
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-sneha',
    name: 'Dr. Sneha Roy',
    email: 'dr.sneha@medisync.in',
    role: 'ENTREPRENEUR',
    isActive: true,
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-rajesh',
    name: 'Rajesh Singhania',
    email: 'rajesh.singhania@apexventures.in',
    role: 'INVESTOR',
    isActive: true,
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-ananya',
    name: 'Ananya Sen',
    email: 'ananya.sen@bengaluruangels.in',
    role: 'INVESTOR',
    isActive: true,
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-sanjay',
    name: 'Sanjay Mehta',
    email: 'sanjay.mehta@scaleadvisors.in',
    role: 'MENTOR',
    isActive: true,
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'usr-radhika',
    name: 'Dr. Radhika Nair',
    email: 'radhika.nair@healthx.org',
    role: 'MENTOR',
    isActive: true,
    onboardingCompleted: true,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
    createdAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const DEMO_AUDIT_LOGS = [
  {
    id: 'log-1',
    action: 'STARTUP_APPROVED',
    description: 'Approved PayFlow India public pitch deck after verifying GSTIN & MCA compliance records.',
    targetType: 'Startup',
    targetId: 'startup-1',
    adminId: 'usr-admin',
    admin: { name: 'System Administrator', email: 'admin@ideamarket.in' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-2',
    action: 'USER_REACTIVATED',
    description: 'Verified accredited investor status for Rajesh Singhania (Apex Ventures).',
    targetType: 'User',
    targetId: 'usr-rajesh',
    adminId: 'usr-admin',
    admin: { name: 'System Administrator', email: 'admin@ideamarket.in' },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-3',
    action: 'STARTUP_APPROVED',
    description: 'Reviewed and certified GreenGrid Energy distributed battery grid listing.',
    targetType: 'Startup',
    targetId: 'startup-2',
    adminId: 'usr-admin',
    admin: { name: 'System Administrator', email: 'admin@ideamarket.in' },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-4',
    action: 'ROLE_CHANGED',
    description: 'Assigned verified mentor badge to Sanjay Mehta following advisory credential checks.',
    targetType: 'User',
    targetId: 'usr-sanjay',
    adminId: 'usr-admin',
    admin: { name: 'System Administrator', email: 'admin@ideamarket.in' },
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-5',
    action: 'ADMIN_LOGIN',
    description: 'Admin portal login session established via secure MFA authentication.',
    targetType: 'System',
    targetId: 'session-auth',
    adminId: 'usr-admin',
    admin: { name: 'System Administrator', email: 'admin@ideamarket.in' },
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
]

