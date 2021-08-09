import { Home } from './src/components/Home';
import { LoginForm } from './src/components/LoginForm';
import { SignupForm } from './src/components/SignupForm';
import { AddressForm } from './src/components/AddressForm';
import { AddressList } from './src/components/AddressList';
import { ForgotPasswordForm } from './src/components/ForgotPasswordForm';
import { BusinessesListing } from './src/components/BusinessesListing';
import { BusinessProductsListing } from './src/components/BusinessProductsListing';
import { SearchList } from './src/components/SearchList';
import { Checkout } from './src/components/Checkout';
import { MomentOption } from './src/components/MomentOption';
import { OrderDetails } from './src/components/OrderDetails';
import { CartSingle } from './src/components/CartSingle';
import { CartContent } from './src/components/CartContent';
import { OrdersOption } from './src/components/OrdersOption';
import { UserProfileForm } from './src/components/UserProfileForm';
import { ReviewOrder } from './src/components/ReviewOrder';
import { Container } from './src/layouts/Container';
import { SafeAreaContainer } from './src/layouts/SafeAreaContainer';
import { _setStoreData, _retrieveStoreData, _removeStoreData } from './src/providers/StoreUtil';
import {
	OAlert,
	OBottomPopup,
	OButton,
	ODropDown,
	OIcon,
	OIconButton,
	OInput,
	OModal,
	OText,
	OToast
} from './src/components/shared';

import theme from './src/theme.json';

theme.images = {
	logos: {
		logotype: require('./src/assets/images/logotype.png'),
		logotypeInvert: require('./src/assets/images/logotype-invert.png'),
	},
	general: {
		homeHero: require('./src/assets/images/home-hero.png'),
		notFound: require('./src/assets/images/not-found.png'),
		emptyActiveOrders: require('./src/assets/images/empty-active-orders.png'),
		emptyPastOrders: require('./src/assets/images/empty-past-orders.png'),
		menu: require('./src/assets/icons/menu.png'),
		lunch: require('./src/assets/icons/lunch.png'),
		arrow_up: require('./src/assets/icons/arrow_up.png'),
		arrow_left: require('./src/assets/icons/chevron-left.png'),
		map: require('./src/assets/icons/map.png'),
		marker: require('./src/assets/images/marker.png'),
		email: require('./src/assets/icons/ic_email.png'),
		lock: require('./src/assets/icons/ic_lock.png'),
		camera: require('./src/assets/icons/camera.png'),
		support: require('./src/assets/icons/help.png'),
		trash: require('./src/assets/icons/trash.png'),
		phone: require('./src/assets/icons/phone.png'),
		mail: require('./src/assets/icons/mail.png'),
		chat: require('./src/assets/icons/ic_chat.png'),
		user: require('./src/assets/icons/menu-user.png'),
		menulogout: require('./src/assets/icons/menu-logout.png'),
		cash: require('./src/assets/icons/cash.png'),
		carddelivery: require('./src/assets/icons/card-delivery.png'),
		paypal: require('./src/assets/icons/paypal.png'),
		stripe: require('./src/assets/icons/stripe.png'),
		stripecc: require('./src/assets/icons/cc-stripe.png'),
		stripes: require('./src/assets/icons/stripe-s.png'),
		stripesb: require('./src/assets/icons/stripe-sb.png'),
		creditCard: require('./src/assets/icons/credit-card.png'),
		facebook: require('./src/assets/icons/ic_facebook.png'),
		apple: require('./src/assets/icons/ic_apple.png'),
		google: require('./src/assets/icons/ic_google.png'),
		pin_line: require('./src/assets/icons/ic_pin_outline.png'),
		tag_home: require('./src/assets/icons/tag_home.png'),
		tag_favorite: require('./src/assets/icons/tag_favorite.png'),
		tag_office: require('./src/assets/icons/tag_office.png'),
		tag_other: require('./src/assets/icons/tag_other.png'),
		drop_down: require('./src/assets/icons/chevron-down.png'),
		tab_home: require('./src/assets/icons/tab_home.png'),
		tab_explore: require('./src/assets/icons/tab_explore.png'),
		tab_promotion: require('./src/assets/icons/tab_promotion.png'),
		tab_orders: require('./src/assets/icons/tab_orders.png'),
		tab_profile: require('./src/assets/icons/tab_profile.png'),
		filter: require('./src/assets/icons/ic_filter.png'),
		pencil: require('./src/assets/icons/ic_pencil.png'),
		info: require('./src/assets/icons/ic_info.png'),
		plus_circle: require('./src/assets/icons/ic_plus_circle.png'),
		radio_act: require('./src/assets/icons/ic_radio_act.png'),
		radio_nor: require('./src/assets/icons/ic_radio_nor.png'),
		check_act: require('./src/assets/icons/ic_check_act.png'),
		check_nor: require('./src/assets/icons/ic_check_nor.png'),
		half_full: require('./src/assets/icons/ic_full.png'),
		half_left: require('./src/assets/icons/ic_half_l.png'),
		half_right: require('./src/assets/icons/ic_half_r.png'),
		minus: require('./src/assets/icons/ic_minus.png'),
		plus: require('./src/assets/icons/ic_plus.png'),
		edit: require('./src/assets/icons/ic_edit.png'),
		clock_history: require('./src/assets/icons/clock-history.png'),
		shop_bag: require('./src/assets/icons/shop-bag.png'),
		bicycle: require('./src/assets/icons/bicycle.png'),
		card: require('./src/assets/icons/card.png'),
		close: require('./src/assets/icons/close.png'),
		clock: require('./src/assets/icons/ic_clock.png'),
		share: require('./src/assets/icons/ic_share.png'),
		call: require('./src/assets/icons/ic_call.png'),
	},
	order: {
		status0: require('./src/assets/images/status-0.png'),
		status1: require('./src/assets/images/status-1.png'),
		status2: require('./src/assets/images/status-2.png'),
		status3: require('./src/assets/images/status-3.png'),
		status4: require('./src/assets/images/status-4.png'),
		status5: require('./src/assets/images/status-5.png'),
		status6: require('./src/assets/images/status-6.png'),
		status7: require('./src/assets/images/status-7.png'),
		status8: require('./src/assets/images/status-8.png'),
		status9: require('./src/assets/images/status-9.png'),
		status10: require('./src/assets/images/status-10.png'),
		status11: require('./src/assets/images/status-11.png'),
		status12: require('./src/assets/images/status-12.png'),
		status13: require('./src/assets/images/status-13.png'),
		status14: require('./src/assets/images/status-14.png'),
		status15: require('./src/assets/images/status-15.png'),
		status16: require('./src/assets/images/status-16.png'),
		status17: require('./src/assets/images/status-17.png'),
		status18: require('./src/assets/images/status-18.png'),
		status19: require('./src/assets/images/status-19.png'),
		status20: require('./src/assets/images/status-20.png'),
		status21: require('./src/assets/images/status-21.png'),
	},
	categories: {
		all: require('./src/assets/images/categories/category-all.png')
	},
	dummies: {
		product: require('./src/assets/images/dummies/product.png'),
		businessLogo: require('./src/assets/images/dummies/store.png'),
		driverPhoto: 'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png',
		customerPhoto: 'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png'
	}
}

const InstaCartTheme = theme;

export {
	InstaCartTheme,
	Home as HomePage,
	LoginForm,
	SignupForm,
	AddressForm,
	AddressList,
	ForgotPasswordForm,
	BusinessesListing,
	BusinessProductsListing,
	SearchList,
	Checkout,
	MomentOption,
	OrderDetails,
	CartSingle,
	CartContent,
	OrdersOption,
	UserProfileForm,
	ReviewOrder,

	OAlert,
	OBottomPopup,
	OButton,
	ODropDown,
	OIcon,
	OIconButton,
	OInput,
	OModal,
	OText,
	OToast,
	
	// theme
	theme,

	// layout
	Container,
	SafeAreaContainer,

	// provider
	_setStoreData,
	_retrieveStoreData,
	_removeStoreData,

}
