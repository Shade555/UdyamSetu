import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
      className="theme-toggle fixed right-4 top-4 z-[60] rounded-lg border border-neutral-200 bg-white p-2 text-neutral-600 shadow-sm hover:bg-neutral-100 hover:text-neutral-900"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
