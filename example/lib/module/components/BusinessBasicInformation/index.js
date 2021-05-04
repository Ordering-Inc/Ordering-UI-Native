import React, { useState } from 'react';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconEvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useUtils, useOrder, useLanguage } from 'ordering-components/native';
import { OIcon, OText, OModal } from '../shared';
import { colors } from '../../theme';
import { convertHoursToMinutes } from '../../utils';
import { BusinessInformation } from '../BusinessInformation';
import { BusinessReviews } from '../BusinessReviews';
import { BusinessContainer, BusinessHeader, BusinessLogo, BusinessInfo, BusinessInfoItem, WrapReviews, WrapBusinessInfo } from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
const types = ['food', 'laundry', 'alcohol', 'groceries'];
export const BusinessBasicInformation = props => {
  var _orderState$options, _business$reviews, _business$reviews2;

  const {
    businessState,
    isBusinessInfoShow
  } = props;
  const {
    business,
    loading
  } = businessState;
  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const [{
    parsePrice,
    parseDistance,
    optimizeImage
  }] = useUtils();
  const [openBusinessInformation, setOpenBusinessInformation] = useState(false);
  const [openBusinessReviews, setOpenBusinessReviews] = useState(false);

  const getBusinessType = () => {
    if (Object.keys(business).length <= 0) return t('GENERAL', 'General');
    const _types = [];
    types.forEach(type => {
      var _type$replace;

      return business[type] && _types.push(t(`BUSINESS_TYPE_${type === null || type === void 0 ? void 0 : (_type$replace = type.replace(/\s/g, '_')) === null || _type$replace === void 0 ? void 0 : _type$replace.toUpperCase()}`, type));
    });
    return _types.join(', ');
  };

  return /*#__PURE__*/React.createElement(BusinessContainer, null, /*#__PURE__*/React.createElement(BusinessHeader, {
    style: isBusinessInfoShow ? styles.businesInfoheaderStyle : { ...styles.headerStyle,
      backgroundColor: colors.backgroundGray
    },
    source: {
      uri: business === null || business === void 0 ? void 0 : business.header
    }
  }, /*#__PURE__*/React.createElement(BusinessLogo, null, loading ? /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 60,
    width: 20,
    style: { ...styles.businessLogo
    }
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, !isBusinessInfoShow && /*#__PURE__*/React.createElement(OIcon, {
    url: optimizeImage(business === null || business === void 0 ? void 0 : business.logo, 'h_200,c_limit'),
    style: styles.businessLogo
  })))), /*#__PURE__*/React.createElement(BusinessInfo, {
    style: styles.businessInfo
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(BusinessInfoItem, null, loading ? /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 30,
    width: 20
  })) : /*#__PURE__*/React.createElement(OText, {
    size: 20,
    weight: "bold"
  }, business === null || business === void 0 ? void 0 : business.name), !isBusinessInfoShow && /*#__PURE__*/React.createElement(WrapBusinessInfo, {
    onPress: () => setOpenBusinessInformation(true)
  }, /*#__PURE__*/React.createElement(IconAntDesign, {
    name: "infocirlceo",
    color: colors.primary,
    size: 16
  }))), loading ? /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 10
  })) : /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(OText, {
    color: colors.textSecondary
  }, getBusinessType())), /*#__PURE__*/React.createElement(BusinessInfoItem, null, loading && /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 13,
    style: {
      marginRight: 10
    }
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 13,
    style: {
      marginRight: 10
    }
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 13
  }))), /*#__PURE__*/React.createElement(View, {
    style: styles.bullet
  }, /*#__PURE__*/React.createElement(IconEvilIcons, {
    name: "clock",
    color: colors.textSecondary,
    size: 16
  }), (orderState === null || orderState === void 0 ? void 0 : (_orderState$options = orderState.options) === null || _orderState$options === void 0 ? void 0 : _orderState$options.type) === 1 ? /*#__PURE__*/React.createElement(OText, {
    color: colors.textSecondary,
    style: styles.metadata
  }, convertHoursToMinutes(business === null || business === void 0 ? void 0 : business.delivery_time)) : /*#__PURE__*/React.createElement(OText, {
    color: colors.textSecondary,
    style: styles.metadata
  }, convertHoursToMinutes(business === null || business === void 0 ? void 0 : business.pickup_time))), /*#__PURE__*/React.createElement(View, {
    style: styles.bullet
  }, /*#__PURE__*/React.createElement(IconEvilIcons, {
    name: "location",
    color: colors.textSecondary,
    size: 16
  }), /*#__PURE__*/React.createElement(OText, {
    color: colors.textSecondary,
    style: styles.metadata
  }, parseDistance((business === null || business === void 0 ? void 0 : business.distance) || 0))), /*#__PURE__*/React.createElement(View, {
    style: styles.bullet
  }, /*#__PURE__*/React.createElement(MaterialComIcon, {
    name: "truck-delivery",
    color: colors.textSecondary,
    size: 16
  })), /*#__PURE__*/React.createElement(OText, {
    color: colors.textSecondary,
    style: styles.metadata
  }, business && parsePrice((business === null || business === void 0 ? void 0 : business.delivery_price) || 0)))), /*#__PURE__*/React.createElement(WrapReviews, null, /*#__PURE__*/React.createElement(View, {
    style: styles.reviewStyle
  }, /*#__PURE__*/React.createElement(IconAntDesign, {
    name: "star",
    color: colors.primary,
    size: 16,
    style: styles.starIcon
  }), /*#__PURE__*/React.createElement(OText, {
    size: 20,
    color: colors.textSecondary
  }, business === null || business === void 0 ? void 0 : (_business$reviews = business.reviews) === null || _business$reviews === void 0 ? void 0 : _business$reviews.total)), !isBusinessInfoShow && /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: () => setOpenBusinessReviews(true)
  }, /*#__PURE__*/React.createElement(OText, {
    color: colors.primary
  }, t('SEE_REVIEWS', 'See reviews'))))), /*#__PURE__*/React.createElement(OModal, {
    titleSectionStyle: styles.modalTitleSectionStyle,
    open: openBusinessInformation,
    onClose: () => setOpenBusinessInformation(false)
  }, /*#__PURE__*/React.createElement(BusinessInformation, {
    businessState: businessState,
    business: business
  })), /*#__PURE__*/React.createElement(OModal, {
    titleSectionStyle: styles.modalTitleSectionStyle,
    open: openBusinessReviews,
    onClose: () => setOpenBusinessReviews(false)
  }, /*#__PURE__*/React.createElement(BusinessReviews, {
    businessState: businessState,
    businessId: business.id,
    reviews: (_business$reviews2 = business.reviews) === null || _business$reviews2 === void 0 ? void 0 : _business$reviews2.reviews
  })));
};
const styles = StyleSheet.create({
  businesInfoheaderStyle: {
    height: 150
  },
  headerStyle: {
    height: 260
  },
  businessLogo: {
    width: 75,
    height: 75,
    borderRadius: 20,
    marginLeft: 20,
    marginBottom: 40,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  businessInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    transform: [{
      translateY: -20
    }]
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metadata: {
    marginRight: 20,
    marginLeft: 5
  },
  starIcon: {
    marginHorizontal: 5
  },
  reviewStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitleSectionStyle: {
    position: 'absolute',
    width: '100%',
    top: 0,
    zIndex: 100
  }
});
//# sourceMappingURL=index.js.map