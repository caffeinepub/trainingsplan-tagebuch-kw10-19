import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TrainingSession {
    day: Day;
    week: bigint;
    completed: boolean;
}
export interface WeekDiary {
    goalAchieved: boolean;
    week: bigint;
    notes: string;
    challenges: string;
    strategies: string;
}
export enum Day {
    wednesday = "wednesday",
    saturday = "saturday",
    monday = "monday"
}
export interface backendInterface {
    getAllDiaries(): Promise<Array<WeekDiary>>;
    getTotalProgress(): Promise<bigint>;
    getTrainingSession(week: bigint, day: Day): Promise<TrainingSession>;
    getWeekDiary(week: bigint): Promise<WeekDiary>;
    saveTrainingSession(session: TrainingSession): Promise<void>;
    saveWeekDiary(entry: WeekDiary): Promise<void>;
}
