import React from 'react';
import { useLanguage } from 'ordering-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {CODES} from 'ordering-components/native'
import { ORDER_TYPES } from '../config/constants';

export const flatArray = (arr: any) => [].concat(...arr)

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
    ERROR_PRODUCT_NOT_FOUND: 'Error with the product'
  }

  return keyList[key] ? t(key, keyList[key]) : t(key)
}

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

export const transformCountryCode = (countryCode : number) => {
  const code = CODES.find((code : any) => code.phoneCode === countryCode)
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

export const getOrderStatus = (status: number) => {
  switch (status) {
    case 0:
      return 'ORDER_STATUS_PENDING'
    case 1:
      return 'ORDERS_COMPLETED'
    case 2:
      return 'ORDER_REJECTED'
    case 3:
      return 'ORDER_STATUS_IN_BUSINESS'
    case 4:
      return 'ORDER_READY'
    case 5:
      return 'ORDER_REJECTED_RESTAURANT'
    case 6:
      return 'ORDER_STATUS_CANCELLEDBYDRIVER'
    case 7:
      return 'ORDER_STATUS_ACCEPTEDBYRESTAURANT'
    case 8:
      return 'ORDER_CONFIRMED_ACCEPTED_BY_DRIVER'
    case 9:
      return 'ORDER_PICKUP_COMPLETED_BY_DRIVER'
    case 10:
      return 'ORDER_PICKUP_FAILED_BY_DRIVER'
    case 11:
      return 'ORDER_DELIVERY_COMPLETED_BY_DRIVER'
    case 12:
      return 'ORDER_DELIVERY_FAILED_BY_DRIVER'
    case 13:
      return 'PREORDER'
    case 14:
      return 'ORDER_NOT_READY'
    case 15:
      return 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER'
    case 16:
      return 'ORDER_STATUS_CANCELLED_BY_CUSTOMER'
    case 17:
      return 'ORDER_NOT_PICKEDUP_BY_CUSTOMER'
    case 18:
      return 'ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS'
    case 19:
      return 'ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER'
    case 20:
      return 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS'
    case 21:
      return 'ORDER_CUSTOMER_ARRIVED_BUSINESS'
    case 22:
      return 'ORDER_LOOKING_FOR_DRIVER'
    case 23:
      return 'ORDER_DRIVER_ON_WAY'
    default:
      return status
  }
}

export const getTextOrderStatus = (s: string, t: any) => {
  const status = parseInt(s)
  const orderStatus = [
    { key: 0, value: t('PENDING', 'Pending') },
    { key: 1, value: t('COMPLETED', 'Completed') },
    { key: 2, value: t('REJECTED', 'Rejected') },
    { key: 3, value: t('DRIVER_IN_BUSINESS', 'Driver in business') },
    { key: 4, value: t('PREPARATION_COMPLETED', 'Preparation Completed') },
    { key: 5, value: t('REJECTED_BY_BUSINESS', 'Rejected by business') },
    { key: 6, value: t('REJECTED_BY_DRIVER', 'Rejected by Driver') },
    { key: 7, value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business') },
    { key: 8, value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver') },
    { key: 9, value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver') },
    { key: 10, value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver') },
    { key: 11, value: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver') },
    { key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver') },
    { key: 13, value: t('PREORDER', 'PreOrder') },
    { key: 14, value: t('ORDER_NOT_READY', 'Order not ready') },
    { key: 15, value: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', 'Order picked up completed by customer') },
    { key: 16, value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer') },
    { key: 17, value: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', 'Order not picked up by customer') },
    { key: 18, value: t('DRIVER_ALMOST_ARRIVED_TO_BUSINESS', 'Driver almost arrived to business') },
    { key: 19, value: t('DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', 'Driver almost arrived to customer') },
    { key: 20, value: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', 'Customer almost arrived to business') },
    { key: 21, value: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', 'Customer arrived to business') },
    { key: 22, value: t('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver') },
    { key: 23, value: t('ORDER_DRIVER_ON_WAY', 'Driver on way') }
  ]

  const objectStatus = orderStatus.find((o) => o.key === status)
  return objectStatus && objectStatus
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
