import React from 'react'
import { AddressList as AddressListController } from '../components/AddressList'
import { useSession } from 'ordering-components/native'

const AddressList = ({ navigation }: any) => {

  const [{ user }] = useSession()

  const AddressListProps = {
    navigation,
    userId: user.id
  }

  return <AddressListController {...AddressListProps} />
}

export default AddressList