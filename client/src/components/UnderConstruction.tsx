import { Card } from "@/components/ui/card";
import { HardHat } from "lucide-react";

export default function UnderConstruction() {
  return (
    <Card className="p-8 text-center space-y-4 bg-background/50 shadow-sm">
      <div className="flex justify-center">
        <HardHat className="w-8 h-8 text-muted-foreground animate-pulse" />
      </div>
      <p className="text-sm text-muted-foreground">
        Coming soon
      </p>
    </Card>
  );
}