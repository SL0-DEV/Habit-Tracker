// page.tsx
"use client";

import { useState, useEffect } from "react";
import HaptickCard from "./haptickcard";
import { Plus, Flame, Calendar, TrendingUp, Moon, Sun } from "lucide-react";

export default function Home() {
  const [hapticks, setHapticks] = useState<Array<{ id: number; name: string; checked: boolean }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [streak, setStreak] = useState(0);
  const [weeklyHistory, setWeeklyHistory] = useState<{ [key: string]: boolean }>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize data from localStorage
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
      // Initialize weekly history
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

  // Apply dark mode class to document
  useEffect(() => {
    if (!mounted) return;
    
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, mounted]);

  // Check if all hapticks are completed
  useEffect(() => {
    if (hapticks.length === 0) return;
    
    const allChecked = hapticks.every(h => h.checked);
    const today = new Date().toISOString().split("T")[0];
    
    if (allChecked && !weeklyHistory[today]) {
      setShowConfetti(true);
      
      // Update streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("streak", newStreak.toString());
      
      // Update history
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          animation: confetti 3s linear forwards;
          z-index: 9999;
        }
      `}</style>

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
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Haptick Tracker
            </h1>
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-yellow-500" />
                ) : (
                  <Moon className="w-6 h-6 text-indigo-600" />
                )}
              </button>
              
              {/* Streak Counter */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-xl shadow-lg pulse-animation border border-gray-200 dark:border-gray-700">
                <Flame className="w-6 h-6 text-orange-500" />
                <span className="text-2xl font-bold text-orange-500">
                  {streak}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">days</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Today's Progress
              </span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
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
              className="flex-grow px-6 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200 shadow-md"
            />
            <button
              onClick={addHaptick}
              className="px-8 py-4 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        {/* Hapticks List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Today's Habits
          </h2>
          <div className="space-y-3">
            {hapticks.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-600">
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
                />
              ))
            )}
          </div>
        </div>

        {/* Weekly History */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
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
                  className={`text-center p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    completed
                      ? "bg-green-500 dark:bg-green-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                  }`}
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