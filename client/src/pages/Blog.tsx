import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import UnderConstruction from "@/components/UnderConstruction";
import { ArrowLeft } from "lucide-react";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-8">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </Button>

          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Blog</h1>
            <p className="text-xl text-muted-foreground">
              A space for technical articles and personal experiences
            </p>
          </div>

          <UnderConstruction />
        </div>
      </main>
    </div>
  );
}
