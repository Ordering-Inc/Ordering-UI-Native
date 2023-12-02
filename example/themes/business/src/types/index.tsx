import { TextInputProps, ViewStyle } from 'react-native';
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
  emailInputIcon?: any;
  passwordInputIcon?: any;
  allowedLevels?: any;
  useRootPoint?: any;
  notificationState?: any;
  handleReCaptcha?: any;
  enableReCaptcha?: any;

  otpType?: string,
  setOtpType: (type: string) => void,
  generateOtpCode: (values?: any) => void,
  useLoginOtpEmail?: boolean,
  useLoginOtpCellphone?: boolean,
  useLoginOtp?: boolean
}
export interface otpParams {
  willVerifyOtpState: boolean,
  setWillVerifyOtpState: (val: boolean) => void,
  onSubmit: () => void,
  handleLoginOtp: (code: string) => void,
  setAlertState: any,
  formState?: any
}
export interface ProfileParams {
  navigation?: any;
  isEdit?: boolean;
  formState?: any;
  userState?: any;
  toggleIsEdit?: any;
  cleanFormState?: any;
  setFormState?: any;
  isAvailableLoading?: boolean;
  handleChangeInput?: any;
  handleButtonUpdateClick?: any;
  handleToggleAvalaibleStatusDriver?: any;
  onNavigationRedirect?: any;
  handlechangeImage?: any;
  validationFields?: any;
  showField?: any;
  isRequiredField?: any;
  isAlsea?: boolean;
  isShowDriverStatus?: boolean;
  isFocused?: boolean;
  isBusinessApp?: boolean;
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
  navigation?: any;
  updateChanges?: any;
  address?: any;
  formState?: any;
  isEditing?: boolean;
  handleChangeInput?: any;
  addressState?: any;
  addressesList?: any;
  saveAddress?: any;
  userCustomerSetup?: boolean;
  isRequiredField?: (field: string) => {};
  isGuestUser?: boolean;
  useValidationFileds?: boolean;
  isSelectedAfterAdd?: boolean;
  onSaveAddress?: any;
  isFromProductsList?: boolean;
  hasAddressDefault?: any;
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
  signupLevel?: any;
}

export interface PhoneInputParams {
  data?: any;
  handleData?: any;
  defaultValue?: any;
  defaultCode?: number | null;
  forwardRef?: any;
  isDisabled?: boolean;
  textInputProps?: TextInputProps;
  flagProps?: any;
  onSubmitEditing?: () => void;
}

export interface LanguageSelectorParams {
  languagesState?: any;
  currentLanguage?: string;
  handleChangeLanguage?: any;
}
export interface BusinessesListingParams {
  navigation?: any;
  businessesList: {
    businesses: Array<any>;
    loading: boolean;
    error: null | string;
  };
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
  images?: any;
  typesState?: any;
}
export interface BusinessControllerParams {
  key?: number;
  setIsUpdateStore?: any;
  business?: any;
  businessState?: any;
  isUpdateStore?: any;
  handleCustomClick?: any;
  orderType?: any;
  handleClick?: any;
  isBusinessOpen?: boolean;
  businessWillCloseSoonMinutes?: number;
  updateBusiness?: (id: any, value: any) => {};
  navigation?: any;
}
export interface BusinessProductsListingParams {
  navigation?: any;
  errors: any;
  businessState: { business: any; loading: boolean; error: null };
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
  isBusinessLoading?: any;
  errorQuantityProducts?: boolean;
}
export interface SingleProductCardParams {
  businessId: any;
  product: any;
  isSoldOut: boolean;
  onProductClick: any;
}
export interface BusinessInformationParams {
  navigation?: any;
  businessState?: any;
  businessSchedule?: Array<any>;
  businessLocation?: any;
  business?: any;
}
export interface BusinessReviewsParams {
  businessState: { business: any; loading: boolean; error: null };
  reviewsList: { reviews: any; loading: boolean; error: null };
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
  image?: any;
  content?: string;
  btnTitle?: string;
  conditioned?: boolean;
  onClickButton?: any;
  children?: any;
  textSize?: number;
}
export interface MessagesOptionParams {
  orders?: any;
  setOrders?: (status: any) => {};
  loadMore?: (key?: any) => {};
  orderList?: any;
  activeOrders?: boolean;
  pagination?: any;
  customArray?: Array<any>;
  messages?: any;
  setMessages?: () => {};
  loadMoreOrders?: () => {};
  loadOrders?: () => {};
  loadMessages?: () => {};
  handlerSubmit?: () => {};
  readMessages?: () => {};
  messagesReadList?: any;
  onNavigationRedirect?: any;
  setSortBy?: any;
  getOrders: any
}
export interface OrdersOptionParams {
  orderList?: any;
  activeOrders?: boolean;
  pagination?: any;
  setRememberOrderStatus?: any;
  rememberOrderStatus?: any;
  titleContent?: string;
  customArray?: Array<any>;
  loadMoreOrders?: () => {};
  loadOrders?: ({ }: any) => {};
  messages?: any;
  setMessages?: () => {};
  loadMessages?: () => {};
  navigation?: any;
  setUpdateOtherStatus?: any;
  onNavigationRedirect?: any;
  orderStatus?: any;
  tabs?: any;
  currentTabSelected?: any;
  setCurrentTabSelected?: any;
  ordersGroup?: any;
  setOrdersGroup?: any;
  setCurrentFilters?: any;
  onFiltered?: ({ }: any) => {};
  filtered?: any;
  handleClickOrder?: any;
  orderGroupStatusCustom?: {
    active?: Array<number>;
    pending?: Array<number>;
    inProgress?: Array<number>;
    completed?: Array<number>;
    cancelled?: Array<number>;
  };
  isBusinessApp?: boolean;
  handleClickLogisticOrder?: (status: number, orderId: number) => void,
  logisticOrders?: { orders: Array<any>, loading: boolean, error: Array<string> | string },
  loadLogisticOrders?: () => void;
  isLogisticActivated?: boolean;
  isAlsea?: boolean;
  checkNotification?: boolean;
  ordersFormatted?: any;
  handleChangeOrderStatus?: () => void;
  handleSendCustomerReview?: () => void;
  orderDetailsProps?: any;
  isNetConnected?: boolean;
  isDriverApp?: boolean;
  combineTabs?: boolean;
  setCombineTabsState?: any;
}
export interface ActiveOrdersParams {
  orders?: any;
  pagination?: any;
  getOrderStatus?: any;
  reorderLoading?: boolean;
  customArray?: Array<any>;
  loadMoreOrders?: () => {};
  onNavigationRedirect?: (route: string, params?: any) => {};
}
export interface PreviousOrdersParams {
  data?: any;
  tab?: any;
  isRefreshing: boolean;
  loadOrders?: (tab: string, isNextPage?: boolean, isRefresh?: boolean) => void;
  getOrderStatus?: (status: number) => string;
  tagsFilter?: number[];
  onNavigationRedirect?: (route: string, params?: any) => void;
}

export interface ContactParams {
  orders?: any;
  contacts?: any;
  messages?: any;
  activeTag?: any;
  pagination?: any;
  getBusinesses?: (value?: any) => {};
  getCustomers?: (value?: any) => {};
  getDrivers?: (value?: any) => {};
  loadMore?: (value?: any) => {};
  setMessages?: (state?: any) => {};
  loadMessages?: (id: any) => {};
  onNavigationRedirect?: (route: string, params?: any) => {};
}

export interface PreviousMessagesParams {
  orders?: any;
  setOrders?: (status: any) => {};
  pagination?: any;
  getOrderStatus?: any;
  orderID?: number;
  reorderLoading?: boolean;
  messages?: any;
  setMessages?: (state?: any) => {};
  tabsFilter?: any;
  loadMoreOrders?: (status: any) => {};
  loadMessages?: (id: any) => {};
  handleReorder?: (order: any) => {};
  onNavigationRedirect?: (route: string, params?: any) => {};
  getOrders?: any;
  loading?: boolean;
  reload?: boolean;
  tabs?: any;
  loadMore: any
  error?: boolean
}
export interface OrderDetailsParams {
  handleUpdateLocationDriver?: () => {};
  setOrders?: (state: any) => {};
  actions?: actions;
  titleAccept?: textTranslate;
  titleReject?: textTranslate;
  titleNotReady?: textTranslate;
  appTitle?: textTranslate;
  drivers?: any;
  loadingDriver?: boolean;
  navigation?: any;
  messagesReadList?: any;
  urlToShare?: string;
  messages?: any;
  handleAssignDriver?: (id: any) => {};
  handleChangeOrderStatus?: (status: any, isAcceptOrReject: any) => {};
  order?: any;
  isFromRoot?: any;
  handleOrderRedirect?: () => {};
  setMessages?: () => {};
  readMessages?: () => {};
  isFromCheckout?: boolean;
  driverLocation?: any;
  goToBusinessList?: boolean;
  permissions?: any;
  askLocationPermission?: any;
  redirectToSettings?: any;
  updateDriverPosition?: any;
  driverUpdateLocation?: any;
  setDriverUpdateLocation?: any;
  handleClickLogisticOrder?: (status: number, orderId: number) => void;
  orderTitle?: any;
  forceUpdate?: number;
  getPermissions?: any
  loadMessages?: any;
  notificationApp?: string
}
export interface ProductItemAccordionParams {
  isCartPending?: boolean;
  isCartProduct?: boolean;
  product?: any;
  getProductMax?: any;
  comment?: string;
  changeQuantity?: (product: any, quantity: number) => {};
  onDeleteProduct?: (product: any) => void;
  onEditProduct?: (product: any) => void;
  offsetDisabled?: any;
  isFromCheckout?: any;
  isClickableEvent?: any;
  currency?: any;
}
export interface ReviewOrderParams {
  order?: { orderId: number; businessId: number; logo: string };
  stars?: any;
  handleChangeInput?: any;
  handleChangeRating?: any;
  handleSendReview?: any;
  formState?: any;
  navigation?: any;
}
export interface MessagesParams {
  type?: string;
  order?: any;
  orderId?: number;
  messages?: any;
  message: string;
  image?: string;
  messagesToShow?: any;
  sendMessage?: any;
  canRead?: any;
  setCanRead?: any;
  notificationApp?: string
  handleSend?: () => {};
  setImage?: (image: string | null) => {};
  setMessage?: (comment: string) => {};
  setMessages?: (state?: any) => {};
  readMessages?: () => {};
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
  btnText: string;
  secondBtnText?: string;
  isPadding?: boolean;
  widthButton?: number | string;
  firstButtonClick?: any;
  secondButtonClick?: any;
  color?: string;
  disabled?: boolean;
  colorTxt1?: string;
  isSecondaryBtn?: boolean;
  btnLeftValueShow?: boolean;
  btnRightValueShow?: boolean;
  handleClick?: any;
  secondButton?: boolean;
  firstColorCustom?: string;
  secondColorCustom?: string;
  paddingBottomIos?: any;
  isHideRejectButtons?: boolean;
  principalButtonColor?: string;
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

export interface Location {
  latitude: number;
  longitude: number;
  speed: number;
}

export interface GoogleMapsParams {
  location: { lat: number; lng: number; icon: string; title: string };
  handleChangeAddressMap?: (address: any, details: any) => void;
  setErrors?: (error: string) => void;
  maxLimitLocation?: number;
  readOnly?: boolean;
  isToFollow?: boolean;
  markerTitle?: string;
  showAcceptOrReject?: boolean;
  order?: any;
  driverLocation?: any;
  saveLocation?: boolean;
  handleOpenMapView?: () => void;
  isBusinessMarker?: boolean;
  isSetInputs?: boolean;
  handleViewActionOrder?: (action: string) => void;
  locations?: Array<any>;
  orderStatus?: number;
  setSaveLocation?: (val: boolean) => void;
  handleToggleMap?: () => void;
  navigation: any;
  updateDriverPosition?: any;
  driverUpdateLocation?: any;
  setDriverUpdateLocation?: any;
}

export interface TagsParams {
  status: number[];
}

interface actions {
  accept: string;
  reject: string;
  pickupFailed: string;
  deliveryFailed: string;
  notReady: string;
  forcePickUp: string;
  forceDelivery: string;
}

interface textTranslate {
  key: string;
  text: string;
}

export interface AcceptOrRejectOrderParams {
  customerCellphone?: string;
  closeModal?: any;
  loading?: boolean;
  action: string;
  orderId?: number;
  handleUpdateOrder?: (p1: any, p2: any) => {};
  notShowCustomerPhone?: boolean | undefined;
  actions?: any;
  titleAccept?: textTranslate;
  titleReject?: textTranslate;
  titleNotReady?: textTranslate;
  appTitle?: textTranslate;
  orderTitle?: any
  isPage?: boolean
  navigation?: any
  route?: any
  isLoadingOrder?: boolean
}

export interface MapViewParams {
  onNavigationRedirect: (page: string, params?: any) => void,
  getBusinessLocations: () => void,
  setDriverLocation: (location: any) => void,
  isLoadingBusinessMarkers?: boolean,
  markerGroups: Array<any>,
  customerMarkerGroups: Array<any>,
  alertState: { open: boolean, content: Array<string>, key?: string | null },
  setAlertState: ({ open, content, key }: { open: boolean, content: Array<string>, key?: string | null }) => void
}

export interface ReviewCustomerParams {
  order?: any,
  closeModal?: any,
  reviewState?: any,
  setReviewState?: any,
  actionState?: any,
  handleChangeQualification?: any,
  handleSendCustomerReview?: any,
  handleCustomCustomerReview?: any,
}

export interface NoNetworkParams {
  image?: any;
}

export interface OrderDetailsLogisticParams {
  navigation: any,
  handleClickLogisticOrder: any,
  orderAssingId: number,
  order: any
}

export interface SessionsParams {
  navigation: any,
  sessionsList: any,
  actionState: any,
  handleDeleteSession: any,
  handleDeleteAllSessions: any
}
