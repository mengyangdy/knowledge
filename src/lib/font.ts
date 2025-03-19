import { Inter, Manrope } from "next/font/google"

const sansFont = Manrope({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-sans",
	display: "swap",
})

const inter = Inter({ subsets: ["latin"] })

export { sansFont, inter }
