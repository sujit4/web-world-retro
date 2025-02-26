import { Button } from "@/components/ui/button";
import { SiGithub, SiX, SiLinkedin, SiMedium } from "react-icons/si";

const socialLinks = [
  {
    name: "GitHub",
    icon: SiGithub,
    url: "https://github.com",
  },
  {
    name: "Twitter",
    icon: SiX,
    url: "https://twitter.com",
  },
  {
    name: "LinkedIn",
    icon: SiLinkedin,
    url: "https://linkedin.com",
  },
  {
    name: "Medium",
    icon: SiMedium,
    url: "https://medium.com",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full"
            title={link.name}
          >
            <link.icon className="w-4 h-4" />
            <span className="sr-only">{link.name}</span>
          </Button>
        </a>
      ))}
    </div>
  );
}