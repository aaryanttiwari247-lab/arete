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

import {
  INITIAL_USER_PROFILE,
  INITIAL_TRACKING_PREFERENCES,
  INITIAL_SLEEP_CONFIG,
  INITIAL_ACTIVITIES,
  INITIAL_ROUTINE_ITEMS,
  INITIAL_SUBJECTS,
  INITIAL_STUDY_SESSIONS,
  INITIAL_WORKOUT_SESSIONS,
  INITIAL_MEALS,
  INITIAL_WATER_LOGS,
  INITIAL_SLEEP_RECORDS,
  INITIAL_HABITS,
  INITIAL_GOALS,
  INITIAL_DAILY_REVIEWS,
  INITIAL_WEEKLY_REVIEW,
  INITIAL_NOTIFICATIONS,
  INITIAL_JOURNAL_ENTRIES,
} from './mockData';

const KEYS = {
  USER_PROFILE: 'daytrack_user_profile',
  TRACKING_PREFERENCES: 'daytrack_tracking_preferences',
  SLEEP_CONFIG: 'daytrack_sleep_config',
  ACTIVITIES: 'daytrack_activities',
  ROUTINE_ITEMS: 'daytrack_routine_items',
  SUBJECTS: 'daytrack_subjects',
  STUDY_SESSIONS: 'daytrack_study_sessions',
  WORKOUT_SESSIONS: 'daytrack_workout_sessions',
  MEALS: 'daytrack_meals',
  WATER_LOGS: 'daytrack_water_logs',
  SLEEP_RECORDS: 'daytrack_sleep_records',
  HABITS: 'daytrack_habits',
  GOALS: 'daytrack_goals',
  DAILY_REVIEWS: 'daytrack_daily_reviews',
  WEEKLY_REVIEW: 'daytrack_weekly_review',
  NOTIFICATIONS: 'daytrack_notifications',
  JOURNAL: 'daytrack_journal',
  AUTH_USER: 'daytrack_auth_session',
  WATER_TARGET: 'daytrack_water_target',
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota or private mode error
  }
}

export const StorageService = {
  getUserProfile: () => getItem<UserProfile>(KEYS.USER_PROFILE, INITIAL_USER_PROFILE),
  saveUserProfile: (data: UserProfile) => setItem(KEYS.USER_PROFILE, data),

  getTrackingPreferences: () => getItem<TrackingPreferences>(KEYS.TRACKING_PREFERENCES, INITIAL_TRACKING_PREFERENCES),
  saveTrackingPreferences: (data: TrackingPreferences) => setItem(KEYS.TRACKING_PREFERENCES, data),

  getSleepConfig: () => getItem<SleepScheduleConfig>(KEYS.SLEEP_CONFIG, INITIAL_SLEEP_CONFIG),
  saveSleepConfig: (data: SleepScheduleConfig) => setItem(KEYS.SLEEP_CONFIG, data),

  getActivities: () => getItem<Activity[]>(KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  saveActivities: (data: Activity[]) => setItem(KEYS.ACTIVITIES, data),

  getRoutineItems: () => getItem<RoutineItem[]>(KEYS.ROUTINE_ITEMS, INITIAL_ROUTINE_ITEMS),
  saveRoutineItems: (data: RoutineItem[]) => setItem(KEYS.ROUTINE_ITEMS, data),

  getSubjects: () => getItem<Subject[]>(KEYS.SUBJECTS, INITIAL_SUBJECTS),
  saveSubjects: (data: Subject[]) => setItem(KEYS.SUBJECTS, data),

  getStudySessions: () => getItem<StudySession[]>(KEYS.STUDY_SESSIONS, INITIAL_STUDY_SESSIONS),
  saveStudySessions: (data: StudySession[]) => setItem(KEYS.STUDY_SESSIONS, data),

  getWorkoutSessions: () => getItem<WorkoutSession[]>(KEYS.WORKOUT_SESSIONS, INITIAL_WORKOUT_SESSIONS),
  saveWorkoutSessions: (data: WorkoutSession[]) => setItem(KEYS.WORKOUT_SESSIONS, data),

  getMeals: () => getItem<Meal[]>(KEYS.MEALS, INITIAL_MEALS),
  saveMeals: (data: Meal[]) => setItem(KEYS.MEALS, data),

  getWaterLogs: () => getItem<WaterLog[]>(KEYS.WATER_LOGS, INITIAL_WATER_LOGS),
  saveWaterLogs: (data: WaterLog[]) => setItem(KEYS.WATER_LOGS, data),

  getWaterTarget: () => getItem<number>(KEYS.WATER_TARGET, 2500),
  saveWaterTarget: (target: number) => setItem(KEYS.WATER_TARGET, target),

  getSleepRecords: () => getItem<SleepRecord[]>(KEYS.SLEEP_RECORDS, INITIAL_SLEEP_RECORDS),
  saveSleepRecords: (data: SleepRecord[]) => setItem(KEYS.SLEEP_RECORDS, data),

  getHabits: () => getItem<Habit[]>(KEYS.HABITS, INITIAL_HABITS),
  saveHabits: (data: Habit[]) => setItem(KEYS.HABITS, data),

  getGoals: () => getItem<Goal[]>(KEYS.GOALS, INITIAL_GOALS),
  saveGoals: (data: Goal[]) => setItem(KEYS.GOALS, data),

  getDailyReviews: () => getItem<DailyReview[]>(KEYS.DAILY_REVIEWS, INITIAL_DAILY_REVIEWS),
  saveDailyReviews: (data: DailyReview[]) => setItem(KEYS.DAILY_REVIEWS, data),

  getWeeklyReview: () => getItem<WeeklyReview>(KEYS.WEEKLY_REVIEW, INITIAL_WEEKLY_REVIEW),
  saveWeeklyReview: (data: WeeklyReview) => setItem(KEYS.WEEKLY_REVIEW, data),

  getNotifications: () => getItem<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (data: NotificationItem[]) => setItem(KEYS.NOTIFICATIONS, data),

  getJournalEntries: () => getItem<JournalEntry[]>(KEYS.JOURNAL, INITIAL_JOURNAL_ENTRIES),
  saveJournalEntries: (data: JournalEntry[]) => setItem(KEYS.JOURNAL, data),

  getAuthSession: () => getItem<{ isAuthenticated: boolean; user: UserProfile | null }>(KEYS.AUTH_USER, {
    isAuthenticated: true, // Default to demo session for instant testing
    user: INITIAL_USER_PROFILE,
  }),
  saveAuthSession: (session: { isAuthenticated: boolean; user: UserProfile | null }) => setItem(KEYS.AUTH_USER, session),

  resetToSeedData: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.USER_PROFILE);
    localStorage.removeItem(KEYS.TRACKING_PREFERENCES);
    localStorage.removeItem(KEYS.SLEEP_CONFIG);
    localStorage.removeItem(KEYS.ACTIVITIES);
    localStorage.removeItem(KEYS.ROUTINE_ITEMS);
    localStorage.removeItem(KEYS.SUBJECTS);
    localStorage.removeItem(KEYS.STUDY_SESSIONS);
    localStorage.removeItem(KEYS.WORKOUT_SESSIONS);
    localStorage.removeItem(KEYS.MEALS);
    localStorage.removeItem(KEYS.WATER_LOGS);
    localStorage.removeItem(KEYS.WATER_TARGET);
    localStorage.removeItem(KEYS.SLEEP_RECORDS);
    localStorage.removeItem(KEYS.HABITS);
    localStorage.removeItem(KEYS.GOALS);
    localStorage.removeItem(KEYS.DAILY_REVIEWS);
    localStorage.removeItem(KEYS.WEEKLY_REVIEW);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    localStorage.removeItem(KEYS.JOURNAL);
  },
};
