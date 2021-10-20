import React from 'react'
import { StyleSheet } from 'react-native';
import { SafeAreaContainerLayout } from '../../themes/business/src/layouts/SafeAreaContainer'
import { OrdersOption } from '../../themes/business/src/components/OrdersOption'
import { useTheme } from 'styled-components/native'

const MyOrders = ({ navigation }: any) => {

  const theme = useTheme()

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
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundLight,
    },
  });

  return (
    <SafeAreaContainerLayout style={styles.container}>
      <OrdersOption {...MyOrderProps} />
    </SafeAreaContainerLayout>
  );
};

export default MyOrders;
