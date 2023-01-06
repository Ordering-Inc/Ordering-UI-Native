import React from 'react';
import { useLanguage } from 'ordering-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CODES } from 'ordering-components/native'
import { ORDER_TYPES } from '../config/constants';

export const flatArray = (arr: any) => [].concat(...arr)
const [languageState, t] = useLanguage();

/**
 * Function to return the traduction depending of a key 't'
 * @param {string} key for traduction
 */
export const getTraduction = (key: string) => {
  const [, t] = useLanguage()
  const keyList: any = {
    // Add the key and traduction that you need below
    ERROR_ORDER_WITHOUT_CART: 'The order was placed without a cart',
    ERROR_INVALID_COUPON: "The coupon doesn't exist",
    ERROR_IVALID_COUPON_MINIMUM: 'You must have more products in your cart to use the coupon',
    ERROR_ADD_PRODUCT_VERY_FAR_FOR_PICKUP: 'The business is too far for order type pickup',
    ERROR_PLACE_PAY_WITH_CARD2: 'An error occurred while trying to pay by card',
    ERROR_ADD_PRODUCT_BUSINESS_CLOSED: 'The business is closed at the moment',
    INTERNAL_ERROR: 'Server Error, please wait, we are working to fix it',
    ERROR_NOT_FOUND_BUSINESSES: 'No businesses found near your location',
    YOU_DO_NOT_HAVE_PERMISSION: 'You do not have permission',
    INVALID_CODE: 'Invalid verify code',
    STRIPE_ERROR: 'Payment service error. Try again later.',
    ERROR_AUTH_TWILIO_DISABLED: 'Auth error, twilio is disabled',
    ERROR_CART_SELECT_PAYMETHOD: 'An error occurred with selected pay method',
    ERROR_YOU_HAVE_ACTIVE_CART: 'You can\'t reorder this cart',
    ERROR_YOU_HAVE_NOT_CART: 'Cart not found',
    ERROR_PLACE_PAY_WITH_REDIRECT: 'An error occurred while trying to pay by redirect',
    ERROR_PLACE_PAY_WITH_CARD1: 'An error occurred while trying to pay by card',
    ERROR_PLACE_PAY_WITH_PAYPAL_CAPTURE: 'An error occurred while trying to pay by PayPal',
    ERROR_ADD_PRODUCT_VERY_FAR_FOR_DELIVERY: 'Error adding product, very far for delivery',
    ERROR_PRODUCT_NOT_FOUND: 'Error with the product',
    ERROR_INVALID_OFFER: 'The offer doesn\'t exist'
  }

  return keyList[key] ? t(key, keyList[key]) : t(key)
}

/**
 * Change local moment variables
 */
export const setLocalMoment = (moment: any, t: any) => {
  moment.locale('custom', {
    months: [
      t('MONTH1', 'January'),
      t('MONTH2', 'February'),
      t('MONTH3', 'March'),
      t('MONTH4', 'April'),
      t('MONTH5', 'May'),
      t('MONTH6', 'June'),
      t('MONTH7', 'July'),
      t('MONTH8', 'August'),
      t('MONTH9', 'September'),
      t('MONTH10', 'October'),
      t('MONTH11', 'November'),
      t('MONTH12', 'December')
    ],
    monthsShort: [
      t('MONTHSHORT1', 'Jan'),
      t('MONTHSHORT2', 'Feb'),
      t('MONTHSHORT3', 'Mar'),
      t('MONTHSHORT4', 'Apr'),
      t('MONTHSHORT5', 'May'),
      t('MONTHSHORT6', 'Jun'),
      t('MONTHSHORT7', 'Jul'),
      t('MONTHSHORT8', 'Aug'),
      t('MONTHSHORT9', 'Sep'),
      t('MONTHSHORT10', 'Oct'),
      t('MONTHSHORT11', 'Nov'),
      t('MONTHSHORT12', 'Dec')
    ],
    weekdays: [
      t('DAY7', 'Sunday'),
      t('DAY1', 'Monday'),
      t('DAY2', 'Tuesday'),
      t('DAY3', 'Wednesday'),
      t('DAY4', 'Thursday'),
      t('DAY5', 'Friday'),
      t('DAY6', 'Saturday')
    ],
    weekdaysShort: [
      t('DAYSHORT7', 'Sun'),
      t('DAYSHORT1', 'Mon'),
      t('DAYSHORT2', 'Tue'),
      t('DAYSHORT3', 'Wed'),
      t('DAYSHORT4', 'Thu'),
      t('DAYSHORT5', 'Fri'),
      t('DAYSHORT6', 'Sat')
    ],
    weekdaysMin: [
      t('DAYMIN7', 'Su'),
      t('DAYMIN1', 'Mo'),
      t('DAYMIN2', 'Tu'),
      t('DAYMIN3', 'We'),
      t('DAYMIN4', 'Th'),
      t('DAYMIN5', 'Fr'),
      t('DAYMIN6', 'Sa')
    ],
    meridiem: function (hours: any) {
      return hours < 12 ? t('AM', 'AM') : t('PM', 'PM');
    }
  })
}

export const monthsEnum: any = {
  Jan: 'MONTHSHORT1',
  Feb: 'MONTHSHORT2',
  Mar: 'MONTHSHORT3',
  Apr: 'MONTHSHORT4',
  May: 'MONTHSHORT5',
  Jun: 'MONTHSHORT6',
  Jul: 'MONTHSHORT7',
  Aug: 'MONTHSHORT8',
  Sep: 'MONTHSHORT9',
  Oct: 'MONTHSHORT10',
  Nov: 'MONTHSHORT11',
  Dec: 'MONTHSHORT12',
}

export const locale = {
  name: languageState?.language?.code?.slice(0, 2),
  config: {
    months: [
      t('MONTH1', 'January'),
      t('MONTH2', 'February'),
      t('MONTH3', 'March'),
      t('MONTH4', 'April'),
      t('MONTH5', 'May'),
      t('MONTH6', 'June'),
      t('MONTH7', 'July'),
      t('MONTH8', 'August'),
      t('MONTH9', 'September'),
      t('MONTH10', 'October'),
      t('MONTH11', 'November'),
      t('MONTH12', 'December')
    ],
    weekdaysShort: [
      t('DAYSHORT7', 'Sun'),
      t('DAYSHORT1', 'Mon'),
      t('DAYSHORT2', 'Tue'),
      t('DAYSHORT3', 'Wed'),
      t('DAYSHORT4', 'Thu'),
      t('DAYSHORT5', 'Fri'),
      t('DAYSHORT6', 'Sat')
    ],
  }
};

/**
 * Function to convert delivery time in minutes
 * @param {string} time business delivery time
 */
export const convertHoursToMinutes = (time: any) => {
  if (!time) return '0min'
  const [hour, minute] = time.split(':')
  const result = (parseInt(hour, 10) * 60) + parseInt(minute, 10)
  return `${result}min`
}

export const getIconCard = (brand: string, size: number) => {
  const value = brand?.toLowerCase()
  switch (value) {
    case 'visa':
      return (
        FontAwesome && <FontAwesome
          name='cc-visa'
          size={size}
          color={'#000'}
        />
      )
    case 'mastercard':
      return (
        FontAwesome && <FontAwesome
          name='cc-mastercard'
          size={size}
          color={'#000'}
        />
      )
    case 'amex':
      return (
        FontAwesome && <FontAwesome
          name='cc-amex'
          size={size}
          color={'#000'}
        />
      )
    case 'discover':
      return (
        FontAwesome && <FontAwesome
          name='cc-discover'
          size={size}
          color={'#000'}
        />
      )
    case 'jcb':
      return (
        FontAwesome && <FontAwesome
          name='cc-jcb'
          size={size}
          color={'#000'}
        />
      )
    case 'diners-club':
      return (
        FontAwesome && <FontAwesome
          name='cc-diners-club'
          size={size}
          color={'#000'}
        />
      )
    default:
      return (
        FontAwesome && <FontAwesome
          name='credit-card-alt'
          size={size}
          color={'#000'}
        />
      )
  }
}
/**
 * Function to return a static google maps image based in location
 * @param {object} param object with latitude and logitude
 */
export const getGoogleMapImage = ({ lat, lng }: any, apiKey: string) => {
  return `https://maps.googleapis.com/maps/api/staticmap?size=500x190&center=${lat},${lng}&zoom=17&scale=2&maptype=roadmap&&markers=icon:https://res.cloudinary.com/ditpjbrmz/image/upload/f_auto,q_auto,w_45,q_auto:best,q_auto:best/v1564675872/marker-customer_kvxric.png%7Ccolor:white%7C${lat},${lng}&key=${apiKey}`
}
/**
 * List of fields with correct order
 */
export const fieldsToSort = ['name', 'middle_name', 'lastname', 'second_lastname', 'email'];
/**
 * Function to return a array sorted by certain fields
 * @param fields Array with right order
 * @param array Array to sort
 */
export const sortInputFields = ({ fields, values }: any) => {
  let fieldsBase = fields;
  const fieldsSorted: any = [];
  const fieldsArray = Array.isArray(values) ? values : values && Object.values(values);

  if (!fieldsBase) {
    fieldsBase = fieldsToSort
  }

  fieldsBase.forEach((f: any) => {
    fieldsArray && fieldsArray.forEach((field: any) => {
      if (f === field.code) {
        fieldsSorted.push(field)
      }
    })
  });
  return fieldsSorted;
}

export const transformCountryCode = (countryCode: number) => {
  const code = CODES.find((code: any) => code.phoneCode === countryCode)
  return code?.countryCode
}

/**
 * Function to check if a number is decimal or not
 * @param {*} value number to check if decimal or not
 * @param {*} parser function fallback when is decimal
 * @returns string
 */
export const verifyDecimals = (value: number, parser: any) => {
  if (value % 1 === 0) {
    return value
  } else {
    return parser(value)
  }
}

export const getTypesText = (value: number) => {
  const ret = ORDER_TYPES.find((type: any) => type.value == value);
  return ret?.content;
}

/**
 * List shape for ribbon
 */
export const shape = {
  rectangle: 'rectangle',
  rectangleRound: 'rectangle_round',
  capsuleShape: 'capsule_shape'
}

/**
 * Function to transform degree to radian
 * @param {number} value for transform
 *
 */
export const convertToRadian = (value: number) => {
  return value * Math.PI / 180
}

/**
 * Function to distance between two locations
 * @param lat1 Lat for first location
 * @param lon1 Lon for first location
 * @param lat2 Lat for second location
 * @param lon2 Lon for second location
 */
export const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
  const R = 6371 // km
  const dLat = convertToRadian(lat2 - lat1)
  const dLon = convertToRadian(lon2 - lon1)
  const curLat1 = convertToRadian(lat1)
  const curLat2 = convertToRadian(lat2)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(curLat1) * Math.cos(curLat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const formatUrlVideo = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  const id = (match && match[7].length === 11) ? match[7] : false
  return `https://www.youtube-nocookie.com/embed/${id}`
}

export const formatSeconds = (seconds: number) => {
  // Hours, minutes and seconds
  var hrs = ~~(seconds / 3600)
  var mins = ~~((seconds % 3600) / 60)
  var secs = ~~seconds % 60

  // Output like '1:01' or '4:03:59' or '123:03:59'
  var ret = ''
  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }
  ret += '' + mins + ':' + (secs < 10 ? '0' : '')
  ret += '' + secs
  return ret
}

/**
 * List of price to filter businesses
 */
export const priceList = [
  { level: '1', content: '$' },
  { level: '2', content: '$$' },
  { level: '3', content: '$$$' },
  { level: '4', content: '$$$$' },
  { level: '5', content: '$$$$$' }
]

export const getLogisticTag = (status: any) => {
  const [, t] = useLanguage()
  const keyList: any = {
    0: t('PENDING', 'Pending'),
    1: t('IN_PROGRESS', 'In progress'),
    2: t('IN_QUEUE', 'In queue'),
    3: t('EXPIRED', 'Expired'),
    4: t('RESOLVED', 'Resolved'),
  }
  return keyList[status] ? keyList[status] : t('UNKNOWN', 'Unknown')
}
