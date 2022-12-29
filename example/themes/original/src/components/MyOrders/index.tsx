import React, { useState, useEffect } from 'react'
import { useLanguage } from 'ordering-components/native';
import { View, StyleSheet, RefreshControl, Platform } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { OrdersOption } from '../OrdersOption'
import { HeaderTitle, OButton, OText } from '../shared'
import { ScrollView } from 'react-native-gesture-handler';
import { Tab } from './styles'
import { useTheme } from 'styled-components/native';
import { Container } from '../../layouts/Container';

export const MyOrders = (props: any) => {
  const {
    navigation,
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
    activeOrdersLength: null,
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
  const isChewLayout = theme?.header?.components?.layout?.type === 'chew'
  const showNavbar = theme?.bar_menu?.components?.orders?.hidden

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

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
    <Container
      noPadding
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => handleOnRefresh()}
        />
      }
    >
      {(isChewLayout || showNavbar) && (
        <View style={{
          ...{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: isChewLayout ? 20 : 40,
          },
          ...props.titleStyle
        }}>
          {!props.hideBackBtn && !isChewLayout && (
            <OButton
              imgLeftStyle={{ width: 18 }}
              imgRightSrc={null}
              style={{
                borderWidth: 0,
                width: 26,
                height: 26,
                backgroundColor: '#FFF',
                borderColor: '#FFF',
                shadowColor: '#FFF',
                paddingLeft: 0,
                paddingRight: 0
              }}
              onClick={goToBack}
              icon={AntDesignIcon}
              iconProps={{
                name: 'arrowleft',
                size: 26
              }}
            />
          )}
          <HeaderTitle ph={0} text={t('MY_ORDERS', 'My Orders')} />
        </View>
      )}
      {!hideOrders && !isChewLayout && !showNavbar && (
        <HeaderTitle text={t('MY_ORDERS', 'My Orders')} />
      )}
      {!allEmpty && (
        <ScrollView
          horizontal
          style={{ ...styles.container, borderBottomWidth: 1 }}
          contentContainerStyle={{ paddingHorizontal: !!businessesSearchList ? 0 : isChewLayout ? 20 : 40 }}
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
          {ordersLength?.activeOrdersLength !== 0 && (
            <View style={{ paddingHorizontal: isChewLayout ? 20 : 40 }}>
              <OrdersOption
                {...props}
                activeOrders
                ordersLength={ordersLength}
                setOrdersLength={setOrdersLength}
                setRefreshOrders={setRefreshOrders}
                refreshOrders={refreshOrders}
              />
            </View>
          )}
          <View style={{ paddingHorizontal: isChewLayout ? 20 : 40 }}>
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
      {selectedOption === 'business' && (
        <OrdersOption
          {...props}
          isBusiness
          titleContent={t('PREVIOUSLY_ORDERED', 'Previously ordered')}
          hideOrders
          horizontal
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
      {selectedOption === 'products' && (
        <OrdersOption
          {...props}
          isProducts
          titleContent={t('PREVIOUSLY_ORDERED', 'Previously ordered')}
          hideOrders
          horizontal
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
