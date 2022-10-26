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
	handleSendVerifyCode?: any;
	handleCheckPhoneCode?: any;
	checkPhoneCodeState?: any;
	verifyPhoneState?: any;
	setCheckPhoneCodeState?: any;
	isVerifiedPhone?: any;
	handleRemoveAccount?: any;
	removeAccountState?: any;
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
	isFromCheckout?: boolean
	loadAddresses: () => void
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
	showField?: (field: string) => {},
	isGuestUser?: boolean,
	useValidationFileds?: boolean,
	isSelectedAfterAdd?: boolean,
	onSaveAddress?: any,
	isFromProductsList?: boolean,
	hasAddressDefault?: any,
	isFromCheckout?: boolean
	afterSignup?: boolean
	isGuestFromStore?: boolean
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
	signUpTab?: string;
	useSignUpFullDetails?: boolean;
	useSignUpOtpEmail?: boolean;
	useSignUpOtpCellphone?: boolean;
	willVerifyOtpState?: boolean;
	numOtpInputs?: number;
	handleChangePromotions: () => void;
	handleChangeInput?: (in1: any, in2: any) => void;
	enableReCaptcha?: boolean;
	generateOtpCode?: (in1?: any) => void;
	handleReCaptcha?: (token?: any) => void;
	setSignUpTab?: (in1: string) => void;
	setWillVerifyOtpState?: (in1: boolean) => void;
	setOtpState?: (in1: string) => void;
}

export interface PhoneInputParams {
	data?: any;
	handleData?: any;
	defaultValue?: any;
	defaultCode?: number | null;
	forwardRef?: any;
	textInputProps?: TextInputProps;
	boxStyle?: any;
	inputStyle?: any;
	textStyle?: any;
	noDropIcon?: boolean;
	flagStyle?: any;
	isDisabled?: any;
	isStartValidation?: any;
	changeCountry?: any;
}

export interface LanguageSelectorParams {
	languagesState?: any;
	currentLanguage?: string;
	handleChangeLanguage?: any;
	iconColor?: any;
	pickerStyle?: any;
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
	franchiseId?: any;
	businessId?: any;
	isGuestUser?: any;
	handleUpdateBusinessList?: any;
	priceLevelSelected?: any;
	handleChangePriceLevel?: any;
	businessTypeSelected?: any;
	logosLayout?: boolean;
}
export interface HighestRatedBusinessesParams {
	businessesList: { businesses: Array<any>, loading: boolean, error: null | string };
	onBusinessClick?: void;
	navigation?: any;
	isLoading?: boolean;
	getBusinesses: (newFetch: boolean) => void,
	favoriteIds?: any,
	setFavoriteIds?: any,
	handleUpdateBusinessList?: any
}
export interface BusinessTypeFilterParams {
	businessTypes?: Array<any>;
	handleChangeBusinessType: any;
	currentTypeSelected?: string | null;
	defaultBusinessType?: string | null;
	images?: any
	typesState?: any
	setBusinessTypes?: any,
	isAppoint?: boolean | undefined
}
export interface BusinessControllerParams {
	key?: string | number;
	business?: any;
	handleCustomClick?: any;
	orderType?: any;
	handleClick?: any;
	isBusinessOpen?: boolean;
	businessWillCloseSoonMinutes?: number
	isBusinessClose?: number,
	navigation?: any,
	style?: ViewStyle,
	businessHeader?: string,
	businessFeatured?: boolean,
	businessLogo?: string,
	businessReviews?: any,
	businessDeliveryPrice?: number,
	businessDeliveryTime?: string,
	businessPickupTime?: string,
	businessDistance?: number,
	favoriteIds?: number[],
	handleFavoriteBusiness?: any,
	setFavoriteIds?: any;
	handleUpdateBusinessList?: any;
	enableIntersection?: boolean;
	handleCustomUpdate?: (businessId: number, changes: any) => {};
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
	handleSearchRedirect: any;
	errorQuantityProducts?: boolean;
	header?: any;
	logo?: any;
	productModal?: any;
	alertState?: { open: boolean, content: any[] };
	setAlertState?: any;
	multiRemoveProducts?: (in1: any, in2: any) => {};
	getNextProducts?: () => {};
	handleChangeCategory: (value: any) => {};
	setProductLogin?: () => {};
	updateProductModal?: (value: any) => {};
	handleUpdateProducts?: any;
	professionalSelected?: any;
	handleChangeProfessionalSelected?: any;
}
export interface BusinessBasicInformationParams {
	navigation?: any;
	businessState?: any;
	openBusinessInformation?: any;
	isBusinessInfoShow?: boolean;
	header?: any;
	logo?: any;
	isPreOrder?: boolean;
}
export interface BusinessProductsCategoriesParams {
	categories: Array<any>;
	// handlerClickCategory: any;
	onClickCategory: any;
	openBusinessInformation: any;
	categorySelected: any;
	featured: boolean;
	loading?: any;
	scrollViewRef?: any;
	productListLayout?: any;
	categoriesLayout?: any;
	selectedCategoryId?: any;
	lazyLoadProductsRecommended?: any;
	setSelectedCategoryId?: any
	setCategoryClicked?: any
}
export interface BusinessProductsListParams {
	errors?: any;
	businessId?: number;
	category?: any;
	categories: Array<any>;
	categoryState?: any;
	onProductClick?: any;
	handleSearchRedirect?: () => {};
	featured?: any;
	searchValue?: any;
	handleClearSearch?: (value: any) => {};
	isBusinessLoading?: any,
	errorQuantityProducts?: boolean,
	handleCancelSearch?: () => void,
	categoriesLayout?: any,
	setCategoriesLayout?: any,
	currentCart?: any,
	setSubcategoriesSelected?: any,
	subcategoriesSelected?: any,
	onClickCategory?: any,
	lazyLoadProductsRecommended?: boolean,
	isFiltMode?: boolean,
	handleUpdateProducts?: any,
	navigation?: any;
	previouslyProducts?: any;
}
export interface SingleProductCardParams {
	businessId: any;
	product: any;
	isSoldOut: boolean;
	onProductClick: any;
	productAddedToCartLength: number;
	style?: ViewStyle;
	categoryState?: any;
	handleFavoriteProduct?: any;
	handleUpdateProducts?: any;
	enableIntersection?: boolean;
	navigation?: any;
	isPreviously?: any;
	isProductId?: any;
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
	franchiseId?: any,
	activeOrders?: boolean,
	pastOrders?: boolean,
	pagination?: any,
	titleContent?: string,
	customArray?: Array<any>,
	loadMoreOrders?: any,
	onNavigationRedirect?: any,
	orderStatus?: any,
	navigation?: any,
	loadOrders?: any,
	setOrderList?: any,
	preOrders?: boolean,
	reorderState?: any,
	handleReorder?: (orderId: number) => {},
	setOrdersLength?: ({ activeOrdersLength, previousOrdersLength }: { activeOrdersLength: number, previousOrdersLength: number }) => void,
	ordersLength: { activeOrdersLength: number, previousOrdersLength: number },
	setSelectedOrderId?: any,
	setOpenMessges?: any,
	loadMoreStatus?: boolean,
	refreshOrders?: boolean,
	setRefreshOrders?: (value: boolean) => void,
	handleUpdateOrderList?: (orderId: number, changes: any) => {},
	handleUpdateProducts?: (productId: number, changes: any) => {},
	handleUpdateBusinesses?: (businessId: number, changes: any) => {},
	isBusiness?: boolean,
	isProducts?: boolean,
	businessOrderIds?: any,
	products?: any,
	businessesSearchList?: any,
	hideOrders?: boolean,
	BusinessControllerSkeletons?: any,
	businessPaginationProps?: any,
	businesses?: any
}
export interface ActiveOrdersParams {
	orders?: any,
	pagination?: any,
	getOrderStatus?: any,
	reorderLoading?: boolean,
	customArray?: Array<any>
	setScreen?: any,
	screen?: any,
	loadMoreOrders?: () => {},
	onNavigationRedirect?: (route: string, params?: any) => {},
	isMessageView?: boolean,
	handleClickOrder?: any,
	handleUpdateOrderList?: (orderId: number, changes: any) => {}
}
export interface PreviousOrdersParams {
	orders?: any,
	pagination?: any,
	getOrderStatus?: any,
	orderID?: number
	reorderLoading?: boolean,
	loadMoreOrders?: () => {},
	handleReorder?: (orderId: number) => {},
	onNavigationRedirect?: (route: string, params?: any) => {}
	handleUpdateOrderList?: (orderId: number, changes: any) => {}
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
	goToBusinessList?: boolean,
	onNavigationRedirect?: any,
	reorderState?: any,
	handleReorder?: any,
}
export interface ProductItemAccordionParams {
	key?: any;
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
	order?: { id: number, business_id: number, logo: string, driver: any, products: Array<any>, review: any, user_review: any };
	stars?: any;
	defaultStar?: number;
	handleChangeInput?: any;
	handleChangeRating?: any;
	handleSendReview?: any;
	formState?: any;
	navigation?: any;
	setIsReviewed?: (isReviewed: boolean) => void;
	handleReviewState?: any;
	setStars?: any;
	onNavigationRedirect?: any;
}
export interface ReviewProductParams {
	navigation?: any,
	onNavigationRedirect?: any,
	order?: { orderId: number, business_id: number, logo: string, driver: any, products: Array<any>, review: any, user_review: any },
	formState?: any,
	handleChangeFormState?: any,
	handleSendProductReview?: any;
}
export interface SingleProductReviewParams {
	product: any,
	formState?: any,
	handleChangeFormState?: any,
}
export interface ReviewDriverParams {
	navigation?: any,
	onNavigationRedirect?: any,
	order?: { orderId: number, business_id: number, logo: string, driver: any, products: Array<any>, review: any, user_review: any },
	formState?: any,
	setIsDriverReviewed?: (isReviewed: boolean) => {},
	dirverReviews?: any,
	setDriverReviews?: any,
	handleSendDriverReview?: any;
}
export interface MessagesParams {
	type?: string,
	order?: any,
	orderId?: number,
	messages?: any,
	message?: string,
	image?: string,
	messagesToShow?: any,
	sendMessage?: any,
	handleSend?: () => {},
	setImage?: (image: string | null) => {},
	setMessage?: (comment: string) => {},
	setMessages?: (image: any | null) => {},
	readMessages?: () => {},
	onClose?: () => void,
	isMeesageListing?: boolean,
	setCanRead?: any,
	business?: boolean,
	driver?: boolean,
	onMessages?: any
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
	handleEmpty?: any;
	iosBottom?: number
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
export interface BusinessPreorderParams {
	navigation?: any;
	datesList: Array<any>;
	hoursList: Array<any>;
	dateSelected?: any;
	timeSelected?: any;
	isAsap?: boolean;
	handleAsap?: () => {};
	handleChangeDate: (value: any) => {};
	handleChangeTime: (value: any) => {};
	goToBack: any;
	business: any;
	handleBusinessClick: (value: any) => {};
}
export interface BusinessMenuListParams {
	menu: any;
	businessMenuList: any;
	setMenu: (value: any) => {};
}
export interface OrderTypeSelectParams {
	navigation?: any;
	handleChangeOrderType: (value: any) => {};
	typeSelected?: number;
	defaultValue?: number;
	configTypes?: Array<any>;
	orderTypes: Array<any>;
	setOrderTypeValue?: (value: number) => any,
	isChewLayout?: boolean;
	chewOrderTypes?: any;
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
	cart?: any;
	handleCloseUpsellingPage: () => void;
	isFromCart?: boolean;
	isPage?: boolean;
	products?: any;
	onNavigationRedirect?: any;
	onGoBack?: any;
}

export interface GoogleMapsParams {
	location: { lat: number, lng: number }
	handleChangeAddressMap?: (address: any, details: any) => void
	setErrors?: (error: string) => void
	maxLimitLocation?: number
	readOnly?: boolean
	markerTitle?: string,
	saveLocation?: boolean,
	isSetInputs?: boolean,
	locations?: Array<any>,
	setSaveLocation?: (val: boolean) => void,
	handleToggleMap?: () => void
}

export interface HelpParams {
	navigation: any;
	businessId?: any;
}

export interface LastOrdersParams {
	orderList?: any,
	onRedirect?: any,
}

export interface HelpOrderParams {
	navigation: any;
}

export interface HelpGuideParams {
	navigation: any;
}

export interface HelpAccountAndPaymentParams {
	navigation: any;
}

export interface MessageListingParams {
	navigation: any;
	franchiseId?: any;
}

export interface BusinessSearchParams {
	navigation: any,
	businessesSearchList: any,
	onBusinessClick: any,
	handleChangeTermValue: (term: string) => void,
	termValue: string,
	paginationProps: any,
	handleSearchbusinessAndProducts: (newFetch?: boolean) => void,
	handleChangeFilters: (prop: string, value: any) => void,
	filters: any,
	businessTypes: Array<number>,
	setFilters: (filters: any) => void,
	lazySearch?: boolean,
	brandList?: any;
	onNavigationRedirect?: any,
	handleUpdateProducts: any,
	handleUpdateBusinessList?: any;
}

export interface NoNetworkParams {
	image?: any,
}

export interface PlaceSpotParams {
	isCheckout?: any,
	isInputMode?: any,
	cart?: any,
	spotNumberDefault?: any,
	vehicleDefault?: any,
	spotNumber?: any,
    setSpotNumber?: any,
	orderTypes?: any,
	placesState?: any,
	handleChangePlace? : any,
	spotState?: any,
	vehicle?: any,
	setVehicle?: any,
	handleChangeSpot?: any
}

export interface PromotionParams {
	navigation: any,
	offersState: any,
	handleSearchValue: any,
	searchValue: string,
	offerSelected: any,
	setOfferSelected: any,
	loadOffers: any
}
export interface SessionsParams {
	navigation: any,
	sessionsList: any,
	actionState: any,
	handleDeleteSession: any,
	handleDeleteAllSessions: any
}

export interface otpParams {
	willVerifyOtpState: boolean,
	setWillVerifyOtpState: (val: boolean) => void,
	onSubmit: () => void,
	handleLoginOtp: (code: string) => void,
	setAlertState: any;
	pinCount: number;
}

export interface FavoriteParams {
	favoriteList: any,
	handleUpdateFavoriteList: (id: number, changes: any) => {},
	pagination: any,
	getFavoriteList: (value: number) => {},
	navigation?: any,
	onNavigationRedirect?: (route: string, params?: any) => {},
	reorderState?: any,
	handleReorder?: (orderId: number) => {},
	isOrder?: boolean,
	isProduct?: boolean,
	isBusiness?: boolean
}

export interface SingleOrderCardParams {
	order: any,
	reorderLoading: any,
	handleReorder?: (value: any) => {},
	getOrderStatus: any,
	handleFavoriteOrder?: (value: boolean) => {},
	onNavigationRedirect?: (route: string, params?: any) => {},
	pastOrders: any,
	isMessageView?: any,
	handleClickOrder: (value: any) => {},
	handleRemoveCart: () => {},
	cartState: any
}

export interface PreviousBusinessOrderedParams {
	navigation?: any,
	businessesList?: any,
	setBusinessLoading?: any,
	businessId?: number,
	onNavigationRedirect?: any,
	isBusinessesSearchList?: any,
	businessLoading?: boolean,
	businesses?: any
  handleUpdateBusinesses?: (businessId: number, changes: any) => {},
}

export interface ServiceFormParams {
	navigation?: any,
	professionalSelected: any,
	product: any,
	handleSave: (value?: any) => {}
	productCart?: any
	isSoldOut: boolean,
	maxProductQuantity: any,
	businessSlug?: string,
	onClose: any,
	professionalList: any
}

export interface ProfessionalFilterParams {
	professionals?: any,
	professionalSelected?: any,
	handleChangeProfessionalSelected: any
}

export interface ProfessionalProfileParams {
	professional: any,
	handleChangeProfessionalSelected: any,
	onClose: any
}

export interface OrderItAgainParams {
	onProductClick: any,
	productList: any,
	businessId: any,
	categoryState: any,
	currentCart: any,
	handleUpdateProducts: any,
	navigation: any,
	searchValue?: string
}

export interface PreviousProductsOrderedParams {
	products?: any,
	isProductId?: boolean
	onProductClick?: any,
	isBusinessesSearchList?: boolean
	handleUpdateProducts?: any
}
