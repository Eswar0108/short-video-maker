/**
 * Utility for generating scripts and managing bulk operations
 */

const TRENDING_TOPICS = [
  "Time Management",
  "Productivity Hacks",
  "Habit Building",
  "Learning Techniques",
  "Deep Work Methods",
  "Focus Improvement",
  "Procrastination Solutions",
  "Goal Setting",
  "Morning Routines",
  "Study Techniques",
  "Memory Improvement",
  "Speed Learning",
  "Motivation Strategies",
  "Discipline Building",
  "Decision Making",
];

const TEMPLATES = {
  "Problem-Solution": {
    hook: "Most people [problem]. Here's how to fix it.",
    main: "The solution is [solution]. Step 1: [action], Step 2: [action], Step 3: [action].",
    cta: "Try this for a week. Drop a comment if it worked for you!",
  },
  "Myth-Truth": {
    hook: "You've been lied to about [topic]. The truth is [fact].",
    main: "Here's the evidence: [proof]. Scientists confirm this.",
    cta: "Stop believing the lie. Share this with someone who needs to know.",
  },
  Tutorial: {
    hook: "Learn [skill] in [time period]. It's easier than you think.",
    main: "Follow these [number] steps. Each takes under a minute.",
    cta: "Master this skill today. Your future self will thank you.",
  },
  Motivation: {
    hook: "[Inspiring statement about topic].",
    main: "Here's what changed for me: [personal example/data].",
    cta: "Your turn. Will you try this? Comment your goals below.",
  },
};

interface GenerateScriptOptions {
  topic: string;
  style: "Problem-Solution" | "Myth-Truth" | "Tutorial" | "Motivation";
  minDuration?: number; // in milliseconds
}

interface GeneratedScript {
  scenes: Array<{
    text: string;
    searchTerms: string[];
  }>;
}

function generateSearchTerms(topic: string, context: string): string[] {
  const contextualTerms: Record<string, string[]> = {
    time: ["productivity", "clock", "scheduling", "organization"],
    learning: ["study", "knowledge", "brain", "education", "notes"],
    habit: ["routine", "motivation", "habit formation", "discipline"],
    productivity: ["focus", "productivity", "efficient", "workflow"],
    success: ["achievement", "goal", "success", "victory", "winning"],
    motivation: ["inspiration", "motivation", "positive", "energetic"],
    focus: ["concentration", "focus", "attention", "mindful"],
    memory: ["brain", "memory", "learning", "knowledge"],
  };

  let terms: string[] = [];
  const lowerTopic = topic.toLowerCase();

  for (const [key, values] of Object.entries(contextualTerms)) {
    if (lowerTopic.includes(key)) {
      terms = values;
      break;
    }
  }

  if (terms.length === 0) {
    terms = [lowerTopic, context.toLowerCase(), "learning"];
  }

  return terms.slice(0, 3);
}

export function generateScript(options: GenerateScriptOptions): GeneratedScript {
  const { topic, style } = options;
  const template = TEMPLATES[style] || TEMPLATES["Problem-Solution"];

  const scenes = [
    {
      text: template.hook,
      searchTerms: generateSearchTerms(topic, "introduction"),
    },
    {
      text: template.main,
      searchTerms: generateSearchTerms(topic, "content"),
    },
    {
      text: template.cta,
      searchTerms: generateSearchTerms(topic, "action"),
    },
  ];

  return { scenes };
}

export function getTrendingTopics(count: number = 10): string[] {
  // Shuffle and return requested count
  const shuffled = [...TRENDING_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, TRENDING_TOPICS.length));
}

export function getAllTrendingTopics(): string[] {
  return TRENDING_TOPICS;
}
