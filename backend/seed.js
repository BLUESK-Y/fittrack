require("dotenv").config();
const mongoose = require("mongoose");
const Challenge = require("./models/Challenge");

const challenges = [
  {
    title: "30-Day Cardio Blast",
    description: "Burn fat and boost your cardiovascular fitness with daily cardio sessions ranging from HIIT to steady-state runs. Perfect for those looking to improve endurance and shed extra pounds.",
    category: "Cardio",
    level: "Beginner",
    duration: 30,
    points: 150,
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "6-Week Strength Builder",
    description: "Progressive overload training designed to build raw strength and muscle mass. Covers compound lifts — squat, deadlift, bench press, and overhead press — with structured progression.",
    category: "Strength",
    level: "Intermediate",
    duration: 42,
    points: 250,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "21-Day Yoga Flow",
    description: "A daily yoga challenge to improve flexibility, balance, and mindfulness. Each session blends Vinyasa flows with restorative poses to leave you feeling energized and calm.",
    category: "Flexibility",
    level: "Beginner",
    duration: 21,
    points: 120,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Marathon Prep 60-Day",
    description: "A structured 60-day running plan that takes you from 5K to marathon-ready. Includes tempo runs, long runs, and recovery days crafted by certified running coaches.",
    category: "Endurance",
    level: "Advanced",
    duration: 60,
    points: 400,
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Core Crusher 14-Day",
    description: "Two intense weeks of daily core work targeting your abs, obliques, and lower back. Planks, crunches, leg raises, and more — sculpt a strong, functional midsection.",
    category: "Strength",
    level: "Beginner",
    duration: 14,
    points: 100,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "HIIT Inferno 28-Day",
    description: "High-intensity interval training at its most intense. Short explosive bursts followed by brief rests to maximize calorie burn and improve anaerobic capacity in just 28 days.",
    category: "Cardio",
    level: "Advanced",
    duration: 28,
    points: 300,
    image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Flexibility Foundations",
    description: "A 30-day program to dramatically improve your range of motion. Daily stretching routines covering all major muscle groups with guided progressions for deeper stretches each week.",
    category: "Flexibility",
    level: "Beginner",
    duration: 30,
    points: 130,
    image: "https://images.unsplash.com/photo-1517130038641-a774d04afb3c?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Power Lifting Pro",
    description: "An advanced 8-week powerlifting program focused on maximizing your one-rep max in squat, bench, and deadlift. Periodization-based training for serious lifters.",
    category: "Strength",
    level: "Advanced",
    duration: 56,
    points: 450,
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Cycling Century Prep",
    description: "Train to complete a 100-mile cycling event in 45 days. Combines interval rides, hill climbs, and endurance builds to prepare your legs and lungs for the ultimate cycling challenge.",
    category: "Endurance",
    level: "Intermediate",
    duration: 45,
    points: 280,
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Body Weight Beast",
    description: "No gym? No problem. Master push-ups, pull-ups, dips, and squats to build a powerful physique using nothing but your bodyweight over 35 days of progressive calisthenics.",
    category: "Strength",
    level: "Intermediate",
    duration: 35,
    points: 200,
    image: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "5K Runner Kickstart",
    description: "Go from couch to 5K in just 21 days with this beginner-friendly running plan. Alternating walk-run intervals gradually build your stamina without risking injury.",
    category: "Cardio",
    level: "Beginner",
    duration: 21,
    points: 110,
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Pilates Powerhouse",
    description: "Strengthen your core and improve posture with 28 days of Pilates. Low-impact, high-precision movements that tone deep stabilizing muscles and relieve chronic back pain.",
    category: "Flexibility",
    level: "Intermediate",
    duration: 28,
    points: 160,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Ironman 90-Day Prep",
    description: "The ultimate endurance challenge. A 90-day triathlon prep plan covering swimming, cycling, and running. Structured periodization brings peak performance on race day.",
    category: "Endurance",
    level: "Advanced",
    duration: 90,
    points: 600,
    image: "https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Jump Rope Revolution",
    description: "Upgrade your cardio game with 30 days of jump rope training. From basic jumps to double-unders, this challenge burns calories, improves coordination, and sharpens footwork.",
    category: "Cardio",
    level: "Intermediate",
    duration: 30,
    points: 175,
    image: "https://images.unsplash.com/photo-1616279969965-d1f6ba87d4e8?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Mobility Mastery",
    description: "Unlock full-body mobility in 21 days. Combines foam rolling, dynamic stretching, and joint mobilization drills that athletes use to stay injury-free and perform at their best.",
    category: "Flexibility",
    level: "Intermediate",
    duration: 21,
    points: 140,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Hypertrophy Hustle",
    description: "Science-backed muscle hypertrophy program spanning 48 days. High volume training split across push, pull, and legs to maximize muscle growth with progressive overload.",
    category: "Strength",
    level: "Intermediate",
    duration: 48,
    points: 320,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Swimming Endurance Challenge",
    description: "Build open-water endurance in 30 days. Daily pool sessions cover freestyle technique, breathing drills, and progressive distance builds from 500m to 2km continuous swims.",
    category: "Endurance",
    level: "Intermediate",
    duration: 30,
    points: 220,
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Dance Cardio Party",
    description: "Turn fitness into fun with 14 days of dance cardio. High-energy routines set to upbeat music burn 400–600 calories per session while improving rhythm and coordination.",
    category: "Cardio",
    level: "Beginner",
    duration: 14,
    points: 90,
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Stair Climber 30-Day",
    description: "Use stairs as your gym with this 30-day stair climbing challenge. Builds powerful glutes, quads, and cardiovascular fitness with nothing but a staircase and your determination.",
    category: "Cardio",
    level: "Beginner",
    duration: 30,
    points: 130,
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format&fit=crop",
    isActive: true,
  },
  {
    title: "Athlete Performance Peak",
    description: "Elite 60-day sports performance program combining speed, agility, power, and endurance training. Designed for competitive athletes looking to gain a decisive edge in their sport.",
    category: "Endurance",
    level: "Advanced",
    duration: 60,
    points: 500,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop",
    isActive: true,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Challenge.deleteMany({});
    console.log("Cleared existing challenges");

    const inserted = await Challenge.insertMany(challenges);
    console.log(`✅ Inserted ${inserted.length} challenges`);

    await mongoose.disconnect();
    console.log("Done.");
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
