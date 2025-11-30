"use client";

import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";

const links = [
  { href: "#contact", label: "Contact" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Blog" },
];

export function FooterCentered() {
  return (
    <footer className="w-full mt-24 border-t border-white/15 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* LEFT - Logo / Name */}
        <div className="text-white text-xl font-light opacity-80">
          SmartAudit
        </div>

        {/* CENTER - Links */}
        <div className="flex gap-6 text-xs sm:text-sm text-white/60">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition"
              onClick={(e) => {
                if (link.href === "#") e.preventDefault();
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* RIGHT - Icons */}
        <div className="flex gap-3">
          <button className="rounded-full border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition">
            <IconBrandTwitter size={18} className="text-white/60" />
          </button>
          <button className="rounded-full border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition">
            <IconBrandYoutube size={18} className="text-white/60" />
          </button>
          <button className="rounded-full border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition">
            <IconBrandInstagram size={18} className="text-white/60" />
          </button>
        </div>
      </div>
    </footer>
  );
}
