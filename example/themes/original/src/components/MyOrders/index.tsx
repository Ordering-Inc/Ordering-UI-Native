import React, { useState, useEffect } from 'react'
import { useLanguage } from 'ordering-components/native';
import { View, StyleSheet, RefreshControl } from 'react-native';

import { OrdersOption } from '../OrdersOption'
import { HeaderTitle, OText } from '../shared'
import { ScrollView } from 'react-native-gesture-handler';
import { Tab } from './styles'
import { useTheme } from 'styled-components/native';
import { Container } from '../../layouts/Container';

export const MyOrders = (props: any) => {
  const {
    hideOrders,
    businessesSearchList
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()
  const [refreshing] = useState(false);
  const [refreshOrders, setRefreshOrders] = useState(false)
  const [isEmptyBusinesses, setIsEmptyBusinesses] = useState(false)
  const [businessOrderIds, setBusinessOrderIds] = useState([])
  const [ordersLength, setOrdersLength] = useState({
    activeOrdersLength: 0,
    previousOrdersLength: 0,
  });
  const [selectedOption, setSelectedOption] = useState(!hideOrders ? 'orders' : 'business')

  const notOrderOptions = ['business', 'products']
  const allEmpty = (ordersLength?.activeOrdersLength === 0 && ordersLength?.previousOrdersLength === 0) || ((isEmptyBusinesses || businessOrderIds?.length === 0) && hideOrders)
  const MyOrdersMenu = [
    { key: 'orders', value: t('ORDERS', 'Orders') },
    { key: 'business', value: t('BUSINESS', 'Business') },
    { key: 'products', value: t('PRODUCTS', 'Products') }
  ]

  const handleOnRefresh = () => {
    setRefreshOrders(true);
  }

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 5,
      borderColor: theme.colors.clear,
      backgroundColor: '#FFF'
    },
    featuredStyle: {
      display: 'none',
    },
    tabStyle: {
      marginTop: 10,
      height: 4,
      borderTopStartRadius: 4,
      borderTopEndRadius: 4,
      backgroundColor: theme.colors.textPrimary,
    },
    tabDeactived: {
      marginTop: 10,
      height: 4
    }
  });

  return (
    <Container noPadding refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={() => handleOnRefresh()}
      />
    }>
      {!hideOrders && (
        <HeaderTitle text={t('MY_ORDERS', 'My Orders')} />
      )}
      {!allEmpty && (
        <ScrollView
          horizontal
          style={{ ...styles.container, borderBottomWidth: 1 }}
          contentContainerStyle={{ paddingHorizontal: !!businessesSearchList ? 0 : 40 }}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {MyOrdersMenu.filter(option => !hideOrders || option.key !== 'orders').map(option => (
            <Tab
              key={option.key}
              onPress={() => setSelectedOption(option.key)}
              style={
                {
                  borderBottomColor:
                    selectedOption === option.key
                      ? theme.colors.textNormal
                      : theme.colors.border,
                }
              }
            >
              <OText>{option?.value}</OText>
            </Tab>
          ))}
        </ScrollView>
      )}
      {selectedOption === 'orders' && (
        <>
          <View style={{ paddingLeft: 40, paddingRight: 40 }}>
            <OrdersOption
              {...props}
              activeOrders
              ordersLength={ordersLength}
              setOrdersLength={setOrdersLength}
              setRefreshOrders={setRefreshOrders}
              refreshOrders={refreshOrders}
            />
          </View>
          <View style={{ paddingLeft: 40, paddingRight: 40 }}>
            <OrdersOption
              {...props}
              ordersLength={ordersLength}
              setOrdersLength={setOrdersLength}
              setRefreshOrders={setRefreshOrders}
              refreshOrders={refreshOrders}
            />
          </View>
        </>
      )}
      {notOrderOptions.includes(selectedOption) && (
        <OrdersOption
          {...props}
          titleContent={t('PREVIOUSLY_ORDERED', 'Previously ordered')}
          hideOrders
          horizontal
          isBusiness={selectedOption === 'business'}
          isProducts={selectedOption === 'products'}
          activeOrders
          pastOrders
          preOrders
          businessesSearchList={businessesSearchList}
          setIsEmptyBusinesses={setIsEmptyBusinesses}
          businessOrderIds={businessOrderIds}
          setBusinessOrderIds={setBusinessOrderIds}
          ordersLength={ordersLength}
          setOrdersLength={setOrdersLength}
        />
      )}
    </Container>

  )
}
