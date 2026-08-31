import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { RcProvider } from "@/context/rc-context";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "VerbalOS | Your personal CAT VARC operating system.",
  description: "Your personal CAT VARC operating system. Train reading comprehension, verbal ability, and timed sectional mocks with cloud sync.",
  openGraph: {
    title: "VerbalOS",
    description: "Your personal CAT VARC operating system.",
    siteName: "VerbalOS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <RcProvider>
            <AppShell>{children}</AppShell>
          </RcProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
