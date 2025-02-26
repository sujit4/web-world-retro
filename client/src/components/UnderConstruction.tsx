import { HardHat } from "lucide-react";

export default function UnderConstruction() {
  return (
    <div className="text-center space-y-4 py-8">
      <div className="flex justify-center">
        <HardHat className="w-6 h-6 text-muted-foreground/50 animate-pulse" />
      </div>
      <p className="text-xs text-muted-foreground/70">
        Coming soon
      </p>
    </div>
  );
}