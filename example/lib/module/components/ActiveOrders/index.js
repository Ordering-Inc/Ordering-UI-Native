import React from 'react';
import { useLanguage, useUtils, useConfig } from 'ordering-components/native';
import { OButton, OIcon, OText } from '../shared';
import { ActiveOrdersContainer, Card, Map, Information, Logo, OrderInformation, BusinessInformation, Price } from './styles';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { getGoogleMapImage } from '../../utils';
export const ActiveOrders = props => {
  var _configs$google_maps_5;

  const {
    onNavigationRedirect,
    orders,
    pagination,
    loadMoreOrders,
    getOrderStatus
  } = props;
  const [{
    configs
  }] = useConfig();
  const [, t] = useLanguage();
  const [{
    parseDate,
    parsePrice
  }] = useUtils();

  const handleClickCard = uuid => {
    onNavigationRedirect && onNavigationRedirect('OrderDetails', {
      orderId: uuid
    });
  };

  const Order = ({
    order,
    index
  }) => {
    var _configs$google_maps_, _configs$google_maps_2, _order$business, _configs$google_maps_3, _order$business2, _order$business3, _order$business4, _order$summary, _getOrderStatus, _configs$google_maps_4;

    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
      isMiniCard: configs === null || configs === void 0 ? void 0 : (_configs$google_maps_ = configs.google_maps_api_key) === null || _configs$google_maps_ === void 0 ? void 0 : _configs$google_maps_.value,
      onPress: () => handleClickCard(order === null || order === void 0 ? void 0 : order.uuid)
    }, (configs === null || configs === void 0 ? void 0 : (_configs$google_maps_2 = configs.google_maps_api_key) === null || _configs$google_maps_2 === void 0 ? void 0 : _configs$google_maps_2.value) && /*#__PURE__*/React.createElement(Map, null, /*#__PURE__*/React.createElement(OIcon, {
      url: getGoogleMapImage(order === null || order === void 0 ? void 0 : (_order$business = order.business) === null || _order$business === void 0 ? void 0 : _order$business.location, configs === null || configs === void 0 ? void 0 : (_configs$google_maps_3 = configs.google_maps_api_key) === null || _configs$google_maps_3 === void 0 ? void 0 : _configs$google_maps_3.value),
      height: 100,
      width: 340,
      style: {
        resizeMode: 'cover',
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24
      }
    })), /*#__PURE__*/React.createElement(Information, null, ((_order$business2 = order.business) === null || _order$business2 === void 0 ? void 0 : _order$business2.logo) && /*#__PURE__*/React.createElement(Logo, null, /*#__PURE__*/React.createElement(OIcon, {
      url: (_order$business3 = order.business) === null || _order$business3 === void 0 ? void 0 : _order$business3.logo,
      style: styles.logo
    })), /*#__PURE__*/React.createElement(OrderInformation, null, /*#__PURE__*/React.createElement(BusinessInformation, null, /*#__PURE__*/React.createElement(OText, {
      size: 16
    }, (_order$business4 = order.business) === null || _order$business4 === void 0 ? void 0 : _order$business4.name), /*#__PURE__*/React.createElement(View, {
      style: styles.orderNumber
    }, /*#__PURE__*/React.createElement(OText, {
      size: 12,
      space: true,
      color: colors.textSecondary
    }, t('ORDER_NUMBER', 'Order No.')), /*#__PURE__*/React.createElement(OText, {
      size: 12,
      color: colors.textSecondary
    }, order.id)), /*#__PURE__*/React.createElement(OText, {
      size: 12,
      color: colors.textSecondary
    }, order !== null && order !== void 0 && order.delivery_datetime_utc ? parseDate(order === null || order === void 0 ? void 0 : order.delivery_datetime_utc) : parseDate(order === null || order === void 0 ? void 0 : order.delivery_datetime, {
      utc: false
    }))), /*#__PURE__*/React.createElement(Price, null, /*#__PURE__*/React.createElement(OText, {
      size: 16
    }, parsePrice((order === null || order === void 0 ? void 0 : (_order$summary = order.summary) === null || _order$summary === void 0 ? void 0 : _order$summary.total) || (order === null || order === void 0 ? void 0 : order.total))), (order === null || order === void 0 ? void 0 : order.status) !== 0 && /*#__PURE__*/React.createElement(OText, {
      color: colors.primary,
      size: 12,
      numberOfLines: 2
    }, (_getOrderStatus = getOrderStatus(order.status)) === null || _getOrderStatus === void 0 ? void 0 : _getOrderStatus.value))))), (pagination === null || pagination === void 0 ? void 0 : pagination.totalPages) && (pagination === null || pagination === void 0 ? void 0 : pagination.currentPage) < (pagination === null || pagination === void 0 ? void 0 : pagination.totalPages) && index === 10 * (pagination === null || pagination === void 0 ? void 0 : pagination.currentPage) - 1 && /*#__PURE__*/React.createElement(Card, {
      style: { ...styles.loadOrders,
        height: configs !== null && configs !== void 0 && (_configs$google_maps_4 = configs.google_maps_api_key) !== null && _configs$google_maps_4 !== void 0 && _configs$google_maps_4.value ? 200 : 100
      },
      onPress: loadMoreOrders
    }, /*#__PURE__*/React.createElement(OButton, {
      bgColor: colors.white,
      textStyle: {
        color: colors.primary,
        fontSize: 20
      },
      text: t('LOAD_MORE_ORDERS', 'Load more orders'),
      borderColor: colors.white,
      style: {
        paddingLeft: 30,
        paddingRight: 30
      }
    })));
  };

  return /*#__PURE__*/React.createElement(ActiveOrdersContainer, {
    showsVerticalScrollIndicator: false,
    showsHorizontalScrollIndicator: false,
    horizontal: true,
    isMiniCards: configs === null || configs === void 0 ? void 0 : (_configs$google_maps_5 = configs.google_maps_api_key) === null || _configs$google_maps_5 === void 0 ? void 0 : _configs$google_maps_5.value
  }, orders.length > 0 && orders.map((order, index) => /*#__PURE__*/React.createElement(Order, {
    key: (order === null || order === void 0 ? void 0 : order.id) || (order === null || order === void 0 ? void 0 : order.uuid),
    order: order,
    index: index
  })));
};
const styles = StyleSheet.create({
  logo: {
    borderRadius: 10,
    width: 75,
    height: '100%'
  },
  orderNumber: {
    flexDirection: 'row'
  },
  loadOrders: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 230
  }
});
//# sourceMappingURL=index.js.map