import React, { createContext, useState } from 'react'

const themes = {
  dark: {
    backgroundColor: '#282c34',
    color: '#b9b9b9',
    inputColor: '#b9b9b9'
  },
  light: {
    backgroundColor: '#b9b9b9',
    color: 'black',
    inputColor: '#b9b9b9'
  }
}

const initialState = {
  dark: false,
  theme: themes.light,
  toggle: () => {}
}
const ThemeContext = createContext(initialState)

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)

  React.useEffect(() => {
    const isDark = localStorage.getItem('dark') === 'true'
    setDark(isDark)
  }, [dark])

  const toggle = () => {
    const isDark = !dark
    localStorage.setItem('dark', JSON.stringify(isDark))
    setDark(isDark)
  }

  const theme = dark ? themes.dark : themes.light

  return (
    <ThemeContext.Provider value={{ theme, dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProvider, ThemeContext }