import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { BookOpen, CheckCircle, Loader2, Save, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { WEEKS, getCurrentKw } from "../data/trainingData";
import { useGetWeekDiary, useSaveWeekDiary } from "../hooks/useQueries";

function DiaryForm({ week }: { week: number }) {
  const weekBigInt = BigInt(week);
  const { data: existing, isLoading } = useGetWeekDiary(weekBigInt);
  const { mutate: save, isPending } = useSaveWeekDiary();

  const [goalAchieved, setGoalAchieved] = useState(false);
  const [challenges, setChallenges] = useState("");
  const [strategies, setStrategies] = useState("");
  const [notes, setNotes] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Pre-fill on load
  useEffect(() => {
    if (existing) {
      setGoalAchieved(existing.goalAchieved);
      setChallenges(existing.challenges);
      setStrategies(existing.strategies);
      setNotes(existing.notes);
      setHasChanges(false);
    }
  }, [existing]);

  function markChanged() {
    setHasChanges(true);
  }

  function handleSave() {
    save(
      {
        week: weekBigInt,
        goalAchieved,
        challenges: goalAchieved ? "" : challenges,
        strategies,
        notes,
      },
      {
        onSuccess: () => {
          toast.success("Tagebucheintrag gespeichert! 📔");
          setHasChanges(false);
        },
        onError: () => {
          toast.error("Fehler beim Speichern. Bitte erneut versuchen.");
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div
        data-ocid="tagebuch.loading_state"
        className="flex items-center justify-center py-12"
      >
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground text-sm">
          Lade Eintrag...
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Goal achieved toggle */}
      <div
        className={cn(
          "rounded-xl border p-4 transition-all duration-300",
          goalAchieved
            ? "border-success/40 bg-success/8"
            : "border-destructive/30 bg-destructive/8",
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label className="text-base font-display font-semibold text-foreground cursor-pointer">
              Wochenziel erfüllt?
            </Label>
            <p className="text-sm text-muted-foreground mt-0.5">
              {goalAchieved
                ? "Super — du hast dein Wochenziel erreicht! 🏆"
                : "Du hast das Wochenziel diese Woche nicht erfüllt."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {goalAchieved ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
            <Switch
              data-ocid="tagebuch.goal.switch"
              checked={goalAchieved}
              onCheckedChange={(v) => {
                setGoalAchieved(v);
                markChanged();
              }}
              className="data-[state=checked]:bg-success"
            />
          </div>
        </div>
      </div>

      {/* Challenges – only shown when goal not achieved */}
      <AnimatePresence>
        {!goalAchieved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              <Label
                htmlFor="challenges"
                className="text-sm font-medium text-foreground"
              >
                Herausforderungen
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Textarea
                id="challenges"
                data-ocid="tagebuch.challenges.textarea"
                value={challenges}
                onChange={(e) => {
                  setChallenges(e.target.value);
                  markChanged();
                }}
                placeholder="Was hat Sie daran gehindert, das Ziel zu erreichen?"
                className="min-h-[100px] bg-card border-border resize-none focus:border-primary/60"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strategies */}
      <div className="space-y-2">
        <Label
          htmlFor="strategies"
          className="text-sm font-medium text-foreground"
        >
          Gemeisterte Herausforderungen & Strategie
        </Label>
        <Textarea
          id="strategies"
          data-ocid="tagebuch.strategies.textarea"
          value={strategies}
          onChange={(e) => {
            setStrategies(e.target.value);
            markChanged();
          }}
          placeholder="Was haben Sie gut gemeistert? Welche Strategie haben Sie angewendet?"
          className="min-h-[100px] bg-card border-border resize-none focus:border-primary/60"
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-foreground">
          Notizen{" "}
          <span className="text-muted-foreground font-normal text-xs">
            (optional)
          </span>
        </Label>
        <Textarea
          id="notes"
          data-ocid="tagebuch.notes.textarea"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            markChanged();
          }}
          placeholder="Weitere Gedanken zum Training diese Woche..."
          className="min-h-[80px] bg-card border-border resize-none focus:border-primary/60"
        />
      </div>

      {/* Save button */}
      <Button
        data-ocid="tagebuch.save.submit_button"
        onClick={handleSave}
        disabled={isPending}
        className={cn(
          "w-full font-display font-semibold transition-all",
          hasChanges
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-secondary text-secondary-foreground",
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Wird gespeichert...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            {hasChanges ? "Eintrag speichern" : "Gespeichert"}
          </>
        )}
      </Button>
    </motion.div>
  );
}

export default function Tagebuch() {
  const currentKw = getCurrentKw();
  const [selectedWeek, setSelectedWeek] = useState(currentKw);
  const weekData = WEEKS.find((w) => w.kw === selectedWeek)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">
            Tagebuch
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Dokumentiere deinen wöchentlichen Fortschritt und deine Erfahrungen.
        </p>
      </motion.div>

      {/* Week selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="rounded-xl border border-border bg-card p-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            Woche:
          </Label>
          <Select
            value={selectedWeek.toString()}
            onValueChange={(v) => setSelectedWeek(Number(v))}
          >
            <SelectTrigger
              data-ocid="tagebuch.week.select"
              className="w-full sm:w-[280px] bg-background border-border"
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
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {weekData.label}
            </span>
            {" · "}
            {weekData.dateRange}
          </div>
        </div>
      </motion.div>

      {/* Diary form */}
      <AnimatePresence mode="wait">
        <div key={selectedWeek}>
          <DiaryForm week={selectedWeek} />
        </div>
      </AnimatePresence>
    </div>
  );
}
