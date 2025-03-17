import { Manrope,Inter } from "next/font/google";
// 加载谷歌字体
export const sansFont = Manrope({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable:'--font-sans',
  display:'swap',
});

export const inter=Inter({subsets:['latin']})
