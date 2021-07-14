import React from 'react'
import { AddressList as AddressListController } from '../components/AddressList'
import { useSession } from 'ordering-components/native'
import theme from '../theme.json';

const AddressList = ({ route, navigation }: any) => {

  const [{ user }] = useSession()
  const isGoBack = route?.params?.isGoBack
  const isFromBusinesses = route?.params?.isFromBusinesses
  const isFromProductsList = route?.params?.isFromProductsList
  const isFromCheckout = route?.params?.isFromCheckout
  const afterSignup = route?.params?.afterSignup
  const addressListProps = {
    navigation,
    route,
    theme,
    userId: user?.id,
    isGoBack,
    isFromBusinesses,
    isFromProductsList,
    isFromCheckout,
    afterSignup
  }

  return (
    <AddressListController {...addressListProps} />
  )
}

export default AddressList
