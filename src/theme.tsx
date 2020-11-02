export const colors = {
  primary: '#06B7AE',
  secondary: '#11142C',
  skyBlue: '#069ccd',
  white: '#fff',
  whiteGray: '#f7f6f3',
  dusk: 'rgb(65,77,107)',
  green: '#0CAD63',
  mediumGray: 'rgb(134,154,183)',
  paleGray: '#FAFAFA',
  lightGray: '#D2D2D2',
  backgroundLight: 'white',
  backgroundDark: '#484848',
  backgroundGray: '#EFEFEF',
  clear: 'transparent',
  error: '#C90800',
  success: '#0CAD63'
};

export const light = {
  background: colors.backgroundLight,
  backgroundDark: colors.secondary,
  btnPrimary: colors.backgroundLight,
  btnPrimaryFont: 'black',
  btnPrimaryLight: colors.backgroundDark,
  btnPrimaryLightFont: 'black',
  textDisabled: '#969696',
  btnDisabled: 'rgb(224,224,224)',
  fontColor: 'black',
  tintColor: '#333333',
  primaryColor: colors.primary,
  navBackground: 'white',
  borderColor: colors.lightGray
};

export type Theme = typeof light;

export const dark = {
  background: colors.backgroundDark,
  btnPrimary: colors.primary,
  btnPrimaryFont: 'white',
  btnPrimaryLight: colors.whiteGray,
  btnPrimaryLightFont: 'black',
  textDisabled: '#969696',
  btnDisabled: 'rgb(224,224,224)',
  fontColor: 'white',
  tintColor: '#a3a3a3',
  primaryColor: colors.primary,
  navBackground: colors.clear
};
