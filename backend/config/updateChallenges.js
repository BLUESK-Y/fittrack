const Challenge = require("../models/Challenge");

// Shorthand workout builder
const w = (name, sets, reps) => ({ name, sets, reps });

// Generates full roadmap — days 4 & 7 are rest, days 1/2/3/5/6 are workout
const makeRoadmap = (weekConfigs) =>
  weekConfigs.map((wc, wi) => {
    const days = [];
    let wIdx = 0;
    for (let di = 0; di < 7; di++) {
      if (di === 3 || di === 6) {
        days.push({ day: di + 1, type: "rest", name: "Rest & Recovery", sets: null, reps: null });
      } else {
        const workout = wc.workouts[wIdx++];
        days.push({ day: di + 1, type: "workout", name: workout.name, sets: workout.sets, reps: workout.reps });
      }
    }
    return { week: wi + 1, title: wc.title, status: "locked", days };
  });

const challengeUpdates = [
  // ─────────────────────────────────────────────
  // 1. 30-Day Cardio Blast
  // ─────────────────────────────────────────────
  {
    title: "30-Day Cardio Blast",
    heroImage: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop",
    tags: ["Cardio", "Fat Burn"],
    participants: 312,
    equipment: "No Equipment",
    coach: { name: "Sarah Mitchell", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    rating: { value: 4.6, reviews: 1850 },
    overview: {
      short: "Burn fat and boost cardiovascular fitness with daily cardio sessions.",
      long: "A progressive 30-day cardio program combining HIIT, steady-state runs, and active recovery days. Each week increases in intensity to maximize fat burn and improve endurance without overwhelming beginners.",
    },
    rules: ["Complete sessions 5 days per week", "Log every workout", "Stay hydrated throughout"],
    benefits: [
      { title: "Fat Burn", description: "Maximize calorie burn with varied cardio formats." },
      { title: "Endurance", description: "Build cardiovascular stamina week by week." },
      { title: "Energy Boost", description: "Feel more energized throughout your day." },
    ],
    included: ["30 Guided Workout Videos", "Cardio Progress Tracker", "Nutrition Tips Guide"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Jumping Jacks", 3, "30 reps"), w("High Knees", 3, "40 sec"), w("Burpees", 2, "8 reps"), w("Jump Rope", 3, "1 min"), w("Running", 1, "15 min")] },
      { title: "Building", workouts: [w("High Knees", 3, "1 min"), w("Jumping Jacks", 4, "40 reps"), w("Shadow Boxing", 3, "2 min"), w("Cycling", 1, "20 min"), w("Stair Climbs", 3, "3 min")] },
      { title: "Intensity", workouts: [w("Burpees", 3, "15 reps"), w("Dance Cardio", 1, "25 min"), w("High Knees", 4, "1 min"), w("Running", 1, "25 min"), w("Jump Rope", 4, "2 min")] },
      { title: "Peak", workouts: [w("Burpees", 4, "20 reps"), w("Stair Climbs", 4, "5 min"), w("Shadow Boxing", 4, "3 min"), w("Cycling", 1, "35 min"), w("Running", 1, "30 min")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 2. 6-Week Strength Builder
  // ─────────────────────────────────────────────
  {
    title: "6-Week Strength Builder",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop",
    tags: ["Strength", "Muscle Building"],
    participants: 445,
    equipment: "Full Gym",
    coach: { name: "Marcus Reed", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    rating: { value: 4.8, reviews: 2300 },
    overview: {
      short: "Build raw strength with progressive overload compound lifts.",
      long: "A 6-week program centered on the big four lifts — squat, deadlift, bench press, and overhead press. Each week adds weight or volume to drive consistent strength gains through structured periodization.",
    },
    rules: ["Train 5 days per week", "Track your lifts every session", "Warm up before every workout", "Follow progressive overload"],
    benefits: [
      { title: "Raw Strength", description: "Increase your one-rep max on major lifts." },
      { title: "Muscle Mass", description: "Build lean muscle with compound movements." },
      { title: "Posture", description: "Strengthen stabilizer muscles for better posture." },
    ],
    included: ["42 HD Training Videos", "Strength Tracking Sheet", "Warm-Up Protocol Guide", "Nutrition Plan"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Squat", 3, "8 reps"), w("Bench Press", 3, "8 reps"), w("Barbell Row", 3, "8 reps"), w("Deadlift", 3, "5 reps"), w("Overhead Press", 3, "8 reps")] },
      { title: "Building", workouts: [w("Squat", 3, "10 reps"), w("Bench Press", 3, "10 reps"), w("Romanian Deadlift", 3, "10 reps"), w("Deadlift", 3, "6 reps"), w("Overhead Press", 3, "10 reps")] },
      { title: "Strength", workouts: [w("Squat", 4, "8 reps"), w("Bench Press", 4, "8 reps"), w("Barbell Row", 4, "8 reps"), w("Front Squat", 3, "6 reps"), w("Incline Press", 3, "8 reps")] },
      { title: "Intensity", workouts: [w("Squat", 4, "10 reps"), w("Deadlift", 4, "5 reps"), w("Overhead Press", 4, "8 reps"), w("Barbell Row", 4, "10 reps"), w("Romanian Deadlift", 4, "10 reps")] },
      { title: "Power", workouts: [w("Front Squat", 4, "6 reps"), w("Incline Press", 4, "10 reps"), w("Squat", 5, "5 reps"), w("Deadlift", 4, "4 reps"), w("Bench Press", 5, "5 reps")] },
      { title: "Peak", workouts: [w("Squat", 5, "3 reps"), w("Deadlift", 5, "3 reps"), w("Bench Press", 5, "3 reps"), w("Overhead Press", 5, "5 reps"), w("Barbell Row", 5, "5 reps")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 3. 21-Day Yoga Flow
  // ─────────────────────────────────────────────
  {
    title: "21-Day Yoga Flow",
    heroImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    tags: ["Yoga", "Mindfulness"],
    participants: 528,
    equipment: "Yoga Mat",
    coach: { name: "Priya Sharma", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
    rating: { value: 4.9, reviews: 3100 },
    overview: {
      short: "Improve flexibility, balance, and mindfulness with daily yoga flows.",
      long: "A 21-day beginner yoga journey blending Vinyasa flows with restorative poses. Each session builds on the last, gradually deepening flexibility and introducing breathwork and meditation techniques.",
    },
    rules: ["Practice daily without skipping", "Use a proper yoga mat", "Listen to your body", "Focus on breathing"],
    benefits: [
      { title: "Flexibility", description: "Significantly improve range of motion in 21 days." },
      { title: "Mental Clarity", description: "Reduce stress with daily mindfulness practice." },
      { title: "Balance", description: "Build stability and body awareness." },
    ],
    included: ["21 Guided Yoga Sessions", "Breathing Exercise Guide", "Meditation Starter Pack"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Sun Salutation", 2, "5 reps"), w("Warrior Sequence", 2, "45 sec"), w("Downward Dog Flow", 2, "1 min"), w("Cat-Cow Stretch", 3, "1 min"), w("Child's Pose Flow", 1, "5 min")] },
      { title: "Building", workouts: [w("Warrior Sequence", 3, "1 min"), w("Pigeon Pose", 2, "2 min"), w("Downward Dog Flow", 3, "1 min"), w("Tree Pose", 3, "45 sec"), w("Bridge Pose", 3, "1 min")] },
      { title: "Peak", workouts: [w("Sun Salutation", 3, "8 reps"), w("Pigeon Pose", 3, "2 min"), w("Seated Forward Fold", 3, "2 min"), w("Warrior Sequence", 4, "1 min"), w("Tree Pose", 4, "1 min")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 4. Marathon Prep 60-Day
  // ─────────────────────────────────────────────
  {
    title: "Marathon Prep 60-Day",
    heroImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop",
    tags: ["Running", "Endurance"],
    participants: 187,
    equipment: "Running Shoes",
    coach: { name: "David Okonkwo", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
    rating: { value: 4.7, reviews: 980 },
    overview: {
      short: "Go from 5K to marathon-ready in 60 structured days.",
      long: "A comprehensive 60-day running plan designed by certified running coaches. Combines tempo runs, long runs, interval training, and strategic recovery days to build the aerobic base needed to complete a full marathon.",
    },
    rules: ["Run on scheduled days only", "Log every run with distance and time", "No skipping long run days", "Cross-train on rest days"],
    benefits: [
      { title: "Aerobic Base", description: "Build the cardiovascular foundation for long distance." },
      { title: "Running Economy", description: "Improve efficiency and reduce injury risk." },
      { title: "Mental Toughness", description: "Develop the mindset to push through the wall." },
    ],
    included: ["60-Day Training Schedule", "Race Day Strategy Guide", "Injury Prevention Manual", "Nutrition for Runners"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Easy Run", 1, "20 min"), w("Tempo Run", 1, "20 min"), w("Interval Training", 3, "2 min"), w("Recovery Jog", 1, "15 min"), w("Hill Repeats", 4, "1 min")] },
      { title: "Adaptation", workouts: [w("Easy Run", 1, "25 min"), w("Fartlek Run", 1, "25 min"), w("Tempo Run", 1, "25 min"), w("Recovery Jog", 1, "20 min"), w("Interval Training", 4, "2 min")] },
      { title: "Building", workouts: [w("Easy Run", 1, "30 min"), w("Tempo Run", 1, "30 min"), w("Long Run", 1, "45 min"), w("Hill Repeats", 5, "2 min"), w("Recovery Jog", 1, "25 min")] },
      { title: "Strength", workouts: [w("Interval Training", 5, "3 min"), w("Tempo Run", 1, "35 min"), w("Hill Repeats", 6, "2 min"), w("Easy Run", 1, "35 min"), w("Fartlek Run", 1, "35 min")] },
      { title: "Endurance", workouts: [w("Long Run", 1, "60 min"), w("Tempo Run", 1, "40 min"), w("Easy Run", 1, "40 min"), w("Interval Training", 6, "3 min"), w("Hill Repeats", 6, "3 min")] },
      { title: "Intensity", workouts: [w("Long Run", 1, "75 min"), w("Fartlek Run", 1, "45 min"), w("Tempo Run", 1, "45 min"), w("Hill Repeats", 7, "3 min"), w("Easy Run", 1, "45 min")] },
      { title: "Power", workouts: [w("Long Run", 1, "90 min"), w("Interval Training", 6, "4 min"), w("Tempo Run", 1, "50 min"), w("Fartlek Run", 1, "50 min"), w("Recovery Jog", 1, "30 min")] },
      { title: "Peak", workouts: [w("Long Run", 1, "60 min"), w("Easy Run", 1, "30 min"), w("Tempo Run", 1, "30 min"), w("Recovery Jog", 1, "20 min"), w("Easy Run", 1, "20 min")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 5. Core Crusher 14-Day
  // ─────────────────────────────────────────────
  {
    title: "Core Crusher 14-Day",
    heroImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop",
    tags: ["Core", "Abs"],
    participants: 634,
    equipment: "No Equipment",
    coach: { name: "Jessica Park", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
    rating: { value: 4.5, reviews: 2750 },
    overview: {
      short: "Sculpt a strong core in two intense weeks of daily ab work.",
      long: "Two weeks of targeted core training hitting your abs, obliques, and lower back. Each session is 20-30 minutes and requires zero equipment — perfect for beginners wanting to build a functional, strong midsection.",
    },
    rules: ["Complete all sets daily", "No skipping rest days", "Log every session"],
    benefits: [
      { title: "Core Strength", description: "Build a strong foundation for all movements." },
      { title: "Better Posture", description: "Strengthen your lower back and stabilizers." },
      { title: "Visible Abs", description: "Reduce belly fat and tone your midsection." },
    ],
    included: ["14 Core Workout Videos", "Form Guide PDF", "Daily Checklist"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Plank Hold", 3, "30 sec"), w("Crunches", 3, "15 reps"), w("Leg Raises", 3, "12 reps"), w("Mountain Climbers", 3, "40 sec"), w("Russian Twists", 3, "20 reps")] },
      { title: "Intensity", workouts: [w("Hollow Body Hold", 3, "30 sec"), w("Bicycle Crunches", 4, "20 reps"), w("V-Ups", 3, "15 reps"), w("Flutter Kicks", 3, "45 sec"), w("Plank Hold", 4, "45 sec")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 6. HIIT Inferno 28-Day
  // ─────────────────────────────────────────────
  {
    title: "HIIT Inferno 28-Day",
    heroImage: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&auto=format&fit=crop",
    tags: ["HIIT", "High Intensity"],
    participants: 298,
    equipment: "Minimal",
    coach: { name: "Tyler Cross", avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
    rating: { value: 4.8, reviews: 1670 },
    overview: {
      short: "Maximum calorie burn with explosive HIIT sessions for 28 days.",
      long: "An advanced 28-day HIIT program using short explosive bursts followed by brief recovery periods. Designed to maximize calorie burn, improve anaerobic capacity, and accelerate fat loss in minimum time.",
    },
    rules: ["Give 100% during work periods", "Track heart rate", "Never skip warm-up", "Rest on scheduled days"],
    benefits: [
      { title: "Calorie Burn", description: "Burn up to 600 calories per session." },
      { title: "Metabolism Boost", description: "Elevate metabolism for hours after workout." },
      { title: "Anaerobic Power", description: "Dramatically improve explosive performance." },
    ],
    included: ["28 HIIT Workout Videos", "Heart Rate Zone Guide", "Recovery Protocol", "Meal Timing Guide"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Burpee Intervals", 3, "30 sec"), w("Sprint Drills", 4, "20 sec"), w("Jump Squat Tabata", 4, "20 sec"), w("Plyometric Lunges", 3, "12 reps"), w("Kettlebell Swings", 3, "15 reps")] },
      { title: "Building", workouts: [w("Burpee Intervals", 4, "40 sec"), w("Jump Squat Tabata", 5, "20 sec"), w("Box Jump Circuit", 3, "10 reps"), w("Battle Rope Rounds", 3, "30 sec"), w("Sprint Drills", 5, "20 sec")] },
      { title: "Intensity", workouts: [w("Box Jump Circuit", 4, "12 reps"), w("Battle Rope Rounds", 4, "40 sec"), w("Burpee Intervals", 5, "40 sec"), w("Kettlebell Swings", 4, "20 reps"), w("Jump Squat Tabata", 6, "20 sec")] },
      { title: "Peak", workouts: [w("Burpee Intervals", 5, "45 sec"), w("Sprint Drills", 6, "20 sec"), w("Box Jump Circuit", 5, "12 reps"), w("Battle Rope Rounds", 5, "45 sec"), w("Plyometric Lunges", 4, "16 reps")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 7. Flexibility Foundations
  // ─────────────────────────────────────────────
  {
    title: "Flexibility Foundations",
    heroImage: "https://images.unsplash.com/photo-1517130038641-a774d04afb3c?w=800&auto=format&fit=crop",
    tags: ["Flexibility", "Stretching"],
    participants: 421,
    equipment: "Yoga Mat",
    coach: { name: "Emma Collins", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
    rating: { value: 4.6, reviews: 1420 },
    overview: {
      short: "Dramatically improve your range of motion in 30 days.",
      long: "A guided 30-day flexibility program covering all major muscle groups. Daily stretching routines use progressive techniques to safely deepen your flexibility each week while reducing muscle tension and injury risk.",
    },
    rules: ["Stretch daily without skipping", "Never force a stretch", "Hold each position as instructed", "Breathe through discomfort"],
    benefits: [
      { title: "Range of Motion", description: "Move freely without tightness or restriction." },
      { title: "Injury Prevention", description: "Flexible muscles are less prone to strains." },
      { title: "Recovery", description: "Speed up muscle recovery between workouts." },
    ],
    included: ["30 Stretching Session Videos", "Flexibility Progress Chart", "Foam Rolling Guide"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Hip Flexor Stretch", 2, "45 sec"), w("Hamstring Stretch", 2, "45 sec"), w("Shoulder Stretch", 2, "30 sec"), w("Quad Stretch", 2, "30 sec"), w("Chest Opener", 2, "45 sec")] },
      { title: "Building", workouts: [w("Hip Flexor Stretch", 3, "1 min"), w("Spinal Twist", 3, "45 sec"), w("Hamstring Stretch", 3, "1 min"), w("IT Band Stretch", 3, "45 sec"), w("Calf Stretch", 3, "45 sec")] },
      { title: "Deepening", workouts: [w("Hamstring Stretch", 3, "90 sec"), w("Spinal Twist", 3, "1 min"), w("Chest Opener", 3, "1 min"), w("Hip Flexor Stretch", 4, "1 min"), w("Shoulder Stretch", 3, "1 min")] },
      { title: "Peak", workouts: [w("Hip Flexor Stretch", 4, "90 sec"), w("Hamstring Stretch", 4, "90 sec"), w("Spinal Twist", 4, "1 min"), w("IT Band Stretch", 4, "90 sec"), w("Chest Opener", 4, "90 sec")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 8. Power Lifting Pro
  // ─────────────────────────────────────────────
  {
    title: "Power Lifting Pro",
    heroImage: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&auto=format&fit=crop",
    tags: ["Powerlifting", "Max Strength"],
    participants: 134,
    equipment: "Full Gym",
    coach: { name: "Igor Petrov", avatar: "https://randomuser.me/api/portraits/men/88.jpg" },
    rating: { value: 4.9, reviews: 760 },
    overview: {
      short: "Maximize your one-rep max in squat, bench, and deadlift.",
      long: "An 8-week periodization-based powerlifting program for serious lifters. Uses percentage-based loading and strategic deload weeks to safely push your strength ceiling while minimizing injury risk.",
    },
    rules: ["Follow percentages exactly", "Log every set and rep", "Deload on scheduled weeks", "Use proper belts and equipment"],
    benefits: [
      { title: "Maximum Strength", description: "Set new personal records on all three lifts." },
      { title: "Neural Efficiency", description: "Train your nervous system to recruit more muscle fibers." },
      { title: "Technique", description: "Perfect your form under heavy loads." },
    ],
    included: ["Periodization Program Sheet", "Technique Video Library", "Competition Prep Guide", "Recovery Protocol"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Squat (Heavy)", 4, "5 reps"), w("Bench Press (Heavy)", 4, "5 reps"), w("Deadlift (Heavy)", 3, "5 reps"), w("Squat Variation", 3, "8 reps"), w("Bench Variation", 3, "8 reps")] },
      { title: "Building", workouts: [w("Squat (Heavy)", 4, "4 reps"), w("Bench Press (Heavy)", 4, "4 reps"), w("Deadlift (Heavy)", 3, "4 reps"), w("Accessory Work", 4, "10 reps"), w("Squat Variation", 4, "6 reps")] },
      { title: "Strength", workouts: [w("Squat (Heavy)", 5, "3 reps"), w("Bench Press (Heavy)", 5, "3 reps"), w("Deadlift (Heavy)", 4, "3 reps"), w("Bench Variation", 4, "6 reps"), w("Accessory Work", 4, "10 reps")] },
      { title: "Deload", workouts: [w("Deload Squat", 3, "5 reps"), w("Deload Bench", 3, "5 reps"), w("Accessory Work", 3, "12 reps"), w("Squat Variation", 3, "8 reps"), w("Bench Variation", 3, "8 reps")] },
      { title: "Intensity", workouts: [w("Squat (Heavy)", 4, "3 reps"), w("Deadlift (Heavy)", 4, "3 reps"), w("Bench Press (Heavy)", 4, "3 reps"), w("Bench Variation", 4, "5 reps"), w("Squat Variation", 4, "5 reps")] },
      { title: "Power", workouts: [w("Squat (Heavy)", 5, "2 reps"), w("Bench Press (Heavy)", 5, "2 reps"), w("Deadlift (Heavy)", 4, "2 reps"), w("Accessory Work", 5, "8 reps"), w("Squat Variation", 5, "3 reps")] },
      { title: "Peak", workouts: [w("Squat (Heavy)", 3, "1 rep"), w("Bench Press (Heavy)", 3, "1 rep"), w("Deadlift (Heavy)", 3, "1 rep"), w("Bench Variation", 3, "5 reps"), w("Squat Variation", 3, "5 reps")] },
      { title: "Competition", workouts: [w("Deload Squat", 2, "3 reps"), w("Deload Bench", 2, "3 reps"), w("Accessory Work", 2, "10 reps"), w("Squat (Heavy)", 1, "1 rep (max)"), w("Bench Press (Heavy)", 1, "1 rep (max)")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 9. Cycling Century Prep
  // ─────────────────────────────────────────────
  {
    title: "Cycling Century Prep",
    heroImage: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&auto=format&fit=crop",
    tags: ["Cycling", "Endurance"],
    participants: 203,
    equipment: "Bicycle",
    coach: { name: "Sophie Laurent", avatar: "https://randomuser.me/api/portraits/women/57.jpg" },
    rating: { value: 4.7, reviews: 1100 },
    overview: {
      short: "Train to complete a 100-mile cycling event in 45 days.",
      long: "A structured 45-day cycling plan combining interval rides, hill climbs, and endurance builds. Progressively increases weekly mileage to prepare your legs, lungs, and mental endurance for the ultimate cycling challenge.",
    },
    rules: ["Ride on scheduled days", "Maintain a training log with distance and speed", "Fuel properly before long rides", "Wear helmet always"],
    benefits: [
      { title: "Leg Power", description: "Build powerful quads and glutes for long climbs." },
      { title: "Aerobic Capacity", description: "Increase your VO2 max significantly." },
      { title: "Endurance", description: "Complete long distances without fatigue." },
    ],
    included: ["45-Day Ride Schedule", "Hill Training Guide", "Cycling Nutrition Plan", "Bike Fit Tips"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Recovery Ride", 1, "30 min"), w("Interval Ride", 5, "3 min"), w("Cadence Drills", 1, "30 min"), w("Tempo Ride", 1, "30 min"), w("Recovery Ride", 1, "20 min")] },
      { title: "Building", workouts: [w("Recovery Ride", 1, "40 min"), w("Hill Climb Repeats", 5, "5 min"), w("Interval Ride", 6, "3 min"), w("Long Endurance Ride", 1, "60 min"), w("Tempo Ride", 1, "40 min")] },
      { title: "Endurance", workouts: [w("Long Endurance Ride", 1, "75 min"), w("Tempo Ride", 1, "45 min"), w("Interval Ride", 6, "4 min"), w("Hill Climb Repeats", 6, "5 min"), w("Cadence Drills", 1, "40 min")] },
      { title: "Intensity", workouts: [w("Long Endurance Ride", 1, "90 min"), w("Hill Climb Repeats", 8, "5 min"), w("Tempo Ride", 1, "50 min"), w("Interval Ride", 8, "4 min"), w("Recovery Ride", 1, "30 min")] },
      { title: "Power", workouts: [w("Long Endurance Ride", 1, "120 min"), w("Brick Workout", 1, "90 min"), w("Hill Climb Repeats", 8, "6 min"), w("Tempo Ride", 1, "60 min"), w("Cadence Drills", 1, "50 min")] },
      { title: "Peak", workouts: [w("Tempo Ride", 1, "45 min"), w("Interval Ride", 6, "4 min"), w("Hill Climb Repeats", 6, "5 min"), w("Long Endurance Ride", 1, "60 min"), w("Recovery Ride", 1, "30 min")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 10. Body Weight Beast
  // ─────────────────────────────────────────────
  {
    title: "Body Weight Beast",
    heroImage: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=800&auto=format&fit=crop",
    tags: ["Calisthenics", "No Equipment"],
    participants: 487,
    equipment: "No Equipment",
    coach: { name: "Chris Malone", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
    rating: { value: 4.7, reviews: 2100 },
    overview: {
      short: "Build a powerful physique using nothing but your bodyweight.",
      long: "A 35-day progressive calisthenics program mastering push-ups, pull-ups, dips, and squats. Each week adds volume and complexity to build serious strength and muscle without a single piece of equipment.",
    },
    rules: ["Train 5 days per week", "Master form before adding reps", "Log every workout", "No skipping upper body days"],
    benefits: [
      { title: "Functional Strength", description: "Build strength you can use in real life." },
      { title: "No Gym Needed", description: "Train anywhere, anytime with zero equipment." },
      { title: "Body Control", description: "Develop superior body awareness and coordination." },
    ],
    included: ["35 Calisthenics Videos", "Progression Guide", "Home Workout Setup Tips"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Push-Up Variations", 3, "10 reps"), w("Squat Variations", 3, "15 reps"), w("Dip Circuit", 3, "8 reps"), w("Pull-Up Progression", 3, "5 reps"), w("Pike Push-Ups", 3, "8 reps")] },
      { title: "Building", workouts: [w("Push-Up Variations", 4, "12 reps"), w("Pull-Up Progression", 3, "6 reps"), w("Dip Circuit", 4, "10 reps"), w("Squat Variations", 4, "15 reps"), w("Handstand Progression", 3, "30 sec")] },
      { title: "Strength", workouts: [w("Push-Up Variations", 4, "15 reps"), w("Pull-Up Progression", 4, "6 reps"), w("Pike Push-Ups", 4, "10 reps"), w("Dip Circuit", 4, "12 reps"), w("Squat Variations", 5, "15 reps")] },
      { title: "Intensity", workouts: [w("Muscle-Up Progression", 3, "3 reps"), w("Handstand Progression", 4, "45 sec"), w("Push-Up Variations", 5, "15 reps"), w("Pull-Up Progression", 5, "6 reps"), w("Dip Circuit", 5, "12 reps")] },
      { title: "Peak", workouts: [w("Muscle-Up Progression", 4, "3 reps"), w("Push-Up Variations", 5, "20 reps"), w("Pull-Up Progression", 5, "8 reps"), w("Pike Push-Ups", 5, "12 reps"), w("Handstand Progression", 4, "1 min")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 11. 5K Runner Kickstart
  // ─────────────────────────────────────────────
  {
    title: "5K Runner Kickstart",
    heroImage: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&auto=format&fit=crop",
    tags: ["Running", "Beginner"],
    participants: 723,
    equipment: "Running Shoes",
    coach: { name: "Anna Brooks", avatar: "https://randomuser.me/api/portraits/women/14.jpg" },
    rating: { value: 4.8, reviews: 3400 },
    overview: {
      short: "Go from couch to 5K in just 21 beginner-friendly days.",
      long: "A walk-to-run program that gradually builds your running stamina through alternating walk-run intervals. Designed to get complete beginners comfortably running 5K without injury in just three weeks.",
    },
    rules: ["Follow the walk-run intervals exactly", "Run on soft surfaces when possible", "Wear proper running shoes", "Rest on scheduled days"],
    benefits: [
      { title: "Running Habit", description: "Build a sustainable daily running routine." },
      { title: "Stamina", description: "Run 5K without stopping by day 21." },
      { title: "Confidence", description: "Prove to yourself that you are a runner." },
    ],
    included: ["21-Day Run Schedule", "Beginner Running Tips", "Stretching Routine for Runners"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Walk-Run 1:2 Intervals", 1, "20 min"), w("Walk-Run 1:2 Intervals", 1, "22 min"), w("Walk-Run 2:1 Intervals", 1, "20 min"), w("Easy Jog", 1, "15 min"), w("Walk-Run 2:1 Intervals", 1, "25 min")] },
      { title: "Building", workouts: [w("Walk-Run 2:1 Intervals", 1, "25 min"), w("Easy Jog", 1, "20 min"), w("Tempo Walk-Run", 1, "25 min"), w("Continuous Run", 1, "10 min"), w("Easy Jog", 1, "25 min")] },
      { title: "Peak", workouts: [w("Easy Jog", 1, "25 min"), w("Continuous Run", 1, "20 min"), w("Tempo Walk-Run", 1, "30 min"), w("5K Practice Run", 1, "5 km"), w("Continuous Run", 1, "25 min")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 12. Pilates Powerhouse
  // ─────────────────────────────────────────────
  {
    title: "Pilates Powerhouse",
    heroImage: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop",
    tags: ["Pilates", "Core"],
    participants: 356,
    equipment: "Yoga Mat",
    coach: { name: "Rachel Moore", avatar: "https://randomuser.me/api/portraits/women/78.jpg" },
    rating: { value: 4.7, reviews: 1560 },
    overview: {
      short: "Strengthen your core and fix posture with 28 days of Pilates.",
      long: "A 28-day Pilates program using low-impact, high-precision movements to tone deep stabilizing muscles. Targets chronic back pain, poor posture, and weak core through controlled breathing and mindful movement.",
    },
    rules: ["Practice with mindful focus", "Quality over quantity on every rep", "Use a mat on a flat surface", "Log sessions daily"],
    benefits: [
      { title: "Core Stability", description: "Develop deep stabilizing muscles for better movement." },
      { title: "Posture Correction", description: "Fix forward head and rounded shoulder posture." },
      { title: "Back Pain Relief", description: "Strengthen muscles that support your spine." },
    ],
    included: ["28 Pilates Session Videos", "Posture Assessment Guide", "Breathing Technique Manual"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("The Hundred", 2, "1 min"), w("Roll Up", 3, "10 reps"), w("Single Leg Circles", 3, "10 reps"), w("Rolling Like a Ball", 3, "10 reps"), w("Single Leg Stretch", 3, "10 reps")] },
      { title: "Building", workouts: [w("The Hundred", 3, "1 min"), w("Double Leg Stretch", 3, "12 reps"), w("Spine Stretch", 3, "10 reps"), w("Swan Dive", 3, "8 reps"), w("Roll Up", 4, "10 reps")] },
      { title: "Deepening", workouts: [w("The Hundred", 3, "90 sec"), w("Single Leg Circles", 4, "12 reps"), w("Swan Dive", 4, "10 reps"), w("Double Leg Stretch", 4, "12 reps"), w("Spine Stretch", 4, "10 reps")] },
      { title: "Peak", workouts: [w("The Hundred", 4, "90 sec"), w("Roll Up", 4, "15 reps"), w("Swan Dive", 4, "12 reps"), w("Double Leg Stretch", 4, "15 reps"), w("Single Leg Stretch", 4, "15 reps")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 13. Ironman 90-Day Prep
  // ─────────────────────────────────────────────
  {
    title: "Ironman 90-Day Prep",
    heroImage: "https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=800&auto=format&fit=crop",
    tags: ["Triathlon", "Elite"],
    participants: 98,
    equipment: "Full Gym + Bicycle + Pool",
    coach: { name: "Michael Torres", avatar: "https://randomuser.me/api/portraits/men/62.jpg" },
    rating: { value: 4.9, reviews: 540 },
    overview: {
      short: "The ultimate 90-day triathlon prep for swim, bike, and run.",
      long: "A comprehensive 90-day Ironman preparation plan covering all three disciplines — swimming, cycling, and running. Structured periodization with brick workouts and race simulation brings you to peak performance on race day.",
    },
    rules: ["Follow the tri-discipline schedule strictly", "Log all three sports separately", "Prioritize sleep and recovery", "Nutrition is critical — follow the plan"],
    benefits: [
      { title: "Multi-Sport Fitness", description: "Excel in swimming, cycling, and running simultaneously." },
      { title: "Peak Performance", description: "Arrive at race day at your physical best." },
      { title: "Mental Fortitude", description: "Develop the iron will to finish no matter what." },
    ],
    included: ["90-Day Tri Plan", "Swim Technique Videos", "Brick Workout Guide", "Race Day Checklist", "Ironman Nutrition Plan"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Pool Laps", 1, "20 min"), w("Cycling Endurance", 1, "30 min"), w("Run Training", 1, "20 min"), w("Pool Laps", 1, "25 min"), w("Recovery Session", 1, "20 min")] },
      { title: "Adaptation", workouts: [w("Pool Laps", 1, "25 min"), w("Cycling Endurance", 1, "40 min"), w("Run Training", 1, "25 min"), w("Brick Workout", 1, "45 min"), w("Recovery Session", 1, "25 min")] },
      { title: "Base Build I", workouts: [w("Pool Laps", 1, "30 min"), w("Cycling Endurance", 1, "50 min"), w("Run Training", 1, "30 min"), w("Brick Workout", 1, "60 min"), w("Open Water Swim", 1, "30 min")] },
      { title: "Base Build II", workouts: [w("Open Water Swim", 1, "35 min"), w("Cycling Endurance", 1, "60 min"), w("Run Training", 1, "35 min"), w("Brick Workout", 1, "75 min"), w("Transition Practice", 3, "5 min")] },
      { title: "Strength", workouts: [w("Pool Laps", 1, "40 min"), w("Cycling Endurance", 1, "75 min"), w("Run Training", 1, "40 min"), w("Brick Workout", 1, "90 min"), w("Open Water Swim", 1, "40 min")] },
      { title: "Endurance", workouts: [w("Open Water Swim", 1, "45 min"), w("Cycling Endurance", 1, "90 min"), w("Run Training", 1, "45 min"), w("Brick Workout", 1, "2 hr"), w("Pool Laps", 1, "45 min")] },
      { title: "Race Pace I", workouts: [w("Pool Laps", 1, "50 min"), w("Cycling Endurance", 1, "2 hr"), w("Run Training", 1, "50 min"), w("Brick Workout", 1, "2.5 hr"), w("Open Water Swim", 1, "50 min")] },
      { title: "Race Pace II", workouts: [w("Open Water Swim", 1, "55 min"), w("Cycling Endurance", 1, "2.5 hr"), w("Run Training", 1, "55 min"), w("Brick Workout", 1, "3 hr"), w("Transition Practice", 5, "5 min")] },
      { title: "Power", workouts: [w("Pool Laps", 1, "60 min"), w("Cycling Endurance", 1, "3 hr"), w("Run Training", 1, "60 min"), w("Brick Workout", 1, "3 hr"), w("Open Water Swim", 1, "60 min")] },
      { title: "Peak Volume I", workouts: [w("Open Water Swim", 1, "60 min"), w("Cycling Endurance", 1, "4 hr"), w("Run Training", 1, "90 min"), w("Brick Workout", 1, "4 hr"), w("Pool Laps", 1, "45 min")] },
      { title: "Peak Volume II", workouts: [w("Open Water Swim", 1, "45 min"), w("Cycling Endurance", 1, "5 hr"), w("Run Training", 1, "90 min"), w("Brick Workout", 1, "5 hr"), w("Transition Practice", 5, "5 min")] },
      { title: "Race Ready", workouts: [w("Pool Laps", 1, "30 min"), w("Cycling Endurance", 1, "60 min"), w("Run Training", 1, "30 min"), w("Recovery Session", 1, "30 min"), w("Race Day Prep", 1, "30 min")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 14. Jump Rope Revolution
  // ─────────────────────────────────────────────
  {
    title: "Jump Rope Revolution",
    heroImage: "https://images.unsplash.com/photo-1616279969965-d1f6ba87d4e8?w=800&auto=format&fit=crop",
    tags: ["Jump Rope", "Coordination"],
    participants: 389,
    equipment: "Jump Rope",
    coach: { name: "Keisha Williams", avatar: "https://randomuser.me/api/portraits/women/91.jpg" },
    rating: { value: 4.6, reviews: 1780 },
    overview: {
      short: "From basic jumps to double-unders in 30 explosive days.",
      long: "A 30-day jump rope progression that takes you from basics to advanced techniques. Burns serious calories, improves footwork and coordination, and builds cardiovascular fitness in short daily sessions.",
    },
    rules: ["Jump on a flat non-slip surface", "Wear proper shoes", "Log every session", "Progress at your own pace"],
    benefits: [
      { title: "Coordination", description: "Dramatically improve footwork and timing." },
      { title: "Calorie Burn", description: "Burn 400+ calories in 30-minute sessions." },
      { title: "Cardio Fitness", description: "Build impressive cardiovascular endurance." },
    ],
    included: ["30 Jump Rope Skill Videos", "Trick Progression Guide", "Jump Rope Selection Tips"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Basic Bounce", 3, "2 min"), w("Alternate Foot Step", 3, "2 min"), w("High Knees Jump", 3, "1 min"), w("Speed Rounds", 3, "30 sec"), w("Basic Bounce", 4, "2 min")] },
      { title: "Building", workouts: [w("Alternate Foot Step", 4, "2 min"), w("High Knees Jump", 4, "90 sec"), w("Double Under Attempts", 3, "1 min"), w("Speed Rounds", 4, "45 sec"), w("Crossover Jumps", 3, "1 min")] },
      { title: "Intensity", workouts: [w("Double Under Attempts", 4, "2 min"), w("High Knees Jump", 4, "2 min"), w("Speed Rounds", 5, "1 min"), w("Crossover Jumps", 4, "90 sec"), w("Basic Bounce", 5, "3 min")] },
      { title: "Peak", workouts: [w("Double Under Attempts", 5, "2 min"), w("Triple Jump Practice", 4, "1 min"), w("Speed Rounds", 5, "90 sec"), w("Crossover Jumps", 5, "2 min"), w("High Knees Jump", 5, "2 min")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 15. Mobility Mastery
  // ─────────────────────────────────────────────
  {
    title: "Mobility Mastery",
    heroImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop",
    tags: ["Mobility", "Recovery"],
    participants: 267,
    equipment: "Foam Roller + Resistance Band",
    coach: { name: "Dr. James Wu", avatar: "https://randomuser.me/api/portraits/men/77.jpg" },
    rating: { value: 4.8, reviews: 1230 },
    overview: {
      short: "Unlock full-body mobility and move pain-free in 21 days.",
      long: "A 21-day mobility program combining foam rolling, dynamic stretching, and joint mobilization drills used by elite athletes. Targets all major joints to reduce pain, improve performance, and prevent injury.",
    },
    rules: ["Roll before every session", "Move through pain-free range only", "Daily practice is mandatory", "Film yourself to check range improvement"],
    benefits: [
      { title: "Joint Health", description: "Restore healthy range of motion in all joints." },
      { title: "Pain Reduction", description: "Eliminate chronic tightness and movement pain." },
      { title: "Athletic Performance", description: "Move more efficiently in all sports and workouts." },
    ],
    included: ["21 Mobility Session Videos", "Foam Rolling Manual", "Joint Health Guide"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Hip 90-90 Stretch", 2, "2 min"), w("Thoracic Rotation", 2, "1 min"), w("Ankle Mobility Drill", 2, "1 min"), w("Shoulder CARs", 2, "10 reps"), w("Deep Squat Hold", 2, "1 min")] },
      { title: "Building", workouts: [w("Hip 90-90 Stretch", 3, "2 min"), w("Knee to Wall Drill", 3, "1 min"), w("Thoracic Rotation", 3, "90 sec"), w("Wrist Circles & Extension", 3, "1 min"), w("Shoulder CARs", 3, "12 reps")] },
      { title: "Peak", workouts: [w("Deep Squat Hold", 3, "2 min"), w("Hip 90-90 Stretch", 4, "2 min"), w("Ankle Mobility Drill", 3, "90 sec"), w("Thoracic Rotation", 4, "90 sec"), w("Shoulder CARs", 4, "12 reps")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 16. Hypertrophy Hustle
  // ─────────────────────────────────────────────
  {
    title: "Hypertrophy Hustle",
    heroImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop",
    tags: ["Muscle Growth", "Hypertrophy"],
    participants: 378,
    equipment: "Full Gym",
    coach: { name: "Brandon Lee", avatar: "https://randomuser.me/api/portraits/men/29.jpg" },
    rating: { value: 4.8, reviews: 1940 },
    overview: {
      short: "Science-backed muscle growth program with high volume push-pull-legs.",
      long: "A 48-day hypertrophy-focused program using high volume push, pull, and leg splits. Progressive overload and strategic exercise selection maximize muscle protein synthesis for serious size gains.",
    },
    rules: ["Hit every muscle group twice per week", "Track weights every session", "Eat in a caloric surplus", "Sleep 8 hours minimum"],
    benefits: [
      { title: "Muscle Size", description: "Gain significant lean muscle mass in 48 days." },
      { title: "Strength Foundation", description: "Build strength that translates to all activities." },
      { title: "Body Composition", description: "Improve muscle-to-fat ratio dramatically." },
    ],
    included: ["48-Day Training Split", "Exercise Video Library", "Hypertrophy Nutrition Guide", "Supplement Stack Recommendations"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Push Day", 4, "10 reps"), w("Pull Day", 4, "10 reps"), w("Leg Day", 4, "10 reps"), w("Push Variation", 3, "12 reps"), w("Pull Variation", 3, "12 reps")] },
      { title: "Building", workouts: [w("Push Day", 4, "12 reps"), w("Pull Day", 4, "12 reps"), w("Leg Day", 4, "12 reps"), w("Leg Variation", 4, "12 reps"), w("Push Variation", 4, "12 reps")] },
      { title: "Strength", workouts: [w("Push Day", 5, "8 reps"), w("Pull Day", 5, "8 reps"), w("Leg Day", 5, "8 reps"), w("Pull Variation", 4, "10 reps"), w("Push Variation", 4, "10 reps")] },
      { title: "Intensity", workouts: [w("Push Day", 5, "10 reps"), w("Pull Day", 5, "10 reps"), w("Leg Day", 5, "10 reps"), w("Leg Variation", 5, "10 reps"), w("Pull Variation", 4, "12 reps")] },
      { title: "Power", workouts: [w("Push Day", 6, "8 reps"), w("Pull Day", 6, "8 reps"), w("Leg Day", 6, "8 reps"), w("Push Variation", 5, "8 reps"), w("Leg Variation", 5, "8 reps")] },
      { title: "Performance", workouts: [w("Push Day", 5, "6 reps"), w("Pull Day", 5, "6 reps"), w("Leg Variation", 5, "12 reps"), w("Push Variation", 5, "12 reps"), w("Pull Variation", 5, "12 reps")] },
      { title: "Peak", workouts: [w("Push Day", 6, "6 reps"), w("Pull Day", 6, "6 reps"), w("Leg Day", 6, "6 reps"), w("Push Variation", 5, "6 reps"), w("Pull Variation", 5, "6 reps")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 17. Swimming Endurance Challenge
  // ─────────────────────────────────────────────
  {
    title: "Swimming Endurance Challenge",
    heroImage: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop",
    tags: ["Swimming", "Technique"],
    participants: 156,
    equipment: "Swimming Pool",
    coach: { name: "Laura Jensen", avatar: "https://randomuser.me/api/portraits/women/52.jpg" },
    rating: { value: 4.6, reviews: 870 },
    overview: {
      short: "Build open-water endurance and freestyle technique in 30 days.",
      long: "A 30-day pool training program progressing from 500m to 2km continuous swims. Covers freestyle technique, breathing drills, flip turns, and open-water strategies for intermediate swimmers looking to go the distance.",
    },
    rules: ["Train in a supervised pool", "Never swim alone", "Log distance and time each session", "Focus on technique over speed"],
    benefits: [
      { title: "Swimming Distance", description: "Progress from 500m to 2km continuous swim." },
      { title: "Technique", description: "Fix common freestyle mistakes that slow you down." },
      { title: "Full Body Fitness", description: "Swimming works every major muscle group." },
    ],
    included: ["30 Swim Training Sessions", "Freestyle Technique Guide", "Breathing Drill Videos", "Open Water Tips"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Freestyle Technique Drills", 1, "20 min"), w("Breathing Pattern Practice", 1, "20 min"), w("Kick Board Drills", 1, "15 min"), w("Pull Buoy Sets", 3, "100 m"), w("Lap Endurance Swim", 1, "500 m")] },
      { title: "Building", workouts: [w("Freestyle Technique Drills", 1, "25 min"), w("Lap Endurance Swim", 1, "750 m"), w("Breathing Pattern Practice", 1, "25 min"), w("Open Turn Practice", 4, "5 reps"), w("Pull Buoy Sets", 4, "100 m")] },
      { title: "Intensity", workouts: [w("Lap Endurance Swim", 1, "1000 m"), w("Kick Board Drills", 1, "20 min"), w("Freestyle Technique Drills", 1, "30 min"), w("Pull Buoy Sets", 5, "100 m"), w("Open Turn Practice", 5, "5 reps")] },
      { title: "Peak", workouts: [w("Distance Swim", 1, "2000 m"), w("Lap Endurance Swim", 1, "1500 m"), w("Freestyle Technique Drills", 1, "30 min"), w("Breathing Pattern Practice", 1, "30 min"), w("Pull Buoy Sets", 5, "200 m")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 18. Dance Cardio Party
  // ─────────────────────────────────────────────
  {
    title: "Dance Cardio Party",
    heroImage: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop",
    tags: ["Dance", "Fun Fitness"],
    participants: 891,
    equipment: "No Equipment",
    coach: { name: "Bella Rivera", avatar: "https://randomuser.me/api/portraits/women/38.jpg" },
    rating: { value: 4.9, reviews: 4200 },
    overview: {
      short: "Turn fitness into a party with 14 days of high-energy dance cardio.",
      long: "A 14-day dance cardio program that makes working out genuinely fun. High-energy routines set to upbeat music burn 400-600 calories per session while improving rhythm, coordination, and mood.",
    },
    rules: ["Clear space to move safely", "Wear comfortable shoes", "Have fun and let loose", "Log each session"],
    benefits: [
      { title: "Fun Factor", description: "Enjoy every workout and look forward to exercising." },
      { title: "Calorie Burn", description: "Burn 400-600 calories without noticing the effort." },
      { title: "Coordination", description: "Improve rhythm and body coordination naturally." },
    ],
    included: ["14 Dance Cardio Videos", "Song Playlist Guide", "Cool-Down Stretch Routine"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Latin Dance Cardio", 1, "30 min"), w("Hip Hop Fitness", 1, "30 min"), w("Bollywood Dance Workout", 1, "30 min"), w("Zumba Style Routine", 1, "30 min"), w("Pop Dance Circuit", 1, "30 min")] },
      { title: "Peak", workouts: [w("Hip Hop Fitness", 1, "40 min"), w("Latin Dance Cardio", 1, "40 min"), w("Freestyle Dance Cardio", 1, "40 min"), w("Pop Dance Circuit", 1, "40 min"), w("Zumba Style Routine", 1, "40 min")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 19. Stair Climber 30-Day
  // ─────────────────────────────────────────────
  {
    title: "Stair Climber 30-Day",
    heroImage: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&auto=format&fit=crop",
    tags: ["Stairs", "Glutes"],
    participants: 445,
    equipment: "Stairs",
    coach: { name: "Kim Santos", avatar: "https://randomuser.me/api/portraits/women/25.jpg" },
    rating: { value: 4.5, reviews: 1320 },
    overview: {
      short: "Build powerful glutes and cardio fitness using just a staircase.",
      long: "A 30-day stair climbing challenge that transforms a simple staircase into a powerful fitness tool. Progressive daily sessions build glute and quad strength, cardiovascular fitness, and explosive leg power.",
    },
    rules: ["Use handrail for safety on steep stairs", "Wear proper shoes", "Log flights and time", "Increase floors weekly as planned"],
    benefits: [
      { title: "Glute Strength", description: "Build powerful, toned glutes with every step." },
      { title: "Cardio Fitness", description: "Improve heart health with daily stair sessions." },
      { title: "Zero Cost", description: "Use any staircase — no gym membership needed." },
    ],
    included: ["30-Day Stair Plan", "Lower Body Strength Guide", "Calorie Calculator"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Stair Walk Warm-Up", 1, "10 min"), w("Stair Climb Intervals", 3, "5 min"), w("Two-Step Stair Climb", 3, "5 min"), w("Lateral Stair Steps", 3, "3 min"), w("Stair Walk Warm-Up", 1, "15 min")] },
      { title: "Building", workouts: [w("Stair Climb Intervals", 4, "5 min"), w("Two-Step Stair Climb", 4, "5 min"), w("Stair Sprint Repeats", 5, "1 min"), w("Weighted Stair Walk", 1, "15 min"), w("Stair Climb Intervals", 4, "6 min")] },
      { title: "Intensity", workouts: [w("Stair Sprint Repeats", 6, "1 min"), w("Weighted Stair Walk", 1, "20 min"), w("Stair Jump Circuit", 3, "3 min"), w("Two-Step Stair Climb", 5, "6 min"), w("Lateral Stair Steps", 4, "4 min")] },
      { title: "Peak", workouts: [w("Stair Jump Circuit", 4, "3 min"), w("Stair Sprint Repeats", 8, "1 min"), w("Weighted Stair Walk", 1, "25 min"), w("Stair Climb Intervals", 5, "8 min"), w("Two-Step Stair Climb", 5, "8 min")] },
    ]),
  },

  // ─────────────────────────────────────────────
  // 20. Athlete Performance Peak
  // ─────────────────────────────────────────────
  {
    title: "Athlete Performance Peak",
    heroImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop",
    tags: ["Sports Performance", "Elite"],
    participants: 142,
    equipment: "Full Gym + Field",
    coach: { name: "Coach Ray Thompson", avatar: "https://randomuser.me/api/portraits/men/93.jpg" },
    rating: { value: 4.9, reviews: 680 },
    overview: {
      short: "Elite 60-day program combining speed, power, agility, and endurance.",
      long: "A 60-day sports performance program designed for competitive athletes. Combines speed training, agility drills, power development, and sport-specific endurance work to create a decisive competitive edge.",
    },
    rules: ["Train with maximum intensity", "Log all metrics (time, distance, weight)", "Recovery is mandatory", "Video yourself for technique review"],
    benefits: [
      { title: "Speed", description: "Improve sprint times and first-step explosiveness." },
      { title: "Agility", description: "React faster and change direction more efficiently." },
      { title: "Competitive Edge", description: "Outperform opponents in any sport." },
    ],
    included: ["60-Day Performance Plan", "Speed Drill Video Library", "Agility Ladder Workouts", "Sport Psychology Guide", "Peak Performance Nutrition"],
    roadmap: makeRoadmap([
      { title: "Foundation", workouts: [w("Sprint Intervals", 5, "30 m"), w("Agility Ladder Drills", 4, "2 min"), w("Plyometric Circuit", 3, "10 reps"), w("Box Jumps", 3, "8 reps"), w("Reaction Drills", 3, "2 min")] },
      { title: "Building", workouts: [w("Sprint Intervals", 6, "30 m"), w("Agility Ladder Drills", 5, "2 min"), w("Power Clean", 4, "5 reps"), w("Box Jumps", 4, "8 reps"), w("Plyometric Circuit", 4, "10 reps")] },
      { title: "Strength", workouts: [w("Power Clean", 4, "4 reps"), w("Sprint Intervals", 6, "40 m"), w("Agility Ladder Drills", 5, "3 min"), w("Plyometric Circuit", 4, "12 reps"), w("Reaction Drills", 4, "3 min")] },
      { title: "Intensity", workouts: [w("Sprint Intervals", 8, "40 m"), w("Box Jumps", 4, "10 reps"), w("Power Clean", 5, "4 reps"), w("Agility Ladder Drills", 6, "3 min"), w("Sport Simulation", 1, "30 min")] },
      { title: "Power", workouts: [w("Power Clean", 5, "3 reps"), w("Sprint Intervals", 8, "50 m"), w("Box Jumps", 5, "10 reps"), w("Plyometric Circuit", 5, "12 reps"), w("Sport Simulation", 1, "40 min")] },
      { title: "Performance", workouts: [w("Sprint Intervals", 10, "50 m"), w("Agility Ladder Drills", 6, "4 min"), w("Power Clean", 5, "3 reps"), w("Sport Simulation", 1, "45 min"), w("Reaction Drills", 5, "3 min")] },
      { title: "Elite", workouts: [w("Sprint Intervals", 10, "60 m"), w("Box Jumps", 5, "12 reps"), w("Power Clean", 5, "2 reps"), w("Plyometric Circuit", 5, "15 reps"), w("Sport Simulation", 1, "50 min")] },
      { title: "Peak", workouts: [w("Sprint Intervals", 8, "60 m"), w("Agility Ladder Drills", 6, "5 min"), w("Power Clean", 4, "2 reps"), w("Box Jumps", 4, "12 reps"), w("Sport Simulation", 1, "60 min")] },
    ]),
  },
];

const updateChallengesWithDetailedData = async () => {
  console.log("🔄 Checking challenges for updates...");
  let count = 0;

  for (const data of challengeUpdates) {
    const { title, ...updateFields } = data;
    try {
      const result = await Challenge.findOneAndUpdate(
        { title, heroImage: { $exists: false } },
        { $set: updateFields },
        { returnDocument: "after" }
      );
      if (result) {
        console.log(`✅ Updated: ${title}`);
        count++;
      } else {
        console.log(`⏭  Skipped (already updated): ${title}`);
      }
    } catch (err) {
      console.error(`❌ Failed to update "${title}":`, err.message);
    }
  }

  if (count > 0) {
    console.log(`\n✅ Challenge update complete: ${count} challenges updated.`);
  } else {
    console.log("\n✅ All challenges already up to date.");
  }
};

module.exports = { updateChallengesWithDetailedData };
