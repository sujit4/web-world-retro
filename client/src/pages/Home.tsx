import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SocialLinks from "@/components/SocialLinks";
import { ArrowRight, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main className="w-full max-w-lg mx-auto space-y-12">
        {/* Minimal Introduction */}
        <section className="text-center space-y-6">
          <h1 className="text-xl tracking-wider text-foreground/90">
            <span className="text-primary">SUJIT KONAPUR</span>
            <span className="retro-blink">_</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Security musings from the trenches.
          </p>
        </section>

        {/* Social Links */}
        <div className="py-4">
          <SocialLinks />
        </div>

        {/* Minimal Blog Link */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            asChild 
            className="text-xs hover:text-primary pixel-border"
          >
            <Link href="/blog" className="inline-flex items-center gap-2">
              BLOG <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
        
        {/* Admin Link - Very subtle */}
        <div className="text-center mt-16">
          <Link href="/admin" className="text-[10px] text-muted-foreground/30 hover:text-primary/50 inline-flex items-center gap-1">
            <Lock className="w-2 h-2" />
            ADMIN
          </Link>
        </div>
      </main>
    </div>
  );
}