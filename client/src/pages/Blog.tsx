import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import UnderConstruction from "@/components/UnderConstruction";
import { ArrowLeft } from "lucide-react";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main className="w-full max-w-lg mx-auto space-y-12">
        <Button variant="ghost" asChild className="text-xs hover:text-primary transition-all duration-300">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
        </Button>

        <div className="text-center space-y-3">
          <h1 className="text-2xl font-light tracking-wider text-foreground/90">Blog</h1>
          <p className="text-sm text-muted-foreground font-light">
            Thoughts
          </p>
        </div>

        <UnderConstruction />
      </main>
    </div>
  );
}