import { Home as HomePage } from "./Home";
import { AddressForm } from "./AddressForm";
import { AddressList } from "./AddressList";
import { BusinessesListing } from "./BusinessesListing";
import { BusinessProductsList } from "./BusinessProductsList";
import { CartContent } from "./CartContent";
import { Checkout } from "./Checkout";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { LoginForm } from "./LoginForm";
import { MomentOption } from "./MomentOption";
import { OrdersOption } from "./OrdersOption";
import { OrderDetails } from "./OrderDetails";
import { UserProfileForm } from "./UserProfileForm";
import { ReviewOrder } from "./ReviewOrder";
import { SignupForm } from "./SignupForm";
import { BusinessProductsListing } from "./BusinessProductsListing";

import theme from '../theme.json';

theme.images = {
	logos: {
		logotype: require('../assets/images/logotype.png'),
		logotypeInvert: require('../assets/images/logotype-invert.png'),
	},
	general: {
		homeHero: require('../assets/images/home-hero.png'),
		notFound: require('../assets/images/not-found.png'),
		emptyActiveOrders: require('../assets/images/empty-active-orders.png'),
		emptyPastOrders: require('../assets/images/empty-past-orders.png'),
		menu: require('../assets/icons/menu.png'),
		lunch: require('../assets/icons/lunch.png'),
		arrow_up: require('../assets/icons/arrow_up.png'),
		arrow_left: require('../assets/icons/arrow_left.png'),
		map: require('../assets/icons/map.png'),
		marker: require('../assets/images/marker.png'),
		email: require('../assets/icons/ic_email.png'),
		lock: require('../assets/icons/ic_lock.png'),
		camera: require('../assets/icons/camera.png'),
		support: require('../assets/icons/help.png'),
		trash: require('../assets/icons/ic_trash.png'),
		phone: require('../assets/icons/phone.png'),
		mail: require('../assets/icons/mail.png'),
		chat: require('../assets/icons/chat.png'),
		user: require('../assets/icons/menu-user.png'),
		menulogout: require('../assets/icons/menu-logout.png'),
		cash: require('../assets/icons/cash.png'),
		carddelivery: require('../assets/icons/card-delivery.png'),
		paypal: require('../assets/icons/paypal.png'),
		stripe: require('../assets/icons/stripe.png'),
		stripecc: require('../assets/icons/cc-stripe.png'),
		stripes: require('../assets/icons/stripe-s.png'),
		stripesb: require('../assets/icons/stripe-sb.png'),
		creditCard: require('../assets/icons/credit-card.png'),
		close: require('../assets/icons/close.png'),
		facebook: require('../assets/icons/facebook.png'),
		google: require('../assets/icons/google.png'),
		apple: require('../assets/icons/apple.png'),
		search: require('../assets/icons/ic_search.png'),
		tag_home: require('../assets/icons/tag_home.png'),
		tag_office: require('../assets/icons/tag_office.png'),
		tag_favorite: require('../assets/icons/tag_favorite.png'),
		tag_other: require('../assets/icons/tag_other.png'),
		radio_act: require('../assets/icons/ic_radio_act.png'),
		radio_nor: require('../assets/icons/ic_radio_nor.png'),
		check_act: require('../assets/icons/ic_check_act.png'),
		check_nor: require('../assets/icons/ic_check_nor.png'),
		clock: require('../assets/icons/ic_clock.png'),
		chevron_right: require('../assets/icons/chevron-right.png'),
		tab_home: require('../assets/icons/tab_home.png'),
		tab_pickup: require('../assets/icons/tab_pickup.png'),
		tab_orders: require('../assets/icons/tab_orders.png'),
		tab_search: require('../assets/icons/tab_search.png'),
		tab_profile: require('../assets/icons/tab_profile.png'),
		share: require('../assets/icons/ic_upload.png'),
		star: require('../assets/icons/ic_star.png'),
		pencil: require('../assets/icons/ic_pencil.png'),
		plus: require('../assets/icons/ic_plus_circle.png'),
		minus: require('../assets/icons/ic_minus_circle.png'),
		pencil_line: require('../assets/icons/ic_pencil_line.png'),
		share_fill: require('../assets/icons/ic_share_fill.png'),
		home: require('../assets/icons/ic_home.png'),
	},
	order: {
		status0: require('../assets/images/status-0.png'),
		status1: require('../assets/images/status-1.png'),
		status2: require('../assets/images/status-2.png'),
		status3: require('../assets/images/status-3.png'),
		status4: require('../assets/images/status-4.png'),
		status5: require('../assets/images/status-5.png'),
		status6: require('../assets/images/status-6.png'),
		status7: require('../assets/images/status-7.png'),
		status8: require('../assets/images/status-8.png'),
		status9: require('../assets/images/status-9.png'),
		status10: require('../assets/images/status-10.png'),
		status11: require('../assets/images/status-11.png'),
		status12: require('../assets/images/status-12.png'),
		status13: require('../assets/images/status-13.png'),
		status14: require('../assets/images/status-14.png'),
		status15: require('../assets/images/status-15.png'),
		status16: require('../assets/images/status-16.png'),
		status17: require('../assets/images/status-17.png'),
		status18: require('../assets/images/status-18.png'),
		status19: require('../assets/images/status-19.png'),
		status20: require('../assets/images/status-20.png'),
		status21: require('../assets/images/status-21.png'),
	},
	categories: {
		all: require('../assets/images/categories/category-all.png')
	},
	dummies: {
		product: require('../assets/images/dummies/product.png'),
		businessLogo: require('../assets/images/dummies/store.png'),
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
	BusinessProductsListing
}