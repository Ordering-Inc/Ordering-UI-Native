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
  notificationState?: any;
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
  isGoBack?: boolean;
  route?: any;
  actionStatus?: any;
  isFromBusinesses?: boolean;
  isFromProductsList?: boolean;
  afterSignup?: boolean;
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
  isRequiredField?: (field: string) => {},
  isGuestUser?: boolean,
  useValidationFileds?: boolean,
  isSelectedAfterAdd?: boolean,
  onSaveAddress?: any,
  isFromProductsList?: boolean,
  hasAddressDefault?: any
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
  notificationState?: any;
}

export interface PhoneInputParams {
  data?: any;
  handleData?: any;
  defaultValue?: any;
  defaultCode?: number | null;
}

export interface LanguageSelectorParams {
  languagesState?: any;
  currentLanguage?: string;
  handleChangeLanguage?: any;
}
export interface BusinessesListingParams {
  navigation?: any;
  businessesList: { businesses: Array<any>, loading: boolean, error: null | string };
  searchValue: string;
  getBusinesses: (newFetch?: boolean) => void;
  handleChangeBusinessType?: any;
  handleBusinessClick?: void;
  paginationProps?: any;
  handleChangeSearch?: any;
  images?: any;
  businessTypes?: any;
  defaultBusinessType?: any;
}
export interface BusinessTypeFilterParams {
  businessTypes?: Array<any>;
  handleChangeBusinessType: any;
  currentTypeSelected?: string | null;
  defaultBusinessType?: string | null;
  images?: any
  typesState?: any
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
  errorQuantityProducts?: boolean;
  header?: any;
  logo?: any;
}
export interface BusinessBasicInformationParams {
  businessState?: any;
  openBusinessInformation?: any;
  isBusinessInfoShow?: boolean;
  header?: any;
  logo?: any;
}
export interface BusinessProductsCategoriesParams {
  categories: Array<any>;
  // handlerClickCategory: any;
  onClickCategory: any;
  openBusinessInformation: any;
  categorySelected: any;
  featured: boolean;
  loading?: any;
}
export interface BusinessProductsListParams {
  errors?: any;
  businessId?: number;
  category?: any;
  categories?: Array<any>;
  categoryState?: any;
  onProductClick?: any;
  handleSearchRedirect?: () => {};
  featured?: any;
  searchValue?: any;
  handleClearSearch?: (value: any) => {};
  isBusinessLoading?: any,
  errorQuantityProducts?: boolean

}
export interface SingleProductCardParams {
  businessId: any,
  product: any;
  isSoldOut: boolean;
  onProductClick: any;
}
export interface BusinessInformationParams {
  navigation?: any,
  businessState?: any;
  businessSchedule?: Array<any>;
  businessLocation?: any
  business?: any
}
export interface BusinessReviewsParams {
  businessState: { business: any, loading: boolean, error: null };
  reviewsList: { reviews: any, loading: boolean, error: null };
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
  onClickButton?: any,
  children?: any
}
export interface OrdersOptionParams {
  orderList?: any,
  activeOrders?: boolean,
  pagination?: any,
  titleContent?: string,
  customArray?: Array<any>,
  loadMoreOrders?: () => {},
  onNavigationRedirect?: any,
}
export interface ActiveOrdersParams {
  orders?: any,
  pagination?: any,
  getOrderStatus?: any,
  reorderLoading?: boolean,
  customArray?: Array<any>
  loadMoreOrders?: () => {},
  onNavigationRedirect?: (route: string, params?: any) => {}
}
export interface PreviousOrdersParams {
  orders?: any,
  pagination?: any,
  getOrderStatus?: any,
  orderID?: number
  reorderLoading?: boolean,
  loadMoreOrders?: () => {},
  handleReorder: (order: any) => {},
  onNavigationRedirect?: (route: string, params?: any) => {}
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
  isFromCheckout?: boolean,
  driverLocation?: any,
  isFromRoot?: any,
}
export interface ProductItemAccordionParams {
  isCartPending?: boolean,
  isCartProduct?: boolean,
  product?: any,
  getProductMax?: any,
  changeQuantity?: (product: any, quantity: number) => {},
  onDeleteProduct?: (product: any) => void,
  onEditProduct?: (product: any) => void,
  offsetDisabled?: any,
  isFromCheckout?: any
}
export interface ReviewOrderParams {
  order?: { orderId: number, businessId: number, logo: string },
  stars?: any,
  handleChangeInput?: any,
  handleChangeRating?: any,
  handleSendReview?: any,
  formState?: any,
  navigation?: any
}
export interface MessagesParams {
  type?: string,
  order?: any,
  orderId?: number,
  messages?: any,
  message?: string,
  image?: string,
  messagesToShow?: any ,
  sendMessage?: any,
  handleSend?: () => {},
  setImage?: (image: string | null) => {},
  setMessage?: (comment: string) => {},
  setMessages?: () => {},
  readMessages?: () => {},
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
  handleClick?: any;
}
export interface MomentOptionParams {
  navigation: any;
  nopadding?: boolean;
  datesList: Array<any>;
  hoursList: Array<any>;
  dateSelected?: any;
  timeSelected?: any;
  isAsap?: boolean;
  handleAsap: () => {};
  handleChangeDate: (value: any) => {};
  handleChangeTime: (value: any) => {};
}
export interface OrderTypeSelectParams {
  handleChangeOrderType: (value: any) => {};
  typeSelected?: number;
  defaultValue?: number;
  configTypes?: Array<any>;
  orderTypes: Array<any>;
}
export interface UpsellingProductsParams {
  isCustomMode?: boolean;
  upsellingProducts?: any;
  business?: any;
  businessId?: number;
  cartProducts?: Array<any>; 
  handleUpsellingPage: () => void;
  openUpselling: boolean;
  canOpenUpselling?: boolean;
  setCanOpenUpselling?: (value: any) => void;
}

export interface GoogleMapsParams {
  location: {lat: number, lng: number}
  handleChangeAddressMap?: (address : any, details : any) => void
  setErrors?: (error : string) => void
  maxLimitLocation?: number
  readOnly?: boolean
  markerTitle?: string,
  saveLocation?: boolean,
  locations?: Array<any>,
  setSaveLocation?: (val : boolean) => void,
  handleToggleMap?: () => void
}
