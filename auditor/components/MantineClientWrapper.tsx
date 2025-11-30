"use client";

import { MantineProvider } from "@mantine/core";

export default function MantineClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider defaultColorScheme="dark">
      {children}
    </MantineProvider>
  );
}
