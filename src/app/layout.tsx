import { inter, sansFont } from "@/lib/font";
import "@/style/global.css";
import React, { Suspense } from "react";
import siteMetaData from "@/config/site";
import { ThemeProvider } from "next-themes";
import GlobalBg from "@/components/globalBg";
import MainBg from "@/components/mainBg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${sansFont.variable} m-0 h-full p-0 font-sans antialiased`}
      lang={siteMetaData.locale}
      suppressHydrationWarning
    >
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalBg />
          <MainBg />
          <div className="relative text-zinc-800 dark:text-zinc-200">
            <Header />
            <main>{children}</main>
            <Suspense>
              <Footer />
            </Suspense>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
