import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { SingleProductCard } from '../SingleProductCard'
import { TaxInformationContainer, ProductContainer } from './styles'
import { OText } from '../shared'

interface taxInformationParams {
  data: {
    name: string,
    description?: string,
    rate: string | number,
    type: number,
    fixed?: number,
    percentage?: number,
    id: number,
    discounts?: any
  },
  products: Array<any>,
  type: string
}

export const TaxInformation = (props: taxInformationParams) => {
  const {
    data,
    products,
    type
  } = props

  const [, t] = useLanguage()

  const includedOnPriceString = data?.type === 1 ? `(${t('INCLUDED_ON_PRICE', 'Included on price')})` : `(${t('NOT_INCLUDED_ON_PRICE', 'Not included on price')})`

  const getFilterValidation = (product: any) => {
    return (
      type === 'tax'
        ? (product.tax?.id ? product.tax?.id === data?.id : product.tax?.id === null && data?.id === null)
        : type === 'fee'
          ? (product.fee?.id ? product.fee?.id === data?.id : (product.fee?.id === null && data?.id === null))
          : Object.keys(data?.discounts ?? {}).map(code => code.includes(product?.code))
    )
  }

  const getTypeString = () => {
    return (
      type === 'offer_target_1'
        ? t('PRODUCT_DISCOUNT', 'Product discount')
        : type === 'tax'
          ? t('TAX', 'Tax')
          : t('Fee', 'Fee')
    )
  }

  return (
    <TaxInformationContainer>
      {!!data?.description ? (
        <OText size={24} style={{ alignSelf: 'center', textAlign: 'center' }} mBottom={10}>
          {t('DESCRIPTION', 'Description')}: {data?.description} {data?.type && !type?.includes('offer') && includedOnPriceString}
        </OText>
      ) : (
        <OText mBottom={10} size={18} style={{ alignSelf: 'center', textAlign: 'center' }}>
          {t('WITHOUT_DESCRIPTION', 'Without description')}
        </OText>
      )}
      {!(type === 'offer_target_2' || type === 'offer_target_3') && (
        <>
          <OText>{t('OTHER_PRODUCTS_WITH_THIS', 'Other products with this')} {getTypeString()}:</OText>
          <ProductContainer>
            {
              products.filter((product: any) => getFilterValidation(product)).map(product => (
                <SingleProductCard
                  key={product.id}
                  product={product}
                  isSoldOut={false}
                  businessId={product?.business_id}
                />
              ))
            }
          </ProductContainer>
        </>
      )}
    </TaxInformationContainer>
  )
}
