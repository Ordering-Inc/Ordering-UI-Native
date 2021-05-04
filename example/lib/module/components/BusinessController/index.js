import React from 'react';
import { BusinessController as BusinessSingleCard, useUtils, useOrder, useLanguage } from 'ordering-components/native';
import { OIcon, OText } from '../shared';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme';
import { convertHoursToMinutes } from '../../utils';
import { Card, BusinessHero, BusinessContent, BusinessCategory, BusinessInfo, Metadata, BusinessState, BusinessLogo, Reviews } from './styles';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
export const BusinessControllerUI = props => {
  var _business$reviews, _business$reviews2, _orderState$options;

  const {
    business,
    handleClick
  } = props;
  const [{
    parsePrice,
    parseDistance,
    parseNumber
  }] = useUtils();
  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const types = ['food', 'laundry', 'alcohol', 'groceries'];

  const getBusinessType = () => {
    if (Object.keys(business).length <= 0) return t('GENERAL', 'General');
    const _types = [];
    types.forEach(type => {
      if (business[type]) {
        _types.push(t(type.toUpperCase(), type));
      }
    });
    return _types.join(', ');
  };

  return /*#__PURE__*/React.createElement(Card, {
    onPress: () => handleClick(business)
  }, /*#__PURE__*/React.createElement(BusinessHero, {
    source: {
      uri: business === null || business === void 0 ? void 0 : business.header
    },
    imageStyle: styles.headerStyle,
    isClosed: business === null || business === void 0 ? void 0 : business.open
  }, (business === null || business === void 0 ? void 0 : business.featured) && /*#__PURE__*/React.createElement(View, {
    style: styles.featured
  }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    name: "crown",
    size: 26,
    color: "gold"
  })), !(business !== null && business !== void 0 && business.open) && /*#__PURE__*/React.createElement(View, {
    style: styles.closed
  }, /*#__PURE__*/React.createElement(OText, {
    size: 32,
    color: colors.white
  }, t('CLOSED', 'CLOSED'))), /*#__PURE__*/React.createElement(BusinessLogo, null, /*#__PURE__*/React.createElement(OIcon, {
    url: business === null || business === void 0 ? void 0 : business.logo,
    style: styles.businessLogo
  })), /*#__PURE__*/React.createElement(BusinessState, null, !(business !== null && business !== void 0 && business.open) && /*#__PURE__*/React.createElement(OText, {
    color: colors.white,
    size: 24,
    style: styles.businessState
  }, t('PREORDER', 'PREORDER')))), /*#__PURE__*/React.createElement(BusinessContent, null, /*#__PURE__*/React.createElement(BusinessInfo, null, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, business === null || business === void 0 ? void 0 : business.name), (business === null || business === void 0 ? void 0 : (_business$reviews = business.reviews) === null || _business$reviews === void 0 ? void 0 : _business$reviews.total) > 0 && /*#__PURE__*/React.createElement(Reviews, null, /*#__PURE__*/React.createElement(IconAntDesign, {
    name: "star",
    color: colors.primary,
    size: 16,
    style: styles.starIcon
  }), /*#__PURE__*/React.createElement(OText, null, parseNumber(business === null || business === void 0 ? void 0 : (_business$reviews2 = business.reviews) === null || _business$reviews2 === void 0 ? void 0 : _business$reviews2.total, {
    separator: '.'
  })))), /*#__PURE__*/React.createElement(BusinessCategory, null, /*#__PURE__*/React.createElement(OText, null, getBusinessType())), /*#__PURE__*/React.createElement(Metadata, null, /*#__PURE__*/React.createElement(View, {
    style: styles.bullet
  }, /*#__PURE__*/React.createElement(MaterialComIcon, {
    name: "alarm",
    size: 16
  }), /*#__PURE__*/React.createElement(OText, {
    style: styles.metadata
  }, convertHoursToMinutes((orderState === null || orderState === void 0 ? void 0 : (_orderState$options = orderState.options) === null || _orderState$options === void 0 ? void 0 : _orderState$options.type) === 1 ? business === null || business === void 0 ? void 0 : business.delivery_time : business === null || business === void 0 ? void 0 : business.pickup_time))), /*#__PURE__*/React.createElement(View, {
    style: styles.bullet
  }, /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "location-on",
    size: 16
  }), /*#__PURE__*/React.createElement(OText, {
    style: styles.metadata
  }, parseDistance(business === null || business === void 0 ? void 0 : business.distance))), /*#__PURE__*/React.createElement(View, {
    style: styles.bullet
  }, /*#__PURE__*/React.createElement(MaterialComIcon, {
    name: "truck-delivery",
    size: 16,
    style: {
      marginBottom: -2
    }
  }), /*#__PURE__*/React.createElement(OText, {
    style: styles.metadata
  }, parsePrice(business === null || business === void 0 ? void 0 : business.delivery_price))))));
};
const styles = StyleSheet.create({
  headerStyle: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25
  },
  businessLogo: {
    width: 75,
    height: 75,
    marginLeft: 20,
    marginBottom: 20,
    borderRadius: 25,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  businessState: {
    backgroundColor: colors.lightGray,
    opacity: 0.8,
    width: 150,
    textAlign: 'center',
    borderRadius: 25
  },
  metadata: {
    marginRight: 20,
    marginLeft: 5,
    marginBottom: -5
  },
  starIcon: {
    marginTop: 1.5,
    marginHorizontal: 5
  },
  featured: {
    position: 'absolute',
    padding: 8,
    backgroundColor: colors.backgroundDark,
    opacity: 0.8,
    borderRadius: 10,
    left: 20,
    top: 10
  },
  closed: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    opacity: 0.6,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
export const BusinessController = props => {
  const BusinessControllerProps = { ...props,
    UIComponent: BusinessControllerUI
  };
  return /*#__PURE__*/React.createElement(BusinessSingleCard, BusinessControllerProps);
};
//# sourceMappingURL=index.js.map