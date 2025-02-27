import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import UnderConstruction from "@/components/UnderConstruction";
import { ArrowLeft } from "lucide-react";

export default function Blog() {
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
          <h1 className="text-xl tracking-wider text-foreground/90">BLOG<span className="retro-blink">_</span></h1>
          <p className="text-xs text-muted-foreground">
            LOADING...
          </p>
        </div>

        <UnderConstruction />
      </main>
    </div>
  );
}