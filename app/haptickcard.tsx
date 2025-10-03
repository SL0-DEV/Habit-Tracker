// HaptickCard.tsx
import { Check, Trash2 } from "lucide-react";

interface HaptickCardProps {
  name: string;
  itemIndex: number;
  isChecked: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

export default function HaptickCard({
  name,
  itemIndex,
  isChecked,
  onToggle,
  onRemove,
}: HaptickCardProps) {
  return (
    <div
      className="group relative bg-gradient-to-r from-white/90 to-violet-50/90 dark:from-slate-800/90 dark:to-purple-900/30 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 dark:border-slate-700/50"
      style={{
        animation: `slideIn 0.4s ease-out ${itemIndex * 0.1}s both`,
      }}
    >
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
      `}</style>
      
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
            isChecked
              ? "bg-gradient-to-br from-emerald-400 to-teal-600 dark:from-emerald-500 dark:to-teal-700 border-emerald-500 dark:border-emerald-400 scale-110 shadow-lg"
              : "border-violet-300 dark:border-slate-600 hover:border-fuchsia-400 dark:hover:border-fuchsia-500 hover:scale-105 bg-white/50 dark:bg-slate-700/50"
          }`}
        >
          {isChecked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </button>

        <span
          className={`flex-grow text-lg font-medium transition-all duration-300 ${
            isChecked
              ? "line-through text-gray-400 dark:text-gray-600"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {name}
        </span>

        <button
          onClick={onRemove}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white transition-all duration-200 transform hover:scale-110 shadow-md"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}