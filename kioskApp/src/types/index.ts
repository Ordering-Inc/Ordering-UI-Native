import { ViewStyle } from 'react-native';
export interface LoginParams {
  navigation?: any;
  formState?: any;
  useLoginByEmail?: boolean;
  useLoginByCellphone?: boolean;
  loginTab?: string;
  handleChangeTab?: any;
  loginButtonText?: string;
  onNavigationRedirect?: any;
  registerButtonText?: string;
  forgotButtonText?: string;
  verifyPhoneState?: any;
  checkPhoneCodeState?: any;
  setCheckPhoneCodeState?: any;
  handleButtonLoginClick?: any;
  handleSendVerifyCode?: any;
  handleCheckPhoneCode?: any;
}
