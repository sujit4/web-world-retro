import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SocialLinks from "@/components/SocialLinks";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main className="w-full max-w-lg mx-auto space-y-12">
        {/* Minimal Introduction */}
        <section className="text-center space-y-3">
          <h1 className="text-2xl font-light tracking-wider text-foreground/90">
            <span className="text-primary">Your Name</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Developer
          </p>
        </section>

        {/* Social Links */}
        <div className="py-4">
          <SocialLinks />
        </div>

        {/* Minimal Blog Link */}
        <div className="text-center">
          <Button variant="ghost" asChild className="text-xs hover:text-primary">
            <Link href="/blog" className="inline-flex items-center gap-2">
              Blog <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}