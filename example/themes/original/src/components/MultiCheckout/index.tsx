import React, { useState, useEffect } from 'react'
import {
  useLanguage,
  useConfig,
  useUtils,
  useOrder,
  useValidationFields,
  useSession,
  useToast,
  ToastType,
  MultiCheckout as MultiCheckoutController
} from 'ordering-components/native'
import { View, StyleSheet, Platform } from 'react-native'
import { useTheme } from 'styled-components/native';
import { Container } from '../../layouts/Container';
import NavBar from '../NavBar';
import { OText, OIcon, OModal } from '../shared';
import { getTypesText } from '../../utils';
import { UserDetails } from '../UserDetails'
import { AddressDetails } from '../AddressDetails'
import { MultiCartsPaymethodsAndWallets } from '../MultiCartsPaymethodsAndWallets'
import { Cart } from '../Cart'
import { FloatingButton } from '../FloatingButton'

import {
  ChContainer,
  ChSection,
  ChHeader,
  CHMomentWrapper,
  ChUserDetails,
  ChAddress,
  ChCarts,
  CartsHeader,
  CCNotCarts,
  ChCartsTotal
} from './styles'

const mapConfigs = {
  mapZoom: 16,
  mapSize: {
    width: 640,
    height: 190
  }
}

const MultiCheckoutUI = (props: any) => {
  const {
    navigation,
    placing,
    openCarts,
    totalCartsPrice,
    handleGroupPlaceOrder,
    paymethodSelected,
    handleSelectPaymethod,
    handleSelectWallet,
    handlePaymethodDataChange,
    cartUuid,
    totalCartsFee,
    cartGroup
  } = props

  const theme = useTheme();
  const styles = StyleSheet.create({
    pagePadding: {
      paddingLeft: 40,
      paddingRight: 40
    },
    wrapperNavbar: Platform.OS === 'ios'
      ? { paddingVertical: 0, paddingHorizontal: 40 }
      : { paddingVertical: 20, paddingHorizontal: 40 }
  })

  const [, { showToast }] = useToast();
  const [, t] = useLanguage()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseDate }] = useUtils();
  const [{ options, carts, loading }, { confirmCart }] = useOrder();
  const [validationFields] = useValidationFields();
  const [{ user }] = useSession()

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []
  const isPreOrder = configs?.preorder_status_enabled?.value === '1'
  const maximumCarts = 5
  const isDisablePlaceOrderButton = !(paymethodSelected?.paymethod_id || paymethodSelected?.wallet_id) || openCarts.length > maximumCarts || (paymethodSelected?.paymethod?.gateway === 'stripe' && !paymethodSelected?.paymethod_data)
  const walletCarts = (Object.values(carts)?.filter((cart: any) => cart?.products && cart?.products?.length && cart?.status !== 2 && cart?.valid_schedule && cart?.valid_products && cart?.valid_address && cart?.valid_maximum && cart?.valid_minimum && cart?.wallets) || null) || []

  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const [userErrors, setUserErrors] = useState<any>([]);
  const handleMomentClick = () => {
    if (isPreOrder) {
      navigation.navigate('MomentOption')
    }
  }

  const checkValidationFields = () => {
    setUserErrors([])
    const errors = []
    const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes']

    Object.values(validationFields?.fields?.checkout).map((field: any) => {
      if (field?.required && !notFields.includes(field.code)) {
        if (!user[field?.code]) {
          errors.push(t(`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`, `The field ${field?.name} is required`))
        }
      }
    })

    if (
      !user?.cellphone &&
      ((validationFields?.fields?.checkout?.cellphone?.enabled &&
        validationFields?.fields?.checkout?.cellphone?.required) ||
        configs?.verification_phone_required?.value === '1')
    ) {
      errors.push(t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone number is required'))
    }

    if (phoneUpdate) {
      errors.push(t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number'))
    }

    setUserErrors(errors)
  }

  const togglePhoneUpdate = (val: boolean) => {
    setPhoneUpdate(val)
  }

  const handlePlaceOrder = () => {
    if (!userErrors.length) {
      handleGroupPlaceOrder && handleGroupPlaceOrder()
      return
    }
    let stringError = ''
    Object.values(userErrors).map((item: any, i: number) => {
      stringError += (i + 1) === userErrors.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
    })
    showToast(ToastType.Error, stringError)
    setIsUserDetailsEdit(true)
  }

  useEffect(() => {
    if (validationFields && validationFields?.fields?.checkout) {
      checkValidationFields()
    }
  }, [validationFields, user])

  return (
    <>
      <Container noPadding>
        <View style={styles.wrapperNavbar}>
          <NavBar
            isVertical
            title={t('CHECKOUT', 'Checkout')}
            titleAlign={'center'}
            onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
            showCall={false}
            btnStyle={{ paddingLeft: 0 }}
            style={{ marginTop: Platform.OS === 'ios' ? 0 : 30 }}
            titleWrapStyle={{ paddingHorizontal: 0 }}
            titleStyle={{ marginRight: 0, marginLeft: 0 }}
          />
        </View>
        <ChContainer style={styles.pagePadding}>
          <ChSection style={{ paddingTop: 0 }}>
            <ChHeader>
              <CHMomentWrapper onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes })}>
                <OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textSecondary}>{t(getTypesText(options?.type || 1), 'Delivery')}</OText>
                <OIcon
                  src={theme.images.general.arrow_down}
                  width={10}
                  style={{ marginStart: 8 }}
                />
              </CHMomentWrapper>
              <CHMomentWrapper
                onPress={() => handleMomentClick()}
                disabled={loading}
              >
                <OText size={12} numberOfLines={1} ellipsizeMode='tail' color={theme.colors.textSecondary}>
                  {options?.moment
                    ? parseDate(options?.moment, { outputFormat: configs?.dates_moment_format?.value })
                    : t('ASAP_ABBREVIATION', 'ASAP')}
                </OText>
                {isPreOrder && (
                  <OIcon
                    src={theme.images.general.arrow_down}
                    width={10}
                    style={{ marginStart: 8 }}
                  />
                )}
              </CHMomentWrapper>
            </ChHeader>
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 18, marginHorizontal: -40 }} />
          </ChSection>

          <ChSection>
            <ChUserDetails>
              <UserDetails
                isUserDetailsEdit={isUserDetailsEdit}
                useValidationFields
                useDefualtSessionManager
                useSessionUser
                isCheckout
                phoneUpdate={phoneUpdate}
                togglePhoneUpdate={togglePhoneUpdate}
              />
            </ChUserDetails>
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40 }} />
          </ChSection>

          <ChSection>
            <ChAddress>
              <AddressDetails
                navigation={navigation}
                isMultiCheckout
                openCarts={openCarts}
                apiKey={configs?.google_maps_api_key?.value}
                mapConfigs={mapConfigs}
              />
            </ChAddress>
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
          </ChSection>

          <ChSection>
            <MultiCartsPaymethodsAndWallets
              openCarts={openCarts}
              paymethodSelected={paymethodSelected}
              handleSelectPaymethod={handleSelectPaymethod}
              handleSelectWallet={handleSelectWallet}
              handlePaymethodDataChange={handlePaymethodDataChange}
              cartUuid={cartUuid}
            />
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
          </ChSection>

          <ChSection>
            <ChCarts>
              <CartsHeader>
                <OText size={16} lineHeight={24} color={theme.colors.textNormal} style={{ fontWeight: '500' }}>
                  {t('MOBILE_FRONT_YOUR_ORDER', 'Your order')}
                </OText>
              </CartsHeader>
              {openCarts.map((cart: any) => (
                <React.Fragment key={cart.uuid}>
                  <Cart
                    cart={cart}
                    cartuuid={cart.uuid}
                    isMultiCheckout
                    onNavigationRedirect={(route: string, params: any) => props.navigation.navigate(route, params)}
                  />
                  <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
                </React.Fragment>
              ))}
              {!cartGroup?.loading && openCarts.length === 0 && (
                <CCNotCarts>
                  <OText size={24} style={{ textAlign: 'center' }}>
                    {t('CARTS_NOT_FOUND', 'You don\'t have carts available')}
                  </OText>
                </CCNotCarts>
              )}
              {walletCarts.length > 0 && (
                <OText size={14} color={theme.colors.danger5} style={{ marginVertical: 20 }}>
                  {t('WARNING_PARTIAL_WALLET_CARTS', 'Important: One or more carts can`t be completed due a partial payment with cash/points wallet and requires to be paid individually')}
                </OText>
              )}
              {openCarts.length > 0 && (
                <ChCartsTotal>
                  {totalCartsFee && configs?.multi_business_checkout_show_combined_delivery_fee?.value === '1' && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                        {t('TOTAL_DELIVERY_FEE', 'Total delivery fee')}
                      </OText>
                      <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>{parsePrice(totalCartsFee)}</OText>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>
                      {t('TOTAL_FOR_ALL_CARTS', 'Total for all Carts')}
                    </OText>
                    <OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>{parsePrice(totalCartsPrice)}</OText>
                  </View>
                  <OText size={12} color={theme.colors.mediumGray} mRight={70} style={{ marginTop: 10 }}>
                    {t('MULTI_CHECKOUT_DESCRIPTION', 'You will receive a receipt for each business. The payment is not combined between multiple stores. Each payment is processed by the store')}
                  </OText>
                </ChCartsTotal>
              )}
              {openCarts.length > maximumCarts && (
                <OText size={14} color={theme.colors.danger5} style={{ marginVertical: 20 }}>
                  {t('WARNING_MAXIMUM_CARTS', 'You can only pay for a maximum of 5 carts, please discard one or more to continue.')}
                </OText>
              )}
            </ChCarts>
          </ChSection>
        </ChContainer>
      </Container>

      <FloatingButton
        handleClick={() => handlePlaceOrder()}
        isSecondaryBtn={isDisablePlaceOrderButton}
        disabled={isDisablePlaceOrderButton}
        btnText={placing ? t('PLACING', 'Placing') : t('PLACE_ORDER', 'Place Order')}
        btnRightValueShow
        btnRightValue={parsePrice(totalCartsPrice)}
        iosBottom={30}
      />
    </>
  )
}

export const MultiCheckout = (props: any) => {
  const multiCheckoutProps = {
    ...props,
    UIComponent: MultiCheckoutUI
  }
  return <MultiCheckoutController {...multiCheckoutProps} />
}
