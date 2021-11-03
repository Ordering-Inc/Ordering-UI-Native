import React from 'react'
import { useApi } from 'ordering-components/native'
import { BusinessProductsListing as BusinessProductsListController } from '../../themes/original/src/components/BusinessProductsListing'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'

const BusinessProductsList = (props: any) => {
  const theme = useTheme()
  const [ordering] = useApi()

  const store = props.route.params?.store || props.route.params?.productLogin?.slug
  const header = props.route.params?.header
  const logo = props.route.params?.logo
  const product = props.route.params?.productLogin
  const businessId = props.route.params?.businessId
  const categoryId = props.route.params?.categoryId
  const productId = props.route.params?.productId

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
      'zones',
      'timezone'
    ],
    handleSearchRedirect: () => {
      props.navigation.navigate('BusinessList')
    },
    onProductRedirect: ({ slug, category, product }: any) => {},
    onCheckoutRedirect: (cartUuid: any) => {},
    logo,
    header,
    product,
    productId,
    categoryId,
    businessId
  }

  const BusinessProductsListView = styled.SafeAreaView`
    flex: 1;
    background-color: ${theme.colors.backgroundPage};
  `

  return (
    <BusinessProductsListView>
      <BusinessProductsListController {...businessProductsProps} />
    </BusinessProductsListView>
  )
}

export default BusinessProductsList
