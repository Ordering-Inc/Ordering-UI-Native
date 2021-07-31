import { AddressForm } from './AddressForm';
import { AddressDetails } from './AddressDetails';
import { Home } from './Home';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ActiveOrders } from './ActiveOrders';
import { AddressList } from './AddressList';
import { AppleLogin } from './AppleLogin';
import { BusinessesListing } from './BusinessesListing';
import { BusinessProductsListing } from './BusinessProductsListing';
import { CartContent } from './CartContent';
import { Checkout } from './Checkout';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { MomentOption } from './MomentOption';
import { OrdersOption } from './OrdersOption';
import { OrderDetails } from './OrderDetails';
import { UserProfileForm } from './UserProfileForm';
import { ReviewOrder } from './ReviewOrder';
import { UserProfile } from './UserProfile';

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
	  arrow_down: require('../assets/icons/arrow_down.png'),
	  map: require('../assets/icons/map.png'),
	  marker: require('../assets/images/marker.png'),
	  email: require('../assets/icons/ic_email.png'),
	  lock: require('../assets/icons/ic_lock.png'),
	  camera: require('../assets/icons/ic_camera.png'),
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
	  google: require('../assets/icons/ic_google.png'),
	  pin: require('../assets/icons/ic_location_pin.png'),
	  tag_home: require('../assets/icons/tag_home.png'),
	  tag_building: require('../assets/icons/tag_building.png'),
	  tag_heart: require('../assets/icons/tag_heart.png'),
	  tag_plus: require('../assets/icons/tag_plus.png'),
	  option_normal: require('../assets/icons/option_normal.png'),
	  option_checked: require('../assets/icons/option_checked.png'),
	  chevron_right: require('../assets/icons/chevron-right.png'),
	  chevron_left: require('../assets/icons/chevron-left.png'),
	  clock: require('../assets/icons/ic_clock.png'),
	  pencil: require('../assets/icons/ic_pencil.png'),
	  search: require('../assets/icons/ic_search.png'),
	  star: require('../assets/icons/ic_star.png'),
	  info: require('../assets/icons/ic_info.png'),
	  close: require('../assets/icons/ic_close.png'),
	  minus: require('../assets/icons/ic_minus_circle.png'),
	  plus: require('../assets/icons/ic_plus_circle.png'),
	  radio_nor: require('../assets/icons/ic_radio_nor.png'),
	  radio_act: require('../assets/icons/ic_radio_act.png'),
	  check_act: require('../assets/icons/ic_check_act.png'),
	  check_nor: require('../assets/icons/ic_check_nor.png'),
	  half_l: require('../assets/icons/ic_half_l.png'),
	  half_f: require('../assets/icons/ic_full.png'),
	  half_r: require('../assets/icons/ic_half_r.png'),
	  drop_up: require('../assets/icons/ic_drop_up.png'),
	  drop_down: require('../assets/icons/ic_drop_down.png'),
	  logout: require('../assets/icons/ic_logout.png'),
	  language: require('../assets/icons/ic_language.png'),
	  help: require('../assets/icons/ic_help.png'),
	  enter: require('../assets/icons/ic_enter.png'),
	  attach: require('../assets/icons/ic_attach.png'),
	  image: require('../assets/icons/ic_image.png'),
	},
	backgrounds: {
	  business_list_header: require('../assets/images/business_list_banner.jpg'),
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
	},
	tabs: {
	  explorer: require('../assets/icons/tab_explor.png'),
	  promotions: require('../assets/icons/tab_promotions.png'),
	  my_carts: require('../assets/icons/tab_mycarts.png'),
	  orders: require('../assets/icons/tab_orders.png'),
	  profile: require('../assets/icons/tab_profile.png'),
	},
	categories: {
	  all: require('../assets/images/categories/category-all.png'),
	},
	dummies: {
	  product: require('../assets/images/dummies/product.png'),
	  businessLogo: require('../assets/images/dummies/store.png'),
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
	UserProfile
}
