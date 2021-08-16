import { AddressForm } from './src/components/AddressForm';
import { AddressDetails } from './src/components/AddressDetails';
import { Home } from './src/components/Home';
import { LoginForm } from './src/components/LoginForm';
import { SignupForm } from './src/components/SignupForm';
import { ActiveOrders } from './src/components/ActiveOrders';
import { AddressList } from './src/components/AddressList';
import { AppleLogin } from './src/components/AppleLogin';
import { BusinessesListing } from './src/components/BusinessesListing';
import { BusinessProductsListing } from './src/components/BusinessProductsListing';
import { CartContent } from './src/components/CartContent';
import { Checkout } from './src/components/Checkout';
import { ForgotPasswordForm } from './src/components/ForgotPasswordForm';
import { MomentOption } from './src/components/MomentOption';
import { OrdersOption } from './src/components/OrdersOption';
import { OrderDetails } from './src/components/OrderDetails';
import { UserProfileForm } from './src/components/UserProfileForm';
import { ReviewOrder } from './src/components/ReviewOrder';
import { UserProfile } from './src/components/UserProfile';
import { NotFoundSource } from './src/components/NotFoundSource';

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
} from './src/components/shared';

import { Container } from './src/layouts/Container';
import { SafeAreaContainer } from './src/layouts/SafeAreaContainer';
import {
	_retrieveStoreData,
	_setStoreData,
	_removeStoreData,
	_clearStoreData
} from './src/providers/StoreUtil';

export {
	AddressForm,
	AddressDetails,
	Home as HomeView,
	SignupForm,
	LoginForm,
	ActiveOrders,
	AddressList,
	AppleLogin,
	BusinessesListing,
	BusinessProductsListing,
	CartContent,
	Checkout,
	ForgotPasswordForm,
	MomentOption,
	OrdersOption,
	OrderDetails,
	UserProfileForm,
	ReviewOrder,
	UserProfile,
	NotFoundSource,

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

	// layout
	Container,
	SafeAreaContainer,

	// utils
	_retrieveStoreData,
	_setStoreData,
	_removeStoreData,
	_clearStoreData
}