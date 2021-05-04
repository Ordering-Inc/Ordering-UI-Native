import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { ReviewOrder as ReviewOrderController } from '../components/ReviewOrder';
import { Container } from '../layouts/Container';
const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

const ReviewOrder = ({
  navigation,
  route
}) => {
  const {
    order
  } = route.params;
  const reviewOrderProps = {
    navigation,
    order
  };
  return /*#__PURE__*/React.createElement(KeyboardView, {
    enabled: true,
    behavior: Platform.OS === 'ios' ? 'padding' : 'height'
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(ReviewOrderController, reviewOrderProps)));
};

export default ReviewOrder;
//# sourceMappingURL=ReviewOrder.js.map