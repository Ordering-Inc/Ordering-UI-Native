import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Messages } from '../Messages';
import { useLanguage, OrderDetails as OrderDetailsConTableoller, useUtils, useSession } from 'ordering-components/native';
import { OrderDetailsContainer, Header, OrderContent, OrderBusiness, Logo, OrderData, OrderInfo, OrderStatus, StaturBar, StatusImage, OrderCustomer, CustomerPhoto, InfoBlock, HeaderInfo, Customer, OrderProducts, Table, OrderBill, Total, NavBack, Icons, OrderDriver, Map } from './styles';
import { OIcon, OModal, OText } from '../shared';
import { colors } from '../../theme';
import { ProductItemAccordion } from '../ProductItemAccordion';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { USER_TYPE } from '../../config/constants';
import { GoogleMap } from '../GoogleMap';

const appLogo = require('../../assets/images/Logo.png');

const orderStatus0 = require('../../assets/images/status-0.png');

const orderStatus1 = require('../../assets/images/status-1.png');

const orderStatus2 = require('../../assets/images/status-2.png');

const orderStatus3 = require('../../assets/images/status-3.png');

const orderStatus4 = require('../../assets/images/status-4.png');

const orderStatus5 = require('../../assets/images/status-5.png');

const orderStatus6 = require('../../assets/images/status-6.png');

const orderStatus7 = require('../../assets/images/status-7.png');

const orderStatus8 = require('../../assets/images/status-8.png');

const orderStatus9 = require('../../assets/images/status-9.png');

const orderStatus10 = require('../../assets/images/status-10.png');

const orderStatus11 = require('../../assets/images/status-11.png');

const orderStatus12 = require('../../assets/images/status-12.png');

const storeDummy = require('../../assets/images/store.png');

export const OrderDetailsUI = props => {
  var _order$driver, _order$driver2, _order$business, _order$business2, _order$business3, _order$customer, _order$customer2, _order$customer3, _order$summary, _order$business4, _order$business5, _getOrderStatus, _getOrderStatus2, _getOrderStatus3, _order$customer4, _order$customer5, _order$customer6, _order$driver3, _order$driver4, _order$driver5, _order$driver6, _order$driver7, _order$products, _order$summary2, _order$summary3, _order$summary4, _order$summary5, _order$summary6, _order$summary7, _order$summary8, _order$summary9, _order$summary10, _order$summary11;

  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    isFromCheckout,
    driverLocation
  } = props;
  const [, t] = useLanguage();
  const [{
    parsePrice,
    parseNumber,
    parseDate
  }] = useUtils();
  const [{
    user
  }] = useSession();
  const [openMessages, setOpenMessages] = useState({
    business: false,
    driver: false
  });
  const [unreadAlert, setUnreadAlert] = useState({
    business: false,
    driver: false
  });
  const {
    order,
    businessData
  } = props.order;

  const getOrderStatus = s => {
    const status = parseInt(s);
    const orderStatus = [{
      key: 0,
      value: t('PENDING', 'Pending'),
      slug: 'PENDING',
      percentage: 0.25,
      image: orderStatus0
    }, {
      key: 1,
      value: t('COMPLETED', 'Completed'),
      slug: 'COMPLETED',
      percentage: 1,
      image: orderStatus1
    }, {
      key: 2,
      value: t('REJECTED', 'Rejected'),
      slug: 'REJECTED',
      percentage: 0,
      image: orderStatus2
    }, {
      key: 3,
      value: t('DRIVER_IN_BUSINESS', 'Driver in business'),
      slug: 'DRIVER_IN_BUSINESS',
      percentage: 0.60,
      image: orderStatus3
    }, {
      key: 4,
      value: t('PREPARATION_COMPLETED', 'Preparation Completed'),
      slug: 'PREPARATION_COMPLETED',
      percentage: 0.70,
      image: orderStatus4
    }, {
      key: 5,
      value: t('REJECTED_BY_BUSINESS', 'Rejected by business'),
      slug: 'REJECTED_BY_BUSINESS',
      percentage: 0,
      image: orderStatus5
    }, {
      key: 6,
      value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'),
      slug: 'REJECTED_BY_DRIVER',
      percentage: 0,
      image: orderStatus6
    }, {
      key: 7,
      value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
      slug: 'ACCEPTED_BY_BUSINESS',
      percentage: 0.35,
      image: orderStatus7
    }, {
      key: 8,
      value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'),
      slug: 'ACCEPTED_BY_DRIVER',
      percentage: 0.45,
      image: orderStatus8
    }, {
      key: 9,
      value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
      slug: 'PICK_UP_COMPLETED_BY_DRIVER',
      percentage: 0.80,
      image: orderStatus9
    }, {
      key: 10,
      value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
      slug: 'PICK_UP_FAILED_BY_DRIVER',
      percentage: 0,
      image: orderStatus10
    }, {
      key: 11,
      value: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver'),
      slug: 'DELIVERY_COMPLETED_BY_DRIVER',
      percentage: 1,
      image: orderStatus11
    }, {
      key: 12,
      value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
      slug: 'DELIVERY_FAILED_BY_DRIVER',
      percentage: 0,
      image: orderStatus12
    }];
    const objectStatus = orderStatus.find(o => o.key === status);
    return objectStatus && objectStatus;
  };

  const handleOpenMessages = data => {
    setOpenMessages(data);
    readMessages && readMessages();

    if ((order === null || order === void 0 ? void 0 : order.unread_count) > 0) {
      data.business ? setUnreadAlert({ ...unreadAlert,
        business: false
      }) : setUnreadAlert({ ...unreadAlert,
        driver: false
      });
    }
  };

  const unreadMessages = () => {
    const length = messages === null || messages === void 0 ? void 0 : messages.messages.length;
    const unreadLength = order === null || order === void 0 ? void 0 : order.unread_count;
    const unreadedMessages = messages.messages.slice(length - unreadLength, length);
    const business = unreadedMessages.some(message => {
      var _message$can_see;

      return message === null || message === void 0 ? void 0 : (_message$can_see = message.can_see) === null || _message$can_see === void 0 ? void 0 : _message$can_see.includes(2);
    });
    const driver = unreadedMessages.some(message => {
      var _message$can_see2;

      return message === null || message === void 0 ? void 0 : (_message$can_see2 = message.can_see) === null || _message$can_see2 === void 0 ? void 0 : _message$can_see2.includes(4);
    });
    setUnreadAlert({
      business,
      driver
    });
  };

  const handleCloseModal = () => {
    setOpenMessages({
      business: false,
      driver: false
    });
  };

  const handleArrowBack = () => {
    if (!isFromCheckout) {
      navigation.goBack();
      return;
    }

    navigation.navigate('BottomTab');
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleArrowBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleArrowBack);
    };
  }, []);
  useEffect(() => {
    if (messagesReadList !== null && messagesReadList !== void 0 && messagesReadList.length) {
      openMessages.business ? setUnreadAlert({ ...unreadAlert,
        business: false
      }) : setUnreadAlert({ ...unreadAlert,
        driver: false
      });
    }
  }, [messagesReadList]);
  const locations = [{ ...(order === null || order === void 0 ? void 0 : (_order$driver = order.driver) === null || _order$driver === void 0 ? void 0 : _order$driver.location),
    title: t('DRIVER', 'Driver'),
    icon: (order === null || order === void 0 ? void 0 : (_order$driver2 = order.driver) === null || _order$driver2 === void 0 ? void 0 : _order$driver2.photo) || 'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png'
  }, { ...(order === null || order === void 0 ? void 0 : (_order$business = order.business) === null || _order$business === void 0 ? void 0 : _order$business.location),
    title: order === null || order === void 0 ? void 0 : (_order$business2 = order.business) === null || _order$business2 === void 0 ? void 0 : _order$business2.name,
    icon: (order === null || order === void 0 ? void 0 : (_order$business3 = order.business) === null || _order$business3 === void 0 ? void 0 : _order$business3.logo) || storeDummy
  }, { ...(order === null || order === void 0 ? void 0 : (_order$customer = order.customer) === null || _order$customer === void 0 ? void 0 : _order$customer.location),
    title: t('YOUR_LOCATION', 'Your Location'),
    icon: (order === null || order === void 0 ? void 0 : (_order$customer2 = order.customer) === null || _order$customer2 === void 0 ? void 0 : _order$customer2.photo) || 'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png'
  }];
  useEffect(() => {
    if (driverLocation) {
      locations[0] = driverLocation;
    }
  }, [driverLocation]);
  return /*#__PURE__*/React.createElement(OrderDetailsContainer, null, /*#__PURE__*/React.createElement(Spinner, {
    visible: !order || Object.keys(order).length === 0
  }), order && Object.keys(order).length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, null, /*#__PURE__*/React.createElement(NavBack, null, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "arrow-left",
    onPress: () => handleArrowBack(),
    size: 24,
    color: colors.white,
    style: {
      marginBottom: 10
    }
  })), /*#__PURE__*/React.createElement(HeaderInfo, null, /*#__PURE__*/React.createElement(OIcon, {
    src: appLogo,
    height: 50,
    width: 150
  }), /*#__PURE__*/React.createElement(OText, {
    size: 24,
    color: colors.white
  }, order === null || order === void 0 ? void 0 : (_order$customer3 = order.customer) === null || _order$customer3 === void 0 ? void 0 : _order$customer3.name, " ", t('THANKS_ORDER', 'thanks for your order!')), /*#__PURE__*/React.createElement(OText, {
    color: colors.white
  }, t('ORDER_MESSAGE_HEADER_TEXT', 'Once business accepts your order, we will send you an email, thank you!')), /*#__PURE__*/React.createElement(View, {
    style: { ...styles.rowDirection,
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(OText, {
    size: 20,
    color: colors.white,
    space: true
  }, t('TOTAL', 'Total')), /*#__PURE__*/React.createElement(OText, {
    size: 20,
    color: colors.white
  }, parsePrice((order === null || order === void 0 ? void 0 : (_order$summary = order.summary) === null || _order$summary === void 0 ? void 0 : _order$summary.total) || (order === null || order === void 0 ? void 0 : order.total)))))), /*#__PURE__*/React.createElement(OrderContent, null, /*#__PURE__*/React.createElement(OrderBusiness, null, /*#__PURE__*/React.createElement(View, {
    style: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Logo, null, /*#__PURE__*/React.createElement(OIcon, {
    url: order === null || order === void 0 ? void 0 : (_order$business4 = order.business) === null || _order$business4 === void 0 ? void 0 : _order$business4.logo,
    style: styles.logo
  })), /*#__PURE__*/React.createElement(OText, {
    size: 20,
    style: styles.textBold
  }, order === null || order === void 0 ? void 0 : (_order$business5 = order.business) === null || _order$business5 === void 0 ? void 0 : _order$business5.name)), /*#__PURE__*/React.createElement(Icons, null, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "store",
    size: 28,
    color: colors.backgroundDark,
    onPress: () => props.navigation.navigate('Business', {
      store: businessData === null || businessData === void 0 ? void 0 : businessData.slug
    })
  }), /*#__PURE__*/React.createElement(TouchableOpacity, null, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "message-text-outline",
    size: 26,
    color: colors.backgroundDark,
    onPress: () => handleOpenMessages({
      business: true,
      driver: false
    })
  })))), /*#__PURE__*/React.createElement(View, {
    style: { ...styles.rowDirection,
      backgroundColor: colors.white
    }
  }, /*#__PURE__*/React.createElement(OrderInfo, null, /*#__PURE__*/React.createElement(OrderData, null, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, t('ORDER', 'Order'), " #", order === null || order === void 0 ? void 0 : order.id), /*#__PURE__*/React.createElement(OText, {
    color: colors.textSecondary
  }, t('DATE_TIME_FOR_ORDER', 'Date and time for your order')), /*#__PURE__*/React.createElement(OText, {
    size: 18
  }, order !== null && order !== void 0 && order.delivery_datetime_utc ? parseDate(order === null || order === void 0 ? void 0 : order.delivery_datetime_utc) : parseDate(order === null || order === void 0 ? void 0 : order.delivery_datetime, {
    utc: false
  })), /*#__PURE__*/React.createElement(StaturBar, null, /*#__PURE__*/React.createElement(LinearGradient, {
    start: {
      x: 0,
      y: 0
    },
    end: {
      x: ((_getOrderStatus = getOrderStatus(order === null || order === void 0 ? void 0 : order.status)) === null || _getOrderStatus === void 0 ? void 0 : _getOrderStatus.percentage) || 0,
      y: 0
    },
    locations: [1, 1],
    colors: [colors.primary, colors.disabled],
    style: styles.statusBar
  })))), /*#__PURE__*/React.createElement(OrderStatus, null, /*#__PURE__*/React.createElement(StatusImage, null, /*#__PURE__*/React.createElement(OIcon, {
    src: (_getOrderStatus2 = getOrderStatus(order === null || order === void 0 ? void 0 : order.status)) === null || _getOrderStatus2 === void 0 ? void 0 : _getOrderStatus2.image,
    width: 80,
    height: 80
  })), /*#__PURE__*/React.createElement(OText, {
    color: colors.primary
  }, (_getOrderStatus3 = getOrderStatus(order === null || order === void 0 ? void 0 : order.status)) === null || _getOrderStatus3 === void 0 ? void 0 : _getOrderStatus3.value))), /*#__PURE__*/React.createElement(OrderCustomer, null, /*#__PURE__*/React.createElement(OText, {
    size: 18
  }, t('CUSTOMER', 'Customer')), /*#__PURE__*/React.createElement(Customer, null, /*#__PURE__*/React.createElement(CustomerPhoto, null, /*#__PURE__*/React.createElement(OIcon, {
    url: user === null || user === void 0 ? void 0 : user.photo,
    width: 100,
    height: 100,
    style: styles.logo
  })), /*#__PURE__*/React.createElement(InfoBlock, null, /*#__PURE__*/React.createElement(OText, {
    size: 18
  }, order === null || order === void 0 ? void 0 : (_order$customer4 = order.customer) === null || _order$customer4 === void 0 ? void 0 : _order$customer4.name, " ", order === null || order === void 0 ? void 0 : (_order$customer5 = order.customer) === null || _order$customer5 === void 0 ? void 0 : _order$customer5.lastname), /*#__PURE__*/React.createElement(OText, null, order === null || order === void 0 ? void 0 : (_order$customer6 = order.customer) === null || _order$customer6 === void 0 ? void 0 : _order$customer6.address))), (order === null || order === void 0 ? void 0 : order.driver) && /*#__PURE__*/React.createElement(React.Fragment, null, (order === null || order === void 0 ? void 0 : (_order$driver3 = order.driver) === null || _order$driver3 === void 0 ? void 0 : _order$driver3.location) && parseInt(order === null || order === void 0 ? void 0 : order.status) === 9 && /*#__PURE__*/React.createElement(Map, null, /*#__PURE__*/React.createElement(GoogleMap, {
    location: order === null || order === void 0 ? void 0 : (_order$driver4 = order.driver) === null || _order$driver4 === void 0 ? void 0 : _order$driver4.location,
    locations: locations,
    readOnly: true
  })))), (order === null || order === void 0 ? void 0 : order.driver) && /*#__PURE__*/React.createElement(OrderDriver, null, /*#__PURE__*/React.createElement(OText, {
    size: 18
  }, t('YOUR_DRIVER', 'Your Driver')), /*#__PURE__*/React.createElement(Customer, null, /*#__PURE__*/React.createElement(CustomerPhoto, null, /*#__PURE__*/React.createElement(OIcon, {
    url: order === null || order === void 0 ? void 0 : (_order$driver5 = order.driver) === null || _order$driver5 === void 0 ? void 0 : _order$driver5.photo,
    width: 100,
    height: 100,
    style: styles.logo
  })), /*#__PURE__*/React.createElement(InfoBlock, null, /*#__PURE__*/React.createElement(OText, {
    size: 18
  }, order === null || order === void 0 ? void 0 : (_order$driver6 = order.driver) === null || _order$driver6 === void 0 ? void 0 : _order$driver6.name, " ", order === null || order === void 0 ? void 0 : (_order$driver7 = order.driver) === null || _order$driver7 === void 0 ? void 0 : _order$driver7.lastname), /*#__PURE__*/React.createElement(Icons, null, /*#__PURE__*/React.createElement(TouchableOpacity, null, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "message-text-outline",
    size: 24,
    color: colors.backgroundDark,
    onPress: () => handleOpenMessages({
      driver: true,
      business: false
    })
  })))))), /*#__PURE__*/React.createElement(OrderProducts, null, /*#__PURE__*/React.createElement(OText, {
    size: 18
  }, t('YOUR_ORDER', 'Your Order')), (order === null || order === void 0 ? void 0 : (_order$products = order.products) === null || _order$products === void 0 ? void 0 : _order$products.length) && (order === null || order === void 0 ? void 0 : order.products.map((product, i) => /*#__PURE__*/React.createElement(ProductItemAccordion, {
    key: (product === null || product === void 0 ? void 0 : product.id) || i,
    product: product
  })))), /*#__PURE__*/React.createElement(OrderBill, null, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(OText, null, t('SUBTOTAL', 'Subtotal')), /*#__PURE__*/React.createElement(OText, null, parsePrice((order === null || order === void 0 ? void 0 : (_order$summary2 = order.summary) === null || _order$summary2 === void 0 ? void 0 : _order$summary2.subtotal) || (order === null || order === void 0 ? void 0 : order.subtotal)))), /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(OText, null, (order === null || order === void 0 ? void 0 : order.tax_type) === 1 ? t('TAX_INCLUDED', 'Tax (included)') : t('TAX', 'Tax'), `(${parseNumber(order === null || order === void 0 ? void 0 : order.tax)}%)`), /*#__PURE__*/React.createElement(OText, null, parsePrice((order === null || order === void 0 ? void 0 : (_order$summary3 = order.summary) === null || _order$summary3 === void 0 ? void 0 : _order$summary3.tax) || (order === null || order === void 0 ? void 0 : order.totalTax)))), ((order === null || order === void 0 ? void 0 : (_order$summary4 = order.summary) === null || _order$summary4 === void 0 ? void 0 : _order$summary4.delivery_price) > 0 || (order === null || order === void 0 ? void 0 : order.deliveryFee) > 0) && /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(OText, null, t('DELIVERY_FEE', 'Delivery Fee')), /*#__PURE__*/React.createElement(OText, null, parsePrice((order === null || order === void 0 ? void 0 : (_order$summary5 = order.summary) === null || _order$summary5 === void 0 ? void 0 : _order$summary5.delivery_price) || (order === null || order === void 0 ? void 0 : order.deliveryFee)))), /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(OText, null, t('DRIVER_TIP', 'Driver tip'), ((order === null || order === void 0 ? void 0 : (_order$summary6 = order.summary) === null || _order$summary6 === void 0 ? void 0 : _order$summary6.driver_tip) > 0 || (order === null || order === void 0 ? void 0 : order.driver_tip) > 0) && `(${parseNumber(order === null || order === void 0 ? void 0 : order.driver_tip)}%)`), /*#__PURE__*/React.createElement(OText, null, parsePrice((order === null || order === void 0 ? void 0 : (_order$summary7 = order.summary) === null || _order$summary7 === void 0 ? void 0 : _order$summary7.driver_tip) || (order === null || order === void 0 ? void 0 : order.totalDriverTip)))), /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(OText, null, t('SERVICE_FEE', 'Service Fee'), `(${parseNumber(order === null || order === void 0 ? void 0 : order.service_fee)}%)`), /*#__PURE__*/React.createElement(OText, null, parsePrice((order === null || order === void 0 ? void 0 : (_order$summary8 = order.summary) === null || _order$summary8 === void 0 ? void 0 : _order$summary8.service_fee) || (order === null || order === void 0 ? void 0 : order.serviceFee) || 0))), ((order === null || order === void 0 ? void 0 : (_order$summary9 = order.summary) === null || _order$summary9 === void 0 ? void 0 : _order$summary9.discount) > 0 || (order === null || order === void 0 ? void 0 : order.discount) > 0) && /*#__PURE__*/React.createElement(Table, null, (order === null || order === void 0 ? void 0 : order.offer_type) === 1 ? /*#__PURE__*/React.createElement(OText, null, t('DISCOUNT', 'Discount'), /*#__PURE__*/React.createElement(OText, null, `(${parseNumber(order === null || order === void 0 ? void 0 : order.offer_rate)}%)`)) : /*#__PURE__*/React.createElement(OText, null, t('DISCOUNT', 'Discount')), /*#__PURE__*/React.createElement(OText, null, "- ", parsePrice((order === null || order === void 0 ? void 0 : (_order$summary10 = order.summary) === null || _order$summary10 === void 0 ? void 0 : _order$summary10.discount) || (order === null || order === void 0 ? void 0 : order.discount)))), /*#__PURE__*/React.createElement(Total, null, /*#__PURE__*/React.createElement(Table, null, /*#__PURE__*/React.createElement(OText, {
    style: styles.textBold
  }, t('TOTAL', 'Total')), /*#__PURE__*/React.createElement(OText, {
    style: styles.textBold,
    color: colors.primary
  }, parsePrice((order === null || order === void 0 ? void 0 : (_order$summary11 = order.summary) === null || _order$summary11 === void 0 ? void 0 : _order$summary11.total) || (order === null || order === void 0 ? void 0 : order.total)))))))), /*#__PURE__*/React.createElement(OModal, {
    open: openMessages.business || openMessages.driver,
    entireModal: true,
    onClose: () => handleCloseModal()
  }, /*#__PURE__*/React.createElement(Messages, {
    type: openMessages.business ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER,
    orderId: order === null || order === void 0 ? void 0 : order.id,
    messages: messages,
    order: order,
    setMessages: setMessages
  })));
};
const styles = StyleSheet.create({
  rowDirection: {
    flexDirection: 'row'
  },
  statusBar: {
    height: 10
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: 10
  },
  textBold: {
    fontWeight: 'bold'
  }
});
export const OrderDetails = props => {
  const orderDetailsProps = { ...props,
    UIComponent: OrderDetailsUI
  };
  return /*#__PURE__*/React.createElement(OrderDetailsConTableoller, orderDetailsProps);
};
//# sourceMappingURL=index.js.map