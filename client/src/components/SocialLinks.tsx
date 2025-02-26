import { Button } from "@/components/ui/button";
import { SiGithub, SiX, SiLinkedin, SiMedium } from "react-icons/si";

const socialLinks = [
  {
    name: "GitHub",
    icon: SiGithub,
    url: "https://github.com",
    description: "Check out my open source projects and contributions",
  },
  {
    name: "Twitter",
    icon: SiX,
    url: "https://twitter.com",
    description: "Follow me for tech insights and updates",
  },
  {
    name: "LinkedIn",
    icon: SiLinkedin,
    url: "https://linkedin.com",
    description: "Connect with me professionally",
  },
  {
    name: "Medium",
    icon: SiMedium,
    url: "https://medium.com",
    description: "Read my published articles",
  },
];

export default function SocialLinks() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
          <Button
            variant="outline"
            className="w-full h-auto p-4 space-y-2 hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <link.icon className="w-5 h-5" />
              <span className="font-semibold">{link.name}</span>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              {link.description}
            </p>
          </Button>
        </a>
      ))}
    </div>
  );
}