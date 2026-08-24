import type { WordEntry } from "../types";

// A deliberately small, curated bank across a handful of light categories —
// easy to extend, not aiming for exhaustive coverage of any one topic.
// Difficulty is a rough blend of length, letter variety and how common the
// word/phrase is, not a strict formula.
export const ENTRIES: WordEntry[] = [
  // --- Words: easy (short, everyday) ---
  { text: "CAT", category: "Animals", type: "word", difficulty: "easy" },
  { text: "BOOK", category: "Objects", type: "word", difficulty: "easy" },
  { text: "CHAIR", category: "Objects", type: "word", difficulty: "easy" },
  { text: "HAPPY", category: "Everyday", type: "word", difficulty: "easy" },
  { text: "GARDEN", category: "Nature", type: "word", difficulty: "easy" },
  { text: "PENCIL", category: "Objects", type: "word", difficulty: "easy" },
  { text: "GUITAR", category: "Music", type: "word", difficulty: "easy" },
  { text: "PLANET", category: "Nature", type: "word", difficulty: "easy" },

  // --- Words: medium (longer or a bit less common) ---
  { text: "PLATYPUS", category: "Animals", type: "word", difficulty: "medium" },
  { text: "OCTOPUS", category: "Animals", type: "word", difficulty: "medium" },
  { text: "HEDGEHOG", category: "Animals", type: "word", difficulty: "medium" },
  { text: "FLAMINGO", category: "Animals", type: "word", difficulty: "medium" },
  { text: "WATERFALL", category: "Nature", type: "word", difficulty: "medium" },
  { text: "AVALANCHE", category: "Nature", type: "word", difficulty: "medium" },
  {
    text: "TYPEWRITER",
    category: "Objects",
    type: "word",
    difficulty: "medium",
  },
  { text: "UMBRELLA", category: "Objects", type: "word", difficulty: "medium" },

  // --- Words: hard (long and/or obscure) ---
  { text: "CHAMELEON", category: "Animals", type: "word", difficulty: "hard" },
  { text: "NARWHAL", category: "Animals", type: "word", difficulty: "hard" },
  { text: "AXOLOTL", category: "Animals", type: "word", difficulty: "hard" },
  { text: "PANGOLIN", category: "Animals", type: "word", difficulty: "hard" },
  {
    text: "RENDEZVOUS",
    category: "Everyday",
    type: "word",
    difficulty: "hard",
  },
  { text: "XYLOPHONE", category: "Music", type: "word", difficulty: "hard" },
  { text: "SOURDOUGH", category: "Food", type: "word", difficulty: "hard" },

  // --- Phrases: easy (two short, familiar words) ---
  { text: "HAT TRICK", category: "Sports", type: "phrase", difficulty: "easy" },
  {
    text: "TIME FLIES",
    category: "Idioms",
    type: "phrase",
    difficulty: "easy",
  },
  {
    text: "MUSIC BOX",
    category: "Objects",
    type: "phrase",
    difficulty: "easy",
  },
  {
    text: "CORAL REEF",
    category: "Nature",
    type: "phrase",
    difficulty: "easy",
  },

  // --- Phrases: medium ---
  {
    text: "BREAK THE ICE",
    category: "Idioms",
    type: "phrase",
    difficulty: "medium",
  },
  {
    text: "SPILL THE BEANS",
    category: "Idioms",
    type: "phrase",
    difficulty: "medium",
  },
  {
    text: "PIECE OF CAKE",
    category: "Idioms",
    type: "phrase",
    difficulty: "medium",
  },
  {
    text: "TABLE TENNIS",
    category: "Sports",
    type: "phrase",
    difficulty: "medium",
  },
  {
    text: "ROCK CLIMBING",
    category: "Sports",
    type: "phrase",
    difficulty: "medium",
  },
  {
    text: "PHOTO FINISH",
    category: "Sports",
    type: "phrase",
    difficulty: "medium",
  },
  {
    text: "PEANUT BUTTER",
    category: "Food",
    type: "phrase",
    difficulty: "medium",
  },
  {
    text: "OPEN SOURCE",
    category: "Technology",
    type: "phrase",
    difficulty: "medium",
  },
  {
    text: "SEARCH ENGINE",
    category: "Technology",
    type: "phrase",
    difficulty: "medium",
  },

  // --- Phrases: hard (longer or more words) ---
  {
    text: "AGAINST THE CLOCK",
    category: "Idioms",
    type: "phrase",
    difficulty: "hard",
  },
  {
    text: "BACK TO SQUARE ONE",
    category: "Idioms",
    type: "phrase",
    difficulty: "hard",
  },
  {
    text: "GRANDFATHER CLOCK",
    category: "Objects",
    type: "phrase",
    difficulty: "hard",
  },
  {
    text: "MAGNIFYING GLASS",
    category: "Objects",
    type: "phrase",
    difficulty: "hard",
  },
  {
    text: "KEYBOARD SHORTCUT",
    category: "Technology",
    type: "phrase",
    difficulty: "hard",
  },
  {
    text: "WIRELESS MOUSE",
    category: "Technology",
    type: "phrase",
    difficulty: "hard",
  },
  {
    text: "FIRMWARE UPDATE",
    category: "Technology",
    type: "phrase",
    difficulty: "hard",
  },
  {
    text: "PINEAPPLE PIZZA",
    category: "Food",
    type: "phrase",
    difficulty: "hard",
  },
  {
    text: "NORTHERN LIGHTS",
    category: "Nature",
    type: "phrase",
    difficulty: "hard",
  },
];
