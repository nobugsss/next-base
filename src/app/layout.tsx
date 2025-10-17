import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Base - 全栈项目模板",
  description: "基于 Next.js 15 + TypeScript + Tailwind CSS 构建的全栈项目，包含完整的 CRUD 功能和文件管理功能",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
