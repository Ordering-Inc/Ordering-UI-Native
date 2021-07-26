import React from 'react'
import { SearchList as SearchListingController } from '../themes/instacart'
import styled from 'styled-components/native'
import { useApi } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'

const SearchPage = (props: any) => {
  const theme = useTheme()
  const [ordering] = useApi()

  const BusinessesListingProps = {
    ...props,
    isSearchByName: true,
    isSearchByDescription: true,
    propsToFetch: ['id', 'name', 'header', 'logo', 'location', 'schedule', 'open', 'delivery_price', 'distance', 'delivery_time', 'pickup_time', 'reviews', 'featured', 'offers', 'food', 'laundry', 'alcohol', 'groceries', 'slug'],
    onBusinessClick: (business: any) => {
      props.navigation.navigate('Business', { store: props?.route?.params?.store || business.slug, header: business.header, logo: business.logo })
    }
  }

  const businessProductsProps = {
	...props,
	ordering,
	isSearchByName: true,
	isSearchByDescription: true,
	slug: '',
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
	// logo,
	// header,
	// product
 }

  const SearchListView = styled.SafeAreaView`
    flex: 1;
    background-color: ${theme.colors.backgroundPage};
  `

  return (
    <SearchListView>
      <SearchListingController bProps={BusinessesListingProps} pProps={businessProductsProps} />
    </SearchListView>
  )
}

export default SearchPage;
