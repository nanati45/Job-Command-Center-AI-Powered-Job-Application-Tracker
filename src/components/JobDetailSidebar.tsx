import { Job } from "./JobCard";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X, ExternalLink, Copy, Check } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface JobDetailSidebarProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkApplied: (id: number) => void;
  onDelete: (id: number) => void;
}

export const JobDetailSidebar = ({
  job,
  isOpen,
  onClose,
  onMarkApplied,
  onDelete,
}: JobDetailSidebarProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (job?.cover_letter) {
      navigator.clipboard.writeText(job.cover_letter);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Cover letter copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!job) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] glass-card border-l border-glass-border z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
              <p className="text-lg text-muted-foreground">{job.company}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Score & Link */}
          <div className="flex items-center gap-4">
            <CircularProgress score={job.score} size={100} strokeWidth={8} />
            {job.link && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(job.link!, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                View Job Posting
              </Button>
            )}
          </div>

          {/* The Verdict */}
          <div className="glass-card p-5 rounded-xl border-l-4 border-primary">
            <h3 className="text-lg font-bold mb-3 neon-text-green">The Verdict</h3>
            <p className="text-foreground leading-relaxed">
              {job.reasoning || "No AI reasoning provided."}
            </p>
          </div>

          {/* The Data */}
          <div className="glass-card p-5 rounded-xl">
            <h3 className="text-lg font-bold mb-3">The Data</h3>
            
            {job.benefits && job.benefits.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Benefits:</p>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {job.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description:</p>
                <p className="text-sm leading-relaxed">{job.description}</p>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          {job.cover_letter && (
            <div className="glass-card p-5 rounded-xl border-l-4 border-accent">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">The Cover Letter</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                {job.cover_letter}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={() => {
                onMarkApplied(job.id);
                onClose();
              }}
              className="flex-1"
              disabled={job.status === "applied"}
            >
              Mark as Applied
            </Button>
            <Button
              onClick={() => {
                onDelete(job.id);
                onClose();
              }}
              variant="destructive"
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
