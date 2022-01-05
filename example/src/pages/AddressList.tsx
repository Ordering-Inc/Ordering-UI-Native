import React from 'react'
import { AddressList as AddressListController } from '../components/AddressList'
import { useSession } from 'ordering-components/native'

const AddressList = ({ route, navigation }: any) => {
  const [{ user }] = useSession()
  const addressListProps = {
    navigation,
    route,
    userId: user?.id,
    isGoBack: route?.params?.isGoBack,
    isFromBusinesses: route?.params?.isFromBusinesses,
    isFromProductsList: route?.params?.isFromProductsList,
    isFromCheckout: route?.params?.isFromCheckout,
    isFromProfile: route?.params?.isFromProfile,
    afterSignup: route?.params?.afterSignup
  }

  return (
    <AddressListController {...addressListProps} />
  )
}

export default AddressList
