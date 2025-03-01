import { SiGithub, SiX, SiLinkedin } from "react-icons/si";
import { MdEmail } from "react-icons/md";

const socialLinks = [
  {
    name: "GitHub",
    icon: SiGithub,
    url: "https://github.com/sujit4",
  },
  {
    name: "Twitter",
    icon: SiX,
    url: "https://twitter.com/satwork13",
  },
  {
    name: "LinkedIn",
    icon: SiLinkedin,
    url: "https://linkedin.com/in/skonapur",
  },
  {
    name: "Email",
    icon: MdEmail,
    url: "mailto:hello@sujit.dev",
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
