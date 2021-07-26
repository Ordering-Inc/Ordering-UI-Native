import React, { useState } from 'react'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { View, StyleSheet, ScrollView, Platform, PanResponder, I18nManager } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
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

import { BusinessListContainer, Divider, Search, OrderControlContainer, AddressInput, WrapMomentOption } from './styles'

import NavBar from '../../../../../components/NavBar'
import { SearchBar } from '../SearchBar'
import { OText } from '../../../../../components/shared'
import { OBottomPopup } from '../shared'
import { BusinessesListingParams } from '../../../../../types'
import { NotFoundSource } from '../../../../../components/NotFoundSource'
import { BusinessTypeFilter } from '../BusinessTypeFilter'
import { BusinessController } from '../BusinessController'
import { OrderTypeSelector } from '../OrderTypeSelector'
import { MomentOption } from '../MomentOption'
import { useTheme } from 'styled-components/native'

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

  const handleScroll = ({ nativeEvent }: any) => {
    const y = nativeEvent.contentOffset.y
    const height = nativeEvent.contentSize.height
    const hasMore = !(paginationProps.totalPages === paginationProps.currentPage)

    if (y + PIXELS_TO_SCROLL > height && !businessesList.loading && hasMore) {
      getBusinesses()
      showToast(ToastType.Info, 'loading more business')
    }
  }

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
        <OText color={theme.colors.green} mBottom={5}>
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
