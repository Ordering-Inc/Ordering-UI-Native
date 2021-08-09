import { Home as HomePage } from "./src/components/Home";
import { AddressForm } from "./src/components/AddressForm";
import { AddressList } from "./src/components/AddressList";
import { BusinessesListing } from "./src/components/BusinessesListing";
import { BusinessProductsList } from "./src/components/BusinessProductsList";
import { CartContent } from "./src/components/CartContent";
import { Checkout } from "./src/components/Checkout";
import { ForgotPasswordForm } from "./src/components/ForgotPasswordForm";
import { LoginForm } from "./src/components/LoginForm";
import { MomentOption } from "./src/components/MomentOption";
import { OrdersOption } from "./src/components/OrdersOption";
import { OrderDetails } from "./src/components/OrderDetails";
import { UserProfileForm } from "./src/components/UserProfileForm";
import { ReviewOrder } from "./src/components/ReviewOrder";
import { SignupForm } from "./src/components/SignupForm";
import { BusinessProductsListing } from "./src/components/BusinessProductsListing";

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
		arrow_left: require('./src/assets/icons/arrow_left.png'),
		map: require('./src/assets/icons/map.png'),
		marker: require('./src/assets/images/marker.png'),
		email: require('./src/assets/icons/ic_email.png'),
		lock: require('./src/assets/icons/ic_lock.png'),
		camera: require('./src/assets/icons/camera.png'),
		support: require('./src/assets/icons/help.png'),
		trash: require('./src/assets/icons/ic_trash.png'),
		phone: require('./src/assets/icons/phone.png'),
		mail: require('./src/assets/icons/mail.png'),
		chat: require('./src/assets/icons/chat.png'),
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
		close: require('./src/assets/icons/close.png'),
		facebook: require('./src/assets/icons/facebook.png'),
		google: require('./src/assets/icons/google.png'),
		apple: require('./src/assets/icons/apple.png'),
		search: require('./src/assets/icons/ic_search.png'),
		tag_home: require('./src/assets/icons/tag_home.png'),
		tag_office: require('./src/assets/icons/tag_office.png'),
		tag_favorite: require('./src/assets/icons/tag_favorite.png'),
		tag_other: require('./src/assets/icons/tag_other.png'),
		radio_act: require('./src/assets/icons/ic_radio_act.png'),
		radio_nor: require('./src/assets/icons/ic_radio_nor.png'),
		check_act: require('./src/assets/icons/ic_check_act.png'),
		check_nor: require('./src/assets/icons/ic_check_nor.png'),
		clock: require('./src/assets/icons/ic_clock.png'),
		chevron_right: require('./src/assets/icons/chevron-right.png'),
		tab_home: require('./src/assets/icons/tab_home.png'),
		tab_pickup: require('./src/assets/icons/tab_pickup.png'),
		tab_orders: require('./src/assets/icons/tab_orders.png'),
		tab_search: require('./src/assets/icons/tab_search.png'),
		tab_profile: require('./src/assets/icons/tab_profile.png'),
		share: require('./src/assets/icons/ic_upload.png'),
		star: require('./src/assets/icons/ic_star.png'),
		pencil: require('./src/assets/icons/ic_pencil.png'),
		plus: require('./src/assets/icons/ic_plus_circle.png'),
		minus: require('./src/assets/icons/ic_minus_circle.png'),
		pencil_line: require('./src/assets/icons/ic_pencil_line.png'),
		share_fill: require('./src/assets/icons/ic_share_fill.png'),
		home: require('./src/assets/icons/ic_home.png'),
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


export {
	HomePage,
	AddressForm,
	AddressList,
	BusinessesListing,
	BusinessProductsList,
	CartContent,
	Checkout,
	ForgotPasswordForm,
	LoginForm,
	MomentOption,
	OrdersOption,
	OrderDetails,
	UserProfileForm,
	ReviewOrder,
	SignupForm,
	BusinessProductsListing,

	theme
}