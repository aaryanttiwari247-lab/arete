import {
  UserProfile,
  TrackingPreferences,
  SleepScheduleConfig,
  Activity,
  RoutineItem,
  Subject,
  StudySession,
  WorkoutSession,
  Meal,
  WaterLog,
  SleepRecord,
  Habit,
  Goal,
  DailyReview,
  WeeklyReview,
  NotificationItem,
  JournalEntry,
} from '@/types/models';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_01',
  name: '',
  email: '',
  age: undefined,
  height: undefined,
  weight: undefined,
  gender: '',
  timezone: 'UTC',
  avatarUrl: '',
  createdAt: new Date().toISOString(),
};

export const INITIAL_TRACKING_PREFERENCES: TrackingPreferences = {
  studies: true,
  coding: true,
  workout: true,
  sleep: true,
  meals: true,
  water: true,
  reading: true,
  meditation: true,
  hobbies: true,
  personalTasks: true,
  other: false,
};

export const INITIAL_SLEEP_CONFIG: SleepScheduleConfig = {
  targetBedtime: '23:00',
  targetWakeTime: '07:00',
  targetHours: 8,
};

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const INITIAL_ACTIVITIES: Activity[] = [];

export const INITIAL_ROUTINE_ITEMS: RoutineItem[] = [];

export const INITIAL_SUBJECTS: Subject[] = [];

export const INITIAL_STUDY_SESSIONS: StudySession[] = [];

export const INITIAL_WORKOUT_SESSIONS: WorkoutSession[] = [];

export const INITIAL_MEALS: Meal[] = [];

export const INITIAL_WATER_LOGS: WaterLog[] = [];

export const INITIAL_SLEEP_RECORDS: SleepRecord[] = [];

export const INITIAL_HABITS: Habit[] = [];

export const INITIAL_GOALS: Goal[] = [];

export const INITIAL_DAILY_REVIEWS: DailyReview[] = [];

export const INITIAL_WEEKLY_REVIEW: WeeklyReview = {
  id: 'wr_01',
  weekStartDate: getTodayDateString(),
  weekEndDate: getTodayDateString(),
  completedActivities: 0,
  plannedActivities: 0,
  studyMinutes: 0,
  workoutMinutes: 0,
  avgSleepMinutes: 0,
  waterLoggedMl: 0,
  routineConsistencyPct: 0,
  achievements: [],
  observations: [],
  focusAreas: [],
  nextWeekRecommendations: [],
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [];
