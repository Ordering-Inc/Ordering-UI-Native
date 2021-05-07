import React from 'react'
import { useApi, useEvent } from 'ordering-components/native'
import { BusinessProductsListing as BusinessProductsListController } from '../components/BusinessProductsListing'
import styled from 'styled-components/native'
import { colors } from '../theme.json'

const BusinessProductsList = (props: any) => {
  const { store } = props.route.params
  const [ordering] = useApi()

  const businessProductsProps = {
    ...props,
    ordering,
    isSearchByName: true,
    isSearchByDescription: true,
    slug: store,
    businessProps: [
      'id',
      'name',
      'header',
      'logo',
      'name',
      'open',
      'about',
      'description',
      'address',
      'location',
      'schedule',
      'service_fee',
      'delivery_price',
      'distance',
      'delivery_time',
      'gallery',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
      'products',
      'zones'
    ],
    handleSearchRedirect: () => {
      props.navigation.navigate('BusinessList')
    },
    onProductRedirect: ({ slug, category, product }: any) => {},
    onCheckoutRedirect: (cartUuid: any) => {}
  }
  return (
    <BusinessProductsListView>
      <BusinessProductsListController {...businessProductsProps} />
    </BusinessProductsListView>
  )
}

const BusinessProductsListView = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.backgroundPage};
`

export default BusinessProductsList
