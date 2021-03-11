import React from 'react'
import { BusinessesListing as BusinessListingController } from '../components/BusinessesListing'
import styled from 'styled-components/native'
import {colors} from '../theme'

const BusinessesListing = (props: any) => {

  const BusinessesListingProps = {
    ...props,
    isSearchByName: true,
    isSearchByDescription: true,
    propsToFetch: ['id', 'name', 'header', 'logo', 'location', 'schedule', 'open', 'delivery_price', 'distance', 'delivery_time', 'pickup_time', 'reviews', 'featured', 'offers', 'food', 'laundry', 'alcohol', 'groceries', 'slug'],
    onRedirect: (route: string, params?: any) => {
      props.navigation.navigate(route, params)
    },
    onBusinessClick: (business: any) => {}
  }

  const BusinessListView = styled.SafeAreaView`
    flex: 1;
    background-color: ${colors.backgroundPage};
  `


  return (
    <BusinessListView>
      <BusinessListingController {...BusinessesListingProps} />
    </BusinessListView>
  )
}

export default BusinessesListing
