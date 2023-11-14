import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CODES } from 'ordering-components/native';

export const flatArray = (arr: any) => [].concat(...arr);

/**
 * Function to return the traduction depending of a key 't'
 * @param {string} key for traduction
 */
export const getTraduction = (key: string, t: any) => {
  const keyList: any = {
    // Add the key and traduction that you need below
    ERROR_ORDER_WITHOUT_CART: 'The order was placed without a cart',
    ERROR_INVALID_COUPON: "The coupon doesn't exist",
    ERROR_IVALID_COUPON_MINIMUM:
      'You must have more products in your cart to use the coupon',
    ERROR_ADD_PRODUCT_VERY_FAR_FOR_PICKUP:
      'The business is too far for order type pickup',
    ERROR_PLACE_PAY_WITH_CARD2: 'An error occurred while trying to pay by card',
    ERROR_ADD_PRODUCT_BUSINESS_CLOSED: 'The business is closed at the moment',
    INTERNAL_ERROR: 'Server Error, please wait, we are working to fix it',
    ERROR_NOT_FOUND_BUSINESSES: 'No businesses found near your location',
    YOU_DO_NOT_HAVE_PERMISSION: 'You do not have permission',
    INVALID_CODE: 'Invalid verify code',
    STRIPE_ERROR: 'Payment service error. Try again later.',
    ERROR_AUTH_TWILIO_DISABLED: 'Auth error, twilio is disabled',
    ERROR_CART_SELECT_PAYMETHOD: 'An error occurred with selected pay method',
    ERROR_YOU_HAVE_ACTIVE_CART: "You can't reorder this cart",
    ERROR_YOU_HAVE_NOT_CART: 'Cart not found',
    ERROR_PLACE_PAY_WITH_REDIRECT:
      'An error occurred while trying to pay by redirect',
    ERROR_PLACE_PAY_WITH_CARD1: 'An error occurred while trying to pay by card',
    ERROR_PLACE_PAY_WITH_PAYPAL_CAPTURE:
      'An error occurred while trying to pay by PayPal',
    ERROR_ADD_PRODUCT_VERY_FAR_FOR_DELIVERY:
      'Error adding product, very far for delivery',
    ERROR_PRODUCT_NOT_FOUND: 'Error with the product',
    ERROR_USER_UPDATE_YOU_HAVE_ASSIGNED_ORDERS:
      "You can't because you have assigned orders",
    ERROR_INVALID_OFFER: 'The offer doesn\'t exist',
    ERROR_AUTH_DRIVER_LOGIN_VALIDATION: 'Error auth driver login validation',
    ERROR_DRIVER_UPDATE_SCHEDULE: 'Error driver update schedule',
  };

  return keyList[key] ? t(key, keyList[key]) : t(key);
};

/**
 * Function to convert delivery time in minutes
 * @param {string} time business delivery time
 */
export const convertHoursToMinutes = (time: any) => {
  if (!time) return '0min';
  const [hour, minute] = time.split(':');
  const result = parseInt(hour, 10) * 60 + parseInt(minute, 10);
  return `${result}min`;
};

export const getIconCard = (brand: string, size: number) => {
  const value = brand?.toLowerCase();
  switch (value) {
    case 'visa':
      return (
        FontAwesome && <FontAwesome name="cc-visa" size={size} color={'#000'} />
      );
    case 'mastercard':
      return (
        FontAwesome && (
          <FontAwesome name="cc-mastercard" size={size} color={'#000'} />
        )
      );
    case 'amex':
      return (
        FontAwesome && <FontAwesome name="cc-amex" size={size} color={'#000'} />
      );
    case 'discover':
      return (
        FontAwesome && (
          <FontAwesome name="cc-discover" size={size} color={'#000'} />
        )
      );
    case 'jcb':
      return (
        FontAwesome && <FontAwesome name="cc-jcb" size={size} color={'#000'} />
      );
    case 'diners-club':
      return (
        FontAwesome && (
          <FontAwesome name="cc-diners-club" size={size} color={'#000'} />
        )
      );
    default:
      return (
        FontAwesome && (
          <FontAwesome name="credit-card-alt" size={size} color={'#000'} />
        )
      );
  }
};
/**
 * Function to return a static google maps image based in location
 * @param {object} param object with latitude and logitude
 */
export const getGoogleMapImage = ({ lat, lng }: any, apiKey: string) => {
  return `https://maps.googleapis.com/maps/api/staticmap?size=500x190&center=${lat},${lng}&zoom=17&scale=2&maptype=roadmap&&markers=icon:https://res.cloudinary.com/ditpjbrmz/image/upload/f_auto,q_auto,w_45,q_auto:best,q_auto:best/v1564675872/marker-customer_kvxric.png%7Ccolor:white%7C${lat},${lng}&key=${apiKey}`;
};
/**
 * List of fields with correct order
 */
export const fieldsToSort = [
  'name',
  'middle_name',
  'lastname',
  'second_lastname',
  'email',
];
/**
 * Function to return a array sorted by certain fields
 * @param fields Array with right order
 * @param array Array to sort
 */
export const sortInputFields = ({ fields, values }: any) => {
  let fieldsBase = fields;
  const fieldsSorted: any = [];
  const fieldsArray = Array.isArray(values)
    ? values
    : values && Object.values(values);

  if (!fieldsBase) {
    fieldsBase = fieldsToSort;
  }

  fieldsBase.forEach((f: any) => {
    fieldsArray &&
      fieldsArray.forEach((field: any) => {
        if (f === field.code) {
          fieldsSorted.push(field);
        }
      });
  });
  return fieldsSorted;
};

export const transformCountryCode = (countryCode: number) => {
  const code = CODES.find((code: any) => code.phoneCode === countryCode);
  return code?.countryCode;
};

export const findExitingCode = (countryCode: string) => {
  const code = CODES.find((code: any) => code.countryCode === (countryCode || '').toUpperCase())
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
    return value;
  } else {
    return parser(value);
  }
};

export const getProductPrice = (product: any) => {
  let subOptionPrice = 0;
  if (product.options.length > 0) {
    for (const option of product.options) {
      for (const suboption of option.suboptions) {
        subOptionPrice += suboption.quantity * suboption.price;
      }
    }
  }

  const price = product.quantity * (product.price + subOptionPrice);
  return price;
};

export const getOrderStatus = (s: string, t: any) => {
  const status = parseInt(s);
  const orderStatus = [
    {
      key: 0,
      value: t('PENDING', 'Pending'),
      slug: 'PENDING',
      percentage: 0.25,
    },
    {
      key: 1,
      value: t('COMPLETED', 'Completed'),
      slug: 'COMPLETED',
      percentage: 1,
    },
    {
      key: 2,
      value: t('REJECTED', 'Rejected'),
      slug: 'REJECTED',
      percentage: 0,
    },
    {
      key: 3,
      value: t('DRIVER_IN_BUSINESS', 'Driver in business'),
      slug: 'DRIVER_IN_BUSINESS',
      percentage: 0.6,
    },
    {
      key: 4,
      value: t('READY_FOR_PICKUP', 'Ready for pickup'),
      slug: 'READY_FOR_PICKUP',
      percentage: 0.7,
    },
    {
      key: 5,
      value: t('REJECTED_BY_BUSINESS', 'Rejected by business'),
      slug: 'REJECTED_BY_BUSINESS',
      percentage: 0,
    },
    {
      key: 6,
      value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'),
      slug: 'REJECTED_BY_DRIVER',
      percentage: 0,
    },
    {
      key: 7,
      value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
      slug: 'ACCEPTED_BY_BUSINESS',
      percentage: 0.35,
    },
    {
      key: 8,
      value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'),
      slug: 'ACCEPTED_BY_DRIVER',
      percentage: 0.45,
    },
    {
      key: 9,
      value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
      slug: 'PICK_UP_COMPLETED_BY_DRIVER',
      percentage: 0.8,
    },
    {
      key: 10,
      value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
      slug: 'PICK_UP_FAILED_BY_DRIVER',
      percentage: 0,
    },
    {
      key: 11,
      value: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver'),
      slug: 'DELIVERY_COMPLETED_BY_DRIVER',
      percentage: 1,
    },
    {
      key: 12,
      value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
      slug: 'DELIVERY_FAILED_BY_DRIVER',
      percentage: 0,
    },
    {
      key: 13,
      value: t('PREORDER', 'PreOrder'),
      slug: 'PREORDER',
      percentage: 0,
    },
    {
      key: 14,
      value: t('ORDER_NOT_READY', 'Order not ready'),
      slug: 'ORDER_NOT_READY',
      percentage: 0,
    },
    {
      key: 15,
      value: t(
        'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        'Order picked up completed by customer',
      ),
      slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
      percentage: 100,
    },
    {
      key: 16,
      value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
      slug: 'CANCELLED_BY_CUSTOMER',
      percentage: 0,
    },
    {
      key: 17,
      value: t(
        'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        'Order not picked up by customer',
      ),
      slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
      percentage: 0,
    },
    {
      key: 18,
      value: t(
        'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
        'Driver almost arrived to business',
      ),
      slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
      percentage: 0.15,
    },
    {
      key: 19,
      value: t(
        'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
        'Driver almost arrived to customer',
      ),
      slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
      percentage: 0.9,
    },
    {
      key: 20,
      value: t(
        'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        'Customer almost arrived to business',
      ),
      slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
      percentage: 90,
    },
    {
      key: 21,
      value: t(
        'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        'Customer arrived to business',
      ),
      slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
      percentage: 95,
    },
    {
      key: 22,
      value: t('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver'),
      slug: 'ORDER_LOOKING_FOR_DRIVER',
      percentage: 35
    },
    {
      key: 23,
      value: t('ORDER_DRIVER_ON_WAY', 'Driver on way'),
      slug: 'ORDER_DRIVER_ON_WAY',
      percentage: 45
    },
    {
      key: 24,
      value: t('ORDER_DRIVER_WAITING_FOR_ORDER', 'Driver waiting for order'),
      slug: 'ORDER_DRIVER_WAITING_FOR_ORDER',
      percentage: 25
    },
    {
      key: 25,
      value: t('ORDER_ACCEPTED_BY_DRIVER_COMPANY', 'Accepted by driver company'),
      slug: 'ORDER_ACCEPTED_BY_DRIVER_COMPANY',
      percentage: 25
    },
    {
      key: 26,
      value: t('ORDER_DRIVER_ARRIVED_CUSTOMER', 'Driver arrived to customer'),
      slug: 'ORDER_DRIVER_ARRIVED_CUSTOMER',
      percentage: 80
    }
  ];

  const objectStatus = orderStatus.find(o => o.key === status);

  return objectStatus && objectStatus;
};

export const transformDistance = (value: number, distanceUnit?: string) => {
  return distanceUnit === 'mi'
    ? (value / 1.609).toFixed(2)
    : distanceUnit === 'ft'
      ? (value * 3280.84).toFixed(0)
      : (value).toFixed(2)
}

export const formatSeconds = (seconds: number) => {
  // Hours, minutes and seconds
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  // Output like '1:01' or '4:03:59' or '123:03:59'
  let ret = ''
  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }
  ret += '' + mins + ':' + (secs < 10 ? '0' : '')
  ret += '' + secs
  return ret
}

export const calculateDistance = (
  pointA: { lat: number; lng: number },
  pointB: { latitude: number; longitude: number },
) => {
  const lat1 = pointA.lat;
  const lon1 = pointA.lng;

  const lat2 = pointB?.latitude;
  const lon2 = pointB?.longitude;

  const R = 6371e3;
  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = (lat2 - lat1) * (Math.PI / 180);
  const Δλ = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  const distanceInKm = distance / 1000;
  return distanceInKm;
};
