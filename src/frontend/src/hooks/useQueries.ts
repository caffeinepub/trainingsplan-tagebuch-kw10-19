import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Day, type TrainingSession, type WeekDiary } from "../backend.d";
import { useActor } from "./useActor";

export { Day };
export type { TrainingSession, WeekDiary };

// ── Week diary queries ──────────────────────────────────────────────────────

export function useGetAllDiaries() {
  const { actor, isFetching } = useActor();
  return useQuery<WeekDiary[]>({
    queryKey: ["allDiaries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDiaries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWeekDiary(week: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<WeekDiary>({
    queryKey: ["weekDiary", week.toString()],
    queryFn: async () => {
      if (!actor)
        return {
          week,
          goalAchieved: false,
          notes: "",
          challenges: "",
          strategies: "",
        };
      return actor.getWeekDiary(week);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveWeekDiary() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: WeekDiary) => {
      if (!actor) throw new Error("No actor");
      return actor.saveWeekDiary(entry);
    },
    onSuccess: (_data, entry) => {
      queryClient.invalidateQueries({
        queryKey: ["weekDiary", entry.week.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["allDiaries"] });
      queryClient.invalidateQueries({ queryKey: ["totalProgress"] });
    },
  });
}

// ── Training session queries ────────────────────────────────────────────────

export function useGetTrainingSession(week: bigint, day: Day) {
  const { actor, isFetching } = useActor();
  return useQuery<TrainingSession>({
    queryKey: ["trainingSession", week.toString(), day],
    queryFn: async () => {
      if (!actor) return { week, day, completed: false };
      return actor.getTrainingSession(week, day);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveTrainingSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (session: TrainingSession) => {
      if (!actor) throw new Error("No actor");
      return actor.saveTrainingSession(session);
    },
    onSuccess: (_data, session) => {
      queryClient.invalidateQueries({
        queryKey: ["trainingSession", session.week.toString(), session.day],
      });
    },
  });
}

// ── Progress query ──────────────────────────────────────────────────────────

export function useGetTotalProgress() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalProgress"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalProgress();
    },
    enabled: !!actor && !isFetching,
  });
}
