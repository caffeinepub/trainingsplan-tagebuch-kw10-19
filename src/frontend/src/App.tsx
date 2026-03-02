import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Activity, BookOpen, Dumbbell, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Tagebuch from "./pages/Tagebuch";
import Trainingsplan from "./pages/Trainingsplan";
import Uebersicht from "./pages/Uebersicht";

type Tab = "trainingsplan" | "tagebuch" | "uebersicht";

const TABS: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "trainingsplan", label: "Trainingsplan", icon: Dumbbell },
  { id: "tagebuch", label: "Tagebuch", icon: BookOpen },
  { id: "uebersicht", label: "Übersicht", icon: TrendingUp },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("trainingsplan");

  const ocidMap: Record<Tab, string> = {
    trainingsplan: "nav.trainingsplan.tab",
    tagebuch: "nav.tagebuch.tab",
    uebersicht: "nav.uebersicht.tab",
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col">
      <Toaster position="top-right" theme="dark" richColors />

      {/* Unified header + nav — single chrome strip */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4">
          {/* Brand row */}
          <div className="flex items-center justify-between pt-3 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/20 border border-primary/40">
                <Activity className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-display font-bold text-foreground text-sm tracking-tight">
                Fitness Tagebuch{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  KW 10–19 · 2026
                </span>
              </span>
            </div>
          </div>

          {/* Tab nav — always shows label */}
          <nav className="flex -mb-px">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  data-ocid={ocidMap[tab.id]}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors duration-200 flex-1 justify-center rounded-t-sm",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground/80",
                  )}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {activeTab === "trainingsplan" && <Trainingsplan />}
            {activeTab === "tagebuch" && <Tagebuch />}
            {activeTab === "uebersicht" && <Uebersicht />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4 mt-4">
        <div className="max-w-2xl mx-auto px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with{" "}
          <span className="text-destructive">♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
