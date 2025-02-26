import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import UnderConstruction from "@/components/UnderConstruction";
import { ArrowLeft } from "lucide-react";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <main className="w-full max-w-xl mx-auto space-y-8">
        <Button variant="ghost" asChild className="text-sm">
          <Link href="/" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
        </Button>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-light">Blog</h1>
          <p className="text-sm text-muted-foreground">
            Thoughts on technology and life
          </p>
        </div>

        <UnderConstruction />
      </main>
    </div>
  );
}