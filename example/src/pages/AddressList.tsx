import React from 'react'
import { AddressList as AddressListController } from '../components/AddressList'
import { useSession } from 'ordering-components/native'

const AddressList = ({ route, navigation }: any) => {

  const [{ user }] = useSession()
  const {isGoBack} = route.params
  const AddressListProps = {
    navigation,
    route,
    userId: user?.id,
    isGoBack: isGoBack
  }

  return (
    <AddressListController {...AddressListProps} />
  )
}

export default AddressList
