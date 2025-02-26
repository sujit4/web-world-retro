import { HardHat } from "lucide-react";

export default function UnderConstruction() {
  return (
    <div className="text-center space-y-4 py-8">
      <div className="flex justify-center">
        <HardHat className="w-6 h-6 text-primary retro-blink" />
      </div>
      <p className="text-xs text-muted-foreground">
        WORLD 1-1
      </p>
    </div>
  );
}