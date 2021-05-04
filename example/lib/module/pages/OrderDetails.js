import React from 'react';
import { OrderDetails as OrderDetailsController } from '../components/OrderDetails';
import { SafeAreaContainer } from '../layouts/SafeAreaContainer';

const OrderDetails = ({
  navigation,
  route
}) => {
  const {
    orderId,
    isFromCheckout
  } = route.params;
  const orderDetailsProps = {
    navigation,
    orderId,
    isFromCheckout
  };
  return /*#__PURE__*/React.createElement(SafeAreaContainer, null, /*#__PURE__*/React.createElement(OrderDetailsController, orderDetailsProps));
};

export default OrderDetails;
//# sourceMappingURL=OrderDetails.js.map