import React from 'react'
import { AddressList as AddressListController } from '../components/AddressList'
import { useSession } from 'ordering-components/native'

const AddressList = ({ navigation }: any) => {

  const [{ user }] = useSession()

  const AddressListProps = {
    navigation,
    userId: user.id,
    goToBack: () => navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) => navigation.navigate(route, params)
  }

  return <AddressListController {...AddressListProps} />
}

export default AddressList