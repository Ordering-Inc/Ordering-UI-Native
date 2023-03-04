import React, { useEffect } from 'react'
import { UpsellingPage as UpsellingPageController } from 'ordering-components/native'

const UpsellingRedirectUI = (props: any) => {
  const {
    setOpenUpselling,
    upsellingProducts,
    handleUpsellingPage,
    onRedirect,
  } = props

  useEffect(() => {
    if (!upsellingProducts.loading) {
      if (upsellingProducts?.products?.length) {
        onRedirect &&
          onRedirect('UpsellingPage', {...props, products: upsellingProducts?.products })
      } else {
        handleUpsellingPage && handleUpsellingPage()
      }
      setOpenUpselling(false)
    }
  }, [upsellingProducts.loading, upsellingProducts?.products.length])

  return (<>{null}</>)
}

export const UpsellingRedirect = (props: any) => {
  const upsellingProps = {
    ...props,
    UIComponent: UpsellingRedirectUI
  }
  return (
    <UpsellingPageController {...upsellingProps} />
  )
}
