import React, {useEffect} from 'react'
import { BusinessesListing as BusinessListingController } from '../components/BusinessesListing'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'

const BusinessesListing = (props: any) => {
  const theme = useTheme()
  const businessId =  props.route.params?.businessId
  const categoryId = props.route.params?.categoryId
  const productId =  props.route.params?.productId
  const store =  props.route.params?.store

  useEffect(() => {
    if(businessId && categoryId && productId && store){
      props.navigation.navigate('Business', {store,businessId,categoryId,productId})
    }
  }, [businessId, categoryId, productId, store])

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
