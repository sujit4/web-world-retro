import { Card, CardContent } from "@/components/ui/card";
import { HardHat, Hammer } from "lucide-react";

export default function UnderConstruction() {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="p-12 text-center space-y-6">
        <div className="flex justify-center gap-4">
          <HardHat className="w-12 h-12 text-primary animate-bounce" />
          <Hammer className="w-12 h-12 text-primary animate-bounce delay-100" />
        </div>
        <h2 className="text-2xl font-semibold">Under Construction</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          The blog section is currently being built. Soon it will be filled with
          technical articles, tutorials, and personal experiences. Check back soon!
        </p>
      </CardContent>
    </Card>
  );
}
