import React from 'react';
import { BusinessReviews as BusinessReviewController, useLanguage } from 'ordering-components/native';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Spinner from 'react-native-loading-spinner-overlay';
import { BusinessBasicInformation } from '../BusinessBasicInformation';
import { View, StyleSheet } from 'react-native';
import { OText } from '../shared';
import { colors } from '../../theme';
import { BusinessReviewsContainer, ScoreView, BusinessReviewContent, WrapCustomerReview, WrapCustomerReviewTotal } from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import { GrayBackground } from '../BusinessInformation/styles';

const Score = ({
  star,
  text
}) => /*#__PURE__*/React.createElement(ScoreView, null, /*#__PURE__*/React.createElement(View, {
  style: styles.reviewScoreStyle
}, /*#__PURE__*/React.createElement(IconAntDesign, {
  name: "star",
  color: colors.primary,
  size: 16,
  style: styles.starIcon
}), /*#__PURE__*/React.createElement(OText, null, star)), /*#__PURE__*/React.createElement(OText, null, text));

const BusinessReviewsUI = props => {
  var _businessState$busine, _businessState$busine2, _businessState$busine3, _businessState$busine4, _businessState$busine5, _businessState$busine6, _businessState$busine7, _businessState$busine8;

  const {
    businessState,
    reviewsList
  } = props;
  const [, t] = useLanguage();
  return /*#__PURE__*/React.createElement(BusinessReviewsContainer, null, /*#__PURE__*/React.createElement(BusinessBasicInformation, {
    isBusinessInfoShow: true,
    businessState: businessState
  }), /*#__PURE__*/React.createElement(Spinner, {
    visible: reviewsList.loading
  }), /*#__PURE__*/React.createElement(BusinessReviewContent, null, reviewsList.error ? /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, t('ERROR_UNKNOWN', 'An error has ocurred')) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ScrollView, {
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    style: styles.wrapTotalScoresStyle
  }, /*#__PURE__*/React.createElement(Score, {
    star: businessState === null || businessState === void 0 ? void 0 : (_businessState$busine = businessState.business) === null || _businessState$busine === void 0 ? void 0 : (_businessState$busine2 = _businessState$busine.reviews) === null || _businessState$busine2 === void 0 ? void 0 : _businessState$busine2.quality,
    text: t('REVIEW_QUALITY', 'Quality of products')
  }), /*#__PURE__*/React.createElement(Score, {
    star: businessState === null || businessState === void 0 ? void 0 : (_businessState$busine3 = businessState.business) === null || _businessState$busine3 === void 0 ? void 0 : (_businessState$busine4 = _businessState$busine3.reviews) === null || _businessState$busine4 === void 0 ? void 0 : _businessState$busine4.delivery,
    text: t('REVIEW_PUNCTUALITY', 'Punctuality')
  }), /*#__PURE__*/React.createElement(Score, {
    star: businessState === null || businessState === void 0 ? void 0 : (_businessState$busine5 = businessState.business) === null || _businessState$busine5 === void 0 ? void 0 : (_businessState$busine6 = _businessState$busine5.reviews) === null || _businessState$busine6 === void 0 ? void 0 : _businessState$busine6.service,
    text: t('REVIEW_SERVICE', 'Service')
  }), /*#__PURE__*/React.createElement(Score, {
    star: businessState === null || businessState === void 0 ? void 0 : (_businessState$busine7 = businessState.business) === null || _businessState$busine7 === void 0 ? void 0 : (_businessState$busine8 = _businessState$busine7.reviews) === null || _businessState$busine8 === void 0 ? void 0 : _businessState$busine8.package,
    text: t('REVIEW_PRODUCT_PACKAGING', 'Product Packaging')
  })), /*#__PURE__*/React.createElement(GrayBackground, null, /*#__PURE__*/React.createElement(OText, {
    weight: "bold",
    size: 16
  }, t('CUSTOMERS_REVIEWS', 'Customers Reviews'))), reviewsList === null || reviewsList === void 0 ? void 0 : reviewsList.reviews.map(review => /*#__PURE__*/React.createElement(WrapCustomerReview, {
    key: review.id
  }, /*#__PURE__*/React.createElement(WrapCustomerReviewTotal, null, /*#__PURE__*/React.createElement(View, {
    style: styles.reviewScoreStyle
  }, /*#__PURE__*/React.createElement(IconAntDesign, {
    name: "star",
    color: colors.primary,
    size: 16,
    style: styles.starIcon
  }), /*#__PURE__*/React.createElement(OText, null, review.total)), /*#__PURE__*/React.createElement(OText, {
    mLeft: 20
  }, review.comment)), /*#__PURE__*/React.createElement(ScrollView, {
    horizontal: true,
    showsHorizontalScrollIndicator: false
  }, /*#__PURE__*/React.createElement(Score, {
    star: review.quality,
    text: t('REVIEW_QUALITY', 'Quality of products')
  }), /*#__PURE__*/React.createElement(Score, {
    star: review.delivery,
    text: t('REVIEW_PUNCTUALITY', 'Punctuality')
  }), /*#__PURE__*/React.createElement(Score, {
    star: review.service,
    text: t('REVIEW_SERVICE', 'Service')
  }), /*#__PURE__*/React.createElement(Score, {
    star: review.package,
    text: t('REVIEW_PRODUCT_PACKAGING', 'Product Packaging')
  }))))), !reviewsList.loading && (reviewsList === null || reviewsList === void 0 ? void 0 : reviewsList.reviews.length) === 0 && /*#__PURE__*/React.createElement(OText, null, t('REVIEWS_NOT_FOUND', 'Reviews Not Found'))));
};

const styles = StyleSheet.create({
  starIcon: {
    marginRight: 5
  },
  reviewScoreStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapTotalScoresStyle: {
    maxHeight: 80,
    height: 80,
    marginBottom: 20
  }
});
export const BusinessReviews = props => {
  const BusinessReviewProps = { ...props,
    UIComponent: BusinessReviewsUI
  };
  return /*#__PURE__*/React.createElement(BusinessReviewController, BusinessReviewProps);
};
//# sourceMappingURL=index.js.map