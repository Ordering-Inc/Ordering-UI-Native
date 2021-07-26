import { Home } from './components/Home';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { AddressForm } from './components/AddressForm';
import { AddressList } from './components/AddressList';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { BusinessesListing } from './components/BusinessesListing';
import { BusinessProductsListing } from './components/BusinessProductsListing';
import { SearchList } from './components/SearchList';

import theme from './theme.json';

theme.images = {
	logos: {
		logotype: require('./assets/images/logotype.png'),
		logotypeInvert: require('./assets/images/logotype-invert.png'),
	},
	general: {
		homeHero: require('./assets/images/home-hero.png'),
		notFound: require('./assets/images/not-found.png'),
		emptyActiveOrders: require('./assets/images/empty-active-orders.png'),
		emptyPastOrders: require('./assets/images/empty-past-orders.png'),
		menu: require('./assets/icons/menu.png'),
		lunch: require('./assets/icons/lunch.png'),
		arrow_up: require('./assets/icons/arrow_up.png'),
		arrow_left: require('./assets/icons/chevron-left.png'),
		map: require('./assets/icons/map.png'),
		marker: require('./assets/images/marker.png'),
		email: require('./assets/icons/ic_email.png'),
		lock: require('./assets/icons/ic_lock.png'),
		camera: require('./assets/icons/camera.png'),
		support: require('./assets/icons/help.png'),
		trash: require('./assets/icons/trash.png'),
		phone: require('./assets/icons/phone.png'),
		mail: require('./assets/icons/mail.png'),
		chat: require('./assets/icons/chat.png'),
		user: require('./assets/icons/menu-user.png'),
		menulogout: require('./assets/icons/menu-logout.png'),
		cash: require('./assets/icons/cash.png'),
		carddelivery: require('./assets/icons/card-delivery.png'),
		paypal: require('./assets/icons/paypal.png'),
		stripe: require('./assets/icons/stripe.png'),
		stripecc: require('./assets/icons/cc-stripe.png'),
		stripes: require('./assets/icons/stripe-s.png'),
		stripesb: require('./assets/icons/stripe-sb.png'),
		creditCard: require('./assets/icons/credit-card.png'),
		facebook: require('./assets/icons/ic_facebook.png'),
		apple: require('./assets/icons/ic_apple.png'),
		google: require('./assets/icons/ic_google.png'),
		pin_line: require('./assets/icons/ic_pin_outline.png'),
		tag_home: require('./assets/icons/tag_home.png'),
		tag_favorite: require('./assets/icons/tag_favorite.png'),
		tag_office: require('./assets/icons/tag_office.png'),
		tag_other: require('./assets/icons/tag_other.png'),
		drop_down: require('./assets/icons/chevron-down.png'),
		tab_home: require('./assets/icons/tab_home.png'),
		tab_explore: require('./assets/icons/tab_explore.png'),
		tab_promotion: require('./assets/icons/tab_promotion.png'),
		tab_orders: require('./assets/icons/tab_orders.png'),
		tab_profile: require('./assets/icons/tab_profile.png'),
		filter: require('./assets/icons/ic_filter.png'),
		pencil: require('./assets/icons/ic_pencil.png'),
		info: require('./assets/icons/ic_info.png'),
		plus_circle: require('./assets/icons/ic_plus_circle.png'),
		radio_act: require('./assets/icons/ic_radio_act.png'),
		radio_nor: require('./assets/icons/ic_radio_nor.png'),
		check_act: require('./assets/icons/ic_check_act.png'),
		check_nor: require('./assets/icons/ic_check_nor.png'),
		half_full: require('./assets/icons/ic_full.png'),
		half_left: require('./assets/icons/ic_half_l.png'),
		half_right: require('./assets/icons/ic_half_r.png'),
		minus: require('./assets/icons/ic_minus.png'),
		plus: require('./assets/icons/ic_plus.png'),
	},
	order: {
		status0: require('./assets/images/status-0.png'),
		status1: require('./assets/images/status-1.png'),
		status2: require('./assets/images/status-2.png'),
		status3: require('./assets/images/status-3.png'),
		status4: require('./assets/images/status-4.png'),
		status5: require('./assets/images/status-5.png'),
		status6: require('./assets/images/status-6.png'),
		status7: require('./assets/images/status-7.png'),
		status8: require('./assets/images/status-8.png'),
		status9: require('./assets/images/status-9.png'),
		status10: require('./assets/images/status-10.png'),
		status11: require('./assets/images/status-11.png'),
		status12: require('./assets/images/status-12.png'),
		status13: require('./assets/images/status-13.png'),
		status14: require('./assets/images/status-14.png'),
		status15: require('./assets/images/status-15.png'),
		status16: require('./assets/images/status-16.png'),
		status17: require('./assets/images/status-17.png'),
		status18: require('./assets/images/status-18.png'),
		status19: require('./assets/images/status-19.png'),
		status20: require('./assets/images/status-20.png'),
		status21: require('./assets/images/status-21.png'),
	},
	categories: {
		all: require('./assets/images/categories/category-all.png')
	},
	dummies: {
		product: require('./assets/images/dummies/product.png'),
		businessLogo: require('./assets/images/dummies/store.png'),
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
	SearchList
}
