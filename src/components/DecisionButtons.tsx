
import { CheckCircle, XCircle, Timer } from 'lucide-react';

type Decision = 'Approved' | 'Rejected' | 'Timed';

interface DecisionButtonsProps {
  selectedDecision: Decision | null;
  onDecisionSelect: (decision: Decision) => void;
}

const DecisionButtons = ({ selectedDecision, onDecisionSelect }: DecisionButtonsProps) => {
  const getDecisionConfig = (decision: Decision) => {
    const configs = {
      Approved: {
        icon: CheckCircle,
        gradient: 'from-emerald-500 to-green-600',
        hoverGradient: 'from-emerald-600 to-green-700',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-300',
        glowColor: 'shadow-emerald-200/50',
        hoverBg: 'hover:bg-emerald-50',
        iconBg: 'bg-emerald-100'
      },
      Rejected: {
        icon: XCircle,
        gradient: 'from-rose-500 to-red-600',
        hoverGradient: 'from-rose-600 to-red-700',
        textColor: 'text-rose-700',
        borderColor: 'border-rose-300',
        glowColor: 'shadow-rose-200/50',
        hoverBg: 'hover:bg-rose-50',
        iconBg: 'bg-rose-100'
      },
      Timed: {
        icon: Timer,
        gradient: 'from-amber-500 to-orange-600',
        hoverGradient: 'from-amber-600 to-orange-700',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-300',
        glowColor: 'shadow-amber-200/50',
        hoverBg: 'hover:bg-amber-50',
        iconBg: 'bg-amber-100'
      }
    };
    return configs[decision];
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {(['Approved', 'Rejected', 'Timed'] as const).map((decision) => {
        const config = getDecisionConfig(decision);
        const Icon = config.icon;
        const isSelected = selectedDecision === decision;
        
        return (
          <button
            key={decision}
            type="button"
            onClick={() => onDecisionSelect(decision)}
            className={`
              relative overflow-hidden group/btn p-3 rounded-2xl border-2 font-semibold 
              transition-all duration-300 ease-out transform
              hover:scale-[1.02] active:scale-[0.98] min-h-[65px] 
              flex flex-col items-center justify-center gap-2
              backdrop-blur-sm
              ${isSelected 
                ? `bg-gradient-to-r ${config.gradient} text-white border-transparent shadow-xl ${config.glowColor} shadow-2xl ring-4 ring-white/20` 
                : `bg-white/80 ${config.borderColor} ${config.textColor} ${config.hoverBg} hover:shadow-lg hover:border-opacity-60 hover:-translate-y-0.5`
              }
            `}
            data-decision={decision.toLowerCase()}
          >
            {/* Icon container */}
            <div className={`
              w-6 h-6 rounded-xl flex items-center justify-center transition-all duration-300
              ${isSelected 
                ? 'bg-white/20 shadow-inner' 
                : `${config.iconBg} group-hover/btn:scale-110`
              }
            `}>
              <Icon className={`w-4 h-4 transition-all duration-300 ${isSelected ? 'text-white' : config.textColor}`} />
            </div>
            
            {/* Label */}
            <span className={`text-xs font-bold tracking-wide transition-all duration-300 ${isSelected ? 'text-white' : config.textColor}`}>
              {decision}
            </span>
            
            {/* Hover overlay */}
            {!isSelected && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            )}
            
            {/* Selected overlay with subtle animation */}
            {isSelected && (
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DecisionButtons;
