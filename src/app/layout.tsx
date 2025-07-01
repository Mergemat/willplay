import "~/styles/globals.css";

import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${plusJakartaSans.variable} dark`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="h-svh">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
