import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobCard, Job } from "@/components/JobCard";
import { JobDetailSidebar } from "@/components/JobDetailSidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Briefcase, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hideLowScores, setHideLowScores] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch jobs
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Job[];
    },
  });

  // Mark as applied mutation
  const markAppliedMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("jobs")
        .update({ status: "applied" })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({
        title: "Success",
        description: "Job marked as applied",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({
        title: "Deleted",
        description: "Job removed from your list",
      });
    },
  });

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsSidebarOpen(true);
  };

  const filteredJobs = jobs?.filter((job) => 
    hideLowScores ? job.score >= 50 : true
  ) || [];

  // Real-time subscription for new jobs
  useEffect(() => {
    const channel = supabase
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'jobs'
        },
        (payload) => {
          console.log('New job received:', payload);
          queryClient.invalidateQueries({ queryKey: ["jobs"] });
          toast({
            title: "New Job Added",
            description: `${payload.new.title} at ${payload.new.company}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  const checkConnection = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    console.log("=== Supabase Connection Info ===");
    console.log("Project URL:", supabaseUrl);
    console.log("Anon Key:", supabaseKey);
    console.log("================================");
    
    toast({
      title: "Connection Info Logged",
      description: "Check the browser console for Supabase credentials",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-glass-border sticky top-0 z-30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold neon-text-green">Job Command Center</h1>
                <p className="text-sm text-muted-foreground">Your AI-powered job tracker</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = "/profile"}
              >
                Profile
              </Button>
              
              <div className="flex items-center gap-3">
                <Label htmlFor="hide-low-scores" className="text-sm cursor-pointer">
                  Hide Low Scores
                </Label>
                <Switch
                  id="hide-low-scores"
                  checked={hideLowScores}
                  onCheckedChange={setHideLowScores}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Jobs Yet</h2>
            <p className="text-muted-foreground mb-6">
              {hideLowScores 
                ? "No jobs with scores above 50. Try disabling the filter." 
                : "Your job feed will appear here once your n8n automation adds jobs."}
            </p>
            <Button 
              onClick={checkConnection}
              variant="outline"
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              Check Connection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
            ))}
          </div>
        )}
      </main>

      {/* Job Detail Sidebar */}
      <JobDetailSidebar
        job={selectedJob}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onMarkApplied={(id) => markAppliedMutation.mutate(id)}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </div>
  );
};

export default Dashboard;
