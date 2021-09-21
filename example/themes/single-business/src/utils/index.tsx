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
    default:
      return status
  }
}