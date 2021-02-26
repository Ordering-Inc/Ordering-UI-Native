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
export interface ProfileParams {
  navigation?: any;
  isEdit?: boolean;
  formState?: any;
  toggleIsEdit?: any;
  cleanFormState?: any;
  setFormState?: any;
  handleChangeInput?: any;
  handleButtonUpdateClick?: any;
  handlechangeImage?: any;
  validationFields?: any;
  showField?: any;
  isRequiredField?: any;
}

export interface AddressListParams {
  navigation?: any;
  addressList?: any;
  isFromProfile?: boolean;
  nopadding?: boolean;
  userId?: any;
  handleDelete?: any;
  handleSetDefault?: any;
  setAddressList?: any;
  onNavigationRedirect?: any,
  goToBack?: any
}

export interface AddressFormParams {
  navigation?: any,
  updateChanges?: any,
  address?: any,
  formState?: any,
  isEditing?: boolean,
  handleChangeInput?: any,
  addressState?: any,
  addressesList?: any,
  saveAddress?: any,
  userCustomerSetup?: boolean,
  isRequiredField?: boolean,
  isGuestUser?: boolean,
  useValidationFileds?: boolean,
  onNavigationRedirect?: any,
  goToBack?: any
}
export interface SignupParams {
  navigation?: any;
  loginButtonText?: string;
  signupButtonText?: string;
  onNavigationRedirect?: any;
  formState?: any;
  validationFields?: any;
  showField?: any;
  isRequiredField?: any;
  useChekoutFileds?: boolean;
  useSignupByEmail?: boolean;
  useSignupByCellphone?: boolean;
  handleSuccessSignup?: any;
  handleButtonSignupClick?: any;
  verifyPhoneState?: any;
  checkPhoneCodeState?: any;
  setCheckPhoneCodeState?: any;
  handleSendVerifyCode?: any;
  handleCheckPhoneCode?: any;
}

export interface PhoneInputParams {
  data?: any;
  handleData?: any;
}

export interface LanguageSelectorParams {
  languagesState?: Array<any>;
  currentLanguage?: string;
  handleChangeLanguage?: any
}
export interface ViewInterface {
  navigation?: any;
  onLogin?: any;
  title?: string;
  subTitle?: string;
  backgroundColor?: string;
  wrapperStyle?: ViewStyle;
  borderRadius?: any;
  border?: string;
  placeHolderColor?: string;
  buttonBackground?: string;
  inputMargin?: string;
  loginButtonText?: string;
  loginButtonBackground?: string;
  loginButtonBorder?: string;
  buttonBorder?: string;
  registerButtonText?: string;
  registerButtonBackground?: string;
  registerButtonBorderColor?: string;
  loginButtonBorderColor?: string;
  onRegister?: any;
  onForgot?: any;
  forgotButtonText?: string;
}
