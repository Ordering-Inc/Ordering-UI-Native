import { AddressForm } from './src/components/AddressForm';
import { AddressDetails } from './src/components/AddressDetails';
import { AnalyticsSegment } from './src/components/AnalyticsSegment';
import { Home } from './src/components/Home';
import { LoginForm } from './src/components/LoginForm';
import { SignupForm } from './src/components/SignupForm';
import { ActiveOrders } from './src/components/ActiveOrders';
import { AddressList } from './src/components/AddressList';
import { AppleLogin } from './src/components/AppleLogin';
import { BusinessBasicInformation } from './src/components/BusinessBasicInformation';
import { BusinessProductsCategories } from './src/components/BusinessProductsCategories';
import { BusinessProductsList } from './src/components/BusinessProductsList';
import { BusinessesListing } from './src/components/BusinessesListing';
import { BusinessProductsListing } from './src/components/BusinessProductsListing';
import { CartContent } from './src/components/CartContent';
import { BusinessCart } from './src/components/BusinessCart';
import { Checkout } from './src/components/Checkout';
import { FloatingButton } from './src/components/FloatingButton';
import { ForgotPasswordForm } from './src/components/ForgotPasswordForm';
import { MomentOption } from './src/components/MomentOption';
import { OrdersOption } from './src/components/OrdersOption';
import { OrderDetails } from './src/components/OrderDetails';
import { OrderProgress } from './src/components/OrderProgress';
import { BusinessPreorder } from './src/components/BusinessPreorder';
import { BusinessMenuList } from './src/components/BusinessMenuList';
import { UserProfileForm } from './src/components/UserProfileForm';
import { ReviewOrder } from './src/components/ReviewOrder';
import { ReviewProducts } from './src/components/ReviewProducts';
import { ReviewDriver } from './src/components/ReviewDriver';
import { UserProfile } from './src/components/UserProfile';
import { MessageListing } from './src/components/MessageListing';
import { Messages } from './src/components/Messages';
import { Help } from './src/components/Help';
import { HelpAccountAndPayment } from './src/components/HelpAccountAndPayment';
import { HelpGuide } from './src/components/HelpGuide';
import { HelpOrder } from './src/components/HelpOrder';
import { NetworkError } from './src/components/NetworkError';
import { NotFoundSource } from './src/components/NotFoundSource';
import { OrderTypeSelector } from './src/components/OrderTypeSelector';
import { SearchBar } from './src/components/SearchBar';
import { Wallets } from './src/components/Wallets';
import { PaymentOptionWallet } from './src/components/PaymentOptionWallet';
import { ProductForm } from './src/components/ProductForm';
import { UpsellingProducts } from './src/components/UpsellingProducts';
import { UserVerification } from './src/components/UserVerification';
import { LastOrders } from './src/components/LastOrders';
import  NavBar from './src/components/NavBar';
import { BusinessTypeFilter } from './src/components/BusinessTypeFilter';
import { BusinessController } from './src/components/BusinessController';
import { BusinessFeaturedController } from './src/components/BusinessFeaturedController';
import { HighestRatedBusinesses } from './src/components/HighestRatedBusinesses';
import { PaymentOptions } from './src/components/PaymentOptions';
import { DriverTips } from './src/components/DriverTips';
import { UserDetails } from './src/components/UserDetails';
import { OrderSummary } from './src/components/OrderSummary';
import { CartStoresListing } from './src/components/CartStoresListing';
import { PaymentOptionsWebView } from '../../src/components/PaymentOptionsWebView';
import { GoogleMap } from './src/components/GoogleMap';
import { SingleProductCard } from './src/components/SingleProductCard';
import { UpsellingRedirect } from './src/components/BusinessProductsListing/UpsellingRedirect';
import { ProductItemAccordion } from './src/components/ProductItemAccordion';
import { BusinessItemAccordion } from './src/components/BusinessItemAccordion';
import { CouponControl } from './src/components/CouponControl';
import { TaxInformation } from './src/components/TaxInformation';
import { PlaceSpot } from './src/components/PlaceSpot';
import { Cart } from './src/components/Cart';
import { LanguageSelector } from './src/components/LanguageSelector';
import { PhoneInputNumber } from './src/components/PhoneInputNumber'
import { FacebookLogin } from './src/components/FacebookLogin';
import { VerifyPhone } from './src/components/VerifyPhone';
import { GoogleLogin } from './src/components/GoogleLogin';
import { PreviousOrders } from './src/components/PreviousOrders';
import { PaymentOptionCash } from './src/components/PaymentOptionCash';
import { StripeElementsForm } from './src/components/StripeElementsForm';
import { StripeCardsList } from './src/components/StripeCardsList';
import { ProductIngredient } from './src/components/ProductIngredient';
import { ProductOption } from './src/components/ProductOption';
import { ProductOptionSubOption } from './src/components/ProductOptionSubOption';
import { SingleProductReview } from './src/components/SingleProductReview';
import { LogoutButton } from './src/components/LogoutButton';
import { UserFormDetailsUI } from './src/components/UserFormDetails';
import { WalletTransactionItem } from './src/components/WalletTransactionItem';

import { USER_TYPE, ORDER_TYPES } from './src/config/constants'

import { OSBill, OSTable, OSCoupon, OSTotal, OSRow } from './src/components/OrderSummary/styles';

import { FormInput, FormSide, ButtonsWrapper, LoginWith, OTab, OTabs } from './src/components/LoginForm/styles';
import { OSItem, OSItemContent, OSItemActions} from './src/components/PaymentOptionStripe/styles';

import Alert from './src/providers/AlertProvider'

import { 
	LoginParams,
	ProfileParams,
	AddressListParams,
	AddressFormParams,
	SignupParams,
	PhoneInputParams,
	LanguageSelectorParams,
	BusinessesListingParams,
	HighestRatedBusinessesParams,
	BusinessTypeFilterParams,
	BusinessControllerParams,
	BusinessProductsListingParams,
	BusinessBasicInformationParams,
	BusinessProductsCategoriesParams,
	BusinessProductsListParams,
	SingleProductCardParams,
	BusinessInformationParams,
	BusinessReviewsParams,
	SearchBarParams,
	NotFoundSourceParams,
	OrdersOptionParams,
	ActiveOrdersParams,
	PreviousOrdersParams,
	OrderDetailsParams,
	ReviewDriverParams
} from './src/types';

import { Toast } from './src/components/shared/OToast';
import {
	OText,
	OButton,
	OInput,
	ODropDown,
	OIcon,
	OIconText,
	OIconButton,
	OTextarea,
	OToggle,
	OKeyButton,
	OAlert,
	OModal,
	OBottomPopup,
  	HeaderTitle
} from './src/components/shared';

import { Container } from './src/layouts/Container';
import { SafeAreaContainer } from './src/layouts/SafeAreaContainer';
import { FloatingBottomContainer } from './src/layouts/FloatingBottomContainer';

import {
	_retrieveStoreData,
	_setStoreData,
	_removeStoreData,
	_clearStoreData
} from './src/providers/StoreUtil';

export {
	AddressForm,
	AddressDetails,
	AnalyticsSegment,
	Home as HomeView,
	SignupForm,
	LoginForm,
	ActiveOrders,
	AddressList,
	AppleLogin,
	BusinessesListing,
	BusinessProductsListing,
	CartContent,
	BusinessCart,
	Checkout,
	ForgotPasswordForm,
	MomentOption,
	OrdersOption,
	OrderDetails,
	OrderProgress,
	BusinessPreorder,
	UserProfileForm,
	ReviewOrder,
	ReviewProducts,
	ReviewDriver,
	BusinessMenuList,
	UserProfile,
	MessageListing,
  	Messages,
	Help,
	HelpAccountAndPayment,
	HelpGuide,
	HelpOrder,
	NetworkError,
	NotFoundSource,
	OrderTypeSelector,
	Wallets,
	PaymentOptionWallet,
	ProductForm,
	UpsellingProducts,
	UserVerification,
	BusinessBasicInformation,
	BusinessProductsCategories,
	BusinessProductsList,
	FloatingButton,
	SearchBar,
	LastOrders,
	BusinessTypeFilter,
	BusinessController,
	BusinessFeaturedController,
	HighestRatedBusinesses,
	PaymentOptions,
	DriverTips,
	UserDetails,
	OrderSummary,
	CartStoresListing,
	PaymentOptionsWebView,
	GoogleMap,
	SingleProductCard,
	UpsellingRedirect,
	ProductItemAccordion,
	BusinessItemAccordion,
	CouponControl,
	TaxInformation,
	PlaceSpot,
	Cart,
	LanguageSelector,
	PhoneInputNumber,
	FacebookLogin,
	VerifyPhone,
	GoogleLogin,
	PreviousOrders,
	PaymentOptionCash,
	StripeElementsForm,
	StripeCardsList,
	ProductIngredient,
	ProductOption,
	ProductOptionSubOption,
	SingleProductReview,
	LogoutButton,
	UserFormDetailsUI,
	WalletTransactionItem,

	ORDER_TYPES,
	USER_TYPE,

	OSBill,
	OSTable,
	OSCoupon,
	OSTotal,
	OSRow,

	FormInput,
	FormSide,
	ButtonsWrapper,
	LoginWith,
	OTab,
	OTabs,

	OSItem,
	OSItemContent,
	OSItemActions,

	Alert,

	//Types
	LoginParams,
	ProfileParams,
	AddressListParams,
	AddressFormParams,
	SignupParams,
	PhoneInputParams,
	LanguageSelectorParams,
	BusinessesListingParams,
	HighestRatedBusinessesParams,
	BusinessTypeFilterParams,
	BusinessControllerParams,
	BusinessProductsListingParams,
	BusinessBasicInformationParams,
	BusinessProductsCategoriesParams,
	BusinessProductsListParams,
	SingleProductCardParams,
	BusinessInformationParams,
	BusinessReviewsParams,
	SearchBarParams,
	NotFoundSourceParams,
	OrdersOptionParams,
	ActiveOrdersParams,
	PreviousOrdersParams,
	OrderDetailsParams,
	ReviewDriverParams,

	// OComponents
	Toast,
	OText,
	OButton,
	OInput,
	ODropDown,
	OIcon,
	OIconText,
	OIconButton,
	OTextarea,
	OToggle,
	OKeyButton,
	OAlert,
	OModal,
	OBottomPopup,
 	HeaderTitle,

	// layout
	Container,
	SafeAreaContainer,
	FloatingBottomContainer,
	NavBar,

	// utils
	_retrieveStoreData,
	_setStoreData,
	_removeStoreData,
	_clearStoreData
}
