import React, { useState, useEffect } from 'react'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { View, StyleSheet, ScrollView, Platform, PanResponder, I18nManager } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Geolocation from '@react-native-community/geolocation'
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
  BusinessList as BusinessesListingController,
  useLanguage,
  useSession,
  useOrder,
  useConfig,
  useUtils,
  ToastType,
  useToast
} from 'ordering-components/native'

import { BusinessListContainer, Divider, Search, OrderControlContainer, AddressInput, WrapMomentOption, FarAwayMessage } from './styles'

import NavBar from '../NavBar'
import { SearchBar } from '../SearchBar'
import { OText } from '../shared'
import { OBottomPopup } from '../shared'
import { BusinessesListingParams } from '../../types'
import { NotFoundSource } from '../NotFoundSource'
import { BusinessTypeFilter } from '../BusinessTypeFilter'
import { BusinessController } from '../BusinessController'
import { OrderTypeSelector } from '../OrderTypeSelector'
import { MomentOption } from '../MomentOption'
import { HighestRatedBusinesses } from '../HighestRatedBusinesses'
import { useTheme } from 'styled-components/native'
import { getDistance } from '../../utils'

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

  const theme = useTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    wrapperOrderOptions: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      zIndex: 100,
      marginVertical: 15
    },
    borderStyle: {
      borderColor: theme.colors.backgroundGray,
      borderWidth: 1,
      borderRadius: 10,
    },
    iconStyle: {
			fontSize: 18,
			color: theme.colors.warning5,
			marginRight: 8
		},
		farAwayMsg: {
			paddingVertical: 6,
			paddingHorizontal: 20
		}
  })

  const [, t] = useLanguage()
  const [{ user, auth }] = useSession()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig()
  const [{ parseDate }] = useUtils()
  const [, {showToast}] = useToast()

  const [openMomentOption, setOpenMomentOption] = useState(false)
  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []
  const [isFarAway, setIsFarAway] = useState(false)

  const handleScroll = ({ nativeEvent }: any) => {
    const y = nativeEvent.contentOffset.y
    const height = nativeEvent.contentSize.height
    const hasMore = !(paginationProps.totalPages === paginationProps.currentPage)

    if (y + PIXELS_TO_SCROLL > height && !businessesList.loading && hasMore) {
      getBusinesses()
      showToast(ToastType.Info, 'loading more business')
    }
  }

  useEffect(() => {
		Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords
      const distance = getDistance(crd.latitude, crd.longitude, orderState?.options?.address?.location?.lat, orderState?.options?.address?.location?.lng)
      if (distance > 20) setIsFarAway(true)
			else setIsFarAway(false)
    }, (err) => {
      console.log(`ERROR(${err.code}): ${err.message}`)
    }, {
      enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
    })
  }, [orderState?.options?.address?.location])

  return (
    <BusinessListContainer>
      {!auth && (
        <NavBar
          onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
          showCall={false}
          btnStyle={{ paddingLeft: 0 }}
          style={{ paddingBottom: 0 }}
        />
      )}
      <OrderControlContainer>
        <OText color={theme.colors.green} style={{ marginVertical: 10 }}>
          {t('DELIVER_TO', 'Deliver to')}
        </OText>
        <AddressInput
          onPress={() => auth
            ? navigation.navigate('AddressList', { isFromBusinesses: true })
            : navigation.navigate('AddressForm', { address: orderState.options?.address,isFromBusinesses: true  })}
        >
          <OText size={16} numberOfLines={1} style={{ paddingHorizontal: 20 }}>
            {orderState?.options?.address?.address}
          </OText>
          <MaterialIcon
            name='keyboard-arrow-down'
            color={theme.colors.primary}
            size={20}
            style={{ marginRight: 10 }}
          />
        </AddressInput>
        {isFarAway && (
					<FarAwayMessage style={styles.farAwayMsg}>
						<Ionicons name='md-warning-outline' style={styles.iconStyle} />
						<OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textNormal}>{t('YOU_ARE_FAR_FROM_ADDRESS', 'You are far from this address')}</OText>
					</FarAwayMessage>
				)}
        <View style={styles.wrapperOrderOptions}>
          <OrderTypeSelector configTypes={configTypes} />
          <WrapMomentOption
            onPress={() => setOpenMomentOption(true)}
          >
            <OText size={14} color={theme.colors.white} numberOfLines={1} ellipsizeMode='tail'>
              {orderState.options?.moment
                ? parseDate(orderState.options?.moment, { outputFormat: configs?.format_time?.value === '12' ? 'MM/DD hh:mma' : 'MM/DD HH:mm' })
                : t('ASAP_ABBREVIATION', 'ASAP')}
            </OText>
          </WrapMomentOption>
        </View>
      </OrderControlContainer>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container} onScroll={(e) => handleScroll(e)}>
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

  			<HighestRatedBusinesses onBusinessClick={handleBusinessClick} />
        <Divider />

        <BusinessTypeFilter
          images={props.images}
          businessTypes={props.businessTypes}
          defaultBusinessType={props.defaultBusinessType}
          handleChangeBusinessType={handleChangeBusinessType}
        />
        <Divider />
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
                  <PlaceholderLine height={180} style={{ marginBottom: 20, borderRadius: 0 }} />
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
      <OBottomPopup
        customHeaderShow
        title={t('SELECT_DELIVERY_TIME', 'Select delivery time')}
        open={openMomentOption}
        onClose={() => setOpenMomentOption(false)}
      >
        <MomentOption
          onClose={() => setOpenMomentOption(false)}
        />
      </OBottomPopup>
    </BusinessListContainer>
  )
}

export const BusinessesListing = (props: BusinessesListingParams) => {

  const BusinessesListingProps = {
    ...props,
    isForceSearch: Platform.OS === 'ios',
    UIComponent: BusinessesListingUI
  }

  return <BusinessesListingController {...BusinessesListingProps} />
}
