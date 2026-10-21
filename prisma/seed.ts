import { PrismaClient, UserRole, StartupStage, StartupStatus, FundingType, InvestmentInterestStatus, ConnectionStatus, MentorshipStatus, NotificationType, NotificationStatus, AuditAction } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Idea Market database seeding...')

  // 1. Clean existing demo data if needed in safe order
  // (Preserves schema integrity without dropping tables)
  await prisma.auditLog.deleteMany()
  await prisma.report.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversationParticipant.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.mentorshipRequest.deleteMany()
  await prisma.connectionRequest.deleteMany()
  await prisma.investmentInterest.deleteMany()
  await prisma.savedStartup.deleteMany()
  await prisma.startupDocument.deleteMany()
  await prisma.startupTeamMember.deleteMany()
  await prisma.startupIndustry.deleteMany()
  await prisma.investorIndustry.deleteMany()
  await prisma.mentorIndustry.deleteMany()
  await prisma.mentorExpertise.deleteMany()
  await prisma.startup.deleteMany()
  await prisma.mentorProfile.deleteMany()
  await prisma.investorProfile.deleteMany()
  await prisma.entrepreneurProfile.deleteMany()
  await prisma.industry.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleaned existing records')

  const hashedPassword = await bcrypt.hash('Password@123', 10)

  // 2. Create Industries
  const industriesData = [
    { name: 'Fintech & Payments', slug: 'fintech-payments', description: 'Financial technology, digital lending, payments, and wealth management', icon: 'Wallet' },
    { name: 'Healthtech & Medtech', slug: 'healthtech-medtech', description: 'Digital health, telemedicine, diagnostics, and medical devices', icon: 'Activity' },
    { name: 'Agritech', slug: 'agritech', description: 'Farm-to-fork solutions, precision agriculture, and supply chain for farmers', icon: 'Sprout' },
    { name: 'Edtech & Upskilling', slug: 'edtech-upskilling', description: 'K-12, higher education, test prep, and executive skilling platforms', icon: 'GraduationCap' },
    { name: 'Clean Energy & Climate', slug: 'clean-energy-climate', description: 'Renewable energy, EV infrastructure, carbon accounting, and waste reduction', icon: 'Zap' },
    { name: 'SaaS & Enterprise Tech', slug: 'saas-enterprise-tech', description: 'B2B software, workflow automation, and cloud utilities', icon: 'Cloud' },
    { name: 'AI & Deeptech', slug: 'ai-deeptech', description: 'Applied generative AI, computer vision, robotics, and edge computing', icon: 'Cpu' },
    { name: 'Logistics & Supply Chain', slug: 'logistics-supply-chain', description: 'Freight tech, warehousing automation, and last-mile delivery', icon: 'Truck' },
    { name: 'E-commerce & D2C', slug: 'ecommerce-d2c', description: 'Omnichannel retail, direct-to-consumer brands, and marketplace infrastructure', icon: 'ShoppingBag' },
  ]

  const industries: Record<string, any> = {}
  for (const ind of industriesData) {
    industries[ind.slug] = await prisma.industry.create({ data: ind })
  }
  console.log('✅ Created 9 core industries')

  // 3. Create Admin Account
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ideamarket.in',
      name: 'System Administrator',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
      onboardingCompleted: true,
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created Admin user (admin@ideamarket.in)')

  // 4. Create Entrepreneur Accounts & Profiles
  const aarav = await prisma.user.create({
    data: {
      email: 'aarav.sharma@payflow.in',
      name: 'Aarav Sharma',
      password: hashedPassword,
      role: UserRole.ENTREPRENEUR,
      isActive: true,
      onboardingCompleted: true,
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      entrepreneurProfile: {
        create: {
          bio: 'Serial fintech entrepreneur with 8 years of product leadership in digital payment gateways and UPI micro-settlements.',
          location: 'Bengaluru, Karnataka',
          phone: '+91 98765 43210',
          linkedinUrl: 'https://linkedin.com/in/aarav-sharma-demo',
          yearsExperience: 8,
          previousStartups: 1,
        },
      },
    },
  })

  const priya = await prisma.user.create({
    data: {
      email: 'priya.patel@greengrid.in',
      name: 'Priya Patel',
      password: hashedPassword,
      role: UserRole.ENTREPRENEUR,
      isActive: true,
      onboardingCompleted: true,
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      entrepreneurProfile: {
        create: {
          bio: 'IIT Bombay alumnus passionate about decentralized EV charging infrastructure and green grid energy trading.',
          location: 'Pune, Maharashtra',
          phone: '+91 98765 43211',
          linkedinUrl: 'https://linkedin.com/in/priya-patel-demo',
          yearsExperience: 6,
          previousStartups: 0,
        },
      },
    },
  })

  const rohit = await prisma.user.create({
    data: {
      email: 'rohit.verma@kisaansetu.in',
      name: 'Rohit Verma',
      password: hashedPassword,
      role: UserRole.ENTREPRENEUR,
      isActive: true,
      onboardingCompleted: true,
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      entrepreneurProfile: {
        create: {
          bio: 'Agritech innovator connecting smallholder farmers directly to mandi buyers using automated price discovery and cold storage.',
          location: 'Indore, Madhya Pradesh',
          phone: '+91 98765 43212',
          linkedinUrl: 'https://linkedin.com/in/rohit-verma-demo',
          yearsExperience: 5,
          previousStartups: 0,
        },
      },
    },
  })

  const ananya = await prisma.user.create({
    data: {
      email: 'ananya.deshmukh@medisync.in',
      name: 'Dr. Ananya Deshmukh',
      password: hashedPassword,
      role: UserRole.ENTREPRENEUR,
      isActive: true,
      onboardingCompleted: true,
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
      entrepreneurProfile: {
        create: {
          bio: 'MD Physician and healthcare technologist developing AI triage workflows for Tier 2 and Tier 3 hospitals across India.',
          location: 'Hyderabad, Telangana',
          phone: '+91 98765 43213',
          linkedinUrl: 'https://linkedin.com/in/ananya-deshmukh-demo',
          yearsExperience: 10,
          previousStartups: 1,
        },
      },
    },
  })

  console.log('✅ Created 4 Entrepreneur profiles')

  // 5. Create Investor Accounts & Profiles
  const rajesh = await prisma.user.create({
    data: {
      email: 'rajesh.singhania@apexventures.in',
      name: 'Rajesh Singhania',
      password: hashedPassword,
      role: UserRole.INVESTOR,
      isActive: true,
      onboardingCompleted: true,
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      investorProfile: {
        create: {
          organization: 'Apex India Capital',
          designation: 'Managing Partner',
          bio: 'Early-stage angel and institutional syndicate lead backing visionary Indian tech founders in Fintech, SaaS, and B2B Commerce.',
          location: 'Mumbai, Maharashtra',
          phone: '+91 98200 11223',
          linkedinUrl: 'https://linkedin.com/in/rajesh-singhania-demo',
          minInvestmentINR: BigInt(2500000), // 25 Lakhs
          maxInvestmentINR: BigInt(50000000), // 5 Crores
          preferredStages: [StartupStage.MVP, StartupStage.EARLY_STAGE],
          geographicFocus: ['Pan-India', 'Bengaluru', 'Mumbai', 'NCR'],
          investmentThesis: 'We partner with high-conviction teams building scalable software solutions addressing structural efficiencies in Indian commerce.',
          isProfilePublic: true,
          showInvestmentRange: true,
          preferredIndustries: {
            create: [
              { industryId: industries['fintech-payments'].id },
              { industryId: industries['saas-enterprise-tech'].id },
              { industryId: industries['ai-deeptech'].id },
            ],
          },
        },
      },
    },
  })

  const meera = await prisma.user.create({
    data: {
      email: 'meera.sundaram@bluestarcap.in',
      name: 'Meera Sundaram',
      password: hashedPassword,
      role: UserRole.INVESTOR,
      isActive: true,
      onboardingCompleted: true,
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      investorProfile: {
        create: {
          organization: 'BlueStar Ventures',
          designation: 'Partner - Climate & Health',
          bio: 'Impact investor focused on decarbonization, climate resilience, and scalable healthcare delivery across South Asia.',
          location: 'Bengaluru, Karnataka',
          phone: '+91 98450 33445',
          linkedinUrl: 'https://linkedin.com/in/meera-sundaram-demo',
          minInvestmentINR: BigInt(5000000), // 50 Lakhs
          maxInvestmentINR: BigInt(100000000), // 10 Crores
          preferredStages: [StartupStage.EARLY_STAGE, StartupStage.GROWTH],
          geographicFocus: ['South India', 'Western India'],
          investmentThesis: 'Capital allocator backing defensible IP in cleantech transition and equitable diagnostic access.',
          isProfilePublic: true,
          showInvestmentRange: true,
          preferredIndustries: {
            create: [
              { industryId: industries['clean-energy-climate'].id },
              { industryId: industries['healthtech-medtech'].id },
            ],
          },
        },
      },
    },
  })

  console.log('✅ Created 2 Investor profiles')

  // 6. Create Mentor Accounts & Profiles
  const sanjay = await prisma.user.create({
    data: {
      email: 'sanjay.mehta@scaleadvisors.in',
      name: 'Sanjay Mehta',
      password: hashedPassword,
      role: UserRole.MENTOR,
      isActive: true,
      onboardingCompleted: true,
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      mentorProfile: {
        create: {
          headline: 'Ex-VP Product at Unicorn E-commerce | Startup Advisor',
          bio: 'Over 18 years shaping product market fit, unit economics, and go-to-market scaling for consumer internet and tech platforms.',
          location: 'Gurugram, Haryana',
          phone: '+91 98110 55667',
          linkedinUrl: 'https://linkedin.com/in/sanjay-mehta-demo',
          yearsExperience: 18,
          isAvailable: true,
          maxMentees: 5,
          mentorshipFocus: 'Product Strategy, Go-to-Market execution, fundraising narrative, and scaling initial traction.',
          isProfilePublic: true,
          supportedIndustries: {
            create: [
              { industryId: industries['fintech-payments'].id },
              { industryId: industries['ecommerce-d2c'].id },
              { industryId: industries['agritech'].id },
            ],
          },
          expertiseAreas: {
            create: [
              { expertise: 'Product-Market Fit' },
              { expertise: 'Unit Economics' },
              { expertise: 'Investor Pitching' },
            ],
          },
        },
      },
    },
  })

  const kavita = await prisma.user.create({
    data: {
      email: 'kavita.rao@healthventures.in',
      name: 'Dr. Kavita Rao',
      password: hashedPassword,
      role: UserRole.MENTOR,
      isActive: true,
      onboardingCompleted: true,
      emailVerified: new Date(),
      image: 'https://images.unsplash.com/photo-1594824813511-209214437435?w=150',
      mentorProfile: {
        create: {
          headline: 'Health Systems Strategist | Former Director of Clinical AI',
          bio: 'Advising healthtech founders on regulatory clearances, hospital pilot partnerships, and medical device compliance.',
          location: 'Chennai, Tamil Nadu',
          phone: '+91 94440 66778',
          linkedinUrl: 'https://linkedin.com/in/kavita-rao-demo',
          yearsExperience: 15,
          isAvailable: true,
          maxMentees: 4,
          mentorshipFocus: 'Healthcare regulations, CDSCO certifications, clinical trials, and B2B hospital sales pipelines.',
          isProfilePublic: true,
          supportedIndustries: {
            create: [
              { industryId: industries['healthtech-medtech'].id },
              { industryId: industries['ai-deeptech'].id },
            ],
          },
          expertiseAreas: {
            create: [
              { expertise: 'Regulatory Approvals' },
              { expertise: 'Clinical Validation' },
              { expertise: 'Hospital Partnerships' },
            ],
          },
        },
      },
    },
  })

  console.log('✅ Created 2 Mentor profiles')

  // 7. Create Startups
  const payflow = await prisma.startup.create({
    data: {
      userId: aarav.id,
      name: 'PayFlow India',
      slug: 'payflow-india',
      tagline: 'Instant working capital & micro-reconciliation for MSME merchants',
      description: 'PayFlow empowers Tier-2 and Tier-3 merchants with automated UPI QR reconciliation, daily payout settlements, and low-interest credit lines based on cash-flow underwriting.',
      stage: StartupStage.EARLY_STAGE,
      status: StartupStatus.PUBLISHED,
      fundingType: FundingType.SEED,
      fundingGoalINR: BigInt(25000000), // 2.5 Cr
      fundingRaisedINR: BigInt(7500000), // 75 Lakhs
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
      monthlyRevenue: BigInt(580000), // 5.8 Lakhs
      monthlyActiveUsers: 12400,
      teamSize: 14,
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      industries: {
        create: [
          { industryId: industries['fintech-payments'].id },
          { industryId: industries['saas-enterprise-tech'].id },
        ],
      },
      teamMembers: {
        create: [
          {
            name: 'Aarav Sharma',
            role: 'Founder & CEO',
            bio: 'Ex-Lead Architect at major payments gateway, 8+ years building high-throughput payment switches.',
            linkedinUrl: 'https://linkedin.com/in/aarav-sharma-demo',
            order: 1,
          },
          {
            name: 'Kavish Goyal',
            role: 'Co-founder & CTO',
            bio: 'Distributed systems engineer with background in financial security and microservice scale.',
            linkedinUrl: 'https://linkedin.com/in/kavish-goyal-demo',
            order: 2,
          },
        ],
      },
      documents: {
        create: [
          {
            name: 'PayFlow Executive Pitch Deck Q3',
            fileUrl: 'https://example.com/docs/payflow-pitch-deck.pdf',
            fileType: 'application/pdf',
            fileSize: 4200000,
            isPublic: true,
            description: 'Comprehensive overview of problem, solution, unit economics, and 3-year financial projections.',
          },
          {
            name: 'Financial Model & Cap Table',
            fileUrl: 'https://example.com/docs/payflow-financial-model.pdf',
            fileType: 'application/pdf',
            fileSize: 1800000,
            isPublic: false,
            description: 'Confidential cap table and cohort retention metrics for verified investors only.',
          },
        ],
      },
    },
  })

  const greengrid = await prisma.startup.create({
    data: {
      userId: priya.id,
      name: 'GreenGrid Mobility',
      slug: 'greengrid-mobility',
      tagline: 'Decentralized solar-powered EV swapping and ultra-fast charging stations',
      description: 'GreenGrid creates micro-grid EV battery swapping stations designed for 2-wheeler and 3-wheeler commercial delivery fleets, powered by rooftop solar generation.',
      stage: StartupStage.EARLY_STAGE,
      status: StartupStatus.PUBLISHED,
      fundingType: FundingType.SEED,
      fundingGoalINR: BigInt(50000000), // 5 Cr
      fundingRaisedINR: BigInt(12000000), // 1.2 Cr
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
      useOfFunds: '50% Station fabrication & battery inventory, 30% Solar micro-grid installations across Pune and Navi Mumbai, 20% Team expansion.',
      traction: '34 operating stations in Pune, 1,180 active fleet riders subscribed, over 140,000 completed swaps with 99.8% uptime.',
      monthlyRevenue: BigInt(940000), // 9.4 Lakhs
      monthlyActiveUsers: 1180,
      teamSize: 18,
      publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      industries: {
        create: [
          { industryId: industries['clean-energy-climate'].id },
          { industryId: industries['logistics-supply-chain'].id },
        ],
      },
      teamMembers: {
        create: [
          {
            name: 'Priya Patel',
            role: 'Founder & CEO',
            bio: 'IIT Bombay Mechanical Engineering graduate, ex-Tata Motors EV powertrain team.',
            linkedinUrl: 'https://linkedin.com/in/priya-patel-demo',
            order: 1,
          },
        ],
      },
      documents: {
        create: [
          {
            name: 'GreenGrid Investor Pitch Deck',
            fileUrl: 'https://example.com/docs/greengrid-deck.pdf',
            fileType: 'application/pdf',
            fileSize: 5100000,
            isPublic: true,
            description: 'Fleet partnership metrics, unit economics per station, and solar payback schedule.',
          },
        ],
      },
    },
  })

  const kisaan = await prisma.startup.create({
    data: {
      userId: rohit.id,
      name: 'KisaanSetu Direct',
      slug: 'kisaansetu-direct',
      tagline: 'Farmgate algorithmic mandi pricing and direct wholesale fulfillment',
      description: 'KisaanSetu eliminates middleman margins for vegetable and grain growers by aggregating produce at village collection points and dispatching direct to food processors.',
      stage: StartupStage.MVP,
      status: StartupStatus.PUBLISHED,
      fundingType: FundingType.ANGEL,
      fundingGoalINR: BigInt(12000000), // 1.2 Cr
      fundingRaisedINR: BigInt(3000000), // 30 Lakhs
      equityOffered: 12.0,
      location: 'Indore, Madhya Pradesh',
      websiteUrl: 'https://kisaansetu.in',
      logoUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=150',
      coverImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200',
      problemStatement: 'Farmers receive only 20-25% of the final consumer price for horticultural crops due to 5+ layers of intermediate commission agents and transport waste.',
      solutionDescription: 'Direct farmgate pickup with digital grading, instant weight verification via IoT scales, and automated RTGS bank payouts within 2 hours.',
      productDescription: 'Multilingual voice-guided farmer mobile app (Hindi, Marathi, Gujarati) paired with local micro-warehouse collection kiosks.',
      marketOpportunity: 'Indian agriculture produce market represents over $450B annually with direct-from-farm procurement growing at 35% CAGR.',
      businessModel: '6-8% fulfillment margin paid by institutional buyers for graded, standardized produce batches.',
      competitiveAdvantage: 'Hyperlocal village collection hubs managed by verified village entrepreneurs with minimal fixed capital expenditure.',
      targetCustomers: 'Commercial grain & vegetable farmers with 2-10 acre holdings, food processing companies, and institutional kitchen chains.',
      useOfFunds: '45% Setting up 25 village fulfillment kiosks, 30% Temperature-controlled logistics fleet leasing, 25% Tech platform enhancements.',
      traction: '850+ onboarded farming families across Malwa region, ₹48 Lakhs monthly produce turnover, 98% repeat dispatch rate.',
      monthlyRevenue: BigInt(320000), // 3.2 Lakhs
      monthlyActiveUsers: 850,
      teamSize: 9,
      publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      industries: {
        create: [
          { industryId: industries['agritech'].id },
          { industryId: industries['logistics-supply-chain'].id },
        ],
      },
    },
  })

  const medisync = await prisma.startup.create({
    data: {
      userId: ananya.id,
      name: 'MediSync Intelligence',
      slug: 'medisync-intelligence',
      tagline: 'Autonomous clinical triage and diagnostic copilot for rural hospitals',
      description: 'MediSync deploys lightweight offline-capable AI models on hospital edge servers to help rural duty medical officers interpret CT scans, X-rays, and patient vitals in real time.',
      stage: StartupStage.GROWTH,
      status: StartupStatus.PUBLISHED,
      fundingType: FundingType.SERIES_A,
      fundingGoalINR: BigInt(80000000), // 8 Cr
      fundingRaisedINR: BigInt(22000000), // 2.2 Cr
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
      monthlyRevenue: BigInt(1180000), // 11.8 Lakhs
      monthlyActiveUsers: 480,
      teamSize: 22,
      publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      industries: {
        create: [
          { industryId: industries['healthtech-medtech'].id },
          { industryId: industries['ai-deeptech'].id },
        ],
      },
    },
  })

  console.log('✅ Created 4 Published Startups')

  // 8. Saved Startups & Investment Interests
  const rajeshProfile = await prisma.investorProfile.findUnique({ where: { userId: rajesh.id } })
  const meeraProfile = await prisma.investorProfile.findUnique({ where: { userId: meera.id } })

  if (rajeshProfile) {
    // Rajesh saved PayFlow & MediSync
    await prisma.savedStartup.create({
      data: { userId: rajesh.id, startupId: payflow.id },
    })
    await prisma.savedStartup.create({
      data: { userId: rajesh.id, startupId: medisync.id },
    })

    // Rajesh expressed interest in PayFlow (ACCEPTED)
    await prisma.investmentInterest.create({
      data: {
        investorUserId: rajesh.id,
        investorProfileId: rajeshProfile.id,
        startupId: payflow.id,
        status: InvestmentInterestStatus.ACCEPTED,
        message: 'Dear Aarav, your MSME credit underwriting approach aligns closely with our thesis at Apex India. We would love to evaluate a syndicate allocation of ₹1.5 Cr for this Seed round.',
        responseMessage: 'Thank you Rajesh! We are thrilled to connect and would be delighted to share our data room and schedule an intro call.',
        respondedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    })
  }

  if (meeraProfile) {
    // Meera saved GreenGrid & MediSync
    await prisma.savedStartup.create({
      data: { userId: meera.id, startupId: greengrid.id },
    })

    // Meera expressed interest in GreenGrid (PENDING)
    await prisma.investmentInterest.create({
      data: {
        investorUserId: meera.id,
        investorProfileId: meeraProfile.id,
        startupId: greengrid.id,
        status: InvestmentInterestStatus.PENDING,
        message: 'Hello Priya, BlueStar Ventures is tracking EV charging infrastructure deployments closely. We would like to review your unit-economics per station.',
      },
    })
  }

  console.log('✅ Created Saved Startups & Investment Interests')

  // 9. Connection Requests & Active Connections
  await prisma.connectionRequest.create({
    data: {
      senderId: rajesh.id,
      receiverId: aarav.id,
      status: ConnectionStatus.ACCEPTED,
      message: 'Connecting to discuss PayFlow investment syndicate and introductions to our retail portfolio.',
      respondedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.connectionRequest.create({
    data: {
      senderId: meera.id,
      receiverId: priya.id,
      status: ConnectionStatus.PENDING,
      message: 'Looking forward to connecting regarding GreenGrid expansion in South India.',
    },
  })

  console.log('✅ Created Connection Requests')

  // 10. Mentorship Requests
  const sanjayProfile = await prisma.mentorProfile.findUnique({ where: { userId: sanjay.id } })
  const kavitaProfile = await prisma.mentorProfile.findUnique({ where: { userId: kavita.id } })

  if (sanjayProfile) {
    await prisma.mentorshipRequest.create({
      data: {
        senderId: rohit.id,
        mentorId: sanjay.id,
        mentorProfileId: sanjayProfile.id,
        status: MentorshipStatus.ACCEPTED,
        goals: 'Refining our village entrepreneur collection kiosk model and structuring our pitch deck for institutional seed investors.',
        message: 'Hi Sanjay, our team at KisaanSetu would greatly value your experience in scaling supply chain marketplaces.',
        responseMessage: 'Delighted to help Rohit. Let us schedule a monthly advisory sync to audit your unit economics and fulfillment margins.',
        respondedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    })
  }

  if (kavitaProfile) {
    await prisma.mentorshipRequest.create({
      data: {
        senderId: ananya.id,
        mentorId: kavita.id,
        mentorProfileId: kavitaProfile.id,
        status: MentorshipStatus.ACCEPTED,
        goals: 'Navigating CDSCO medical device software clearance and establishing pilot validation protocols with tertiary hospital chains.',
        message: 'Respected Dr. Rao, we would be honored to receive your mentorship as we prepare our clinical dossier for state health approvals.',
        responseMessage: 'Hello Dr. Ananya, exceptional work on MediSync. Happy to guide your regulatory pathway.',
        respondedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    })
  }

  console.log('✅ Created Mentorship Requests')

  // 11. Conversations & Messages between connected users (Rajesh & Aarav)
  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId: rajesh.id },
          { userId: aarav.id },
        ],
      },
      messages: {
        create: [
          {
            senderId: rajesh.id,
            content: 'Hi Aarav, thanks for connecting! I was reviewing PayFlow’s pitch deck. Could you walk me through your default loss rate on merchant credit advances over the last 6 months?',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            senderId: aarav.id,
            content: 'Hi Rajesh! Our 90-day delinquency rate is sitting at 0.58%, largely because repayments are automatically deducted from daily UPI merchant settlements before the merchant withdrawal.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3600000),
          },
          {
            senderId: rajesh.id,
            content: 'That daily deduction mechanism is very compelling. Let us arrange a formal term-sheet meeting with our investment committee this Thursday at 3 PM IST.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            senderId: aarav.id,
            content: 'Confirmed for Thursday 3 PM! Looking forward to presenting to the committee.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1800000),
          },
        ],
      },
    },
  })

  console.log('✅ Created Sample Conversation with 4 realistic messages')

  // 12. Realistic Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: aarav.id,
        type: NotificationType.INVESTMENT_ACCEPTED,
        status: NotificationStatus.READ,
        title: 'Investor Interest Accepted',
        message: 'You accepted investment interest from Rajesh Singhania (Apex India Capital).',
        linkUrl: '/dashboard/interests',
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        userId: aarav.id,
        type: NotificationType.NEW_MESSAGE,
        status: NotificationStatus.UNREAD,
        title: 'New Message from Rajesh Singhania',
        message: 'Confirmed for Thursday 3 PM! Looking forward to presenting to the committee.',
        linkUrl: `/messages?id=${conversation.id}`,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: priya.id,
        type: NotificationType.INVESTMENT_INTEREST,
        status: NotificationStatus.UNREAD,
        title: 'New Investor Interest Received',
        message: 'Meera Sundaram (BlueStar Ventures) expressed investment interest in GreenGrid Mobility.',
        linkUrl: '/dashboard/interests',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId: rohit.id,
        type: NotificationType.MENTORSHIP_ACCEPTED,
        status: NotificationStatus.READ,
        title: 'Mentorship Request Accepted',
        message: 'Sanjay Mehta accepted your mentorship request for KisaanSetu.',
        linkUrl: '/dashboard/mentorship',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
  })

  console.log('✅ Created Notifications')

  // 13. Audit Log
  await prisma.auditLog.createMany({
    data: [
      {
        adminId: adminUser.id,
        action: AuditAction.ADMIN_LOGIN,
        description: 'Administrator session initiated via secure credential verification.',
      },
      {
        adminId: adminUser.id,
        action: AuditAction.STARTUP_APPROVED,
        targetType: 'Startup',
        targetId: payflow.id,
        description: 'PayFlow India listing reviewed and approved for public discovery.',
      },
      {
        adminId: adminUser.id,
        action: AuditAction.STARTUP_APPROVED,
        targetType: 'Startup',
        targetId: greengrid.id,
        description: 'GreenGrid Mobility listing verified and approved.',
      },
    ],
  })

  console.log('✅ Created Administrative Audit Logs')
  console.log('🎉 Seed completed successfully! All demo records created with password: Password@123')
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
