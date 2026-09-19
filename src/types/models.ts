export type ActivityCategory =
  | 'study'
  | 'workout'
  | 'sleep'
  | 'meal'
  | 'water'
  | 'coding'
  | 'reading'
  | 'personal'
  | 'other';

export type ActivityPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ActivityStatus = 'pending' | 'completed' | 'skipped' | 'rescheduled';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  gender?: string;
  timezone: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface TrackingPreferences {
  studies: boolean;
  coding: boolean;
  workout: boolean;
  sleep: boolean;
  meals: boolean;
  water: boolean;
  reading: boolean;
  meditation: boolean;
  hobbies: boolean;
  personalTasks: boolean;
  other: boolean;
}

export interface SleepScheduleConfig {
  targetBedtime: string; // e.g. "23:00"
  targetWakeTime: string; // e.g. "07:00"
  targetHours: number; // e.g. 8
}

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  priority: ActivityPriority;
  status: ActivityStatus;
  startTime: string; // "07:30"
  endTime: string;   // "08:30"
  date: string;      // "YYYY-MM-DD"
  durationMinutes: number;
  notes?: string;
  isRecurringTemplate?: boolean;
  templateId?: string;
  completedAt?: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  category: ActivityCategory;
  priority: ActivityPriority;
  startTime: string;
  endTime: string;
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  repeatFrequency: 'weekly' | 'biweekly' | 'daily';
  reminderMinutes?: number;
  notes?: string;
  active: boolean;
}

export interface Subject {
  id: string;
  name: string;
  targetHoursPerWeek: number;
  color: string;
  priority: ActivityPriority;
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  durationMinutes: number;
  date: string;
  focusRating: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weightKg?: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

export interface WorkoutSession {
  id: string;
  title: string;
  type: 'simple' | 'advanced';
  durationMinutes: number;
  date: string;
  completed: boolean;
  notes?: string;
  exercises?: WorkoutExercise[];
}

export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'other';

export interface Meal {
  id: string;
  type: MealType;
  time: string;
  date: string;
  foods: string[];
  notes?: string;
}

export interface WaterLog {
  id: string;
  date: string;
  amountMl: number;
  time: string;
}

export interface SleepRecord {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  durationMinutes: number;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: ActivityCategory;
  currentStreak: number;
  longestStreak: number;
  frequency: 'daily' | 'weekly';
  targetDays: number[];
  color: string;
  createdAt: string;
  completedToday?: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  category: string;
  progress: number; // 0 - 100
  milestones: GoalMilestone[];
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  mode: '25-5' | '50-10' | 'custom';
  activityId?: string;
  subjectId?: string;
  topic?: string;
  date: string;
  completed: boolean;
}

export interface DailyReview {
  id: string;
  date: string;
  mood: number; // 1-5
  energy: number; // 1-5
  stress: number; // 1-5
  wentWell: string;
  couldImprove: string;
  tomorrowFocus: string;
}

export interface WeeklyReview {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  completedActivities: number;
  plannedActivities: number;
  studyMinutes: number;
  workoutMinutes: number;
  avgSleepMinutes: number;
  waterLoggedMl: number;
  achievements: string[];
  observations: string[];
  routineConsistencyPct: number;
  focusAreas: string[];
  nextWeekRecommendations: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'reminder' | 'achievement';
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
}
