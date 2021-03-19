import React from 'react'
import { BusinessList as BusinessesListingController, useLanguage, useSession, useOrder, useConfig, useUtils } from 'ordering-components/native'
import { BusinessTypeFilter } from '../BusinessTypeFilter'
import { BusinessController } from '../BusinessController'
import { SearchBar } from '../SearchBar'
import { NotFoundSource } from '../NotFoundSource'
import { WelcomeTitle, Search, OrderControlContainer, AddressInput, WrapMomentOption } from './styles'
import { OText, OIcon, ODropDown } from '../shared'
import { colors } from '../../theme'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { BusinessesListingParams } from '../../types'
import { View, StyleSheet, ScrollView } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
import NavBar from '../NavBar'
import { OrderTypeSelector } from '../OrderTypeSelector'
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
    handleChangeSearch,
    onRedirect
  } = props
  const [, t] = useLanguage()
  const [{ user, auth }] = useSession()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig()
  const [{ parseDate }] = useUtils()

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []

  const handleScroll = ({ nativeEvent }: any) => {
    const y = nativeEvent.contentOffset.y
    const height = nativeEvent.contentSize.height
    const hasMore = !(paginationProps.totalPages === paginationProps.currentPage)

    if (y + PIXELS_TO_SCROLL > height && !businessesList.loading && hasMore) {
      getBusinesses()
    }
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
            <OText style={{fontWeight: 'bold'}} size={28} >
              {t('WELCOME_TITLE_APP', 'Hello there, ')}
            </OText>
            <OText style={{fontWeight: 'bold'}} size={28} color={colors.primary}>
              {user?.name}
            </OText>
          </View>
          <OIcon
            url={user?.photo}
            width={80}
            height={80}
            style={{ borderRadius: 6 }}
          />
        </WelcomeTitle>
      )}
      <Search>
        <SearchBar onSearch={handleChangeSearch} searchValue={searchValue} lazyLoad />
      </Search>
      <OrderControlContainer>
        <OrderTypeSelector configTypes={configTypes} />
        <AddressInput
          onPress={() => auth
            ? onRedirect('AddressList', { isFromBusinesses: true })
            : onRedirect('AddressForm')}
          >
          <MaterialComIcon
            name='home-outline'
            color={colors.primary}
            size={20}
            style={{ marginRight: 10 }}
          />
          <OText size={12} style={styles.inputStyle} numberOfLines={1}>
            {orderState?.options?.address?.address}
          </OText>
        </AddressInput>
        <WrapMomentOption
          onPress={() => navigation.navigate('MomentOption')}
        >
          <OText size={12} numberOfLines={1} ellipsizeMode='tail'>
            {orderState.options?.moment
            ? parseDate(orderState.options?.moment, { outputFormat: configs?.format_time?.value === '12' ? 'MM/DD hh:mma' : 'MM/DD HH:mm' })
            : t('ASAP_ABBREVIATION', 'ASAP')}
          </OText>
        </WrapMomentOption>
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
      {
        businessesList.businesses?.map((business: any) => (
          <BusinessController
            key={business.id}
            business={business}
            handleCustomClick={handleBusinessClick}
            orderType={orderState?.options?.type}
          />
        ))
      }
      <Spinner visible={businessesList.loading} />
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
})

export const BusinessesListing = (props: BusinessesListingParams) => {

  const BusinessesListingProps = {
    ...props,
    UIComponent: BusinessesListingUI
  }

  return <BusinessesListingController {...BusinessesListingProps} />
}
