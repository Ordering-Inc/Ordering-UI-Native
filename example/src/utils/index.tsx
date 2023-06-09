import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {CODES} from 'ordering-components/native'
import { useLanguage } from 'ordering-components/native'

export const flatArray = (arr: any) => [].concat(...arr)

/**
 * Function to return the traduction depending of a key 't'
 * @param {string} key for traduction
 */
export const getTraduction = (key: string, t: any) => {

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
    ERROR_ADD_BUSINESS_INVALID: 'An error occurred with the business',
    ERROR_INVALID_OFFER: 'The offer doesn\'t exist',
    ERROR_ADD_PRODUCT_BEFORE_ADDRESS: 'You must have an address'
  }

  return keyList[key] ? t(key, keyList[key]) : t(key)
}

/**
 * Function to convert delivery time in minutes
 * @param {string} time business delivery time
 */
export const convertHoursToMinutes = (time: any) => {
  const [, t] = useLanguage()
  if (!time) return '0min'
  const [hour, minute] = time.split(':')
  const result = (parseInt(hour, 10) * 60) + parseInt(minute, 10)
  return `${result}${t('TIME_MINUTES', 'min')}`
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

export const transformCountryCode = (countryCode : number) => {
  const code = CODES.find((code : any) => code.phoneCode === countryCode)
  return code?.countryCode
}

export const verifyCountryCode = (countryCode : string) => {
  const code = CODES.find((code : any) => code.countryCode === (countryCode || '').toUpperCase())
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

/**
 * function to manage review comment list
 * @param {number} param0 type of reviews to return
 * @returns object with reviews dictionary
 */
 export const reviewCommentList = (type: string) => {
  const [, t] = useLanguage()
  // TODO: improve this function
  const reviews: any = {
    order: {
      1: {
        title: t('QUICK_COMMENT_TITLE_1', "What went wrong?"),
        list: [
          { key: 0, content: t('QUICK_COMMENT_1_0', "Not handled with care") },
          { key: 1, content: t('QUICK_COMMENT_1_1', "Poor communication") },
          { key: 2, content: t('QUICK_COMMENT_1_2', "COVID-19 issue") },
          { key: 3, content: t('QUICK_COMMENT_1_3', "Didn't follow instructions") },
          { key: 4, content: t('QUICK_COMMENT_1_4', "Rude") },
          { key: 5, content: t('QUICK_COMMENT_1_5', "Not on-time") },
        ]
      },
      2: {
        title: t('QUICK_COMMENT_TITLE_2', "What went wrong?"),
        list: [
          { key: 0, content: t('QUICK_COMMENT_2_0', "Not handled with care") },
          { key: 1, content: t('QUICK_COMMENT_2_1', "Poor communication") },
          { key: 2, content: t('QUICK_COMMENT_2_2', "COVID-19 issue") },
          { key: 3, content: t('QUICK_COMMENT_2_3', "Didn't follow instructions") },
          { key: 4, content: t('QUICK_COMMENT_2_4', "Rude") },
          { key: 5, content: t('QUICK_COMMENT_2_5', "Not on-time") },
        ]
      },
      3: {
        title: t('QUICK_COMMENT_TITLE_3', "What could have been better?"),
        list: [
          { key: 0, content: t('QUICK_COMMENT_3_0', "Not handled with care") },
          { key: 1, content: t('QUICK_COMMENT_3_1', "Poor communication") },
          { key: 2, content: t('QUICK_COMMENT_3_2', "COVID-19 issue") },
          { key: 3, content: t('QUICK_COMMENT_3_3', "Didn't follow instructions") },
          { key: 4, content: t('QUICK_COMMENT_3_4', "Rude") },
          { key: 5, content: t('QUICK_COMMENT_3_5', "Not on-time") },
        ]
      },
      4: {
        title: t('QUICK_COMMENT_TITLE_4', " Tell us more"),
        list: [
          { key: 0, content: t('QUICK_COMMENT_4_0', "Not handled with care") },
          { key: 1, content: t('QUICK_COMMENT_4_1', "Poor communication") },
          { key: 2, content: t('QUICK_COMMENT_4_2', "COVID-19 issue") },
          { key: 3, content: t('QUICK_COMMENT_4_3', "Didn't follow instructions") },
          { key: 4, content: t('QUICK_COMMENT_4_4', "Rude") },
          { key: 5, content: t('QUICK_COMMENT_4_5', "Not on-time") },
        ]
      },
      5: {
        title: t('QUICK_COMMENT_TITLE_5', "What went well?"),
        list: [
          { key: 0, content: t('QUICK_COMMENT_5_0', "Good communication") },
          { key: 1, content: t('QUICK_COMMENT_5_1', "Followed instructions") },
          { key: 2, content: t('QUICK_COMMENT_5_2', "Friendly") },
          { key: 3, content: t('QUICK_COMMENT_5_3', 'Handled with care') },
          { key: 4, content: t('QUICK_COMMENT_5_4', "Above and beyond") },
        ]
      },
    },
    customer: {
      1: {
        title: t('CUSTOMER_QUICK_COMMENT_TITLE_1', "What went wrong?"),
        list: [
          { key: 0, content: t('CUSTOMER_QUICK_COMMENT_1_0', "Poor communication") },
          { key: 1, content: t('CUSTOMER_QUICK_COMMENT_1_1', "Wrong address") },
          { key: 2, content: t('CUSTOMER_QUICK_COMMENT_1_2', "COVID-19 issue") },
          { key: 3, content: t('CUSTOMER_QUICK_COMMENT_1_3', "Didn't follow instructions") },
          { key: 4, content: t('CUSTOMER_QUICK_COMMENT_1_4', "Rude") },
          { key: 5, content: t('CUSTOMER_QUICK_COMMENT_1_5', "Not on-time") },
        ]
      },
      2: {
        title: t('CUSTOMER_QUICK_COMMENT_TITLE_2', "What went wrong?"),
        list: [
          { key: 0, content: t('CUSTOMER_QUICK_COMMENT_2_0', "Poor communication") },
          { key: 1, content: t('CUSTOMER_QUICK_COMMENT_2_1', "Wrong address") },
          { key: 2, content: t('CUSTOMER_QUICK_COMMENT_2_2', "COVID-19 issue") },
          { key: 3, content: t('CUSTOMER_QUICK_COMMENT_2_3', "Didn't follow instructions") },
          { key: 4, content: t('CUSTOMER_QUICK_COMMENT_2_4', "Rude") },
          { key: 5, content: t('CUSTOMER_QUICK_COMMENT_2_5', "Not on-time") },
        ]
      },
      3: {
        title: t('CUSTOMER_QUICK_COMMENT_TITLE_3', "What could have been better?"),
        list: [
          { key: 0, content: t('CUSTOMER_QUICK_COMMENT_3_0', "Poor communication") },
          { key: 1, content: t('CUSTOMER_QUICK_COMMENT_3_1', "Wrong address") },
          { key: 2, content: t('CUSTOMER_QUICK_COMMENT_3_2', "COVID-19 issue") },
          { key: 3, content: t('CUSTOMER_QUICK_COMMENT_3_3', "Didn't follow instructions") },
          { key: 4, content: t('CUSTOMER_QUICK_COMMENT_3_4', "Rude") },
          { key: 5, content: t('CUSTOMER_QUICK_COMMENT_3_5', "Not on-time") },
        ]
      },
      4: {
        title: t('CUSTOMER_QUICK_COMMENT_TITLE_4', " Tell us more"),
        list: [
          { key: 0, content: t('CUSTOMER_QUICK_COMMENT_4_0', "Poor communication") },
          { key: 1, content: t('CUSTOMER_QUICK_COMMENT_4_1', "Wrong address") },
          { key: 2, content: t('CUSTOMER_QUICK_COMMENT_4_2', "COVID-19 issue") },
          { key: 3, content: t('CUSTOMER_QUICK_COMMENT_4_3', "Didn't follow instructions") },
          { key: 4, content: t('CUSTOMER_QUICK_COMMENT_4_4', "Rude") },
          { key: 5, content: t('CUSTOMER_QUICK_COMMENT_4_5', "Not on-time") },
        ]
      },
      5: {
        title: t('CUSTOMER_QUICK_COMMENT_TITLE_5', "What went well?"),
        list: [
          { key: 0, content: t('CUSTOMER_QUICK_COMMENT_5_0', "Good communication") },
          { key: 1, content: t('CUSTOMER_QUICK_COMMENT_5_1', "Friendly") },
          { key: 2, content: t('CUSTOMER_QUICK_COMMENT_5_2', "Above and beyond") },
        ]
      },
    },
    driver: {
      1: {
        title: t('DRIVER_QUICK_COMMENT_TITLE_1', "What went wrong?"),
        list: [
          { key: 0, content: t('DRIVER_QUICK_COMMENT_1_0', "Not handled with care") },
          { key: 1, content: t('DRIVER_QUICK_COMMENT_1_1', "Poor communication") },
          { key: 2, content: t('DRIVER_QUICK_COMMENT_1_2', "COVID-19 issue") },
          { key: 3, content: t('DRIVER_QUICK_COMMENT_1_3', "Didn't follow instructions") },
          { key: 4, content: t('DRIVER_QUICK_COMMENT_1_4', "Rude") },
          { key: 5, content: t('DRIVER_QUICK_COMMENT_1_5', "Not on-time") },
        ]
      },
      2: {
        title: t('DRIVER_QUICK_COMMENT_TITLE_2', "What went wrong?"),
        list: [
          { key: 0, content: t('DRIVER_QUICK_COMMENT_2_0', "Not handled with care") },
          { key: 1, content: t('DRIVER_QUICK_COMMENT_2_1', "Poor communication") },
          { key: 2, content: t('DRIVER_QUICK_COMMENT_2_2', "COVID-19 issue") },
          { key: 3, content: t('DRIVER_QUICK_COMMENT_2_3', "Didn't follow instructions") },
          { key: 4, content: t('DRIVER_QUICK_COMMENT_2_4', "Rude") },
          { key: 5, content: t('DRIVER_QUICK_COMMENT_2_5', "Not on-time") },
        ]
      },
      3: {
        title: t('DRIVER_QUICK_COMMENT_TITLE_3', "What could have been better?"),
        list: [
          { key: 0, content: t('DRIVER_QUICK_COMMENT_3_0', "Not handled with care") },
          { key: 1, content: t('DRIVER_QUICK_COMMENT_3_1', "Poor communication") },
          { key: 2, content: t('DRIVER_QUICK_COMMENT_3_2', "COVID-19 issue") },
          { key: 3, content: t('DRIVER_QUICK_COMMENT_3_3', "Didn't follow instructions") },
          { key: 4, content: t('DRIVER_QUICK_COMMENT_3_4', "Rude") },
          { key: 5, content: t('DRIVER_QUICK_COMMENT_3_5', "Not on-time") },
        ]
      },
      4: {
        title: t('DRIVER_QUICK_COMMENT_TITLE_4', " Tell us more"),
        list: [
          { key: 0, content: t('DRIVER_QUICK_COMMENT_4_0', "Not handled with care") },
          { key: 1, content: t('DRIVER_QUICK_COMMENT_4_1', "Poor communication") },
          { key: 2, content: t('DRIVER_QUICK_COMMENT_4_2', "COVID-19 issue") },
          { key: 3, content: t('DRIVER_QUICK_COMMENT_4_3', "Didn't follow instructions") },
          { key: 4, content: t('DRIVER_QUICK_COMMENT_4_4', "Rude") },
          { key: 5, content: t('DRIVER_QUICK_COMMENT_4_5', "Not on-time") },
        ]
      },
      5: {
        title: t('DRIVER_QUICK_COMMENT_TITLE_5', "What went well?"),
        list: [
          { key: 0, content: t('DRIVER_QUICK_COMMENT_5_0', "Good communication") },
          { key: 1, content: t('DRIVER_QUICK_COMMENT_5_1', "Followed instructions") },
          { key: 2, content: t('DRIVER_QUICK_COMMENT_5_2', "Friendly") },
          { key: 3, content: t('DRIVER_QUICK_COMMENT_5_3', 'Handled with care') },
          { key: 4, content: t('DRIVER_QUICK_COMMENT_5_4', "Above and beyond") },
        ]
      },
    },
    product: {
      like: [
        { key: 0, content: t('QUICK_COMMENT_LIKE_0', "Tasty") },
        { key: 1, content: t('QUICK_COMMENT_LIKE_1', "Good price") },
        { key: 2, content: t('QUICK_COMMENT_LIKE_2', "Good portion size") },
        { key: 3, content: t('QUICK_COMMENT_LIKE_3', "Packed well") },
      ],
      dislike: [
        { key: 0, content: t('QUICK_COMMENT_DISLIKE_0', "Not tasty") },
        { key: 1, content: t('QUICK_COMMENT_DISLIKE_1', "High price") },
        { key: 2, content: t('QUICK_COMMENT_DISLIKE_2', "Bad portion size") },
        { key: 3, content: t('QUICK_COMMENT_DISLIKE_3', "Not packed well") },
      ]
    }
  }

  return reviews[type]
}

/**
 * function to manage order comment list
 * @param {string} param0 type of orders to return
 * @returns object with orders dictionary
 */
export const orderCommentList = (value: string) => {
  const [, t] = useLanguage()
  const dictionary: any = {
    reject: 6,
    forcePickUp: 9,
    pickupFailed: 10,
    forceDelivery: 11,
    deliveryFailed: 12,
    notReady: 14
  }

  const status = dictionary[value]

  const messages: any = {
    6: [// on reject order
      'very_far_away',
      'driver_vehicle_incident',
      'destination_unreacheable',
      'unavailable_driver',
      'other'
    ],
    9: [// on force pickup status
      'forgot_complete_location',
      'not_internet_conection',
      'other'
    ],
    10: [// on pickup failed by driver
      'very_far_away',
      'driver_vehicle_incident',
      'destination_unreacheable',
      'store_closed',
      'unavailable_driver',
      'other'
    ],
    11: [// on force delivery status
      'forgot_complete_location',
      'not_internet_conection',
      'other'
    ],
    12: [// on delivery failed by driver
      'very_far_away',
      'driver_vehicle_incident',
      'destination_unreacheable',
      'recipient_unavailable',
      'incorrect_missing_items',
      'refused_damage',
      'other'
    ],
    14: [// on order not ready
      'store_recieve_order_late',
      'store_busy',
      'other'
    ]
  }

  if (!messages[status]) return null

  const list = messages[status].map((val: any, i: number) => ({ key: i, value: val, content: t(`REJECT_REASON_${val.toUpperCase()}`, val.replace(/_/g, ' ')) }))

  return { list }
}
