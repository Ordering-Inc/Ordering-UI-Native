export const ORDER_STATUS = {
  PENDING: 0,
  COMPLETED: 1,
  REJECTED: 2,
  DRIVER_ARRIVED_BUSINESS: 3,
  READY_FOR_PICKUP: 4,
  REJECTED_BY_BUSINESS: 5,
  CANCELLED_BY_DRIVER: 6,
  ACCEPTED_BY_BUSINESS: 7,
  ACCEPTED_BY_DRIVER: 8,
  PICKUP_COMPLETED_BY_DRIVER: 9,
  PICKUP_FAILED_BY_DRIVER: 10,
  DELIVERY_COMPLETED_BY_DRIVER: 11,
  DELIVERY_FAILED_BY_DRIVER: 12
};
export const DECIMAL = {
  // They are no longer configured from the builder, by default they are "Point" and "2"
  separator: '.',
  length: 2,
  currency: '$'
};
export const STORAGE_KEY = {
  ONLINE: 'app_is_online',
  USER: 'user_information'
};
export const DIRECTION = {
  RIGHT: 'right',
  LEFT: 'left'
};
export const USER_TYPE = {
  BUSINESS: 'business',
  CUSTOMER: 'customer',
  DRIVER: 'driver'
};
export const IMAGES = {
  menu: require('../assets/icons/menu.png'),
  lunch: require('../assets/icons/lunch.png'),
  avatar: require('../assets/images/avatar.jpg'),
  arrow_up: require('../assets/icons/arrow_up.png'),
  arrow_left: require('../assets/icons/arrow_left.png'),
  map: require('../assets/icons/map.png'),
  marker: require('../assets/images/marker.png'),
  email: require('../assets/icons/ic_email.png'),
  lock: require('../assets/icons/ic_lock.png'),
  camera: require('../assets/icons/camera.png'),
  support: require('../assets/icons/help.png'),
  trash: require('../assets/icons/trash.png'),
  phone: require('../assets/icons/phone.png'),
  mail: require('../assets/icons/mail.png'),
  chat: require('../assets/icons/chat.png')
};
//# sourceMappingURL=constants.js.map