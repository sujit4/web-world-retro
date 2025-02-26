import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SocialLinks from "@/components/SocialLinks";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main className="w-full max-w-xl mx-auto space-y-8">
        {/* Simple Introduction */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl font-light tracking-wide">
            Hello, I'm <span className="font-normal text-primary">Your Name</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Developer & Writer
          </p>
        </section>

        {/* Minimal Social Links */}
        <Card className="p-6 bg-background/50 shadow-sm">
          <SocialLinks />
        </Card>

        {/* Subtle Blog Link */}
        <div className="text-center">
          <Button variant="ghost" asChild className="text-sm">
            <Link href="/blog" className="inline-flex items-center gap-2">
              Read my blog <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}