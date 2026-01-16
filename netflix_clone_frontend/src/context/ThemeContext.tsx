import { createContext, useContext, useEffect, type ReactNode } from 'react'

interface ThemeContextType {
  theme: 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.documentElement.style.colorScheme = 'dark'
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
