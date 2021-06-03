import React from 'react'
import { Text } from 'react-native'
import { BusinessAndProductList } from 'ordering-components/native'

import { BusinessProductsListingParams } from '../../types'

const BusinessProductsListingUI = (props: BusinessProductsListingParams) => {
  const {
    navigation,
    errors,
    businessState,
    categoryState,
    handleChangeSearch,
    categorySelected,
    searchValue,
    handleChangeCategory,
    handleSearchRedirect,
    featuredProducts,
    errorQuantityProducts,
    header,
    logo
  } = props

  const { business, loading, error } = businessState

  console.log(business, loading, error);

  return (
    <>
      <Text>{ JSON.stringify(business) }</Text>  
    </>
  )
}

export const BusinessProductsListing = (props:any) => {
  const businessProductslistingProps = {
    ...props,
    UIComponent: BusinessProductsListingUI
  }
  return (
    <BusinessAndProductList {...businessProductslistingProps} />
  )
}
