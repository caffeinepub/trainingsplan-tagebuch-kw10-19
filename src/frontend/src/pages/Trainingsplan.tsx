import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CheckCircle2, Dumbbell, ShieldCheck, Timer, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  TRAINING_PLAN,
  type TrainingDay,
  WEEKS,
  WHO_STATS,
  getCurrentKw,
} from "../data/trainingData";
import {
  type Day,
  useGetTrainingSession,
  useSaveTrainingSession,
} from "../hooks/useQueries";

const typeConfig = {
  Ausdauer: {
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    icon: Timer,
    badge: "bg-primary/15 text-primary border-primary/30",
  },
  Kraft: {
    color: "text-accent",
    bg: "bg-accent/10 border-accent/20",
    icon: Dumbbell,
    badge: "bg-accent/15 text-accent border-accent/30",
  },
  Kombination: {
    color: "text-[oklch(0.72_0.16_280)]",
    bg: "bg-[oklch(0.72_0.16_280/0.1)] border-[oklch(0.72_0.16_280/0.2)]",
    icon: Zap,
    badge:
      "bg-[oklch(0.72_0.16_280/0.15)] text-[oklch(0.72_0.16_280)] border-[oklch(0.72_0.16_280/0.3)]",
  },
};

function SessionCard({
  plan,
  week,
  index,
}: {
  plan: TrainingDay;
  week: bigint;
  index: number;
}) {
  const config = typeConfig[plan.type];
  const Icon = config.icon;
  const { data: session, isLoading } = useGetTrainingSession(
    week,
    plan.day as Day,
  );
  const { mutate: saveSession, isPending } = useSaveTrainingSession();

  const isCompleted = session?.completed ?? false;

  function handleToggle(checked: boolean) {
    saveSession(
      { week, day: plan.day as Day, completed: checked },
      {
        onSuccess: () => {
          toast.success(
            checked
              ? `${plan.dayLabel}: Training als absolviert markiert! 💪`
              : `${plan.dayLabel}: Training als nicht absolviert markiert.`,
          );
        },
        onError: () => {
          toast.error("Fehler beim Speichern. Bitte erneut versuchen.");
        },
      },
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "relative rounded-xl border p-5 transition-all duration-500",
        isCompleted
          ? "border-primary/50 bg-primary/8 shadow-[0_0_24px_oklch(0.68_0.17_168/0.12)]"
          : config.bg,
      )}
    >
      {/* Completed streak bar on left edge */}
      <div
        className={cn(
          "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all duration-500",
          isCompleted ? "bg-primary opacity-100" : "opacity-0",
        )}
      />

      <div className="flex items-start gap-4">
        {/* Day badge — flips to checkmark on complete */}
        <motion.div
          animate={isCompleted ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm border transition-all duration-500",
            isCompleted
              ? "bg-primary/20 border-primary/40"
              : cn(config.bg, "border"),
          )}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-primary" />
          ) : (
            <span className={config.color}>{plan.dayShort}</span>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3
              className={cn(
                "font-display font-semibold text-base transition-colors duration-300",
                isCompleted ? "text-primary" : "text-foreground",
              )}
            >
              {plan.dayLabel}
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium",
                config.badge,
              )}
            >
              <Icon className="w-3 h-3" />
              {plan.type}
            </span>
          </div>

          <p
            className={cn(
              "text-sm font-semibold mb-2 transition-colors duration-300",
              isCompleted
                ? "text-foreground/70 line-through decoration-primary/40"
                : "text-foreground/90",
            )}
          >
            {plan.title}
          </p>

          {/* Exercises */}
          <ul className="space-y-1">
            {plan.exercises.map((ex) => (
              <li
                key={ex}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors duration-300",
                  isCompleted
                    ? "text-muted-foreground/50"
                    : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-opacity duration-300",
                    isCompleted
                      ? "bg-primary/40"
                      : config.color.replace("text-", "bg-"),
                  )}
                />
                {ex}
              </li>
            ))}
          </ul>

          {/* Meta */}
          <div className="flex gap-3 mt-3 flex-wrap">
            {plan.duration && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Timer className="w-3 h-3" /> {plan.duration}
              </span>
            )}
            {plan.sets && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Dumbbell className="w-3 h-3" /> {plan.sets}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {plan.intensityLabel}
            </span>
          </div>
        </div>

        {/* Checkbox + label */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
          {isLoading ? (
            <div className="w-5 h-5 rounded-sm border border-border animate-pulse bg-muted" />
          ) : (
            <motion.div
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 600, damping: 20 }}
            >
              <Checkbox
                id={`session-${index}`}
                data-ocid={`trainingsplan.session.checkbox.${index + 1}`}
                checked={isCompleted}
                onCheckedChange={(v) => handleToggle(!!v)}
                disabled={isPending}
                className="w-5 h-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
              />
            </motion.div>
          )}
          <Label
            htmlFor={`session-${index}`}
            className="text-xs cursor-pointer text-center leading-tight"
          >
            {isCompleted ? (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-semibold"
              >
                ✓ Fertig!
              </motion.span>
            ) : (
              <span className="text-muted-foreground">Absolviert?</span>
            )}
          </Label>
        </div>
      </div>

      {/* WHO contribution tag */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <span className="text-xs text-muted-foreground">
          {plan.whoContribution}
        </span>
      </div>
    </motion.div>
  );
}

function SundaySessionCard({
  plan,
  week,
  index,
}: {
  plan: TrainingDay;
  week: bigint;
  index: number;
}) {
  const config = typeConfig[plan.type];
  const Icon = config.icon;
  const storageKey = `sunday_completed_kw_${week.toString()}`;

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  });

  // Sync when week changes
  useEffect(() => {
    try {
      setIsCompleted(localStorage.getItem(storageKey) === "true");
    } catch {
      setIsCompleted(false);
    }
  }, [storageKey]);

  function handleToggle(checked: boolean) {
    try {
      if (checked) {
        localStorage.setItem(storageKey, "true");
      } else {
        localStorage.removeItem(storageKey);
      }
      setIsCompleted(checked);
      toast.success(
        checked
          ? `${plan.dayLabel}: Training als absolviert markiert! 💪`
          : `${plan.dayLabel}: Training als nicht absolviert markiert.`,
      );
    } catch {
      toast.error("Fehler beim Speichern. Bitte erneut versuchen.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        "relative rounded-xl border p-5 transition-all duration-500",
        isCompleted
          ? "border-primary/50 bg-primary/8 shadow-[0_0_24px_oklch(0.68_0.17_168/0.12)]"
          : config.bg,
      )}
    >
      {/* Completed streak bar on left edge */}
      <div
        className={cn(
          "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all duration-500",
          isCompleted ? "bg-primary opacity-100" : "opacity-0",
        )}
      />

      <div className="flex items-start gap-4">
        {/* Day badge — flips to checkmark on complete */}
        <motion.div
          animate={isCompleted ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-sm border transition-all duration-500",
            isCompleted
              ? "bg-primary/20 border-primary/40"
              : cn(config.bg, "border"),
          )}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-primary" />
          ) : (
            <span className={config.color}>{plan.dayShort}</span>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3
              className={cn(
                "font-display font-semibold text-base transition-colors duration-300",
                isCompleted ? "text-primary" : "text-foreground",
              )}
            >
              {plan.dayLabel}
            </h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium",
                config.badge,
              )}
            >
              <Icon className="w-3 h-3" />
              {plan.type}
            </span>
          </div>

          <p
            className={cn(
              "text-sm font-semibold mb-2 transition-colors duration-300",
              isCompleted
                ? "text-foreground/70 line-through decoration-primary/40"
                : "text-foreground/90",
            )}
          >
            {plan.title}
          </p>

          {/* Exercises */}
          <ul className="space-y-1">
            {plan.exercises.map((ex) => (
              <li
                key={ex}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors duration-300",
                  isCompleted
                    ? "text-muted-foreground/50"
                    : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-opacity duration-300",
                    isCompleted
                      ? "bg-primary/40"
                      : config.color.replace("text-", "bg-"),
                  )}
                />
                {ex}
              </li>
            ))}
          </ul>

          {/* Meta */}
          <div className="flex gap-3 mt-3 flex-wrap">
            {plan.duration && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Timer className="w-3 h-3" /> {plan.duration}
              </span>
            )}
            {plan.sets && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Dumbbell className="w-3 h-3" /> {plan.sets}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {plan.intensityLabel}
            </span>
          </div>
        </div>

        {/* Checkbox + label */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
          <motion.div
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 600, damping: 20 }}
          >
            <Checkbox
              id={`session-sunday-${index}`}
              data-ocid={`trainingsplan.session.checkbox.${index + 1}`}
              checked={isCompleted}
              onCheckedChange={(v) => handleToggle(!!v)}
              className="w-5 h-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
            />
          </motion.div>
          <Label
            htmlFor={`session-sunday-${index}`}
            className="text-xs cursor-pointer text-center leading-tight"
          >
            {isCompleted ? (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary font-semibold"
              >
                ✓ Fertig!
              </motion.span>
            ) : (
              <span className="text-muted-foreground">Absolviert?</span>
            )}
          </Label>
        </div>
      </div>

      {/* WHO contribution tag */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <span className="text-xs text-muted-foreground">
          {plan.whoContribution}
        </span>
      </div>
    </motion.div>
  );
}

export default function Trainingsplan() {
  const currentKw = getCurrentKw();
  const [selectedWeek, setSelectedWeek] = useState(currentKw);
  const weekBigInt = BigInt(selectedWeek);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          Trainingsplan
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          WHO-konformes Trainingsprogramm · KW 10–19 (2026)
        </p>
      </motion.div>

      {/* WHO Compliance Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="rounded-xl border border-success/30 bg-success/10 p-4"
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-semibold text-success text-sm mb-2">
              WHO-Bewegungsempfehlungen erfüllt ✓
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {WHO_STATS.ausdauerMinutes} Min. Laufen + 30 Min. Kombi =
                    120 Min. Ausdauer/Woche
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ziel: {WHO_STATS.ausdauerTarget}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-px bg-border" />
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-accent flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {WHO_STATS.kraftDays} Krafttage/Woche
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ziel: {WHO_STATS.kraftTarget}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Week selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Woche auswählen:
        </Label>
        <Select
          value={selectedWeek.toString()}
          onValueChange={(v) => setSelectedWeek(Number(v))}
        >
          <SelectTrigger
            data-ocid="trainingsplan.week.select"
            className="w-[220px] bg-card border-border"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {WEEKS.map((w) => (
              <SelectItem key={w.kw} value={w.kw.toString()}>
                {w.label} · {w.dateRange}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Training cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedWeek}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid gap-4"
        >
          {TRAINING_PLAN.map((plan, index) =>
            plan.day === "sunday" ? (
              <SundaySessionCard
                key="sunday"
                plan={plan}
                week={weekBigInt}
                index={index}
              />
            ) : (
              <SessionCard
                key={String(plan.day)}
                plan={plan}
                week={weekBigInt}
                index={index}
              />
            ),
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
