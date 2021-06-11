import React, {useRef} from 'react';
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import {useLanguage, useApi} from 'ordering-components/native';

import {Container} from '../layouts/Container';
import NavBar from '../components/NavBar';
import CustomerName from "../components/CustomerName";
import {OButton} from "../components/shared";

const _dim = Dimensions.get('window');

const CustomerNamePage = (props: any): React.ReactElement => {
  const [, t] = useLanguage();
  const [ordering] = useApi();
  const refRBSheet = useRef<any>(null);

  const {
    navigation
  } = props;

  const businessProductsListingProps = {
    ...props,
    ordering,
    isSearchByName: true,
    isSearchByDescription: true,
    slug: '41',
    categoryId: null,
    productId: null,
    langFallbacks: null,
    handleSearchRedirect: () => {
    },
    onProductRedirect: (x: any) => {
    },
    onCheckoutRedirect: (cartUuid: any) => {
    }
  };

  const goToBack = () => navigation.goBack();

  const goNext = () => {
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
          refRBSheet={refRBSheet}
        >

        </CustomerName>

        <OButton
          style={styles.buttonStyle}
          text={t('PROCEED_TO_PAY', 'Proceed to Pay')}
          onClick={goNext}/>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    height: 44,
    margin: 16
  },
});

export default CustomerNamePage;
