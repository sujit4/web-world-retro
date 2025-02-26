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
    <div className="flex justify-center gap-6">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link text-muted-foreground hover:text-primary p-2"
        >
          <link.icon className="w-5 h-5" />
          <span className="sr-only">{link.name}</span>
        </a>
      ))}
    </div>
  );
}