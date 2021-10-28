import React, { useState } from 'react';
import { useLanguage } from 'ordering-components/native';
import { OrdersOption } from '../../themes/original/src/components/OrdersOption'
import { OText } from '../../themes/original/src/components/shared'
import { Container } from '../../themes/original/src/layouts/Container'
import { View } from 'react-native';

const MyOrders = ({ navigation }: any) => {
  const [, t] = useLanguage();
  const [ordersLength, setOrdersLength] = useState({
    activeOrdersLength: 0,
    previousOrdersLength: 0,
  });
  const myOrderProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) {
        return;
      }
      navigation.navigate(page, params);
    },
  };

  return (
    <Container noPadding>
      <OText
        size={24}
        mBottom={20}
        style={{ marginTop: 20, paddingHorizontal: 40 }}>
        {t('MY_ORDERS', 'My Orders')}
      </OText>
      <View style={{ paddingLeft: 40, paddingRight: 40 }}>
        <OrdersOption
          {...myOrderProps}
          activeOrders
          ordersLength={ordersLength}
          setOrdersLength={setOrdersLength}
        />
      </View>
      <View style={{ paddingLeft: 40, paddingRight: 40 }}>
        <OrdersOption
          {...myOrderProps}
          ordersLength={ordersLength}
          setOrdersLength={setOrdersLength}
        />
      </View>
    </Container>
  );
};

export default MyOrders;
