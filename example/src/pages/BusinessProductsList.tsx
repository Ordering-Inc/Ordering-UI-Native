import React from 'react'
import { useApi, useEvent } from 'ordering-components/native'
import { BusinessProductsListing as BusinessProductsListController } from '../components/BusinessProductsListing'
import styled from 'styled-components/native'
import theme from '../theme.json';

const BusinessProductsList = (props: any) => {
  const [ordering] = useApi()
  const store = props.route.params?.store || props.route.params?.productLogin?.slug
  const header = props.route.params?.header
  const logo = props.route.params?.logo
  const product = props.route.params?.productLogin
  const businessProductsProps = {
    ...props,
    theme,
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
    onCheckoutRedirect: (cartUuid: any) => {},
    logo,
    header,
    product
  }
  return (
    <BusinessProductsListView>
      <BusinessProductsListController {...businessProductsProps} />
    </BusinessProductsListView>
  )
}

const BusinessProductsListView = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.backgroundPage};
`

export default BusinessProductsList
