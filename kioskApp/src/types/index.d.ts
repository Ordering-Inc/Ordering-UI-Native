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

export interface Original {
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
  hidden: string[];
  original: Original;
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
