import React, { useState } from 'react'
import { BusinessList as BusinessesListingController, useLanguage, useSession, useOrder, useConfig, useUtils } from 'ordering-components/native'
import { BusinessTypeFilter } from '../BusinessTypeFilter'
import { BusinessController } from '../BusinessController'
import { SearchBar } from '../SearchBar'
import { NotFoundSource } from '../NotFoundSource'
import { WelcomeTitle, Search, OrderControlContainer, AddressInput, WrapMomentOption } from './styles'
import { OText, OIcon, OModal } from '../shared'
import { colors } from '../../theme'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { BusinessesListingParams } from '../../types'
import { View, StyleSheet, ScrollView } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
import NavBar from '../NavBar'
import { OrderTypeSelector } from '../OrderTypeSelector'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
const PIXELS_TO_SCROLL = 1000

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

  const [isOpenAddressForm, setIsOpenAddressForm] = useState(false)


  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []

  const handleScroll = ({ nativeEvent }: any) => {
    const y = nativeEvent.contentOffset.y
    const height = nativeEvent.contentSize.height
    const hasMore = !(paginationProps.totalPages === paginationProps.currentPage)

    if (y + PIXELS_TO_SCROLL > height && !businessesList.loading && hasMore) {
      getBusinesses()
    }
  }

  const handleCloseAddressForm = () => {
    setIsOpenAddressForm(false)
  }

  return (
    <ScrollView style={styles.container} onScroll={(e) => handleScroll(e)}>
      {!auth && (
        <NavBar
          onActionLeft={() => navigation.goBack()}
          showCall={false}
          btnStyle={{ paddingLeft: 0 }}
        />
      )}
      {auth && (
        <WelcomeTitle>
          <View style={styles.welcome}>
            <OText style={{ fontWeight: 'bold' }} size={28} >
              {t('WELCOME_TITLE_APP', 'Hello there, ')}
            </OText>
            <OText style={{ fontWeight: 'bold' }} size={28} color={colors.primary}>
              {user?.name}
            </OText>
          </View>
        </WelcomeTitle>
      )}
      <Search>
        <SearchBar onSearch={handleChangeSearch} searchValue={searchValue} lazyLoad placeholder={t('FIND_BUSINESS', 'Find a Business')} />
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
        handleChangeBusinessType={handleChangeBusinessType}
      />
      {
        !businessesList.loading && businessesList.businesses.length === 0 && (
          <NotFoundSource
            content={t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')}
          />
        )
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
      {
        !businessesList.loading && businessesList.businesses?.map((business: any) => (
          <BusinessController
            key={business.id}
            business={business}
            handleCustomClick={handleBusinessClick}
            orderType={orderState?.options?.type}
          />
        ))
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
    marginBottom: 10
  }
})

export const BusinessesListing = (props: BusinessesListingParams) => {

  const BusinessesListingProps = {
    ...props,
    UIComponent: BusinessesListingUI
  }

  return <BusinessesListingController {...BusinessesListingProps} />
}
