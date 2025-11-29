import { CircularProgress } from "./CircularProgress";
import { Badge } from "./ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export interface Job {
  id: number;
  title: string;
  company: string;
  description: string | null;
  link: string | null;
  score: number;
  reasoning: string | null;
  benefits: string[] | null;
  cover_letter: string | null;
  status: string;
  created_at: string;
}

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "default";
      case "applied":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div
      onClick={onClick}
      className="glass-card glass-card-hover p-6 rounded-2xl cursor-pointer group animate-fade-in"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground mb-1 truncate group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <p className="text-muted-foreground mb-3">{job.company}</p>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getBadgeVariant(job.status)} className="uppercase text-xs">
              {job.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>

        <CircularProgress score={job.score} size={70} strokeWidth={5} />
      </div>

      {job.description && (
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>
      )}
    </div>
  );
};
