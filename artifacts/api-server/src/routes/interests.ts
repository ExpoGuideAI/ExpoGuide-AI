import { Router } from "express";

const router = Router();

const INTEREST_CATEGORIES = [
  {
    id: "technology",
    label: "Technology & AI",
    labelAr: "التقنية والذكاء الاصطناعي",
    icon: "cpu",
    description: "Explore cutting-edge technology pavilions and AI innovations",
  },
  {
    id: "sustainability",
    label: "Sustainability",
    labelAr: "الاستدامة",
    icon: "leaf",
    description: "Green energy, eco-friendly solutions, and sustainable future",
  },
  {
    id: "culture",
    label: "Culture & Heritage",
    labelAr: "الثقافة والتراث",
    icon: "landmark",
    description: "Rich cultural traditions and world heritage experiences",
  },
  {
    id: "arts",
    label: "Arts & Design",
    labelAr: "الفنون والتصميم",
    icon: "palette",
    description: "Creative art installations, design, and visual experiences",
  },
  {
    id: "family",
    label: "Family & Kids",
    labelAr: "الأسرة والأطفال",
    icon: "users",
    description: "Family-friendly pavilions and activities for all ages",
  },
  {
    id: "innovation",
    label: "Innovation",
    labelAr: "الابتكار",
    icon: "lightbulb",
    description: "Groundbreaking ideas and pioneering solutions for tomorrow",
  },
  {
    id: "business",
    label: "Business & Economy",
    labelAr: "الأعمال والاقتصاد",
    icon: "briefcase",
    description: "Global trade, economic development, and business opportunities",
  },
  {
    id: "space",
    label: "Space & Science",
    labelAr: "الفضاء والعلوم",
    icon: "rocket",
    description: "Space exploration, science breakthroughs, and cosmic wonders",
  },
];

router.get("/interests/categories", (_req, res) => {
  res.json(INTEREST_CATEGORIES);
});

export default router;
