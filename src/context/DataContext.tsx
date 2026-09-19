'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { StorageService } from '@/services/storageService';

interface DataContextType {
  // Auth & Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  trackingPrefs: TrackingPreferences;
  updateTrackingPrefs: (prefs: Partial<TrackingPreferences>) => void;
  sleepConfig: SleepScheduleConfig;
  updateSleepConfig: (config: Partial<SleepScheduleConfig>) => void;
  isAuthenticated: boolean;
  login: (email: string) => boolean;
  register: (name: string, email: string) => boolean;
  logout: () => void;

  // Activities
  activities: Activity[];
  addActivity: (act: Omit<Activity, 'id'>) => Activity;
  updateActivity: (id: string, partial: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  completeActivity: (id: string) => void;
  rescheduleActivity: (id: string, newStartTime: string, newEndTime: string) => void;
  skipActivity: (id: string) => void;

  // Routine
  routineItems: RoutineItem[];
  addRoutineItem: (item: Omit<RoutineItem, 'id'>) => RoutineItem;
  updateRoutineItem: (id: string, partial: Partial<RoutineItem>) => void;
  deleteRoutineItem: (id: string) => void;

  // Studies
  subjects: Subject[];
  addSubject: (sub: Omit<Subject, 'id'>) => Subject;
  studySessions: StudySession[];
  addStudySession: (session: Omit<StudySession, 'id'>) => StudySession;

  // Workout
  workoutSessions: WorkoutSession[];
  addWorkoutSession: (session: Omit<WorkoutSession, 'id'>) => WorkoutSession;

  // Meals
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => Meal;
  deleteMeal: (id: string) => void;

  // Water
  waterLogs: WaterLog[];
  waterTarget: number;
  addWaterLog: (amountMl: number) => void;
  setWaterTarget: (target: number) => void;
  totalWaterToday: number;

  // Sleep
  sleepRecords: SleepRecord[];
  addSleepRecord: (record: Omit<SleepRecord, 'id'>) => SleepRecord;

  // Habits
  habits: Habit[];
  toggleHabitToday: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'createdAt'>) => Habit;

  // Goals
  goals: Goal[];
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => Goal;

  // Daily Review
  dailyReviews: DailyReview[];
  saveDailyReview: (review: Omit<DailyReview, 'id'>) => DailyReview;

  // Weekly Review
  weeklyReview: WeeklyReview;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => JournalEntry;

  // Reset
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // States
  const [userProfile, setUserProfile] = useState<UserProfile>(StorageService.getUserProfile());
  const [trackingPrefs, setTrackingPrefs] = useState<TrackingPreferences>(StorageService.getTrackingPreferences());
  const [sleepConfig, setSleepConfig] = useState<SleepScheduleConfig>(StorageService.getSleepConfig());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [waterTarget, setWaterTargetState] = useState<number>(2500);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyReviews, setDailyReviews] = useState<DailyReview[]>([]);
  const [weeklyReview, setWeeklyReview] = useState<WeeklyReview>(StorageService.getWeeklyReview());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setMounted(true);
    setUserProfile(StorageService.getUserProfile());
    setTrackingPrefs(StorageService.getTrackingPreferences());
    setSleepConfig(StorageService.getSleepConfig());
    setIsAuthenticated(StorageService.getAuthSession().isAuthenticated);
    setActivities(StorageService.getActivities());
    setRoutineItems(StorageService.getRoutineItems());
    setSubjects(StorageService.getSubjects());
    setStudySessions(StorageService.getStudySessions());
    setWorkoutSessions(StorageService.getWorkoutSessions());
    setMeals(StorageService.getMeals());
    setWaterLogs(StorageService.getWaterLogs());
    setWaterTargetState(StorageService.getWaterTarget());
    setSleepRecords(StorageService.getSleepRecords());
    setHabits(StorageService.getHabits());
    setGoals(StorageService.getGoals());
    setDailyReviews(StorageService.getDailyReviews());
    setWeeklyReview(StorageService.getWeeklyReview());
    setNotifications(StorageService.getNotifications());
    setJournalEntries(StorageService.getJournalEntries());
  }, []);

  // Sync helpers
  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const next = { ...prev, ...patch };
      StorageService.saveUserProfile(next);
      return next;
    });
  };

  const updateTrackingPrefs = (patch: Partial<TrackingPreferences>) => {
    setTrackingPrefs(prev => {
      const next = { ...prev, ...patch };
      StorageService.saveTrackingPreferences(next);
      return next;
    });
  };

  const updateSleepConfig = (patch: Partial<SleepScheduleConfig>) => {
    setSleepConfig(prev => {
      const next = { ...prev, ...patch };
      StorageService.saveSleepConfig(next);
      return next;
    });
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    StorageService.saveAuthSession({ isAuthenticated: true, user: userProfile });
    return true;
  };

  const register = (name: string, email: string) => {
    const updated = { ...userProfile, name, email };
    setUserProfile(updated);
    setIsAuthenticated(true);
    StorageService.saveUserProfile(updated);
    StorageService.saveAuthSession({ isAuthenticated: true, user: updated });
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    StorageService.saveAuthSession({ isAuthenticated: false, user: null });
  };

  // Activity Actions
  const addActivity = (act: Omit<Activity, 'id'>): Activity => {
    const newAct: Activity = { ...act, id: `act_${Date.now()}` };
    setActivities(prev => {
      const next = [newAct, ...prev].sort((a, b) => a.startTime.localeCompare(b.startTime));
      StorageService.saveActivities(next);
      return next;
    });
    return newAct;
  };

  const updateActivity = (id: string, partial: Partial<Activity>) => {
    setActivities(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, ...partial } : a));
      StorageService.saveActivities(next);
      return next;
    });
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => {
      const next = prev.filter(a => a.id !== id);
      StorageService.saveActivities(next);
      return next;
    });
  };

  const completeActivity = (id: string) => {
    setActivities(prev => {
      const next = prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: (a.status === 'completed' ? 'pending' : 'completed') as Activity['status'],
              completedAt: a.status === 'completed' ? undefined : new Date().toISOString(),
            }
          : a
      );
      StorageService.saveActivities(next);
      return next;
    });
  };

  const rescheduleActivity = (id: string, newStartTime: string, newEndTime: string) => {
    setActivities(prev => {
      const next = prev
        .map(a => (a.id === id ? { ...a, startTime: newStartTime, endTime: newEndTime, status: 'rescheduled' as const } : a))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      StorageService.saveActivities(next);
      return next;
    });
  };

  const skipActivity = (id: string) => {
    setActivities(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, status: 'skipped' as const } : a));
      StorageService.saveActivities(next);
      return next;
    });
  };

  // Routine Actions
  const addRoutineItem = (item: Omit<RoutineItem, 'id'>): RoutineItem => {
    const newItem: RoutineItem = { ...item, id: `rt_${Date.now()}` };
    setRoutineItems(prev => {
      const next = [...prev, newItem].sort((a, b) => a.startTime.localeCompare(b.startTime));
      StorageService.saveRoutineItems(next);
      return next;
    });
    return newItem;
  };

  const updateRoutineItem = (id: string, partial: Partial<RoutineItem>) => {
    setRoutineItems(prev => {
      const next = prev.map(r => (r.id === id ? { ...r, ...partial } : r));
      StorageService.saveRoutineItems(next);
      return next;
    });
  };

  const deleteRoutineItem = (id: string) => {
    setRoutineItems(prev => {
      const next = prev.filter(r => r.id !== id);
      StorageService.saveRoutineItems(next);
      return next;
    });
  };

  // Subjects & Study
  const addSubject = (sub: Omit<Subject, 'id'>): Subject => {
    const newSub: Subject = { ...sub, id: `sb_${Date.now()}` };
    setSubjects(prev => {
      const next = [...prev, newSub];
      StorageService.saveSubjects(next);
      return next;
    });
    return newSub;
  };

  const addStudySession = (session: Omit<StudySession, 'id'>): StudySession => {
    const newSession: StudySession = { ...session, id: `ss_${Date.now()}` };
    setStudySessions(prev => {
      const next = [newSession, ...prev];
      StorageService.saveStudySessions(next);
      return next;
    });
    return newSession;
  };

  // Workout
  const addWorkoutSession = (session: Omit<WorkoutSession, 'id'>): WorkoutSession => {
    const newSession: WorkoutSession = { ...session, id: `wo_${Date.now()}` };
    setWorkoutSessions(prev => {
      const next = [newSession, ...prev];
      StorageService.saveWorkoutSessions(next);
      return next;
    });
    return newSession;
  };

  // Meals
  const addMeal = (meal: Omit<Meal, 'id'>): Meal => {
    const newMeal: Meal = { ...meal, id: `ml_${Date.now()}` };
    setMeals(prev => {
      const next = [newMeal, ...prev];
      StorageService.saveMeals(next);
      return next;
    });
    return newMeal;
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => {
      const next = prev.filter(m => m.id !== id);
      StorageService.saveMeals(next);
      return next;
    });
  };

  // Water
  const addWaterLog = (amountMl: number) => {
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().slice(0, 5);
    const newLog: WaterLog = { id: `wl_${Date.now()}`, date: today, amountMl, time };
    setWaterLogs(prev => {
      const next = [...prev, newLog];
      StorageService.saveWaterLogs(next);
      return next;
    });
  };

  const setWaterTarget = (target: number) => {
    setWaterTargetState(target);
    StorageService.saveWaterTarget(target);
  };

  const today = new Date().toISOString().split('T')[0];
  const totalWaterToday = waterLogs
    .filter(l => l.date === today)
    .reduce((acc, curr) => acc + curr.amountMl, 0);

  // Sleep
  const addSleepRecord = (record: Omit<SleepRecord, 'id'>): SleepRecord => {
    const newRecord: SleepRecord = { ...record, id: `sl_${Date.now()}` };
    setSleepRecords(prev => {
      const next = [newRecord, ...prev];
      StorageService.saveSleepRecords(next);
      return next;
    });
    return newRecord;
  };

  // Habits
  const toggleHabitToday = (id: string) => {
    setHabits(prev => {
      const next = prev.map(h => {
        if (h.id !== id) return h;
        const willBeCompleted = !h.completedToday;
        return {
          ...h,
          completedToday: willBeCompleted,
          currentStreak: willBeCompleted ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1),
        };
      });
      StorageService.saveHabits(next);
      return next;
    });
  };

  const addHabit = (h: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'createdAt'>): Habit => {
    const newHabit: Habit = {
      ...h,
      id: `hb_${Date.now()}`,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString().split('T')[0],
      completedToday: false,
    };
    setHabits(prev => {
      const next = [...prev, newHabit];
      StorageService.saveHabits(next);
      return next;
    });
    return newHabit;
  };

  // Goals
  const toggleGoalMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => {
      const next = prev.map(g => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        return { ...g, milestones: updatedMilestones, progress };
      });
      StorageService.saveGoals(next);
      return next;
    });
  };

  const addGoal = (g: Omit<Goal, 'id' | 'progress'>): Goal => {
    const newGoal: Goal = {
      ...g,
      id: `gl_${Date.now()}`,
      progress: 0,
    };
    setGoals(prev => {
      const next = [...prev, newGoal];
      StorageService.saveGoals(next);
      return next;
    });
    return newGoal;
  };

  // Daily Review
  const saveDailyReview = (review: Omit<DailyReview, 'id'>): DailyReview => {
    const newRev: DailyReview = { ...review, id: `dr_${Date.now()}` };
    setDailyReviews(prev => {
      const next = [newRev, ...prev.filter(r => r.date !== review.date)];
      StorageService.saveDailyReviews(next);
      return next;
    });
    return newRev;
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => (n.id === id ? { ...n, read: true } : n));
      StorageService.saveNotifications(next);
      return next;
    });
  };

  const clearAllNotifications = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      StorageService.saveNotifications(next);
      return next;
    });
  };

  // Journal
  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>): JournalEntry => {
    const newEntry: JournalEntry = { ...entry, id: `j_${Date.now()}` };
    setJournalEntries(prev => {
      const next = [newEntry, ...prev];
      StorageService.saveJournalEntries(next);
      return next;
    });
    return newEntry;
  };

  const resetAllData = () => {
    StorageService.resetToSeedData();
    setUserProfile(StorageService.getUserProfile());
    setTrackingPrefs(StorageService.getTrackingPreferences());
    setSleepConfig(StorageService.getSleepConfig());
    setActivities(StorageService.getActivities());
    setRoutineItems(StorageService.getRoutineItems());
    setSubjects(StorageService.getSubjects());
    setStudySessions(StorageService.getStudySessions());
    setWorkoutSessions(StorageService.getWorkoutSessions());
    setMeals(StorageService.getMeals());
    setWaterLogs(StorageService.getWaterLogs());
    setWaterTargetState(StorageService.getWaterTarget());
    setSleepRecords(StorageService.getSleepRecords());
    setHabits(StorageService.getHabits());
    setGoals(StorageService.getGoals());
    setDailyReviews(StorageService.getDailyReviews());
    setWeeklyReview(StorageService.getWeeklyReview());
    setNotifications(StorageService.getNotifications());
    setJournalEntries(StorageService.getJournalEntries());
  };

  return (
    <DataContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        trackingPrefs,
        updateTrackingPrefs,
        sleepConfig,
        updateSleepConfig,
        isAuthenticated,
        login,
        register,
        logout,
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        completeActivity,
        rescheduleActivity,
        skipActivity,
        routineItems,
        addRoutineItem,
        updateRoutineItem,
        deleteRoutineItem,
        subjects,
        addSubject,
        studySessions,
        addStudySession,
        workoutSessions,
        addWorkoutSession,
        meals,
        addMeal,
        deleteMeal,
        waterLogs,
        waterTarget,
        addWaterLog,
        setWaterTarget,
        totalWaterToday,
        sleepRecords,
        addSleepRecord,
        habits,
        toggleHabitToday,
        addHabit,
        goals,
        toggleGoalMilestone,
        addGoal,
        dailyReviews,
        saveDailyReview,
        weeklyReview,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        journalEntries,
        addJournalEntry,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
