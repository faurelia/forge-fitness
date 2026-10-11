import {
  Car,
  Coffee,
  Droplets,
  Dumbbell,
  Flame,
  Heart,
  Music,
  Shield,
  Timer,
  Users,
  Wifi,
  Wind,
} from "lucide-react";

export const amenities = [
  {
    icon: Dumbbell,
    title: "Premium Equipment",
    description:
      "State-of-the-art machines and free weights from top brands. Over 200 pieces of equipment per club including Olympic platforms, cable machines, and cardio theater.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  },
  {
    icon: Droplets,
    title: "Locker Rooms & Showers",
    description:
      "Spacious, clean locker rooms with premium showers, complimentary towels, and toiletries. Private changing areas and vanity stations.",
    img: "https://images.unsplash.com/photo-1583416750470-965b2707b355?w=600&q=80",
  },
  {
    icon: Wind,
    title: "Sauna & Steam Room",
    description:
      "Unwind after your workout in our cedar-lined saunas and eucalyptus steam rooms. Perfect for muscle recovery and relaxation.",
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
  },
  {
    icon: Heart,
    title: "Recovery Lounge",
    description:
      "Dedicated recovery space with compression therapy, cold plunge pools, infrared saunas, and stretching areas with foam rollers and bands.",
    img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
  },
  {
    icon: Users,
    title: "Personal Training",
    description:
      "One-on-one sessions with certified trainers who create customized programs for your goals. Available for all fitness levels.",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
  },
  {
    icon: Wifi,
    title: "Free High-Speed Wi-Fi",
    description:
      "Stay connected with complimentary high-speed internet throughout the club. Stream your favorite workouts or catch up on work.",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  },
  {
    icon: Car,
    title: "Free Parking",
    description:
      "Complimentary parking at all locations. Secure, well-lit lots with easy access to club entrances.",
    img: "https://images.unsplash.com/photo-1593079831268-338f21656770?w=600&q=80",
  },
  {
    icon: Coffee,
    title: "Juice & Smoothie Bar",
    description:
      "Refuel with fresh juices, protein shakes, and healthy snacks. Post-workout nutrition made easy and delicious.",
    img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description:
      "Your safety is our priority. Round-the-clock security staff, CCTV monitoring, and secure key fob entry at all locations.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
  },
  {
    icon: Timer,
    title: "Extended Hours",
    description:
      "Early bird or night owl? Most clubs open from 5AM to 11PM. Premium members enjoy 24/7 access at select locations.",
    img: "https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=600&q=80",
  },
  {
    icon: Music,
    title: "Group Studios",
    description:
      "Dedicated studios for yoga, cycling, HIIT, and dance classes. Premium sound systems and immersive lighting.",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  },
  {
    icon: Flame,
    title: "Massage Chairs",
    description:
      "Premium massage chairs available in the recovery lounge. Perfect for post-workout muscle relief and stress reduction.",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
  },
];

export const classCategories = [
  "All",
  "Cardio",
  "Core",
  "Dance",
  "Yoga",
  "Strength",
  "HIIT",
];

export const fitnessClasses = [
  {
    name: "HIIT Blast",
    category: "HIIT",
    duration: "45 min",
    level: "Intermediate",
    instructor: "David Okafor",
    location: "Downtown",
    description:
      "High-intensity intervals that torch calories and build endurance.",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  },
  {
    name: "Power Yoga",
    category: "Yoga",
    duration: "60 min",
    level: "All Levels",
    instructor: "Sarah Chen",
    location: "Midtown",
    description:
      "Dynamic flows that build strength, flexibility, and mindfulness.",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
  },
  {
    name: "Strength Lab",
    category: "Strength",
    duration: "50 min",
    level: "Advanced",
    instructor: "Marcus Johnson",
    location: "Downtown",
    description:
      "Progressive overload training with barbells, dumbbells, and machines.",
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80",
  },
  {
    name: "Dance Cardio",
    category: "Dance",
    duration: "45 min",
    level: "Beginner",
    instructor: "Emma Rodriguez",
    location: "Westside",
    description:
      "Fun, high-energy dance routines that feel more like a party than a workout.",
    img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&q=80",
  },
  {
    name: "Core Crusher",
    category: "Core",
    duration: "30 min",
    level: "Intermediate",
    instructor: "Marcus Johnson",
    location: "Downtown",
    description:
      "Targeted core work for abs, obliques, and lower back stability.",
    img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
  },
  {
    name: "Spin Cycle",
    category: "Cardio",
    duration: "45 min",
    level: "All Levels",
    instructor: "David Okafor",
    location: "Midtown",
    description: "Indoor cycling with music-driven intervals and hill climbs.",
    img: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80",
  },
  {
    name: "Zen Flow",
    category: "Yoga",
    duration: "75 min",
    level: "Beginner",
    instructor: "Sarah Chen",
    location: "Westside",
    description:
      "Gentle restorative yoga for deep relaxation and stress relief.",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
  },
  {
    name: "Tabata Torch",
    category: "HIIT",
    duration: "30 min",
    level: "Advanced",
    instructor: "David Okafor",
    location: "Downtown",
    description:
      "20 seconds on, 10 seconds off. Maximum intensity, maximum results.",
    img: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&q=80",
  },
  {
    name: "Sculpt & Tone",
    category: "Strength",
    duration: "45 min",
    level: "Beginner",
    instructor: "Emma Rodriguez",
    location: "Midtown",
    description: "Lightweight resistance training for lean muscle definition.",
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80",
  },
  {
    name: "Cardio Kickbox",
    category: "Cardio",
    duration: "50 min",
    level: "Intermediate",
    instructor: "Marcus Johnson",
    location: "Downtown",
    description: "Boxing-inspired cardio that builds power and burns fat.",
    img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&q=80",
  },
  {
    name: "Pilates Fusion",
    category: "Core",
    duration: "50 min",
    level: "All Levels",
    instructor: "Sarah Chen",
    location: "Westside",
    description: "Pilates-based core work with modern movement patterns.",
    img: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=600&q=80",
  },
  {
    name: "Latin Heat",
    category: "Dance",
    duration: "45 min",
    level: "All Levels",
    instructor: "Emma Rodriguez",
    location: "Midtown",
    description: "Salsa, bachata, and reggaeton-inspired dance fitness.",
    img: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=600&q=80",
  },
];

export const schedule = [
  {
    time: "6:00 AM",
    mon: "HIIT Blast",
    tue: "Power Yoga",
    wed: "Spin Cycle",
    thu: "HIIT Blast",
    fri: "Strength Lab",
    sat: "Dance Cardio",
    sun: "Zen Flow",
  },
  {
    time: "7:30 AM",
    mon: "Spin Cycle",
    tue: "Core Crusher",
    wed: "Power Yoga",
    thu: "Core Crusher",
    fri: "Cardio Kickbox",
    sat: "Strength Lab",
    sun: "Power Yoga",
  },
  {
    time: "9:00 AM",
    mon: "Power Yoga",
    tue: "Strength Lab",
    wed: "Dance Cardio",
    thu: "Power Yoga",
    fri: "Pilates Fusion",
    sat: "HIIT Blast",
    sun: "Sculpt & Tone",
  },
  {
    time: "12:00 PM",
    mon: "Core Crusher",
    tue: "Tabata Torch",
    wed: "Sculpt & Tone",
    thu: "Tabata Torch",
    fri: "Core Crusher",
    sat: "Latin Heat",
    sun: "—",
  },
  {
    time: "5:30 PM",
    mon: "Strength Lab",
    tue: "Dance Cardio",
    wed: "HIIT Blast",
    thu: "Dance Cardio",
    fri: "Tabata Torch",
    sat: "—",
    sun: "—",
  },
  {
    time: "7:00 PM",
    mon: "Cardio Kickbox",
    tue: "HIIT Blast",
    wed: "Strength Lab",
    thu: "Latin Heat",
    fri: "Spin Cycle",
    sat: "—",
    sun: "—",
  },
];

export const clubsDetails = [
  {
    id: "downtown",
    name: "Forge Downtown",
    address: "123 Fitness Ave, New York, NY 10001",
    phone: "(555) 123-4567",
    email: "downtown@forgefitness.com",
    hours: { weekday: "5:00 AM - 11:00 PM", weekend: "7:00 AM - 9:00 PM" },
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
    ],
    amenities: [
      "Pool",
      "Sauna",
      "Basketball Court",
      "Group Studios (3)",
      "Personal Training",
      "Rooftop Track",
      "Juice Bar",
      "Free Parking",
    ],
    trainers: 12,
    classes: 80,
    members: "2,500+",
    sqft: "25,000",
    description:
      "Our flagship location in the heart of downtown. Featuring three floors of premium equipment, a rooftop running track, and the city's best recovery lounge.",
    classesList: [
      "HIIT Blast",
      "Power Yoga",
      "Strength Lab",
      "Spin Cycle",
      "Core Crusher",
      "Dance Cardio",
      "Zen Flow",
      "Tabata Torch",
    ],
    trainersList: ["Marcus Johnson", "David Okafor", "Aisha Williams"],
  },
  {
    id: "midtown",
    name: "Forge Midtown",
    address: "456 Wellness Blvd, New York, NY 10018",
    phone: "(555) 234-5678",
    email: "midtown@forgefitness.com",
    hours: { weekday: "5:00 AM - 11:00 PM", weekend: "6:00 AM - 10:00 PM" },
    img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
      "https://images.unsplash.com/photo-1593079831268-338f21656770?w=600&q=80",
    ],
    amenities: [
      "Rooftop Track",
      "Recovery Lounge",
      "Group Studios (2)",
      "Cycling Room",
      "Sauna",
      "Free Wi-Fi",
      "Locker Rooms",
    ],
    trainers: 8,
    classes: 60,
    members: "1,800+",
    sqft: "18,000",
    description:
      "A modern urban oasis with stunning city views. Known for our cycling room and recovery lounge, Midtown is perfect for the busy professional.",
    classesList: [
      "Power Yoga",
      "Spin Cycle",
      "HIIT Blast",
      "Sculpt & Tone",
      "Pilates Fusion",
      "Core Crusher",
    ],
    trainersList: ["Sarah Chen", "James Park"],
  },
  {
    id: "westside",
    name: "Forge Westside",
    address: "789 Muscle St, New York, NY 10025",
    phone: "(555) 345-6789",
    email: "westside@forgefitness.com",
    hours: { weekday: "6:00 AM - 10:00 PM", weekend: "7:00 AM - 8:00 PM" },
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    ],
    amenities: [
      "Olympic Pool",
      "Boxing Ring",
      "Yoga Studio",
      "Cafe",
      "Sauna",
      "Free Parking",
      "Outdoor Training Area",
    ],
    trainers: 10,
    classes: 70,
    members: "2,100+",
    sqft: "22,000",
    description:
      "Westside's crown jewel features an Olympic-sized pool, dedicated boxing ring, and a beautiful outdoor training area. A complete fitness destination.",
    classesList: [
      "Dance Cardio",
      "Latin Heat",
      "Zen Flow",
      "Cardio Kickbox",
      "Pilates Fusion",
      "HIIT Blast",
    ],
    trainersList: ["Emma Rodriguez"],
  },
];

export const clubSlugs = [
  "downtown",
  "midtown",
  "westside",
  "brooklyn",
  "uptown",
  "queens",
];

export const clubs = [
  {
    name: "Forge Downtown",
    address: "123 Fitness Ave, New York, NY 10001",
    phone: "(555) 123-4567",
    hours: "Mon-Fri: 5AM-11PM, Sat-Sun: 7AM-9PM",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
    amenities: [
      "Pool",
      "Sauna",
      "Basketball Court",
      "Group Studios",
      "Personal Training",
    ],
    trainers: 12,
    classes: 80,
  },
  {
    name: "Forge Midtown",
    address: "456 Wellness Blvd, New York, NY 10018",
    phone: "(555) 234-5678",
    hours: "Mon-Fri: 5AM-11PM, Sat-Sun: 6AM-10PM",
    img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
    amenities: [
      "Rooftop Track",
      "Recovery Lounge",
      "Group Studios",
      "Cycling Room",
    ],
    trainers: 8,
    classes: 60,
  },
  {
    name: "Forge Westside",
    address: "789 Muscle St, New York, NY 10025",
    phone: "(555) 345-6789",
    hours: "Mon-Fri: 6AM-10PM, Sat-Sun: 7AM-8PM",
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
    amenities: ["Olympic Pool", "Boxing Ring", "Yoga Studio", "Cafe"],
    trainers: 10,
    classes: 70,
  },
  {
    name: "Forge Brooklyn",
    address: "321 Power Lane, Brooklyn, NY 11201",
    phone: "(555) 456-7890",
    hours: "Mon-Fri: 5AM-11PM, Sat-Sun: 7AM-9PM",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
    amenities: [
      "CrossFit Box",
      "Sauna",
      "Group Studios",
      "Outdoor Training Area",
    ],
    trainers: 9,
    classes: 65,
  },
  {
    name: "Forge Uptown",
    address: "555 Summit Dr, New York, NY 10032",
    phone: "(555) 567-8901",
    hours: "Mon-Fri: 5AM-10PM, Sat-Sun: 7AM-8PM",
    img: "https://images.unsplash.com/photo-1593079831268-338f21656770?w=600&q=80",
    amenities: [
      "Pool",
      "Tennis Court",
      "Group Studios",
      "Personal Training",
      "Juice Bar",
    ],
    trainers: 7,
    classes: 50,
  },
  {
    name: "Forge Queens",
    address: "888 Iron Way, Queens, NY 11101",
    phone: "(555) 678-9012",
    hours: "Mon-Fri: 6AM-10PM, Sat-Sun: 7AM-9PM",
    img: "https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=600&q=80",
    amenities: [
      "Basketball Court",
      "Group Studios",
      "Recovery Lounge",
      "Free Parking",
    ],
    trainers: 6,
    classes: 45,
  },
];

export const faqCategories = [
  {
    name: "Memberships",
    faqs: [
      {
        q: "What membership plans do you offer?",
        a: "We offer three plans: Standard ($29/mo), Premium ($59/mo), and Elite ($99/mo). Each plan includes different levels of access and benefits. Visit our Memberships page for a full comparison.",
      },
      {
        q: "Can I cancel my membership anytime?",
        a: "Yes! There are no cancellation fees. You can cancel anytime through the app or by contacting your club. Your access continues until the end of your current billing period.",
      },
      {
        q: "Is there a joining fee?",
        a: 'We occasionally waive joining fees during promotions. Currently, new members can join with $0 down during our "New Year, New You" campaign.',
      },
      {
        q: "Can I freeze my membership?",
        a: "Yes, all members can freeze their membership for up to 3 months per year at no additional cost. Premium and Elite members can freeze for up to 6 months.",
      },
      {
        q: "Do you offer corporate memberships?",
        a: "Yes! We offer discounted corporate plans for companies with 10+ employees. Contact our partnerships team at corporate@forgefitness.com.",
      },
    ],
  },
  {
    name: "Classes",
    faqs: [
      {
        q: "Are group classes included in my membership?",
        a: "Yes! All group classes are included with every membership plan. No extra fees, no limits on how many classes you can attend.",
      },
      {
        q: "Do I need to book classes in advance?",
        a: "Premium and Elite members can book classes up to 7 days in advance. Standard members can book up to 24 hours ahead. Walk-ins are welcome if space is available.",
      },
      {
        q: "What should I bring to class?",
        a: "Just yourself, comfortable workout clothes, and a water bottle! We provide mats, towels, and equipment. Some specialty classes may have specific requirements listed in the class description.",
      },
      {
        q: "Are classes suitable for beginners?",
        a: 'Absolutely! Our classes range from beginner to advanced. Look for "All Levels" or "Beginner" tags when browsing. Instructors always provide modifications for different fitness levels.',
      },
      {
        q: "How do I find the class schedule?",
        a: "You can view the full schedule on our Classes page, in the Forge app, or at the front desk of any club. Schedules are updated weekly.",
      },
    ],
  },
  {
    name: "Personal Training",
    faqs: [
      {
        q: "How much does personal training cost?",
        a: "PT sessions range from $60-$100 per session depending on the trainer and package. Elite members get 4 sessions included per month. We also offer package discounts.",
      },
      {
        q: "How do I book a session with a trainer?",
        a: "Browse our trainer directory, find a trainer that matches your goals, and book directly through the app or at the club front desk. You can also request an assessment.",
      },
      {
        q: "What happens in a first PT session?",
        a: "Your first session is a comprehensive assessment including fitness testing, goal setting, and a customized program overview. It typically lasts 60 minutes.",
      },
      {
        q: "Can I switch trainers?",
        a: "Of course! If you feel a different trainer might be a better fit, just let us know. We want you to have the best possible experience.",
      },
    ],
  },
  {
    name: "Clubs",
    faqs: [
      {
        q: "How do I find the nearest club?",
        a: "Use our Club Finder on the Clubs page. Enter your zip code or city to see all nearby locations with hours, amenities, and contact info.",
      },
      {
        q: "What are the club hours?",
        a: "Most clubs are open Mon-Fri 5AM-11PM and Sat-Sun 7AM-9PM. Hours vary by location — check your specific club's page for exact times.",
      },
      {
        q: "Can I use any club location?",
        a: "Premium and Elite members have access to all 50+ locations. Standard members have access to their home club only, but can purchase day passes for other locations.",
      },
      {
        q: "Is there parking available?",
        a: "Most locations offer free parking. Some urban locations have paid parking nearby. Check your specific club's page for parking details.",
      },
    ],
  },
  {
    name: "Billing",
    faqs: [
      {
        q: "When am I charged?",
        a: "Memberships are billed on the same date each month. You'll receive an email receipt after each payment.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, Discover, PayPal, and direct bank transfers (ACH).",
      },
      {
        q: "Can I change my payment method?",
        a: "Yes, update your payment method anytime in the app under Account > Billing, or by contacting your club.",
      },
      {
        q: "What if I miss a payment?",
        a: "We'll retry the payment after 3 days. If it fails again, your access may be temporarily suspended until payment is resolved. Contact us and we'll work with you.",
      },
      {
        q: "Do you offer refunds?",
        a: "We offer prorated refunds within the first 14 days of a new membership. After that, you can cancel anytime but no partial refunds are provided for the current billing period.",
      },
    ],
  },
];

export const faqs = [
  {
    q: "Can I switch between clubs?",
    a: "Premium and Elite members can access any Forge Fitness location. Standard members have access to their home club only.",
  },
  {
    q: "Is there a cancellation fee?",
    a: "No cancellation fees! You can cancel your membership anytime. Your access continues until the end of your billing period.",
  },
  {
    q: "Can I freeze my membership?",
    a: "Yes, you can freeze your membership for up to 3 months per year at no additional cost. Contact your club or use the app.",
  },
  {
    q: "Do you offer student discounts?",
    a: "Yes! Students get 20% off any membership plan with a valid student ID. Visit your local club to sign up.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, PayPal, and direct bank transfers. Payments are processed monthly.",
  },
  {
    q: "Can I bring a guest?",
    a: "Premium members get 2 guest passes per month. Elite members get unlimited guest passes. Standard members can purchase day passes for guests.",
  },
];

export const categories = [
  "All",
  "Shirts",
  "Shorts",
  "Accessories",
  "Bags",
  "Equipment",
];

export const products = [
  {
    id: 1,
    name: "Forge Performance Tee",
    price: 35,
    category: "Shirts",
    rating: 4.8,
    reviews: 124,
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    description:
      "Moisture-wicking performance fabric with Forge logo. Breathable, quick-dry material that keeps you cool during intense workouts. Available in S-XXL.",
  },
  {
    id: 2,
    name: "Training Shorts",
    price: 45,
    category: "Shorts",
    rating: 4.7,
    reviews: 89,
    img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80",
    description:
      "Lightweight, breathable shorts with secure zip pocket. 7-inch inseam with built-in liner for comfort and support.",
  },
  {
    id: 3,
    name: "Gym Duffle Bag",
    price: 65,
    category: "Bags",
    rating: 4.9,
    reviews: 67,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    description:
      "Spacious 40L duffle with dedicated shoe compartment and wet bag. Water-resistant base and reinforced handles.",
  },
  {
    id: 4,
    name: "Protein Shaker",
    price: 15,
    category: "Accessories",
    rating: 4.6,
    reviews: 203,
    img: "https://images.unsplash.com/photo-1593095948071-474c5cc2c470?w=400&q=80",
    description:
      "BPA-free 24oz shaker with stainless steel mixing ball and measurement marks. Leak-proof lid.",
  },
  {
    id: 5,
    name: "Forge Hoodie",
    price: 55,
    category: "Shirts",
    rating: 4.8,
    reviews: 156,
    img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
    description:
      "Premium cotton-blend hoodie with embroidered Forge logo. Fleece-lined interior for warmth and comfort.",
  },
  {
    id: 6,
    name: "Resistance Bands Set",
    price: 30,
    category: "Equipment",
    rating: 4.7,
    reviews: 98,
    img: "https://images.unsplash.com/photo-1598289431512-52763d2f0851?w=400&q=80",
    description:
      "Set of 5 natural latex resistance bands with different tension levels (10-50 lbs). Includes carry bag and exercise guide.",
  },
  {
    id: 7,
    name: "Training Tank",
    price: 28,
    category: "Shirts",
    rating: 4.5,
    reviews: 76,
    img: "https://images.unsplash.com/photo-1503341504253-dff4f94032fc?w=400&q=80",
    description:
      "Racerback tank with quick-dry technology. Lightweight and breathable for maximum mobility.",
  },
  {
    id: 8,
    name: "Laptop Gym Bag",
    price: 85,
    category: "Bags",
    rating: 4.9,
    reviews: 45,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    description:
      'Dual-purpose bag with padded 15" laptop sleeve and gym compartment. Perfect for work-to-workout transitions.',
  },
  {
    id: 9,
    name: "Wrist Wraps",
    price: 18,
    category: "Accessories",
    rating: 4.6,
    reviews: 134,
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
    description:
      'Heavy-duty 18" wrist wraps with thumb loop and velcro closure. Ideal for heavy lifting and pressing movements.',
  },
  {
    id: 10,
    name: "Compression Leggings",
    price: 52,
    category: "Shorts",
    rating: 4.8,
    reviews: 112,
    img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80",
    description:
      "High-waist compression leggings with side pockets. 4-way stretch fabric with moisture-wicking technology.",
  },
  {
    id: 11,
    name: "Speed Jump Rope",
    price: 22,
    category: "Equipment",
    rating: 4.5,
    reviews: 87,
    img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80",
    description:
      "Competition-style speed rope with ball bearings and adjustable 10ft cable. Ergonomic handles.",
  },
  {
    id: 12,
    name: "Forge Snapback Cap",
    price: 25,
    category: "Accessories",
    rating: 4.7,
    reviews: 91,
    img: "https://images.unsplash.com/photo-1588850561407-ed78c3343679?w=400&q=80",
    description:
      "Adjustable snapback with embroidered Forge logo. Structured crown with flat brim.",
  },
];

export const trainerDetails = [
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    specialty: "Strength & Conditioning",
    location: "Downtown",
    bio: "Former collegiate athlete with 10+ years of experience in strength training and athletic performance. Marcus specializes in progressive overload programs and functional movement patterns that build real-world strength.",
    certifications: [
      "NSCA-CSCS",
      "ACE-CPT",
      "FMS Level 2",
      "USA Weightlifting L2",
    ],
    philosophy:
      "Strength is the foundation of everything. Build a solid base, and everything else follows. I believe in training that translates to real life — not just the gym.",
    img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=800&q=80",
    rating: 4.9,
    reviews: 127,
    experience: "10+ years",
    specialties: [
      "Strength Training",
      "Athletic Performance",
      "Powerlifting",
      "Functional Movement",
    ],
    availability: [
      "Mon 6AM-12PM",
      "Tue 6AM-12PM",
      "Wed 3PM-8PM",
      "Thu 6AM-12PM",
      "Fri 3PM-8PM",
    ],
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    specialty: "Yoga & Mobility",
    location: "Midtown",
    bio: "Certified yoga instructor with a background in physical therapy. Sarah combines Eastern wisdom with Western science to help clients move better, feel better, and live better.",
    certifications: [
      "RYT-500",
      "FRC",
      "Precision Nutrition L1",
      "Corrective Exercise Specialist",
    ],
    philosophy:
      "Movement is medicine. Every body can find its expression through mindful practice. My goal is to help you build a sustainable movement practice that serves you for life.",
    img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&q=80",
    rating: 4.8,
    reviews: 98,
    experience: "8 years",
    specialties: ["Yoga", "Mobility", "Flexibility", "Injury Prevention"],
    availability: [
      "Mon 8AM-4PM",
      "Tue 8AM-4PM",
      "Wed 8AM-4PM",
      "Thu 8AM-4PM",
      "Sat 9AM-2PM",
    ],
  },
  {
    id: "david-okafor",
    name: "David Okafor",
    specialty: "HIIT & Cardio",
    location: "Downtown",
    bio: "High-energy coach who believes fitness should be fun. David's classes are known for their infectious energy and creative programming that keeps members coming back for more.",
    certifications: [
      "ACE-GFI",
      "NASM-CPT",
      "TRX Qualified",
      "Kettlebell Instructor",
    ],
    philosophy:
      "If you're not having fun, you won't stick with it. Let's make fitness your favorite part of the day. We'll work hard, but we'll smile doing it.",
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    rating: 4.9,
    reviews: 156,
    experience: "7 years",
    specialties: ["HIIT", "Cardio", "Circuit Training", "Weight Loss"],
    availability: [
      "Mon 5AM-1PM",
      "Tue 5AM-1PM",
      "Wed 2PM-9PM",
      "Thu 5AM-1PM",
      "Fri 2PM-9PM",
    ],
  },
  {
    id: "emma-rodriguez",
    name: "Emma Rodriguez",
    specialty: "Dance Fitness",
    location: "Westside",
    bio: "Professional dancer turned fitness instructor. Emma brings the energy of the stage to every class, blending choreography with effective calorie-burning workouts.",
    certifications: ["Zumba Licensed", "ACE-GFI", "AFAA", "Zumba Kids"],
    philosophy:
      "Dance is the hidden language of the soul. Let your body express what words cannot. Fitness should feel like celebration, not punishment.",
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80",
    rating: 4.7,
    reviews: 89,
    experience: "6 years",
    specialties: ["Dance Fitness", "Zumba", "Cardio Dance", "Choreography"],
    availability: [
      "Mon 10AM-6PM",
      "Tue 10AM-6PM",
      "Wed 10AM-6PM",
      "Thu 10AM-6PM",
      "Sat 10AM-4PM",
    ],
  },
  {
    id: "james-park",
    name: "James Park",
    specialty: "Nutrition & Recovery",
    location: "Midtown",
    bio: "Registered dietitian and recovery specialist. James helps clients optimize their nutrition and recovery protocols for maximum performance and results.",
    certifications: ["RD", "CSSS", "CPT-NASM", "Sleep Science Coach"],
    philosophy:
      "You can't out-train a bad diet. Nutrition and recovery are where transformations happen. Let me help you build habits that last.",
    img: "https://images.unsplash.com/photo-1571019613454-1ec235038180?w=800&q=80",
    rating: 4.8,
    reviews: 72,
    experience: "9 years",
    specialties: [
      "Nutrition",
      "Recovery",
      "Sleep Optimization",
      "Weight Management",
    ],
    availability: [
      "Mon 9AM-5PM",
      "Tue 9AM-5PM",
      "Wed 9AM-5PM",
      "Thu 9AM-5PM",
      "Fri 9AM-3PM",
    ],
  },
  {
    id: "aisha-williams",
    name: "Aisha Williams",
    specialty: "Strength & Powerlifting",
    location: "Downtown",
    bio: "Competitive powerlifter and coach. Aisha specializes in helping clients build raw strength through barbell training and periodized programming.",
    certifications: [
      "USAW-L2",
      "CSCS",
      "Starting Strength Coach",
      "Powerlifting Judge",
    ],
    philosophy:
      "The bar doesn't lie. Show up, put in the work, and the numbers will tell your story. I coach with science, patience, and relentless belief in your potential.",
    img: "https://images.unsplash.com/photo-1609899464926-249c9500db77?w=800&q=80",
    rating: 4.9,
    reviews: 104,
    experience: "11 years",
    specialties: [
      "Powerlifting",
      "Barbell Training",
      "Strength",
      "Competition Prep",
    ],
    availability: [
      "Mon 5AM-1PM",
      "Tue 5AM-1PM",
      "Wed 3PM-9PM",
      "Thu 5AM-1PM",
      "Fri 3PM-9PM",
    ],
  },
];

export const specialties = [
  "All",
  "Strength",
  "Yoga",
  "HIIT",
  "Cardio",
  "Dance",
  "Nutrition",
  "Recovery",
];

export const trainers = [
  {
    id: "marcus-johnson",
    name: "Marcus Johnson",
    specialty: "Strength & Conditioning",
    location: "Downtown",
    bio: "Former collegiate athlete with 10+ years of experience in strength training and athletic performance. Marcus specializes in progressive overload programs and functional movement.",
    certifications: ["NSCA-CSCS", "ACE-CPT", "FMS Level 2"],
    philosophy:
      "Strength is the foundation of everything. Build a solid base, and everything else follows.",
    img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80",
    rating: 4.9,
    reviews: 127,
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    specialty: "Yoga & Mobility",
    location: "Midtown",
    bio: "Certified yoga instructor with a background in physical therapy. Sarah combines Eastern wisdom with Western science to help clients move better and feel better.",
    certifications: ["RYT-500", "FRC", "Precision Nutrition L1"],
    philosophy:
      "Movement is medicine. Every body can find its expression through mindful practice.",
    img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80",
    rating: 4.8,
    reviews: 98,
  },
  {
    id: "david-okafor",
    name: "David Okafor",
    specialty: "HIIT & Cardio",
    location: "Downtown",
    bio: "High-energy coach who believes fitness should be fun. David's classes are known for their infectious energy and creative programming that keeps members coming back.",
    certifications: ["ACE-GFI", "NASM-CPT", "TRX Qualified"],
    philosophy:
      "If you're not having fun, you won't stick with it. Let's make fitness your favorite part of the day.",
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: "emma-rodriguez",
    name: "Emma Rodriguez",
    specialty: "Dance Fitness",
    location: "Westside",
    bio: "Professional dancer turned fitness instructor. Emma brings the energy of the stage to every class, blending choreography with effective calorie-burning workouts.",
    certifications: ["Zumba Licensed", "ACE-GFI", "AFAA"],
    philosophy:
      "Dance is the hidden language of the soul. Let your body express what words cannot.",
    img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "james-park",
    name: "James Park",
    specialty: "Nutrition & Recovery",
    location: "Midtown",
    bio: "Registered dietitian and recovery specialist. James helps clients optimize their nutrition and recovery protocols for maximum performance and results.",
    certifications: ["RD", "CSSS", "CPT-NASM"],
    philosophy:
      "You can't out-train a bad diet. Nutrition and recovery are where transformations happen.",
    img: "https://images.unsplash.com/photo-1571019613454-1ec235038180?w=400&q=80",
    rating: 4.8,
    reviews: 72,
  },
  {
    id: "aisha-williams",
    name: "Aisha Williams",
    specialty: "Strength & Powerlifting",
    location: "Downtown",
    bio: "Competitive powerlifter and coach. Aisha specializes in helping clients build raw strength through barbell training and periodized programming.",
    certifications: ["USAW-L2", "CSCS", "Starting Strength Coach"],
    philosophy:
      "The bar doesn't lie. Show up, put in the work, and the numbers will tell your story.",
    img: "https://images.unsplash.com/photo-1609899464926-249c9500db77?w=400&q=80",
    rating: 4.9,
    reviews: 104,
  },
];
