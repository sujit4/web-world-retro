import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import SocialLinks from "@/components/SocialLinks";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome to My Space
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Developer, writer, and technology enthusiast sharing thoughts and experiences through code and words.
            </p>
          </section>

          {/* Social Links */}
          <Card className="border-2">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Connect With Me</h2>
              <ScrollArea className="h-full">
                <SocialLinks />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Blog Preview */}
          <section className="text-center space-y-6">
            <h2 className="text-2xl font-semibold">Latest from the Blog</h2>
            <p className="text-muted-foreground">
              My blog is currently under construction. Soon it will be filled with technical articles and personal experiences.
            </p>
            <Button asChild>
              <Link href="/blog" className="inline-flex items-center gap-2">
                Visit Blog <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}
