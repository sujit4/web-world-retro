import { useEffect, useState } from "react";
import { Shield, Lock, Binary } from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);

  const icons = [
    { Icon: Shield, label: "INITIALIZING SECURITY..." },
    { Icon: Lock, label: "ENCRYPTING DATA..." },
    { Icon: Binary, label: "SCANNING SYSTEM..." }
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % icons.length);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(iconInterval);
    };
  }, []);

  const CurrentIcon = icons[currentIcon].Icon;

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-8 p-4">
        <div className="pixel-border p-8 relative">
          <div className="absolute inset-0 bg-primary/10 animate-pulse" />
          <div className="relative">
            <CurrentIcon className="w-12 h-12 mx-auto text-primary retro-blink" />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-primary">{icons[currentIcon].label}</p>

          <div className="w-48 h-4 bg-muted relative overflow-hidden pixel-border">
            <div 
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-300 ease-steps"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}