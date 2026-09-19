import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    localStorage.getItem('udyamsetu-theme') === 'light' ? 'light' : 'dark',
  )

  useEffect(() => {
    localStorage.setItem('udyamsetu-theme', theme)
    document.documentElement.dataset.theme = theme
    document.body.dataset.theme = theme
  }, [theme])

  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark'), setTheme }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
