import { Day } from "../backend.d";

export const WEEKS = [
  {
    kw: 10,
    label: "KW 10",
    dateRange: "2. März – 8. März 2026",
    start: new Date("2026-03-02"),
  },
  {
    kw: 11,
    label: "KW 11",
    dateRange: "9. März – 15. März 2026",
    start: new Date("2026-03-09"),
  },
  {
    kw: 12,
    label: "KW 12",
    dateRange: "16. März – 22. März 2026",
    start: new Date("2026-03-16"),
  },
  {
    kw: 13,
    label: "KW 13",
    dateRange: "23. März – 29. März 2026",
    start: new Date("2026-03-23"),
  },
  {
    kw: 14,
    label: "KW 14",
    dateRange: "30. März – 5. April 2026",
    start: new Date("2026-03-30"),
  },
  {
    kw: 15,
    label: "KW 15",
    dateRange: "6. April – 12. April 2026",
    start: new Date("2026-04-06"),
  },
  {
    kw: 16,
    label: "KW 16",
    dateRange: "13. April – 19. April 2026",
    start: new Date("2026-04-13"),
  },
  {
    kw: 17,
    label: "KW 17",
    dateRange: "20. April – 26. April 2026",
    start: new Date("2026-04-20"),
  },
  {
    kw: 18,
    label: "KW 18",
    dateRange: "27. April – 3. Mai 2026",
    start: new Date("2026-04-27"),
  },
  {
    kw: 19,
    label: "KW 19",
    dateRange: "4. Mai – 10. Mai 2026",
    start: new Date("2026-05-04"),
  },
];

export type TrainingType = "Ausdauer" | "Kraft" | "Kombination";

export interface TrainingDay {
  day: Day | "sunday";
  dayLabel: string;
  dayShort: string;
  type: TrainingType;
  title: string;
  exercises: string[];
  duration?: string;
  sets?: string;
  intensityLabel: string;
  whoContribution: string;
}

export const TRAINING_PLAN: TrainingDay[] = [
  {
    day: Day.monday,
    dayLabel: "Montag",
    dayShort: "Mo",
    type: "Ausdauer",
    title: "Ausdauer-Lauf",
    exercises: ["Laufen – 60 Minuten", "Mittlere Intensität"],
    duration: "60 Min.",
    intensityLabel: "Mittlere Intensität",
    whoContribution: "60 Min. Ausdauer",
  },
  {
    day: Day.wednesday,
    dayLabel: "Mittwoch",
    dayShort: "Mi",
    type: "Kraft",
    title: "Ganzkörpertraining Calisthenics",
    exercises: [
      "Rumpf (Core)",
      "Beine",
      "Oberkörper (Push & Pull)",
      "Schultern",
    ],
    duration: "60 Min.",
    sets: "3 × 10–15 Wdh.",
    intensityLabel: "Mittlere bis hohe Intensität",
    whoContribution: "Krafttag 1",
  },
  {
    day: Day.saturday,
    dayLabel: "Samstag",
    dayShort: "Sa",
    type: "Kombination",
    title: "Kombi: Joggen + Calisthenics",
    exercises: [
      "Joggen – 30 Minuten",
      "Ganzkörper Calisthenics (Rumpf, Beine, Oberkörper)",
    ],
    duration: "60–75 Min.",
    sets: "2–3 × 10–15 Wdh.",
    intensityLabel: "Mittlere Intensität",
    whoContribution: "30 Min. Ausdauer + Krafttag 2",
  },
  {
    day: "sunday",
    dayLabel: "Sonntag",
    dayShort: "So",
    type: "Kraft",
    title: "Ganzkörpertraining Calisthenics",
    exercises: [
      "Rumpf (Core)",
      "Beine",
      "Oberkörper (Push & Pull)",
      "Schultern",
    ],
    duration: "60 Min.",
    sets: "3 × 10–15 Wdh.",
    intensityLabel: "Mittlere bis hohe Intensität",
    whoContribution: "Krafttag 3",
  },
];

export const WHO_STATS = {
  ausdauerMinutes: 90,
  ausdauerTarget: "≥ 150 Min. (mittel) / ≥ 75 Min. (hoch)",
  kraftDays: 3,
  kraftTarget: "≥ 2 Tage",
  complianceNote:
    "Erfüllt: 90 Min. Ausdauer (mittel) + 30 Min. (Kombi) + 3 Krafttage pro Woche",
};

export function getWeekByKw(kw: number) {
  return WEEKS.find((w) => w.kw === kw);
}

export function getCurrentKw(): number {
  const now = new Date();
  const firstWeek = WEEKS[0].start;
  const lastWeek = WEEKS[WEEKS.length - 1].start;

  if (now < firstWeek) return 10;
  if (now > lastWeek) return 19;

  for (let i = 0; i < WEEKS.length - 1; i++) {
    if (now >= WEEKS[i].start && now < WEEKS[i + 1].start) {
      return WEEKS[i].kw;
    }
  }
  return 19;
}
