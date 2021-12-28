import React from 'react';
import { StyleSheet } from 'react-native';
// import { useTheme } from '../context/Theme';
import { OrdersOption } from '../../themes/business/src/components/OrdersOption'
import { SafeAreaContainerLayout } from '../../themes/business/src/layouts/SafeAreaContainer'

const MyOrders = (props: any) => {
  // const [theme] = useTheme();
  const { navigation } = props;

  const MyOrderProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return;
      navigation.navigate(page, params);
    },
    paginationSettings: {
      initialPage: 1,
      pageSize: 50,
      controlType: 'infinity'
    },
    isBusinessApp: true
  };

  const styles = StyleSheet.create({
    container: {
      // backgroundColor: theme.colors.backgroundLight,
    },
  });

  return (
    <SafeAreaContainerLayout style={styles.container}>
      <OrdersOption {...MyOrderProps} />
    </SafeAreaContainerLayout>
  );
};

export default MyOrders;
