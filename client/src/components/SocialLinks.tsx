import { Button } from "@/components/ui/button";
import { SiGithub, SiX, SiLinkedin } from "react-icons/si";

const socialLinks = [
  {
    name: "GitHub",
    icon: SiGithub,
    url: "https://github.com/sujitkonapur",
  },
  {
    name: "Twitter",
    icon: SiX,
    url: "https://twitter.com/sujitkonapur",
  },
  {
    name: "LinkedIn",
    icon: SiLinkedin,
    url: "https://linkedin.com/in/sujitkonapur",
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
          onClick={() => {
            const audio = new Audio('/sounds/select.wav');
            audio.play();
          }}
        >
          <link.icon className="w-5 h-5" />
          <span className="sr-only">{link.name}</span>
        </a>
      ))}
    </div>
  );
}