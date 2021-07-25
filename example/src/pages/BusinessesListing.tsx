import React from 'react'
import { BusinessesListing as BusinessListingController } from '../themes/instacart'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'

const BusinessesListing = (props: any) => {
  const theme = useTheme()

  const BusinessesListingProps = {
    ...props,
    isSearchByName: true,
    isSearchByDescription: true,
    propsToFetch: ['id', 'name', 'header', 'logo', 'location', 'schedule', 'open', 'delivery_price', 'distance', 'delivery_time', 'pickup_time', 'reviews', 'featured', 'offers', 'food', 'laundry', 'alcohol', 'groceries', 'slug'],
    onBusinessClick: (business: any) => {
      props.navigation.navigate('Business', { store: props?.route?.params?.store || business.slug, header: business.header, logo: business.logo })
    }
  }

  const BusinessListView = styled.SafeAreaView`
    flex: 1;
    background-color: ${theme.colors.backgroundPage};
  `

  return (
    <BusinessListView>
      <BusinessListingController {...BusinessesListingProps} />
    </BusinessListView>
  )
}

export default BusinessesListing
