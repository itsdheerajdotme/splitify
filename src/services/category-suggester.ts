export type CategoryDef = {
  id: string;
  name: string;
  icon: string;
  keywords: string[];
};

export const CATEGORIES: CategoryDef[] = [
  {
    id: "food",
    name: "Food & Dining",
    icon: "🍔",
    keywords: ["food", "dinner", "lunch", "breakfast", "meal", "cafe", "coffee", "restaurant", "burger", "pizza", "biryani", "swiggy", "zomato", "dhabha", "snack"],
  },
  {
    id: "fuel",
    name: "Fuel & Travel",
    icon: "⛽",
    keywords: ["fuel", "petrol", "diesel", "cng", "gas", "uber", "ola", "cab", "taxi", "toll", "parking", "auto", "ride"],
  },
  {
    id: "stay",
    name: "Hotel & Stay",
    icon: "🏨",
    keywords: ["hotel", "resort", "stay", "room", "airbnb", "villa", "booking", "hostel", "lodge"],
  },
  {
    id: "flight",
    name: "Flight & Train",
    icon: "✈️",
    keywords: ["flight", "air", "ticket", "train", "railway", "irctc", "indigo", "vistara", "bus"],
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "🛍️",
    keywords: ["shopping", "clothes", "mall", "mart", "store", "amazon", "flipkart", "gift", "apparel"],
  },
  {
    id: "entertainment",
    name: "Entertainment & Party",
    icon: "🎬",
    keywords: ["movie", "cinema", "film", "park", "concert", "party", "drinks", "pub", "bar", "club", "event"],
  },
  {
    id: "groceries",
    name: "Groceries",
    icon: "🛒",
    keywords: ["groceries", "grocery", "supermarket", "milk", "vegetables", "fruits", "zepto", "blinkit", "instamart"],
  },
  {
    id: "utilities",
    name: "Bills & Utilities",
    icon: "💡",
    keywords: ["electricity", "water", "wifi", "internet", "recharge", "bill", "rent", "maintenance"],
  },
  {
    id: "medical",
    name: "Medical & Health",
    icon: "💊",
    keywords: ["pharmacy", "medical", "medicine", "doctor", "hospital", "clinic", "health"],
  },
  {
    id: "other",
    name: "General / Other",
    icon: "📦",
    keywords: [],
  },
];

/**
 * Given an expense description, suggests the best matching category.
 */
export function suggestCategory(description: string): CategoryDef {
  if (!description.trim()) {
    return CATEGORIES.find((c) => c.id === "other")!;
  }

  const normalized = description.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const tokens = normalized.split(/\s+/);

  let bestCategory: CategoryDef | null = null;
  let maxScore = 0;

  for (const cat of CATEGORIES) {
    if (cat.keywords.length === 0) continue;

    let score = 0;
    for (const keyword of cat.keywords) {
      if (tokens.includes(keyword)) {
        score += 3; // Exact word match
      } else if (normalized.includes(keyword)) {
        score += 1; // Partial match
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat;
    }
  }

  return bestCategory || CATEGORIES.find((c) => c.id === "other")!;
}
