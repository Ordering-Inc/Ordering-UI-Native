export const colors = {
  primary: '#06B7AE',
  skyBlue: '#069ccd',
  whiteGray: '#f7f6f3',
  dusk: 'rgb(65,77,107)',
  green: 'rgb(29,211,168)',
  mediumGray: 'rgb(134,154,183)',
  paleGray: 'rgb(221,226,236)',
  lightBackground: 'white',
  lightBackgroundLight: '#f7f6f3',
  darkBackground: '#323739',
  darkBackgroundLight: '#393241',
  clear: 'transparent'
};

export const light = {
  background: colors.lightBackground,
  btnPrimary: colors.lightBackground,
  btnPrimaryFont: 'black',
  btnPrimaryLight: colors.darkBackground,
  btnPrimaryLightFont: 'black',
  textDisabled: '#969696',
  btnDisabled: 'rgb(224,224,224)',
  fontColor: 'black',
  tintColor: '#333333',
  primaryColor: colors.primary,
  navBackground: 'white',
  borderColor: '##e0e0e0'
};

export type Theme = typeof light;

export const dark = {
  background: colors.darkBackground,
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
