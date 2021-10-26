import React from 'react';
import { StyleSheet } from 'react-native';
import { OrdersOption } from '../../themes/business/src/components/OrdersOption'
import { SafeAreaContainerLayout } from '../../themes/business/src/layouts/SafeAreaContainer'
import { useTheme } from '../context/Theme'

const MyOrders = ({ navigation }: any) => {
  const [theme] = useTheme();
  const myOrderProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      navigation.navigate(page, params);
    },
    paginationSettings: {
      initialPage: 1,
      pageSize: 45,
      controlType: 'infinity',
    },
    orderGroupStatusCustom: {
      pending: [0, 13, 7, 4],
      inProgress: [3, 8, 9, 14, 18, 19, 20, 21],
    },
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundLight,
    },
  });

  return (
    <SafeAreaContainerLayout style={styles.container}>
      <OrdersOption {...myOrderProps} />
    </SafeAreaContainerLayout>
  )
}

export default MyOrders;
