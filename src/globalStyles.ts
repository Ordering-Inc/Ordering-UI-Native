const color  = {
  primary: '#06B7AE',
  secondary: '#11142C',
  error: '#C90800',
  success: '#90C68E',
  light: 'white',
  dark: '#484848',
  gray: '#EFEFEF',
  blueGray: '#869ab7',
  lightGray: '#D2D2D2',
  clear: 'transparent',
  paleGray: '#FAFAFA',
  whiteGray: '#f7f6f3',

  black: 'black',

  skyBlue: '#069ccd',
  white: '#fff',
  dusk: 'rgb(65,77,107)',
  green: '#0CAD63',
  mediumGray: '#869ab7',
  
  buttonFont: 'black',
  buttonFontDisabled: 'black'
};

const backgroundColors = {
  primary: color.primary,
  secondary: color.secondary,
  error: color.error,
  success: color.success,
  light: color.white,
  dark: color.dark,
  gray: color.gray,
  lightGray: color.lightGray,
  paleGray: color.paleGray,
  clear: color.clear
}

const borderColors = {
  primary: color.primary,
  secondary: color.secondary,
  error: color.error,
  light: color.white,
  dark: color.dark,
  gray: color.gray,
  lightGray: color.lightGray,
  whiteGray: color.whiteGray,
  clear: color.clear
}

const buttonTheme = {
  fontColor: color.black,
  disabledFontColor: color.white,
  backgroundColor: color.primary,
  disabledBackgroundColor: color.dark,
  borderColor: color.primary,
  disabledBorderColor: color.dark,
  backgroundClear: color.clear
}

const labelTheme = {
  default: color.black,
  gray: color.gray,
  light: color.light,
  dark: color.dark,
  lightGray: color.lightGray,
  primary: color.primary,
  secondary: color.secondary,
  error: color.error,
}

export { backgroundColors, borderColors, buttonTheme, labelTheme }