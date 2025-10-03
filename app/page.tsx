// page.tsx
"use client";

import { useState, useEffect } from "react";
import HaptickCard from "./haptickcard";
import { Plus, Flame, Calendar, TrendingUp, Moon, Sun } from "lucide-react";
import { theme } from "./theme";

export default function Home() {
  const [hapticks, setHapticks] = useState<Array<{ id: number; name: string; checked: boolean }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [streak, setStreak] = useState(0);
  const [weeklyHistory, setWeeklyHistory] = useState<{ [key: string]: boolean }>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const colors = darkMode ? theme.dark : theme.light;

  useEffect(() => {
    setMounted(true);
    
    const storedHapticks = localStorage.getItem("hapticks");
    if (storedHapticks) {
      setHapticks(JSON.parse(storedHapticks));
    }

    const storedStreak = localStorage.getItem("streak");
    if (storedStreak) {
      setStreak(parseInt(storedStreak));
    }

    const storedHistory = localStorage.getItem("history");
    if (storedHistory) {
      setWeeklyHistory(JSON.parse(storedHistory));
    } else {
      const history: { [key: string]: boolean } = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        history[dateStr] = false;
      }
      setWeeklyHistory(history);
      localStorage.setItem("history", JSON.stringify(history));
    }

    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, mounted]);

  useEffect(() => {
    if (hapticks.length === 0) return;
    
    const allChecked = hapticks.every(h => h.checked);
    const today = new Date().toISOString().split("T")[0];
    
    if (allChecked && !weeklyHistory[today]) {
      setShowConfetti(true);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("streak", newStreak.toString());
      
      const newHistory = { ...weeklyHistory, [today]: true };
      setWeeklyHistory(newHistory);
      localStorage.setItem("history", JSON.stringify(newHistory));
      
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [hapticks]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
  };

  const addHaptick = () => {
    if (inputValue.trim() === "") return;
    const newHaptick = {
      id: Date.now(),
      name: inputValue,
      checked: false,
    };
    const newList = [...hapticks, newHaptick];
    setHapticks(newList);
    setInputValue("");
    localStorage.setItem("hapticks", JSON.stringify(newList));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addHaptick();
    }
  };

  const toggleHaptick = (id: number) => {
    const newList = hapticks.map(h =>
      h.id === id ? { ...h, checked: !h.checked } : h
    );
    setHapticks(newList);
    localStorage.setItem("hapticks", JSON.stringify(newList));
  };

  const removeHaptick = (id: number) => {
    const newList = hapticks.filter(h => h.id !== id);
    setHapticks(newList);
    localStorage.setItem("hapticks", JSON.stringify(newList));
  };

  const completedCount = hapticks.filter(h => h.checked).length;
  const completionPercentage = hapticks.length > 0
    ? Math.round((completedCount / hapticks.length) * 100)
    : 0;

  if (!mounted) {
    return null;
  }

  return (
    <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      {/* Confetti Effect */}
      {showConfetti && (
        <>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-5xl font-bold" style={{ color: colors.textPrimary }}>
              Haptick Tracker
            </h1>
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: colors.border,
                }}
              >
                {darkMode ? (
                  <Sun className="w-6 h-6" style={{ color: colors.accent }} />
                ) : (
                  <Moon className="w-6 h-6" style={{ color: colors.primary }} />
                )}
              </button>
              
              {/* Streak Counter */}
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg pulse-animation"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: colors.border,
                }}
              >
                <Flame className="w-6 h-6" style={{ color: colors.accent }} />
                <span className="text-2xl font-bold" style={{ color: colors.accent }}>
                  {streak}
                </span>
                <span className="text-sm" style={{ color: colors.textSecondary }}>days</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="rounded-2xl p-6 shadow-lg"
            style={{
              backgroundColor: colors.surface,
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                Today's Progress
              </span>
              <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                {completionPercentage}%
              </span>
            </div>
            <div
              className="w-full rounded-full h-4 overflow-hidden"
              style={{ backgroundColor: darkMode ? colors.border : "#F3F4F6" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${completionPercentage}%`,
                  backgroundColor: colors.primary,
                }}
              />
            </div>
            <div className="mt-3 text-sm" style={{ color: colors.textSecondary }}>
              {completedCount} of {hapticks.length} habits completed
            </div>
          </div>
        </header>

        {/* Add Haptick Input */}
        <div className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What habit do you want to build today?"
              className="flex-grow px-6 py-4 rounded-2xl shadow-md focus:outline-none transition-all duration-200"
              style={{
                backgroundColor: colors.surface,
                color: colors.textPrimary,
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: colors.border,
              }}
              onFocus={(e) => e.target.style.borderColor = colors.borderHover}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
            <button
              onClick={addHaptick}
              className="px-8 py-4 font-semibold rounded-2xl hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 flex items-center gap-2"
              style={{
                backgroundColor: colors.primary,
                color: "#FFFFFF",
              }}
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        {/* Hapticks List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <TrendingUp className="w-6 h-6" style={{ color: colors.primary }} />
            Today's Habits
          </h2>
          <div className="space-y-3">
            {hapticks.length === 0 ? (
              <div className="text-center py-12" style={{ color: colors.textMuted }}>
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No habits yet. Add your first one above!</p>
              </div>
            ) : (
              hapticks.map((haptick, index) => (
                <HaptickCard
                  key={haptick.id}
                  name={haptick.name}
                  itemIndex={index}
                  isChecked={haptick.checked}
                  onToggle={() => toggleHaptick(haptick.id)}
                  onRemove={() => removeHaptick(haptick.id)}
                  colors={colors}
                />
              ))
            )}
          </div>
        </div>

        {/* Weekly History */}
        <div
          className="rounded-2xl p-6 shadow-lg"
          style={{
            backgroundColor: colors.surface,
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: colors.border,
          }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.textPrimary }}>
            <Calendar className="w-6 h-6" style={{ color: colors.primary }} />
            Weekly History
          </h2>
          <div className="grid grid-cols-7 gap-3">
            {Object.entries(weeklyHistory).map(([dateStr, completed]) => {
              const date = new Date(dateStr);
              const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
              const dayNum = date.getDate();

              return (
                <div
                  key={dateStr}
                  className="text-center p-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundColor: completed ? colors.secondary : (darkMode ? "#2D2D2D" : "#F9F9F9"),
                    color: completed ? "#FFFFFF" : colors.textMuted,
                  }}
                >
                  <div className="text-xs font-medium mb-1">{dayName}</div>
                  <div className="text-2xl font-bold">{dayNum}</div>
                  {completed && (
                    <div className="flex justify-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}