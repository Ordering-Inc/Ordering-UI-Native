import React from 'react';
import { Button, Dimensions, View } from 'react-native';
import { useLanguage } from 'ordering-components/native';

import { Container } from '../layouts/Container';
import NavBar from '../components/NavBar';
import CustomerName from '../components/CustomerName';

const _dim = Dimensions.get('window');

const CustomerNamePage = (props: any): React.ReactElement => {
  const [, t] = useLanguage();

  const {
    navigation,
    route,
  } = props;

  const goToBack = () => navigation.goBack();

  const goNextPage = () => {
    // this method is called when user press button "Proceed to Pay" and field is not empty
    // Customer name is saved on local storage like STORAGE_KEY.CUSTOMER_NAME (constants placed on config/constants)
    console.log('Implement navigate to the "proceed to pay" page and delete this log')

    navigation?.navigate('PaymentMethods', { cartUuid: route?.params?.cartUuid })
  };

  return (
    <Container nopadding>
      <View style={{width: _dim.width, height: _dim.height}}>
        <View style={{paddingVertical: 20}}>
          <NavBar
            title={t('YOUR_NAME', 'Your Name')}
            onActionLeft={goToBack}
          />
        </View>

        <CustomerName
          onProceedToPay={goNextPage}/>
      </View>
    </Container>
  );
};

export default CustomerNamePage;
