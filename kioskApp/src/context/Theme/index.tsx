import React, { createContext, useContext, useState } from 'react'
import { ThemeProvider as ThemeProviderStyled } from 'styled-components'

type ITheme = any;

type IThemeContext = [ITheme, React.Dispatch<React.SetStateAction<ITheme>>];

const ThemeContext = createContext<IThemeContext>([[], () => null]);

export const ThemeProvider = ({ children, ...props }: any) => {
  const [theme, setTheme] = useState<ITheme>(props.theme);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <ThemeProviderStyled theme={theme}>
        {children}
      </ThemeProviderStyled>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const themeManager = useContext(ThemeContext)
  return themeManager || [{}]
}
