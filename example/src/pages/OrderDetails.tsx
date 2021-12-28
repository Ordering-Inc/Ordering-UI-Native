import React from 'react';
import {useTheme} from '../context/Theme';
import { OrderDetailsBusiness as OrderDetailsController } from '../../themes/business/src/components/OrderDetails/Business'
import { SafeAreaContainerLayout } from '../../themes/business/src/layouts/SafeAreaContainer'
// import {
//   OrderDetailsBusiness as OrderDetailsController,
//   SafeAreaContainerLayout,
// } from 'ordering-ui-react-native/themes/business';

const OrderDetails = ({navigation, route}: any) => {
  const orderDetailsProps = {
    navigation,
    orderId: route.params?.orderId || route.params?.order?.id,
    driverAndBusinessId: true,
    order: route.params?.order,
    isFromCheckout: route.params?.isFromCheckout,
    isFromRoot: route.params?.isFromRoot,
    isFetchDrivers: true,
    isBusiness: true,
    isDisabledOrdersRoom: true,
    actions: {accept: 'acceptByBusiness', reject: 'rejectByBusiness'},
    titleAccept: {key: 'PREPARATION_TIME', text: 'Preparation time'},
    titleReject: {key: 'REJECT_ORDER', text: 'Reject Order'},
    appTitle: {key: 'BUSINESS_APP', text: 'Business App'},
  };

  return (
    <SafeAreaContainerLayout>
      <OrderDetailsController {...orderDetailsProps} />
    </SafeAreaContainerLayout>
  );
};

export default OrderDetails;
