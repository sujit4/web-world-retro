import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Not authenticated, that's okay
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        toast({
          title: "Authentication successful",
          description: "Welcome to the admin area",
        });
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error.message || "Invalid credentials",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main className="w-full max-w-lg mx-auto space-y-12">
        <Button 
          variant="ghost" 
          asChild 
          className="text-xs hover:text-primary pixel-border"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" /> BACK
          </Link>
        </Button>

        <div className="text-center space-y-3">
          <h1 className="text-xl tracking-wider text-foreground/90">ADMIN<span className="retro-blink">_</span></h1>
          <p className="text-xs text-muted-foreground">
            RESTRICTED AREA
          </p>
        </div>

        {isAuthenticated ? (
          <div className="text-center space-y-8 py-8">
            <div className="text-primary text-2xl font-bold tracking-wider retro-text">
              PWNED
            </div>
            <p className="text-xs text-muted-foreground">
              YOU HAVE ACCESSED THE RESTRICTED AREA
            </p>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {Array.from({ length: 9 }).map((_, i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-primary/20 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 max-w-xs mx-auto">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-primary/50 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-primary/50 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-4 pixel-border"
            >
              {isLoading ? "AUTHENTICATING..." : "LOGIN"}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
} 