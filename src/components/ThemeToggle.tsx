import { useThemeToggle } from "@/hooks/useThemeToggle"

export default function ThemeToggle() {
	const { mounted, theme, toggleTheme } = useThemeToggle()
	return <div>ThemeToggle</div>
}
