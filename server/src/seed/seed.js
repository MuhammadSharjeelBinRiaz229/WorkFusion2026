import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
import { Review } from "../models/Review.js";
import { Notification } from "../models/Notification.js";
import { Category } from "../models/Category.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { Recommendation } from "../models/Recommendation.js";
import { UserRole, UserStatus, ServiceType, WorkType, JobStatus, ApplicationStatus, MessageType, NotificationType } from "shared";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/workfusion";

// Cities in Pakistan
const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Peshawar", "Multan", "Sialkot"];

// Mock Skills
const SKILLS_DATA = [
  "React", "Node.js", "Express.js", "MongoDB", "TypeScript", "JavaScript", "HTML5", "CSS3", "Next.js", "TailwindCSS",
  "Figma", "Adobe Illustrator", "Adobe Photoshop", "Adobe Premiere Pro", "After Effects", "Logo Design", "UI/UX Design",
  "Flutter", "Dart", "Android SDK", "iOS Swift", "React Native",
  "Python", "scikit-learn", "pandas", "numpy", "Django", "FastAPI", "Machine Learning", "NLP",
  "Docker", "AWS", "Google Cloud", "CI/CD", "Git", "Kubernetes", "Linux",
  "Electrician", "House Wiring", "Generator Repair", "AC Installation", "AC Repair", "Inverter Technology",
  "Plumbing", "Leak Fixing", "Sanitary Fitting", "Drainage Unblocking", "Water Pump Repair",
  "Mechanic", "Car Tuning", "EFI Diagnosis", "Engine Overhaul", "Brake Repair", "Suspension Repair",
  "Deep Cleaning", "Sofa Cleaning", "Carpet Washing", "Disinfection Services", "Office Cleaning",
  "Math Tutoring", "Physics Tutoring", "Programming Coach", "English Writing", "Chemistry Tutoring",
  "Wedding Photography", "Portrait Photography", "Product Shoot", "Photo Editing", "Videography",
  "Digital Marketing", "SEO Optimization", "Social Media Management", "Content Writing", "Copywriting"
];

// Clean databases and load seed
const seedDatabase = async () => {
  try {
    console.log("Connecting to Database for seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected. Clearing collections...");

    // Drop indexes first to purge any stale index definitions from prior schema versions
    await User.collection.dropIndexes().catch(() => {});
    await Job.collection.dropIndexes().catch(() => {});
    await Application.collection.dropIndexes().catch(() => {});
    await Chat.collection.dropIndexes().catch(() => {});
    await Message.collection.dropIndexes().catch(() => {});
    await Review.collection.dropIndexes().catch(() => {});
    await Notification.collection.dropIndexes().catch(() => {});
    await Category.collection.dropIndexes().catch(() => {});
    await ActivityLog.collection.dropIndexes().catch(() => {});
    await Recommendation.collection.dropIndexes().catch(() => {});

    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Chat.deleteMany({});
    await Message.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    await Category.deleteMany({});
    await ActivityLog.deleteMany({});
    await Recommendation.deleteMany({});

    console.log("Collections cleared. Beginning seed execution...");

    // 1. SEED CATEGORIES
    const parentCategories = [
      { name: "Software Development", description: "Digital jobs for software engineers, web and mobile developers.", icon: "code" },
      { name: "Graphic & Creative Design", description: "Designers specializing in branding, illustrations, UI/UX, and videos.", icon: "palette" },
      { name: "Local Handyman Services", description: "On-site home repairs: electrical, plumbing, AC maintenance.", icon: "wrench" },
      { name: "Education & Tutoring", description: "Private coaching, academic help, and skill-based trainers.", icon: "graduation-cap" },
      { name: "Photography & Media", description: "Visual documentation: events, commercial product shoots, video edits.", icon: "camera" },
      { name: "Digital Marketing", description: "Growth services: search engine rankings, social media, copywriting.", icon: "trending-up" },
    ];

    const categoryDocs = [];
    for (const cat of parentCategories) {
      const doc = new Category(cat);
      await doc.save();
      categoryDocs.push(doc);
    }
    console.log(`Successfully seeded ${categoryDocs.length} primary categories.`);

    // Add sub-categories
    const subCategories = [
      { name: "Web Development", parentCategory: categoryDocs[0]._id },
      { name: "Mobile App Development", parentCategory: categoryDocs[0]._id },
      { name: "Data Science & AI", parentCategory: categoryDocs[0]._id },
      { name: "UI/UX & Web Design", parentCategory: categoryDocs[1]._id },
      { name: "Logo & Branding", parentCategory: categoryDocs[1]._id },
      { name: "AC & Fridge Services", parentCategory: categoryDocs[2]._id },
      { name: "Electrical Wiring & Repair", parentCategory: categoryDocs[2]._id },
      { name: "Sanitary & Plumbing Installation", parentCategory: categoryDocs[2]._id },
      { name: "Math & Science Tutoring", parentCategory: categoryDocs[3]._id },
      { name: "Coding & Tech Coaching", parentCategory: categoryDocs[3]._id },
    ];

    for (const sub of subCategories) {
      await Category.create(sub);
    }
    console.log("Successfully seeded sub-categories.");

    // 2. SEED ADMIN USER
    const adminPassword = await bcrypt.hash("password123", 10);
    await User.create({
      fullName: "WorkFusion Admin",
      email: "admin@workfusion.com",
      password: adminPassword,
      role: UserRole.ADMIN,
      roles: [UserRole.ADMIN],
      city: "Islamabad",
      cnic: "37405-0000000-1",
      deviceId: "admin_device",
      skills: ["Management", "Moderation", "Analytics"],
      experience: 5,
      isVerified: true,
      profileCompletion: 100,
    });
    console.log("Admin account generated: admin@workfusion.com");

    // 3. SEED EMPLOYERS (20 Users)
    const employerNames = [
      "TechNova Solutions", "ByteForge Technologies", "PixelCraft Studio", "Nexa Digital", 
      "Alpha Builders", "Elite Tutors Academy", "Urban Interiors", "FutureSoft", "Smart Electrical Services",
      "Apex Media Group", "Stellar Marketing", "InnoTech Labs", "Creative Canvas", "Pakistan Auto EFI",
      "Green Clean Services", "EduReach Academy", "Faisal Plumbing Works", "Visionary Designs", "Karachi Coding Hub",
      "Prime Development"
    ];

    const employerDocs = [];
    const generalPassword = await bcrypt.hash("password123", 10);

    for (let i = 0; i < employerNames.length; i++) {
      const company = employerNames[i];
      const city = CITIES[i % CITIES.length];
      
      const doc = new User({
        fullName: `${company} Manager`,
        email: `employer${i + 1}@workfusion.com`,
        password: generalPassword,
        role: UserRole.EMPLOYER,
        roles: [UserRole.EMPLOYER],
        phone: `+92-300-11223${i.toString().padStart(2, "0")}`,
        cnic: `37405-11111${i.toString().padStart(2, "0")}-1`,
        deviceId: `employer_device_${i}`,
        city,
        bio: `${company} is a leading provider of premium professional services, based out of ${city}, Pakistan. We specialize in fast-paced scaling and delivering results.`,
        address: `${i + 12} Blue Area, Sector F-6, ${city}`,
        isVerified: i % 3 === 0,
        rating: Math.round((4.0 + (i % 11) * 0.1) * 10) / 10,
        reviewCount: 2 + i,
        profileCompletion: 80,
      });
      await doc.save();
      employerDocs.push(doc);
    }
    console.log(`Successfully seeded ${employerDocs.length} Employers.`);

    // 4. SEED SERVICE SEEKERS (30 Users)
    const seekerProfiles = [
      { name: "Muhammad Ali", bio: "Senior MERN Stack Developer. Passionate about building performant scalable web apps with React, Node, and TypeScript.", skills: ["React", "Node.js", "Express.js", "MongoDB", "TypeScript", "JavaScript", "HTML5", "CSS3", "Next.js", "TailwindCSS"], experience: 5, preferred: WorkType.FULL_TIME },
      { name: "Zainab Khan", bio: "UI/UX Designer. Experienced in making user-centric interfaces on Figma with visual excellence.", skills: ["Figma", "UI/UX Design", "Logo Design", "Adobe Photoshop", "Adobe Illustrator"], experience: 3, preferred: WorkType.PROJECT },
      { name: "Fatima Zahra", bio: "Mobile application developer. Specialized in cross-platform development using Flutter & Dart.", skills: ["Flutter", "Dart", "Android SDK", "iOS Swift", "Git"], experience: 4, preferred: WorkType.FULL_TIME },
      { name: "Bilal Ahmed", bio: "Professional HVAC technician. Over 8 years of experience in AC installation, repair, and cleaning.", skills: ["AC Installation", "AC Repair", "Inverter Technology", "Electrician"], experience: 8, preferred: WorkType.HOURLY },
      { name: "Aisha Khan", bio: "Academic tutor for college mathematics and physics. Helping students learn complex topics easily.", skills: ["Math Tutoring", "Physics Tutoring", "Chemistry Tutoring"], experience: 6, preferred: WorkType.PART_TIME },
      { name: "Muhammad Usman", bio: "Certified domestic and commercial electrician. Experienced in house wiring, breaker repairs, and generator checks.", skills: ["Electrician", "House Wiring", "Generator Repair"], experience: 7, preferred: WorkType.HOURLY },
      { name: "Hamza Shah", bio: "Experienced automobile mechanic. Diagnostics, engine repair, EFI tuning, suspension overhauls.", skills: ["Mechanic", "Car Tuning", "EFI Diagnosis", "Engine Overhaul"], experience: 5, preferred: WorkType.MONTHLY },
      { name: "Zainab Bibi", bio: "Creative content creator and digital marketer. Managing social media ads, campaigns, and copywriting.", skills: ["Digital Marketing", "SEO Optimization", "Social Media Management", "Content Writing"], experience: 2, preferred: WorkType.PART_TIME },
      { name: "Asad Mahmood", bio: "Full-stack web engineer. Specializes in building modern SaaS products using Node and React.", skills: ["React", "Node.js", "MongoDB", "Next.js", "TailwindCSS", "Docker", "AWS"], experience: 4, preferred: WorkType.FULL_TIME },
      { name: "Mariam Malik", bio: "Digital illustrator and graphic designer. Visual branding and commercial poster designs.", skills: ["Figma", "Logo Design", "Adobe Illustrator", "Photo Editing"], experience: 3, preferred: WorkType.PROJECT },
      { name: "Saad Sheikh", bio: "Plumbing specialist. Kitchen sanitary fittings, pump installations, leak diagnosis.", skills: ["Plumbing", "Leak Fixing", "Sanitary Fitting", "Water Pump Repair"], experience: 10, preferred: WorkType.HOURLY },
      { name: "Kiran Jameel", bio: "Professional cleaning provider. Deep sanitation of homes, offices, carpets, and sofas.", skills: ["Deep Cleaning", "Sofa Cleaning", "Carpet Washing", "Disinfection Services"], experience: 5, preferred: WorkType.HOURLY },
      { name: "Haris Ali", bio: "Computer science instructor and coding trainer. Offering programming coaching in Python and Javascript.", skills: ["Programming Coach", "Python", "JavaScript", "FastAPI"], experience: 4, preferred: WorkType.PART_TIME },
      { name: "Sanaullah Khan", bio: "Photographer and videographer. Covering weddings, corporate shoots, and high-quality product setups.", skills: ["Wedding Photography", "Portrait Photography", "Product Shoot", "Video Editing"], experience: 6, preferred: WorkType.PROJECT },
      { name: "Ayesha Ahmed", bio: "SEO specialist and copywriter. Helping business websites rank on Google with SEO copywriting.", skills: ["Digital Marketing", "SEO Optimization", "Content Writing", "Copywriting"], experience: 3, preferred: WorkType.PROJECT },
      ...Array.from({ length: 15 }).map((_, index) => {
        const id = index + 16;
        return {
          name: `Seeker Candidate ${id}`,
          bio: `Experienced specialist in various general labor and digital domains. Professional, dedicated, and target-driven.`,
          skills: [SKILLS_DATA[id % SKILLS_DATA.length], SKILLS_DATA[(id + 5) % SKILLS_DATA.length]],
          experience: 2 + (id % 5),
          preferred: id % 2 === 0 ? WorkType.PROJECT : WorkType.FULL_TIME,
        };
      })
    ];

    const seekerDocs = [];

    for (let i = 0; i < seekerProfiles.length; i++) {
      const profile = seekerProfiles[i];
      const city = CITIES[i % CITIES.length];
      
      const doc = new User({
        fullName: profile.name,
        email: `seeker${i + 1}@workfusion.com`,
        password: generalPassword,
        role: UserRole.SEEKER,
        roles: [UserRole.SEEKER],
        phone: `+92-333-55667${i.toString().padStart(2, "0")}`,
        cnic: `37405-22222${i.toString().padStart(2, "0")}-1`,
        deviceId: `seeker_device_${i}`,
        city,
        bio: profile.bio,
        address: `${i + 45} G-Sector, Street 3, ${city}`,
        skills: profile.skills,
        experience: profile.experience,
        preferredWorkType: profile.preferred,
        languages: ["Urdu", "English"],
        certifications: [`Certified ${profile.skills[0]} Specialist`],
        availability: "Immediate Availability",
        education: [
          { degree: "Bachelor of Science", school: `${city} Central University`, year: 2018 + (i % 5) }
        ],
        portfolio: [
          {
            title: `SaaS Dashboard ${i + 1}`,
            description: `A responsive control panel project integrated with analytics modules, designed for scalable business administration. Built with ${profile.skills[0]} and ${profile.skills[1] || "Tailwind"}.`,
            technologies: [profile.skills[0], profile.skills[1] || "CSS"],
            github: "https://github.com/demo/project",
            demo: "https://demo.project.com"
          }
        ],
        resume: `https://workfusion-resumes.s3.amazonaws.com/seeker${i + 1}_resume.pdf`,
        isVerified: i % 2 === 0,
        rating: Math.round((4.2 + (i % 9) * 0.1) * 10) / 10,
        reviewCount: 4 + i,
        profileCompletion: 90,
        status: UserStatus.ACTIVE,
      });

      await doc.save();
      seekerDocs.push(doc);
    }
    console.log(`Successfully seeded ${seekerDocs.length} Service Seekers.`);

    // 5. SEED JOBS (45 Jobs)
    const jobTemplates = [
      { title: "Senior React Developer Needed", desc: "We are seeking a senior React developer to lead the implementation of our modular dashboard panel. Must have experience with context patterns, async rendering, and TailwindCSS.", category: "Web Development", skills: ["React", "TypeScript", "TailwindCSS"], service: ServiceType.ONLINE, work: WorkType.PROJECT, budget: 150000, exp: 5 },
      { title: "MERN Stack Engineer for SaaS", desc: "Build a complete web app using Node.js, Express, and MongoDB. You will implement backend JWT authorizations, schema designs, and connect to a frontend React admin dashboard.", category: "Web Development", skills: ["React", "Node.js", "Express.js", "MongoDB"], service: ServiceType.ONLINE, work: WorkType.PROJECT, budget: 250000, exp: 4 },
      { title: "Figma UI/UX Landing Page Design", desc: "Design a high-converting premium landing page for an AI employment marketplace. Inspired by Apple, Stripe, and Vercel aesthetic benchmarks. Expect wireframes, design tokens, and prototypes.", category: "UI/UX & Web Design", skills: ["Figma", "UI/UX Design"], service: ServiceType.ONLINE, work: WorkType.PROJECT, budget: 45000, exp: 2 },
      { title: "Cross-Platform Flutter Developer", desc: "Develop an app from scratch using Flutter and Dart. Integration with REST APIs and state management (Provider/Bloc) is required. Clean and well-commented code is a must.", category: "Mobile App Development", skills: ["Flutter", "Dart", "Git"], service: ServiceType.ONLINE, work: WorkType.FULL_TIME, budget: 120000, exp: 3 },
      { title: "Urgent: Home AC Deep Cleaning & Gas Refill", desc: "Looking for an HVAC technician in Islamabad for deep cleaning of 3 split AC units and gas recharging. Must bring own high-pressure cleaning pumps and tools.", category: "AC & Fridge Services", skills: ["AC Repair", "AC Installation"], service: ServiceType.PHYSICAL, work: WorkType.HOURLY, budget: 8000, exp: 3 },
      { title: "House Electrician for Inverter Install", desc: "Need a certified electrician for installing an automatic generator transfer switch and setting up an solar hybrid inverter. Proximity to Lahore is preferred.", category: "Electrical Wiring & Repair", skills: ["Electrician", "Generator Repair"], service: ServiceType.PHYSICAL, work: WorkType.HOURLY, budget: 12000, exp: 4 },
      { title: "Bathroom Leak and Pipe Repair", desc: "Looking for a plumber to locate and fix a leakage issue causing wall dampness in the guest bathroom. Replacement of sanitary pipelines might be required.", category: "Sanitary & Plumbing Installation", skills: ["Plumbing", "Leak Fixing"], service: ServiceType.PHYSICAL, work: WorkType.HOURLY, budget: 5000, exp: 5 },
      { title: "EFI Tuning & Diagnostic check", desc: "My Civic EFI engine is stalling. I need a mechanic with EFI scanners to diagnose engine codes, clean the throttle body, and check the fuel pump system.", category: "Mechanic", skills: ["Mechanic", "EFI Diagnosis"], service: ServiceType.PHYSICAL, work: WorkType.HOURLY, budget: 6000, exp: 3 },
      { title: "O-Levels Math & Physics Online Tutor", desc: "We need an academic tutor for O-Levels mathematics and physics courses. Virtual classes will be held three times a week. Explanatory concepts and past papers practice are expected.", category: "Math & Science Tutoring", skills: ["Math Tutoring", "Physics Tutoring"], service: ServiceType.ONLINE, work: WorkType.MONTHLY, budget: 25000, exp: 3 },
      { title: "Python Programming Tutor needed", desc: "Seeking an experienced coach to teach python coding, pandas, and scikit-learn basics to a beginner student. Classes will be held online.", category: "Coding & Tech Coaching", skills: ["Programming Coach", "Python"], service: ServiceType.ONLINE, work: WorkType.MONTHLY, budget: 30000, exp: 2 },
      { title: "Wedding Photography Portfolio Shoot", desc: "Looking for a photographer for a 2-day outdoor wedding photo shoot. High-end camera gear, lighting setups, and final digital album delivery with post-processing edits are expected.", category: "Photography & Media", skills: ["Wedding Photography", "Portrait Photography", "Photo Editing"], service: ServiceType.PHYSICAL, work: WorkType.PROJECT, budget: 90000, exp: 4 },
      { title: "Digital Marketing & SEO Lead", desc: "Optimize our local business website to rank on top search terms. Set up Google Business profile, write SEO optimized articles, and manage monthly social media ad accounts.", category: "Digital Marketing", skills: ["Digital Marketing", "SEO Optimization", "Social Media Management"], service: ServiceType.HYBRID, work: WorkType.MONTHLY, budget: 75000, exp: 2 }
    ];

    const jobDocs = [];
    for (let i = 0; i < 45; i++) {
      const template = jobTemplates[i % jobTemplates.length];
      const employer = employerDocs[i % employerDocs.length];
      const city = CITIES[i % CITIES.length];

      let status = JobStatus.OPEN;
      if (i > 30) status = JobStatus.CLOSED;
      else if (i > 25) status = JobStatus.PAUSED;

      const doc = new Job({
        title: `${template.title} - ${i + 1}`,
        description: template.desc,
        category: template.category,
        serviceType: template.service,
        workType: template.work,
        requiredSkills: template.skills,
        experienceRequired: template.exp,
        experienceLevel: i % 3 === 0 ? "Expert" : i % 3 === 1 ? "Intermediate" : "Entry Level",
        timeline: i % 2 === 0 ? "1 - 3 months" : "Less than 1 month",
        budget: template.budget + (i % 5) * 5000,
        currency: "PKR",
        location: city,
        remoteAllowed: template.service === ServiceType.ONLINE,
        vacancies: 1,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status,
        employerId: employer._id,
      });

      await doc.save();
      jobDocs.push(doc);
    }
    console.log(`Successfully seeded ${jobDocs.length} Jobs.`);

    // 6. SEED APPLICATIONS (70 Applications)
    const appDocs = [];
    const appStatuses = [
      ApplicationStatus.APPLIED, ApplicationStatus.PENDING, ApplicationStatus.REVIEWED,
      ApplicationStatus.INTERVIEW, ApplicationStatus.ACCEPTED, ApplicationStatus.HIRED,
      ApplicationStatus.COMPLETED, ApplicationStatus.REJECTED
    ];

    for (let i = 0; i < 70; i++) {
      const job = jobDocs[i % jobDocs.length];
      const seeker = seekerDocs[i % seekerDocs.length];

      const isDuplicate = appDocs.some((a) => a.jobId.toString() === job._id.toString() && a.seekerId.toString() === seeker._id.toString());
      if (isDuplicate) continue;

      let status = appStatuses[i % appStatuses.length];
      if (job.status === JobStatus.CLOSED) {
        status = i % 2 === 0 ? ApplicationStatus.COMPLETED : ApplicationStatus.REJECTED;
      }

      let score = 50;
      const matchCount = job.requiredSkills.filter((s) => seeker.skills.includes(s)).length;
      if (matchCount > 0) {
        score = 60 + (matchCount / job.requiredSkills.length) * 35;
      }
      score = Math.min(Math.round(score), 99);

      const doc = new Application({
        jobId: job._id,
        seekerId: seeker._id,
        proposal: `Hello, I am writing to apply for the "${job.title}" position. I have over ${seeker.experience} years of experience in these domains, particularly working with ${seeker.skills.slice(0, 3).join(", ")}. Please review my profile and portfolio projects.`,
        resume: seeker.resume,
        portfolio: [seeker.portfolio[0]?.demo || ""],
        expectedSalary: job.budget - 2000 + (i % 5) * 1000,
        availability: "Available to start within 3 days",
        estimatedTime: i % 3 === 0 ? "2 weeks" : i % 3 === 1 ? "1 month" : "5 days",
        status,
        matchScore: score,
      });

      await doc.save();
      appDocs.push(doc);
    }
    console.log(`Successfully seeded ${appDocs.length} Job Applications.`);

    // 7. SEED CHATS & MESSAGES (10 Chats, 100 Messages)
    const chatEligibleApps = appDocs.filter((app) => 
      app.status === ApplicationStatus.INTERVIEW ||
      app.status === ApplicationStatus.ACCEPTED ||
      app.status === ApplicationStatus.HIRED ||
      app.status === ApplicationStatus.COMPLETED
    );

    let chatCounter = 0;
    const conversationTemplates = [
      { text: "Hello! Thanks for applying. I reviewed your MERN stack profile and I'm very impressed with your portfolio project. Are you available for a quick technical interview call?", isEmp: true },
      { text: "Hello! Thank you for the positive response. Yes, I am absolutely available. We can schedule a video call today or tomorrow. Please let me know what time works best for you.", isEmp: false },
      { text: "Tomorrow at 3:00 PM PKR works best for our team. I will send you the invite links.", isEmp: true },
      { text: "Sounds perfect. I've noted down the time. I will prepare my local code setups to walk you through the system modules.", isEmp: false },
      { text: "Great! One quick question: Have you worked with Docker and AWS deployment configurations in your past projects?", isEmp: true },
      { text: "Yes, I have containerized my Express APIs using Docker and set up automated CI/CD deployments to Render and AWS EC2 instances.", isEmp: false },
      { text: "Perfect. Looking forward to speaking with you tomorrow. Best of luck!", isEmp: true },
      { text: "Thank you! Have a great day ahead.", isEmp: false },
      { text: "Hi, I have sent you the project document details. Let me know if you have any questions before we finalize the budget.", isEmp: true },
      { text: "Got the document! The requirements are very clear. I can start working on this immediately.", isEmp: false },
    ];

    for (const app of chatEligibleApps) {
      if (chatCounter >= 10) break;

      const job = await Job.findById(app.jobId);
      if (!job) continue;

      const chat = await Chat.create({
        jobId: app.jobId,
        employerId: job.employerId,
        seekerId: app.seekerId,
        status: "Active",
      });

      for (let m = 0; m < 10; m++) {
        const template = conversationTemplates[m];
        const senderId = template.isEmp ? job.employerId : app.seekerId;
        
        await Message.create({
          chatId: chat._id,
          senderId,
          type: MessageType.TEXT,
          message: template.text,
          seen: m < 8,
          createdAt: new Date(Date.now() - (10 - m) * 60 * 60 * 1000),
        });
      }
      chatCounter++;
    }
    console.log(`Successfully seeded ${chatCounter} secure Chats with 100 conversation Messages.`);

    // 8. SEED REVIEWS (50 Reviews)
    const completedApps = appDocs.filter((a) => a.status === ApplicationStatus.COMPLETED);
    let reviewCount = 0;

    const reviewComments = [
      "Excellent work! Delivered the MERN project ahead of schedule. Highly recommended developer.",
      "Very professional handyman. Solved my AC cooling leakage issue quickly. Excellent skills.",
      "The O-Levels math classes were very informative. My child has improved concepts significantly.",
      "Stunning wedding photographs! The edits were extremely elegant. Will hire again for sure.",
      "Completed SEO optimization targets perfectly. We saw organic search rank increases within weeks.",
      "Great communication, high-quality code, and extremely helpful during deployment integration.",
    ];

    for (const app of completedApps) {
      if (reviewCount >= 50) break;

      const job = await Job.findById(app.jobId);
      if (!job) continue;

      const employerId = job.employerId;
      const seekerId = app.seekerId;

      await Review.create({
        jobId: job._id,
        reviewer: seekerId,
        receiver: employerId,
        rating: 4 + (reviewCount % 2),
        comment: "Great experience working with this client. Clear specifications and prompt payouts.",
      });

      await Review.create({
        jobId: job._id,
        reviewer: employerId,
        receiver: seekerId,
        rating: 4 + ((reviewCount + 1) % 2),
        comment: reviewComments[reviewCount % reviewComments.length],
      });

      reviewCount += 2;
    }
    console.log(`Successfully seeded ${reviewCount} completed-contract Reviews.`);

    // 9. SEED NOTIFICATIONS (100 Notifications)
    const notificationTitles = [
      "New Job Recommendation", "Application Under Review", "Interview Scheduled",
      "New Message Received", "Contract Completed Successfully", "Profile 90% Completed"
    ];

    const notificationBodies = [
      "We found a new job matching your MERN stack developer skills. Apply now!",
      "The employer has updated your application status for Web Engineer to 'Reviewed'.",
      "An interview has been scheduled! The chat channel is now active for messaging.",
      "You have received a new file attachment in your active chat thread.",
      "Congratulations! The contract has been marked as completed. Please leave a review.",
      "Complete your portfolio details to boost your AI recommendation match score!"
    ];

    let notifCounter = 0;
    for (let i = 0; i < 100; i++) {
      const user = i % 2 === 0 ? seekerDocs[i % seekerDocs.length] : employerDocs[i % employerDocs.length];
      
      let notifType = NotificationType.SYSTEM;
      if (i % 6 === 0) notifType = NotificationType.RECOMMENDATION;
      else if (i % 6 === 1) notifType = NotificationType.APPLICATION;
      else if (i % 6 === 2) notifType = NotificationType.INTERVIEW;
      else if (i % 6 === 3) notifType = NotificationType.MESSAGE;
      
      await Notification.create({
        userId: user._id,
        title: notificationTitles[i % notificationTitles.length],
        body: notificationBodies[i % notificationBodies.length],
        type: notifType,
        read: i % 3 === 0,
        createdAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
      });
      notifCounter++;
    }
    console.log(`Successfully seeded ${notifCounter} user Notifications.`);

    console.log("\n==========================================");
    console.log("DATABASE SEED COMPLETED SUCCESSFULLY!");
    console.log("Check lists:");
    console.log(`- Admin: admin@workfusion.com (password123)`);
    console.log(`- Employer: employer1@workfusion.com (password123)`);
    console.log(`- Seeker: seeker1@workfusion.com (password123)`);
    console.log("==========================================\n");

    process.exit(0);
  } catch (err) {
    console.error(`Database seeding failed: ${err.message}`);
    process.exit(1);
  }
};

seedDatabase();
