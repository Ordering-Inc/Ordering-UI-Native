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
  resetInactivityTimeout: any;
  clearInactivityTimeout: any;
  bottomSheetVisibility: any;
  titleStyle: any;
  descriptionStyle: any;
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
}

export interface OrderTypeSelectParams {
  handleChangeOrderType: (value: any) => {};
  typeSelected?: number;
  defaultValue?: number;
  configTypes?: Array<any>;
  orderTypes: Array<any>;
  navigation: any;
  callback?: () => void;
  goBack?: () => void;
}

export interface UpsellingProductsParams {
  isCustomMode?: boolean;
  upsellingProducts?: any;
  business?: any;
  businessId?: string;
  cartProducts?: Array<any>; 
  handleUpsellingPage: () => void;
  openUpselling: boolean;
  canOpenUpselling?: boolean;
  setCanOpenUpselling?: (value: any) => void;
  onClose?: () => void;
  resetInactivityTimeout: any;
  onAddProduct: any;
}

export interface LanguageSelectorParams {
  languagesState?: any;
  currentLanguage?: string;
  handleChangeLanguage?: any;
}

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
  useRootPoint?: any;
  enableReCaptcha?: boolean;
  handleReCaptcha?: (vlaue: any) => void;
  useLoginOtp?: any;
  otpType?: any;
  setOtpType?: any;
  generateOtpCode?: any;
  useLoginOtpEmail?: any;
  useLoginOtpCellphone?: any;
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

export interface Open {
  hour: number;
  minute: number;
}

export interface Laps {
  open: Open;
  close: Close;
}

export interface Review {
  id: number;
  order_id: number;
  quality: number;
  delivery: number;
  service: number;
  package: number;
  comment: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  laravel_through_key: number;
  total: number;
}

export interface Reviews {
  reviews: Review[];
  quality: number;
  delivery: number;
  service: number;
  package: number;
  total: number;
}

export interface Close {
  hour: number;
  minute: number;
}

export interface Extra {
  id: number;
  business_id: number;
  name: string;
  description?: any;
  enabled: boolean;
  pivot: Pivot;
  options: Option[];
}

export interface Ingredient {
  id: number;
  product_id: number;
  name: string;
  image?: any;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  total: number;
  description: string;
  images: string;
  sku: string;
  category_id: number;
  inventoried: boolean;
  quantity: number;
  featured: boolean;
  enabled: boolean;
  upselling: boolean;
  in_offer: boolean;
  offer_price?: any;
  rank?: any;
  extras: Extra[];
  gallery: any[];
  ingredients: Ingredient[];
  options: any;
  comment: string;
  valid_menu: boolean;
}

export interface Gallery {
  id: number;
  business_id: number;
  type: number;
  file: string;
  video: string;
  title?: any;
  description?: any;
  created_at: string;
  updated_at: string;
}

export interface OriginalBusiness {
  name: string;
  id: number;
  header: string;
  logo: string;
  about: string;
  description: string;
  address: string;
  location: Location;
  timezone: string;
  schedule: Schedule[];
  service_fee: number;
  delivery_price: number;
  delivery_time: string;
  pickup_time: string;
  featured: boolean;
  food: boolean;
  laundry: boolean;
  alcohol: boolean;
  groceries: boolean;
  slug: string;
  menus_count: number;
  available_menus_count: number;
  menus_shared_count: number;
  available_menus_shared_count: number;
  reviews: Reviews;
  open: boolean;
  today: Today;
  lazy_load_products_recommended: boolean;
  available_products_count: number;
  categories: Category[];
  valid_service: boolean;
  delivery_zone?: any;
  maximum?: any;
  gallery: Gallery[];
  offers: any[];
}

export interface Query {
  type: number;
  location?: any;
}

export interface Ordering {
  url: string;
  version: string;
  project: string;
  language: string;
  accessToken?: any;
  apiKey?: any;
  appId: string;
}

export interface Api {
  attributes: string[];
  query: Query;
  ordering: Ordering;
  businessId: string;
}

export interface Location {
  lat: number;
  lng: number;
  zipcode: number;
  zoom: number;
}

export interface Close {
  hour: number;
  minute: number;
}

export interface Laps {
  open: Open;
  close: Close;
}

export interface Schedule {
  enabled: boolean;
  lapses: Laps[];
}

export interface Review {
  id: number;
  order_id: number;
  quality: number;
  delivery: number;
  service: number;
  package: number;
  comment: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  laravel_through_key: number;
  total: number;
}

export interface Reviews {
  reviews: Review[];
  quality: number;
  delivery: number;
  service: number;
  package: number;
  total: number;
}

export interface Today {
  enabled: boolean;
  lapses: Laps[];
}

export interface Pivot {
  product_id: number;
  extra_id: number;
}

export interface Suboption {
  id: number;
  extra_option_id: number;
  name: string;
  price: number;
  image?: any;
  sku?: any;
  rank: number;
  description?: any;
  max: number;
  half_price?: any;
  enabled: boolean;
}

export interface Option {
  id: number;
  extra_id: number;
  name: string;
  image?: any;
  conditioned: boolean;
  respect_to?: number;
  min: number;
  max: number;
  rank: number;
  with_half_option: boolean;
  allow_suboption_quantity: boolean;
  limit_suboptions_by_max: boolean;
  enabled: boolean;
  suboptions: Suboption[];
}

export interface Category {
  id: number;
  business_id: number;
  name: string;
  image: string;
  rank: number;
  enabled: boolean;
  products: Product[];
}

export interface Business {
  tax: number;
  tax_type: number;
  hidden: string[];
  original: OriginalBusiness;
  api: Api;
  name: string;
  id: number;
  header: string;
  logo: string;
  about: string;
  description: string;
  address: string;
  location: Location;
  timezone: string;
  schedule: Schedule[];
  service_fee: number;
  delivery_price: number;
  delivery_time: string;
  pickup_time: string;
  featured: boolean;
  food: boolean;
  laundry: boolean;
  alcohol: boolean;
  groceries: boolean;
  slug: string;
  menus_count: number;
  available_menus_count: number;
  menus_shared_count: number;
  available_menus_shared_count: number;
  reviews: Reviews;
  open: boolean;
  today: Today;
  lazy_load_products_recommended: boolean;
  available_products_count: number;
  categories: Category[];
  valid_service: boolean;
  delivery_zone?: any;
  maximum?: any;
  gallery: Gallery[];
  offers: any[];
}

export interface OriginalCart {
  uuid: string;
  user_id: number;
  status?: any;
  business_id: string;
  comment?: any;
  driver_tip_rate: number;
  paymethod_id?: any;
  driver_tip: number;
  quantity: number;
  pay_reference?: any;
  paymethod_data?: any;
  products: Product[];
  business: Business;
  metafields: any[];
  subtotal: number;
  valid_address: boolean;
  delivery_zone_id: number;
  delivery_price: number;
  minimum: number;
  valid_minimum: boolean;
  valid_maximum: boolean;
  maximum?: any;
  valid_schedule: boolean;
  valid_products: boolean;
  valid: boolean;
  tax_rate: number;
  service_fee_rate: number;
  summary_version: number;
  tax: number;
  service_fee: number;
  tax_with_discount: number;
  discount: number;
  offers: any[];
  subtotal_with_discount: number;
  service_fee_with_discount: number;
  delivery_price_with_discount: number;
  total: number;
}

export interface Cart {
  discount_rate: number;
  discount_type: number;
  hidden: string[];
  original: OriginalCart;
  api: Api;
  uuid: string;
  user_id: number;
  status?: any;
  business_id: string;
  comment?: any;
  driver_tip_rate: number;
  paymethod_id?: any;
  driver_tip: number;
  quantity: number;
  pay_reference?: any;
  paymethod_data?: any;
  products: Product[];
  business: Business;
  metafields: any[];
  subtotal: number;
  valid_address: boolean;
  delivery_zone_id: number;
  delivery_price: number;
  minimum: number;
  valid_minimum: boolean;
  valid_maximum: boolean;
  maximum?: any;
  valid_schedule: boolean;
  valid_products: boolean;
  valid: boolean;
  tax_rate: number;
  service_fee_rate: number;
  summary_version: number;
  tax: number;
  service_fee: number;
  tax_with_discount: number;
  discount: number;
  offers: any[];
  subtotal_with_discount: number;
  service_fee_with_discount: number;
  delivery_price_with_discount: number;
  total: number;
  clearInactivityTimeout: any;
  taxes: Array<any>;
  fees: Array<any>;
}

export interface NoNetworkParams {
  image?: any;
}
export interface otpParams {
	willVerifyOtpState: boolean,
	setWillVerifyOtpState: (val : boolean) => void,
	onSubmit: any,
	handleLoginOtp: (code : string) => void,
	setAlertState: any
}
