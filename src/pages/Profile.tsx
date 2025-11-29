import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [resumeContext, setResumeContext] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("resumeContext");
    if (saved) {
      setResumeContext(saved);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("resumeContext", resumeContext);
    toast({
      title: "Saved!",
      description: "Your resume context has been saved",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-glass-border sticky top-0 z-30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Profile & Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your resume context</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="glass-card p-8 rounded-2xl">
          <div className="space-y-4">
            <div>
              <Label htmlFor="resume-context" className="text-lg font-semibold mb-2 block">
                My Resume Context
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Paste your resume details, skills, experience, or any context that will help
                the AI generate better cover letters and match scores.
              </p>
            </div>

            <Textarea
              id="resume-context"
              value={resumeContext}
              onChange={(e) => setResumeContext(e.target.value)}
              placeholder="Example: I'm a Senior Software Engineer with 5 years of experience in React, TypeScript, and Node.js. I specialize in building scalable web applications and have led multiple teams..."
              className="min-h-[400px] resize-none glass-card"
            />

            <div className="flex justify-end">
              <Button onClick={handleSave} size="lg" className="px-8">
                Save Context
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
