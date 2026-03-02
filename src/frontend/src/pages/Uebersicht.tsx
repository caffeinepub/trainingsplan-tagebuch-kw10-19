import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Loader2,
  Minus,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { WEEKS } from "../data/trainingData";
import { useGetAllDiaries, useGetTotalProgress } from "../hooks/useQueries";

function ArcRing({ percent, count }: { percent: number; count: number }) {
  const size = 80;
  const strokeWidth = 7;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (percent / 100) * circumference;

  const ringColor =
    percent >= 100
      ? "oklch(0.7 0.19 145)" // success green
      : percent >= 50
        ? "oklch(0.68 0.17 168)" // primary teal
        : "oklch(0.75 0.17 80)"; // accent amber

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        role="img"
        aria-label={`Fortschritt: ${percent}%`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="oklch(0.22 0.015 240)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{
            delay: 0.4,
            duration: 1.2,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display font-bold text-xl leading-none"
          style={{ color: ringColor }}
        >
          {count}
        </span>
        <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
          / 9
        </span>
      </div>
    </div>
  );
}

function WeekStatusIcon({
  achieved,
  hasDiary,
  isFuture,
}: {
  achieved: boolean;
  hasDiary: boolean;
  isFuture: boolean;
}) {
  if (isFuture || !hasDiary) {
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
  if (achieved) {
    return <CheckCircle2 className="w-4 h-4 text-success" />;
  }
  return <XCircle className="w-4 h-4 text-destructive" />;
}

function WeekRow({
  weekData,
  diary,
  isFuture,
  index,
}: {
  weekData: (typeof WEEKS)[0];
  diary?: {
    goalAchieved: boolean;
    notes: string;
    challenges: string;
    strategies: string;
  } | null;
  isFuture: boolean;
  index: number;
}) {
  const hasDiary = !!diary;
  const achieved = diary?.goalAchieved ?? false;

  return (
    <motion.div
      data-ocid={`uebersicht.week.item.${index + 1}`}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.35 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
        isFuture
          ? "border-border/50 bg-card/40 opacity-60"
          : achieved
            ? "border-success/20 bg-success/5"
            : hasDiary
              ? "border-destructive/20 bg-destructive/5"
              : "border-border bg-card",
      )}
    >
      {/* Week number */}
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-xs border",
          isFuture
            ? "border-border bg-muted text-muted-foreground"
            : achieved
              ? "border-success/30 bg-success/15 text-success"
              : hasDiary
                ? "border-destructive/30 bg-destructive/15 text-destructive"
                : "border-border bg-muted text-muted-foreground",
        )}
      >
        {weekData.kw}
      </div>

      {/* Date range */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium",
            isFuture ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {weekData.label}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {weekData.dateRange}
        </p>
      </div>

      {/* Diary status */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {hasDiary && !isFuture && (
          <Badge
            variant="outline"
            className="text-xs hidden sm:flex items-center gap-1 border-border text-muted-foreground"
          >
            <BookOpen className="w-3 h-3" />
            Eintrag
          </Badge>
        )}
        <WeekStatusIcon
          achieved={achieved}
          hasDiary={hasDiary}
          isFuture={isFuture}
        />
      </div>
    </motion.div>
  );
}

export default function Uebersicht() {
  const {
    data: allDiaries,
    isLoading: diariesLoading,
    isError: diariesError,
  } = useGetAllDiaries();
  const { data: totalProgress, isLoading: progressLoading } =
    useGetTotalProgress();

  const now = new Date();
  const diaryMap = new Map((allDiaries ?? []).map((d) => [Number(d.week), d]));

  const progressCount = Number(totalProgress ?? 0);
  const progressPercent = Math.round((progressCount / 9) * 100);

  const achievedWeeks = allDiaries?.filter((d) => d.goalAchieved).length ?? 0;
  const totalEntries = allDiaries?.length ?? 0;

  const isLoading = diariesLoading || progressLoading;

  if (isLoading) {
    return (
      <div
        data-ocid="uebersicht.loading_state"
        className="flex items-center justify-center py-16"
      >
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground text-sm">
          Lade Fortschritt...
        </span>
      </div>
    );
  }

  if (diariesError) {
    return (
      <div
        data-ocid="uebersicht.error_state"
        className="flex items-center justify-center py-16 flex-col gap-2"
      >
        <AlertCircle className="w-8 h-8 text-destructive" />
        <p className="text-muted-foreground text-sm">
          Fehler beim Laden der Daten.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            Fortschrittsübersicht
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          KW 10–19 · 9 Wochen Training
        </p>
      </motion.div>

      {/* Progress hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-xl border border-border bg-card p-5 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-accent/4 pointer-events-none" />

        <div className="relative flex items-center gap-5">
          {/* SVG Arc Ring */}
          <div className="flex-shrink-0">
            <ArcRing percent={progressPercent} count={progressCount} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
              Gesamtfortschritt
            </p>
            <p className="font-display text-2xl font-bold text-foreground leading-tight">
              <span className="text-primary">{progressCount}</span>
              <span className="text-muted-foreground text-lg font-normal">
                {" "}
                von 9 Wochen
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 mb-3">
              Ziel erreicht
            </p>

            {/* Stats row */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>{achievedWeeks} erfüllt</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>{totalEntries} Einträge</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Target className="w-3.5 h-3.5 text-accent" />
                <span>{9 - progressCount} verbleibend</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient bar below */}
        <div className="mt-4 progress-track h-2">
          <motion.div
            className="progress-fill h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{
              delay: 0.5,
              duration: 1.0,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          />
        </div>
      </motion.div>

      {/* Weeks grid */}
      <div>
        <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Wochenübersicht
        </h2>
        <div className="space-y-2">
          {WEEKS.map((weekData, i) => {
            const weekStart = weekData.start;
            const isFuture = weekStart > now;
            const diary = diaryMap.get(weekData.kw) ?? null;

            return (
              <WeekRow
                key={weekData.kw}
                weekData={weekData}
                diary={diary}
                isFuture={isFuture}
                index={i}
              />
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="flex gap-4 flex-wrap pt-2"
      >
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" /> Ziel erreicht
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <XCircle className="w-3.5 h-3.5 text-destructive" /> Ziel nicht
          erreicht
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Minus className="w-3.5 h-3.5 text-muted-foreground" /> Kein Eintrag /
          Zukunft
        </div>
      </motion.div>
    </div>
  );
}
