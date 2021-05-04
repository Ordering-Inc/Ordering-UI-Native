import React from 'react';
import { useLanguage, useUtils } from 'ordering-components/native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { OButton, OIcon, OText } from '../shared';
import { Card, Logo, Information, MyOrderOptions, Status, WrappButton } from './styles';
import { colors } from '../../theme';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
export const PreviousOrders = props => {
  const {
    orders,
    pagination,
    onNavigationRedirect,
    loadMoreOrders,
    getOrderStatus,
    handleReorder,
    reorderLoading,
    orderID
  } = props;
  const [, t] = useLanguage();
  const [{
    parseDate
  }] = useUtils();
  const allowedOrderStatus = [1, 2, 5, 6, 10, 11, 12];

  const handleClickViewOrder = uuid => {
    onNavigationRedirect && onNavigationRedirect('OrderDetails', {
      orderId: uuid
    });
  };

  const handleClickOrderReview = order => {
    var _order$business;

    onNavigationRedirect && onNavigationRedirect('ReviewOrder', {
      order: {
        id: order === null || order === void 0 ? void 0 : order.id,
        business_id: order === null || order === void 0 ? void 0 : order.business_id,
        logo: (_order$business = order.business) === null || _order$business === void 0 ? void 0 : _order$business.logo
      }
    });
  };

  return /*#__PURE__*/React.createElement(ScrollView, {
    style: {
      height: '60%',
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement(Spinner, {
    visible: reorderLoading
  }), orders.map(order => {
    var _order$business2, _order$business3, _order$business4, _getOrderStatus;

    return /*#__PURE__*/React.createElement(Card, {
      key: order.id
    }, ((_order$business2 = order.business) === null || _order$business2 === void 0 ? void 0 : _order$business2.logo) && /*#__PURE__*/React.createElement(Logo, null, /*#__PURE__*/React.createElement(OIcon, {
      url: (_order$business3 = order.business) === null || _order$business3 === void 0 ? void 0 : _order$business3.logo,
      style: styles.logo
    })), /*#__PURE__*/React.createElement(Information, null, /*#__PURE__*/React.createElement(OText, {
      size: 16,
      numberOfLines: 1
    }, (_order$business4 = order.business) === null || _order$business4 === void 0 ? void 0 : _order$business4.name), /*#__PURE__*/React.createElement(OText, {
      size: 12,
      color: colors.textSecondary,
      numberOfLines: 1
    }, order !== null && order !== void 0 && order.delivery_datetime_utc ? parseDate(order === null || order === void 0 ? void 0 : order.delivery_datetime_utc) : parseDate(order === null || order === void 0 ? void 0 : order.delivery_datetime, {
      utc: false
    })), /*#__PURE__*/React.createElement(MyOrderOptions, null, /*#__PURE__*/React.createElement(TouchableOpacity, {
      onPress: () => handleClickViewOrder(order === null || order === void 0 ? void 0 : order.uuid)
    }, /*#__PURE__*/React.createElement(OText, {
      size: 10,
      color: colors.primary,
      mRight: 5,
      numberOfLines: 1
    }, t('MOBILE_FRONT_BUTTON_VIEW_ORDER', 'View order'))), allowedOrderStatus.includes(parseInt(order === null || order === void 0 ? void 0 : order.status)) && !order.review && /*#__PURE__*/React.createElement(TouchableOpacity, {
      onPress: () => handleClickOrderReview(order)
    }, /*#__PURE__*/React.createElement(OText, {
      size: 10,
      color: colors.primary,
      numberOfLines: 1
    }, t('REVIEW_ORDER', 'Review Order'))))), /*#__PURE__*/React.createElement(Status, null, /*#__PURE__*/React.createElement(OText, {
      color: colors.primary,
      size: 16,
      numberOfLines: 1
    }, (_getOrderStatus = getOrderStatus(order.status)) === null || _getOrderStatus === void 0 ? void 0 : _getOrderStatus.value), /*#__PURE__*/React.createElement(OButton, {
      text: t('REORDER', 'Reorder'),
      imgRightSrc: '',
      textStyle: styles.buttonText,
      style: styles.reorderbutton,
      onClick: () => handleReorder(order.id)
    })));
  }), pagination.totalPages && pagination.currentPage < pagination.totalPages && /*#__PURE__*/React.createElement(WrappButton, null, /*#__PURE__*/React.createElement(OButton, {
    onClick: loadMoreOrders,
    text: t('LOAD_MORE_ORDERS', 'Load more orders'),
    imgRightSrc: null,
    textStyle: {
      color: colors.white
    }
  })));
};
const styles = StyleSheet.create({
  logo: {
    borderRadius: 10,
    width: 75,
    height: 75
  },
  reorderbutton: {
    width: 80,
    height: 40,
    paddingLeft: 0,
    paddingRight: 0,
    borderRadius: 10,
    flex: 1
  },
  buttonText: {
    color: colors.white,
    fontSize: 12,
    marginLeft: 2,
    marginRight: 2
  }
});
//# sourceMappingURL=index.js.map