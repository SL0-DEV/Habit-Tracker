// HaptickCard.tsx
import { Check, Trash2 } from "lucide-react";

interface HaptickCardProps {
  name: string;
  itemIndex: number;
  isChecked: boolean;
  onToggle: () => void;
  onRemove: () => void;
  colors: any;
}

export default function HaptickCard({
  name,
  itemIndex,
  isChecked,
  onToggle,
  onRemove,
  colors,
}: HaptickCardProps) {
  return (
    <div
      className="group relative rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      style={{
        backgroundColor: colors.surface,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: colors.border,
        animation: `slideIn 0.4s ease-out ${itemIndex * 0.1}s both`,
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="flex-shrink-0 w-7 h-7 rounded-lg transition-all duration-300 flex items-center justify-center"
          style={{
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: isChecked ? colors.secondary : colors.border,
            backgroundColor: isChecked ? colors.secondary : colors.background,
            transform: isChecked ? "scale(1.1)" : "scale(1)",
          }}
        >
          {isChecked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </button>

        <span
          className="flex-grow text-lg font-medium transition-all duration-300"
          style={{
            color: isChecked ? colors.textMuted : colors.textPrimary,
            textDecoration: isChecked ? "line-through" : "none",
          }}
        >
          {name}
        </span>

        <button
          onClick={onRemove}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-2 rounded-lg text-white transition-all duration-200 transform hover:scale-110 shadow-md"
          style={{
            backgroundColor: "#FF6B6B",
          }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}