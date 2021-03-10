import React from 'react'
import { AddressList as AddressListController, useLanguage, useOrder } from 'ordering-components/native'
import { AddressListContainer, AddressItem } from './styles'
import { StyleSheet } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { colors } from '../../theme'
import { OButton, OText, OAlert } from '../shared'
import { Container } from '../../layouts/Container'
import { AddressListParams } from '../../types'
import { NotFoundSource } from '../NotFoundSource'
import NavBar from '../NavBar'

const addIcon = require('../../assets/icons/add-circular-outlined-button.png')

const AddressListUI = (props: AddressListParams) => {

  const {
    navigation,
    route,
    addressList,
    isFromProfile,
    nopadding,
    handleSetDefault,
    handleDelete,
    setAddressList,
    actionStatus
  } = props

  const [orderState] = useOrder()
  const [, t] = useLanguage()

  const uniqueAddressesList = (addressList.addresses && addressList.addresses.filter(
    (address: any, i: number, self: any) =>
      i === self.findIndex((obj: any) => (
        address.address === obj.address &&
        address.address_notes === obj.address_notes &&
        address.zipcode === obj.zipcode &&
        address.internal_number === obj.internal_number
      )))) || []

  const checkAddress = (address: any) => {
    if (!orderState?.options?.address) return true
    const props = ['address', 'address_notes', 'zipcode', 'location', 'internal_number']
    const values: any = []
    props.forEach(prop => {
      if (address[prop]) {
        if (prop === 'location') {
          values.push(address[prop].lat === orderState?.options?.address[prop]?.lat &&
            address[prop].lng === orderState?.options?.address[prop]?.lng)
        } else {
          values.push(address[prop] === orderState?.options?.address[prop])
        }
      } else {
        values.push(orderState?.options?.address[prop] === null || orderState?.options?.address[prop] === '')
      }
    })
    return values.every((value: any) => value)
  }

  const addressIcon = (tag: string) => {
    switch (tag) {
      case 'other':
        return 'plus'
      case 'office':
        return 'office-building'
      case 'home':
        return 'home'
      case 'favorite':
        return 'heart'
      default:
        return 'plus'
    }
  }

  const handleSetAddress = (address: any) => {
    if (address.id === orderState?.options?.address_id) return
    handleSetDefault(address)
  }

  const handleSaveAddress = (address: any) => {
    let found = false
    const addresses = addressList.addresses.map((_address: any) => {
      if (_address?.id === address?.id) {
        Object.assign(_address, address)
        found = true
      } else if (address.default) {
        _address.default = false
      }
      return _address
    })
    if (!found) {
      addresses.push(address)
    }
    setAddressList({
      ...addressList,
      addresses
    })
  }

  const goToBack = () => navigation.goBack()
  const onNavigationRedirect = (route: string, params?: any) => navigation.navigate(route, params)

  return (
    <Container nopadding={nopadding}>
      <AddressListContainer>
        {
          !addressList.error &&
          addressList?.addresses?.length > 0 && (
            <>
              {isFromProfile && (
                <OText size={24} mBottom={20}>{t('SAVED_PLACES', 'My saved places')}</OText>
              )}
              {route && route?.params?.isFromBusinesses && !isFromProfile && (
                <NavBar
                  title={t('ADDRESS_LIST', 'Address List')}
                  titleAlign={'center'}
                  onActionLeft={() => goToBack()}
                  showCall={false}
                  btnStyle={{ paddingLeft: 0 }}
                  paddingTop={0}
                />
              )}
              {uniqueAddressesList.map((address: any) => (
                <AddressItem
                  key={address.id}
                  isSelected={checkAddress(address)}
                  onPress={() => handleSetAddress(address)}
                >
                  <MaterialIcon
                    name={addressIcon(address?.tag)}
                    size={32}
                    color={colors.primary}
                    style={styles.icon}
                  />
                  <OText style={styles.address}>{address.address}</OText>
                  <MaterialIcon
                    name='pencil-outline'
                    size={28}
                    color={colors.green}
                    onPress={() => onNavigationRedirect(
                      'AddressForm', {
                        address: address,
                        isEditing: true,
                        addressList: addressList,
                        onSaveAddress: handleSaveAddress
                      }
                    )}
                  />
                  <OAlert
                    title={t('DELETE_ADDRESS', 'Delete Address')}
                    message={t('QUESTION_DELETE_ADDRESS', 'Are you sure to you wants delete the selected address')}
                    onAccept={() => handleDelete(address)}
                    disabled={checkAddress(address)}
                  >
                    <MaterialIcon
                      name='trash-can-outline'
                      size={28}
                      color={!checkAddress(address) ? colors.primary : colors.disabled}
                    />
                  </OAlert>
                </AddressItem>
              ))}
            </>
          )}
        {!addressList.loading && addressList.error && (
          addressList.error.length > 0 && (
            <NotFoundSource
              content={
                addressList.error[0]?.message ||
                addressList.error[0] ||
                t('NETWORK_ERROR', 'Network Error, please reload the app')
              }
            />
          )
        )}
        {!(route && route?.params?.isFromBusinesses) && !isFromProfile && (
          <OText size={24}>
            {t('WHERE_DELIVER_NOW', 'Where do we deliver you?')}
          </OText>
        )}
        <OButton
          text={t('ADD_NEW_ADDRESS', 'Add new Address')}
          imgRightSrc=''
          imgLeftSrc={addIcon}
          bgColor={colors.white}
          imgLeftStyle={styles.buttonIcon}
          style={styles.button}
          borderColor={colors.primary}
          onClick={() => onNavigationRedirect(
            'AddressForm', {
              address: null,
              nopadding: true,
              addressList: addressList?.addresses,
              onSaveAddress: handleSaveAddress
            }
          )}
        />
        {!isFromProfile && addressList?.addresses?.length > 0 && (
          <OButton
            text={t('CONTINUE', 'Continue')}
            style={styles.button}
            onClick={() => onNavigationRedirect('BottomTab')}
            textStyle={{ color: colors.white }}
          />
        )}
        <Spinner visible={addressList.loading} />
      </AddressListContainer>
    </Container>
  )
}

const styles = StyleSheet.create({
  address: {
    flex: 1,
    marginHorizontal: 5
  },
  icon: {
    flex: 0.2
  },
  buttonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    left: 20,
    position: 'absolute',
  },
  button: {
    marginVertical: 30
  }
})

export const AddressList = (props: AddressListParams) => {
  const addressListProps = {
    ...props,
    UIComponent: AddressListUI
  }
  return <AddressListController {...addressListProps} />
}
