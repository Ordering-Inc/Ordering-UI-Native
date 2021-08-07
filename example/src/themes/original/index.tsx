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

import { Toast } from './src/components/shared/OToast';

import { Container } from './src/layouts/Container';

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
	  arrow_down: require('./src/assets/icons/arrow_down.png'),
	  map: require('./src/assets/icons/map.png'),
	  marker: require('./src/assets/images/marker.png'),
	  email: require('./src/assets/icons/ic_email.png'),
	  lock: require('./src/assets/icons/ic_lock.png'),
	  camera: require('./src/assets/icons/ic_camera.png'),
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
	  google: require('./src/assets/icons/ic_google.png'),
	  pin: require('./src/assets/icons/ic_location_pin.png'),
	  tag_home: require('./src/assets/icons/tag_home.png'),
	  tag_building: require('./src/assets/icons/tag_building.png'),
	  tag_heart: require('./src/assets/icons/tag_heart.png'),
	  tag_plus: require('./src/assets/icons/tag_plus.png'),
	  option_normal: require('./src/assets/icons/option_normal.png'),
	  option_checked: require('./src/assets/icons/option_checked.png'),
	  chevron_right: require('./src/assets/icons/chevron-right.png'),
	  chevron_left: require('./src/assets/icons/chevron-left.png'),
	  clock: require('./src/assets/icons/ic_clock.png'),
	  pencil: require('./src/assets/icons/ic_pencil.png'),
	  search: require('./src/assets/icons/ic_search.png'),
	  star: require('./src/assets/icons/ic_star.png'),
	  info: require('./src/assets/icons/ic_info.png'),
	  close: require('./src/assets/icons/ic_close.png'),
	  minus: require('./src/assets/icons/ic_minus_circle.png'),
	  plus: require('./src/assets/icons/ic_plus_circle.png'),
	  radio_nor: require('./src/assets/icons/ic_radio_nor.png'),
	  radio_act: require('./src/assets/icons/ic_radio_act.png'),
	  check_act: require('./src/assets/icons/ic_check_act.png'),
	  check_nor: require('./src/assets/icons/ic_check_nor.png'),
	  half_l: require('./src/assets/icons/ic_half_l.png'),
	  half_f: require('./src/assets/icons/ic_full.png'),
	  half_r: require('./src/assets/icons/ic_half_r.png'),
	  drop_up: require('./src/assets/icons/ic_drop_up.png'),
	  drop_down: require('./src/assets/icons/ic_drop_down.png'),
	  logout: require('./src/assets/icons/ic_logout.png'),
	  language: require('./src/assets/icons/ic_language.png'),
	  help: require('./src/assets/icons/ic_help.png'),
	  enter: require('./src/assets/icons/ic_enter.png'),
	  attach: require('./src/assets/icons/ic_attach.png'),
	  image: require('./src/assets/icons/ic_image.png'),
	},
	backgrounds: {
	  business_list_header: require('./src/assets/images/business_list_banner.jpg'),
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
	},
	tabs: {
	  explorer: require('./src/assets/icons/tab_explor.png'),
	  promotions: require('./src/assets/icons/tab_promotions.png'),
	  my_carts: require('./src/assets/icons/tab_mycarts.png'),
	  orders: require('./src/assets/icons/tab_orders.png'),
	  profile: require('./src/assets/icons/tab_profile.png'),
	},
	categories: {
	  all: require('./src/assets/images/categories/category-all.png'),
	},
	dummies: {
	  product: require('./src/assets/images/dummies/product.png'),
	  businessLogo: require('./src/assets/images/dummies/store.png'),
	  driverPhoto:
		 'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png',
	  customerPhoto:
		 'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
	},
};

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
	
	// theme
	theme,

	Toast,
	// layout
	Container,
}