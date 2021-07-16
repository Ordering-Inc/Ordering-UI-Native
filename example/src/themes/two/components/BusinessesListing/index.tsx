import React, { useEffect, useRef } from 'react'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { View, StyleSheet, ScrollView, Platform, PanResponder, I18nManager } from 'react-native'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  BusinessList as BusinessesListingController,
  useLanguage,
  useSession,
  useOrder,
  useConfig,
  useUtils
} from 'ordering-components/native'

import { WelcomeTitle, Search, OrderControlContainer, AddressInput, WrapMomentOption } from './styles'

import NavBar from '../NavBar'
import { colors } from '../../theme.json'
import { SearchBar } from '../SearchBar'
import { OText } from '../../../../components/shared'
import { BusinessesListingParams } from '../../../../types'
import { NotFoundSource } from '../NotFoundSource'
import { BusinessTypeFilter } from '../BusinessTypeFilter'
import { BusinessController } from '../BusinessController'
import { OrderTypeSelector } from '../OrderTypeSelector'
import { ToastType, useToast } from '../../../../providers/ToastProvider'

const PIXELS_TO_SCROLL = 1200

const BusinessesListingUI = (props: BusinessesListingParams) => {
  const {
    navigation,
    businessesList,
    searchValue,
    getBusinesses,
    handleChangeBusinessType,
    handleBusinessClick,
    paginationProps,
    handleChangeSearch
  } = props
  const [, t] = useLanguage()
  const [{ user, auth }] = useSession()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig()
  const [{ parseDate }] = useUtils()
  const {showToast} = useToast()

  // const timerId = useRef<any>(false)
  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: (e, gestureState) => {
  //       const {dx, dy} = gestureState;
  //       resetInactivityTimeout()
  //       return (Math.abs(dx) > 20) || (Math.abs(dy) > 20);
  //     },
  //   })
  // ).current

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []

  const handleScroll = ({ nativeEvent }: any) => {
    const y = nativeEvent.contentOffset.y
    const height = nativeEvent.contentSize.height
    const hasMore = !(paginationProps.totalPages === paginationProps.currentPage)

    if (y + PIXELS_TO_SCROLL > height && !businessesList.loading && hasMore) {
      getBusinesses()
      showToast(ToastType.Info, 'loading more business')
    }
  }

  // const resetInactivityTimeout = () => {
  //   clearTimeout(timerId.current)
  //   timerId.current = setInterval(() => {
  //     getBusinesses(true)
  //   }, 600000)
  // }

  // useEffect(() => {
  //   resetInactivityTimeout()
  // }, [])

  return (
    <ScrollView style={styles.container} onScroll={(e) => handleScroll(e)}>
      {!auth && (
        <NavBar
          onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
          showCall={false}
          btnStyle={{ paddingLeft: 0 }}
          style={{ paddingBottom: 0 }}
        />
      )}
      {auth && (
        <WelcomeTitle>
          <View style={styles.welcome}>
            <OText style={{ fontWeight: 'bold' }} size={28} >
              {t('WELCOME_TITLE_APP', 'Hello there')}
            </OText>
            <View style={{ maxWidth: '65%' }}>
              <OText
                style={{ fontWeight: 'bold' }}
                size={28}
                color={colors.primary}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {I18nManager.isRTL ? `${user?.name}, ` : `, ${user?.name}`}
              </OText>
            </View>
          </View>
        </WelcomeTitle>
      )}
      <Search>
        <SearchBar
          onSearch={handleChangeSearch}
          searchValue={searchValue}
          lazyLoad
          isCancelXButtonShow={!!searchValue}
          borderStyle={styles.borderStyle}
          onCancel={() => handleChangeSearch('')}
          placeholder={t('FIND_BUSINESS', 'Find a Business')}
        />
      </Search>
      <OrderControlContainer>
        <View style={styles.wrapperOrderOptions}>
          <OrderTypeSelector configTypes={configTypes} />
          <WrapMomentOption
            onPress={() => navigation.navigate('MomentOption')}
          >
            <OText size={14} numberOfLines={1} ellipsizeMode='tail'>
              {orderState.options?.moment
                ? parseDate(orderState.options?.moment, { outputFormat: configs?.format_time?.value === '12' ? 'MM/DD hh:mma' : 'MM/DD HH:mm' })
                : t('ASAP_ABBREVIATION', 'ASAP')}
            </OText>
          </WrapMomentOption>
        </View>
        <AddressInput
          onPress={() => auth
            ? navigation.navigate('AddressList', { isFromBusinesses: true })
            : navigation.navigate('AddressForm', { address: orderState.options?.address,isFromBusinesses: true  })}
        >
          <MaterialComIcon
            name='home-outline'
            color={colors.primary}
            size={20}
            style={{ marginRight: 10 }}
          />
          <OText size={16} style={styles.inputStyle} numberOfLines={1}>
            {orderState?.options?.address?.address}
          </OText>
        </AddressInput>
      </OrderControlContainer>
      <BusinessTypeFilter
        images={props.images}
        businessTypes={props.businessTypes}
        defaultBusinessType={props.defaultBusinessType}
        handleChangeBusinessType={handleChangeBusinessType}
      />
      {
        !businessesList.loading && businessesList.businesses.length === 0 && (
          <NotFoundSource
            content={t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')}
          />
        )
      }
      {
        businessesList.businesses?.map((business: any) => (
          <BusinessController
            key={business.id}
            business={business}
            handleCustomClick={handleBusinessClick}
            orderType={orderState?.options?.type}
            isBusinessOpen={business?.open}
          />
        ))
      }
      {businessesList.loading && (
        <>
          {[...Array(paginationProps.nextPageItems ? paginationProps.nextPageItems : 8).keys()].map((item, i) => (
            <Placeholder Animation={Fade} key={i} style={{ marginBottom: 20 }}>
              <View style={{ width: '100%' }}>
                <PlaceholderLine height={200} style={{ marginBottom: 20, borderRadius: 25 }} />
                <View style={{ paddingHorizontal: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <PlaceholderLine height={25} width={40} style={{ marginBottom: 10 }} />
                    <PlaceholderLine height={25} width={20} style={{ marginBottom: 10 }} />
                  </View>
                  <PlaceholderLine height={20} width={30} style={{ marginBottom: 10 }} />
                  <PlaceholderLine height={20} width={80} style={{ marginBottom: 10 }} />
                </View>
              </View>
            </Placeholder>
          ))}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 20
  },
  welcome: {
    flex: 1,
    flexDirection: 'row'
  },
  inputStyle: {
    backgroundColor: colors.inputDisabled,
    flex: 1
  },
  wrapperOrderOptions: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 100
  },
  borderStyle: {
    borderColor: colors.backgroundGray,
    borderWidth: 1,
    borderRadius: 10,
  }
})

export const BusinessesListing = (props: BusinessesListingParams) => {

  const BusinessesListingProps = {
    ...props,
    isForceSearch: Platform.OS === 'ios',
    UIComponent: BusinessesListingUI
  }

  return <BusinessesListingController {...BusinessesListingProps} />
}
