import React, { useContext } from 'react'
// import { OrderDetails as OrderDetailsController } from '../components/OrderDetails'
import { OrderDetailsDelivery as OrderDetailsController } from '../../themes/business/src/components/OrderDetails/Delivery'
import { SafeAreaContainer } from '../layouts/SafeAreaContainer'
import { PermissionsContext } from '../context/PermissionsContext';

const OrderDetails = ({ navigation, route } : any) => {
  const { permissions, askLocationPermission, redirectToSettings } =
  useContext(PermissionsContext);

  const orderDetailsProps = {
    navigation,
    order: route.params?.order,
    driverAndBusinessId: true,
    orderId: route.params?.orderId || route.params?.order?.id,
    isFromCheckout: route.params?.isFromCheckout,
    isFromRoot: route.params?.isFromRoot,
    getDrivers: false,
    isDisabledOrdersRoom: true,
    actions: { accept: 'acceptByDriver', reject: 'rejectByDriver' },
    titleAccept: { key: 'DELIVERY_TIME', text: 'Delivery time' },
    titleReject: { key: 'REJECT_ORDER', text: 'Reject Order' },
    appTitle: { key: 'DELIVERY_APP', text: 'Delivery app' },
    permissions,
    askLocationPermission,
    redirectToSettings,
  }

  return (
    <SafeAreaContainer>
      <OrderDetailsController {...orderDetailsProps} />
    </SafeAreaContainer>
  )
}

export default OrderDetails;
