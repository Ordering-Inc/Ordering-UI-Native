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
  isRequiredField: (field: string) => {},
  isGuestUser?: boolean,
  useValidationFileds?: boolean,
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
  handleChangeLanguage?: any;
}
export interface BusinessesListingParams {
  navigation?: any;
  businessesList: { businesses: Array<any>, loading: boolean, error: null | string };
  searchValue: string;
  getBusinesses: () => void;
  handleChangeBusinessType?: any;
  handleBusinessClick?: void;
  paginationProps?: any;
  handleChangeSearch?: any;
}
export interface BusinessTypeFilterParams {
  businessTypes?: Array<any>;
  handleChangeBusinessType: () => void;
  currentTypeSelected?: string | null;
  defaultBusinessType?: string | null;
}
export interface BusinessControllerParams {
  key?: number;
  business?: any;
  handleCustomClick?: any;
  orderType?: any;
  handleClick?: any;
}
export interface BusinessProductsListingParams {
  navigation?: any;
  errors: any;
  businessState: { business: any, loading: boolean, error: null };
  categoryState: any;
  searchValue?: string;
  featuredProducts: boolean;
  handleChangeSearch?: any;
  categorySelected: any;
  handleChangeCategory: (value: any) => {};
  handleSearchRedirect: any;
}
export interface BusinessBasicInformationParams {
  businessState: { business: any, loading: boolean, error: null };
  openBusinessInformation?: boolean;
  setOpenBusinessInformation?: any;
}
export interface BusinessProductsCategoriesParams {
  categories: Array<any>;
  handlerClickCategory: (value: any) => {};
  categorySelected: any;
  featured: boolean;
}
export interface BusinessProductsListParams {
  errors: any;
  businessId: number;
  category: any;
  categories: Array<any>;
  categoryState: any;
  onProductClick: any;
  handleSearchRedirect: () => {};
  featured: any;
  searchValue: any;
  handleClearSearch: (value: any) => {};
}
export interface SingleProductCardParams {
  businessId: number,
  product: any;
  isSoldOut: boolean;
  onProductClick: any;
}
export interface SearchBarParams {
  searchValue?: any;
  lazyLoad?: boolean;
  placeholder: string;
  isCancelButtonShow?: boolean;
  noBorderShow?: boolean;
  onSearch: (value: any) => {};
  onCancel?: any;
}
export interface NotFoundSourceParams {
  image?: any,
  content?: string,
  btnTitle?: string,
  conditioned?: boolean,
  onClickButton?: () => {},
  children?: any
}
export interface OrdersOptionParams {
  orderList: { loading: boolean, error: Array<any> | string | null, orders: Array<any> },
  activeOrders?: boolean,
  pagination?: any,
  titleContent?: string,
  customArray?: Array<any>,
  loadMoreOrders?: () => {},
  onNavigationRedirect?: () => {},
}
export interface ActiveOrdersParams {
  orders?: any,
  pagination?: any,
  getOrderStatus?: any,
  reorderLoading?: boolean,
  customArray?: Array<any>
  loadMoreOrders?: () => {},
  onNavigationRedirect?: (route: string, params: any) => {}
}
export interface PreviousOrdersParams {
  orders?: any,
  pagination?: any,
  getOrderStatus?: any,
  orderID?: number
  reorderLoading?: boolean,
  loadMoreOrders?: () => {},
  handleReorder?: (order: any) => {},
  onNavigationRedirect?: (route: string, params: any) => {}
}
export interface OrderDetailsParams {
  navigation?: any,
  messagesReadList?: any,
  urlToShare?: string,
  messages?: any,
  order?: any,
  handleOrderRedirect?: () => {},
  setMessages?: () => {},
  readMessages?: () => {},
}
export interface ProductItemAccordionParams {
  isCartPending?: boolean,
  isCartProduct?: boolean,
  product?: any,
  getProductMax?: any,
  changeQuantity?: any,
  onDeleteProduct?: any,
  onEditProduct?: any,
  offsetDisabled: any,
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
export interface FloatingButtonParams {
  btnLeftValue?: string;
  btnRightValue?: string;
  btnText: string
  handleButtonClick?: any;
  disabled?: boolean;
  isSecondaryBtn?: boolean;
  btnLeftValueShow?: boolean;
  btnRightValueShow?: boolean;
}
