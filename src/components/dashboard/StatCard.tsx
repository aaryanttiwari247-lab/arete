'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/ui/Card';
import { useData } from '@/context/DataContext';
import { BookOpen, Dumbbell, Moon, Droplets, Utensils, CheckSquare } from 'lucide-react';

interface QuickStatItemProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  accentColor: string;
}

const QuickStatItem: React.FC<QuickStatItemProps> = ({
  label,
  value,
  subtext,
  icon,
  accentColor,
}) => {
  return (
    <Card className="hover:border-[var(--border-hover)] transition-all">
      <CardContent className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            {label}
          </span>
          <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {value}
          </h4>
          <p className="text-[11px] text-[var(--text-muted)]">{subtext}</p>
        </div>
        <div
          className="p-2.5 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardQuickStats: React.FC = () => {
  const { studySessions, workoutSessions, sleepRecords, totalWaterToday, waterTarget, meals, activities } = useData();

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayStudyMinutes = studySessions
      .filter(s => s.date === today)
      .reduce((acc, s) => acc + s.durationMinutes, 0);
    const studyHours = Math.floor(todayStudyMinutes / 60);
    const studyMins = todayStudyMinutes % 60;
    const studyFormatted = todayStudyMinutes > 0
      ? (studyHours > 0 ? `${studyHours}h ${studyMins}m` : `${studyMins}m`)
      : '0m';
    const studySubtext = todayStudyMinutes > 0 ? 'Active today' : 'No study logged';

    const todayWorkout = workoutSessions.find(w => w.date === today);
    const workoutFormatted = todayWorkout ? `${todayWorkout.durationMinutes} min` : '0 min';
    const workoutSubtext = todayWorkout ? todayWorkout.title : 'No workout today';

    const latestSleep = sleepRecords[0];
    const sleepFormatted = latestSleep
      ? `${Math.floor(latestSleep.durationMinutes / 60)}h ${latestSleep.durationMinutes % 60}m`
      : '0h 0m';
    const sleepSubtext = latestSleep ? `Quality ${latestSleep.quality}/5` : 'No sleep logged';

    const waterLiters = (totalWaterToday / 1000).toFixed(2);
    const targetLiters = (waterTarget / 1000).toFixed(1);

    const todayMealsCount = meals.filter(m => m.date === today).length;
    const mealSubtext = todayMealsCount > 0 ? `${todayMealsCount} recorded` : 'No meals logged';

    const completedTasks = activities.filter(a => a.status === 'completed').length;
    const totalTasks = activities.length;
    const taskSubtext = totalTasks > 0
      ? (completedTasks === totalTasks ? 'All completed' : `${totalTasks - completedTasks} remaining`)
      : 'No tasks scheduled';

    return {
      studyFormatted,
      studySubtext,
      workoutFormatted,
      workoutSubtext,
      sleepFormatted,
      sleepSubtext,
      waterLiters,
      targetLiters,
      todayMealsCount,
      mealSubtext,
      completedTasks,
      totalTasks,
      taskSubtext,
    };
  }, [studySessions, workoutSessions, sleepRecords, totalWaterToday, waterTarget, meals, activities]);

  const {
    studyFormatted,
    studySubtext,
    workoutFormatted,
    workoutSubtext,
    sleepFormatted,
    sleepSubtext,
    waterLiters,
    targetLiters,
    todayMealsCount,
    mealSubtext,
    completedTasks,
    totalTasks,
    taskSubtext,
  } = stats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      <QuickStatItem
        label="Study Time"
        value={studyFormatted}
        subtext={studySubtext}
        icon={<BookOpen className="w-4 h-4" />}
        accentColor="#38bdf8"
      />

      <QuickStatItem
        label="Workout"
        value={workoutFormatted}
        subtext={workoutSubtext}
        icon={<Dumbbell className="w-4 h-4" />}
        accentColor="#f97316"
      />

      <QuickStatItem
        label="Sleep"
        value={sleepFormatted}
        subtext={sleepSubtext}
        icon={<Moon className="w-4 h-4" />}
        accentColor="#818cf8"
      />

      <QuickStatItem
        label="Water Intake"
        value={`${waterLiters} L`}
        subtext={`Goal: ${targetLiters} L`}
        icon={<Droplets className="w-4 h-4" />}
        accentColor="#06b6d4"
      />

      <QuickStatItem
        label="Meals Logged"
        value={`${todayMealsCount}`}
        subtext={mealSubtext}
        icon={<Utensils className="w-4 h-4" />}
        accentColor="#10b981"
      />

      <QuickStatItem
        label="Tasks Done"
        value={`${completedTasks} / ${totalTasks}`}
        subtext={taskSubtext}
        icon={<CheckSquare className="w-4 h-4" />}
        accentColor="#a855f7"
      />
    </div>
  );
};
