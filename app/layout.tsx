import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import Header from "@/components/Header/Header";
import getRestaurant from "@/components/Server/getRestaurant";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ذوّاقة | اكتشف أفضل المطاعم حولك",
  description:
    "ذوّاقة هو موقع عربي يساعدك على اكتشاف المطاعم وتقييمها بسهولة. شارك تجربتك مع مجتمع عشاق الطعام في الوطن العربي.",
  keywords: [
    "مطاعم",
    "تقييم مطاعم",
    "ذواقة",
    "أكل",
    "طعام",
    "تجارب الأكل",
    "مطاعم القاهرة",
  ],
  authors: [{ name: "مشروع ذوّاقة" }],
  openGraph: {
    title: "ذوّاقة | اكتشف أفضل المطاعم حولك",
    description:
      "شارك تجربتك، قيّم مطعمك المفضل، واستكشف أماكن جديدة لتذوق الطعام في الوطن العربي.",
    locale: "ar_AR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurants = await getRestaurant();
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable}  antialiased`}>
        <StoreProvider>
          <Header restaurant={restaurants} />

          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
