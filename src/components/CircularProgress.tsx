import { cn } from "@/lib/utils";

interface CircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const CircularProgress = ({ 
  score, 
  size = 80, 
  strokeWidth = 6,
  className 
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return "stroke-neon-green";
    if (score >= 50) return "stroke-neon-amber";
    return "stroke-neon-red";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 70) return "neon-text-green";
    if (score >= 50) return "neon-text-amber";
    return "neon-text-red";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(getScoreColor(score), "transition-all duration-500")}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${
              score >= 70 ? 'hsl(151 100% 50% / 0.5)' : 
              score >= 50 ? 'hsl(45 100% 50% / 0.5)' : 
              'hsl(0 100% 65% / 0.5)'
            })`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-2xl font-bold", getScoreTextColor(score))}>
          {score}
        </span>
      </div>
    </div>
  );
};
