"use client";

import React, { useState } from "react";
import { Menu, MenuItem, ProductItem, HoveredLink } from "@/components/ui/navbar-menu"; // adjust if needed

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Menu setActive={setActive}>
      <HoveredLink href="/">Home</HoveredLink>

      <HoveredLink href="#analyze">Analyze</HoveredLink>

      <HoveredLink href="#contact">Contact</HoveredLink>
    </Menu>
  );
}
