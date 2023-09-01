import React, { useState, useEffect } from 'react'
import { useLanguage } from 'ordering-components/native';
import { View, StyleSheet, RefreshControl, Platform } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { GiftCardOrdersList } from '../GiftCard/GiftCardOrdersList'
import { OrdersOption } from '../OrdersOption'
import { HeaderTitle, OButton, OText } from '../shared'
import { ScrollView } from 'react-native-gesture-handler';
import { Tab } from './styles'
import { useTheme } from 'styled-components/native';
import { Container } from '../../layouts/Container';
import NavBar from '../NavBar'

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
    preordersLength: 0
  });
  const [selectedOption, setSelectedOption] = useState(!hideOrders ? 'orders' : 'business')

  const notOrderOptions = ['business', 'products']
  const allEmpty = (ordersLength?.activeOrdersLength === 0 && ordersLength?.previousOrdersLength === 0 && ordersLength?.preordersLength === 0) || ((isEmptyBusinesses || businessOrderIds?.length === 0) && hideOrders)

  const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
  const showNavbar = theme?.bar_menu?.components?.orders?.hidden
  const hideOrdersTheme = theme?.bar_menu?.components?.orders?.hidden
  const hideProductsTab = theme?.orders?.components?.products_tab?.hidden
  const hideBusinessTab = theme?.orders?.components?.business_tab?.hidden
  const MyOrdersMenu = [
    { key: 'orders', value: t('ORDERS', 'Orders'), disabled: false },
    { key: 'business', value: t('BUSINESS', 'Business'), disabled: hideBusinessTab },
    { key: 'products', value: t('PRODUCTS', 'Products'), disabled: hideProductsTab },
    { key: 'giftCards', value: t('GIFT_CARD', 'Gift card'), disabled: false }
  ]
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
            paddingHorizontal: 20,
          },
          ...props.titleStyle
        }}>
          {!props.hideBackBtn && (!isChewLayout || (isChewLayout && hideOrdersTheme)) && (
            <NavBar
              title={t('MY_ORDERS', 'My Orders')}
              titleAlign={'center'}
              onActionLeft={goToBack}
              showCall={false}
              paddingTop={30}
              btnStyle={{ paddingLeft: 0 }}
              buttonProps={{
                bgColor: theme.colors.white,
                borderColor: theme.colors.white,
                textStyle: { color: theme.colors.btnFont }
              }}
            />
          )}
        </View>
      )}
      {!hideOrders && !isChewLayout && !showNavbar && (
        <HeaderTitle text={t('MY_ORDERS', 'My Orders')} />
      )}
      {!allEmpty && (
        <ScrollView
          horizontal
          style={{ ...styles.container, borderBottomWidth: 1 }}
          contentContainerStyle={{ paddingHorizontal: !!businessesSearchList ? 0 : 20 }}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {MyOrdersMenu.filter(option => (!hideOrders || option.key !== 'orders') && !option.disabled).map(option => (
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
          <View style={{ paddingHorizontal: 20 }}>
            <OrdersOption
              {...props}
              preOrders
              ordersLength={ordersLength}
              setOrdersLength={setOrdersLength}
              setRefreshOrders={setRefreshOrders}
              refreshOrders={refreshOrders}
            />
          </View>
          <View style={{ paddingHorizontal: 20 }}>
            <OrdersOption
              {...props}
              activeOrders
              ordersLength={ordersLength}
              setOrdersLength={setOrdersLength}
              setRefreshOrders={setRefreshOrders}
              refreshOrders={refreshOrders}
            />
          </View>
          <View style={{ paddingHorizontal: 20 }}>
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
      
      {selectedOption === 'giftCards' && (
        <View style={{ paddingHorizontal: 20  }}>
          <GiftCardOrdersList
            onNavigationRedirect={props?.onNavigationRedirect}
          />
        </View>
      )}
    </Container>
  )
}
