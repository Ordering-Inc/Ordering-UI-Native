import React from 'react';

import CustomerName from '../components/CustomerName';
import { SafeAreaContainer } from '../layouts/SafeAreaContainer';

const CustomerNamePage = (props: any): React.ReactElement => {

  const {
    navigation,
    route,
  } = props;

  const onProceedToPay = () => {
    // this method is called when user press button "Proceed to Pay" and field is not empty
    // Customer name is saved on local storage like STORAGE_KEY.CUSTOMER_NAME (constants placed on config/constants)
    console.log('Implement navigate to the "proceed to pay" page and delete this log')

    navigation?.navigate('PaymentMethods', { cartUuid: route?.params?.cartUuid })
  };

  const customerNameProps = {
    ...props,
    onProceedToPay,
  };

  return (
    <SafeAreaContainer>
      <CustomerName
        { ...customerNameProps }
      />
    </SafeAreaContainer>
  );
};

export default CustomerNamePage;
