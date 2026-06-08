import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/utils/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Sauber & Fix - Find Trusted Local Workers in Germany",
  description: "Book skilled professionals for your home and get the job done. Home Cleaning, Plumbing, Electrical, Painting, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans text-slate-800 bg-[#fafcff] selection:bg-blue-100 selection:text-blue-900">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
