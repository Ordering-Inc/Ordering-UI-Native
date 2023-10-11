import React from 'react'
import { useLanguage, useUtils } from 'ordering-components/native'
import { SingleProductCard } from '../SingleProductCard'
import { TaxInformationContainer, ProductContainer } from './styles'
import { OText } from '../shared'

interface taxInformationParams {
  data: {
    name: string,
    description?: string,
    rate: string | number,
    type: string | number,
    fixed?: number,
    percentage?: number,
    id: number,
    discounts?: any,
    rate_type?: number,
    target?: string
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
  const [{ parsePrice }] = useUtils()

  const includedOnPriceString = data?.type === 1 ? `(${t('INCLUDED_ON_PRICE', 'Included on price')})` : `(${t('NOT_INCLUDED_ON_PRICE', 'Not included on price')})`
  const offersHideArray = ['offer_target_2', 'offer_target_3']
  const hideProductsSectionOffers = offersHideArray.includes(type)
  const dataHideArray : Array<string | number> = ['platform', 'business']
  const hideProductsSectionData = dataHideArray.includes(data.type) || data?.target === 'delivery_fee'

  const getFilterValidation = (product: any) => {
    return (
      type === 'tax'
        ? (product.tax?.id ? product.tax?.id === data?.id : product.tax?.id === null && data?.id === null)
        : type === 'fee'
          ? (product.fee?.id ? product.fee?.id === data?.id : (product.fee?.id === null && data?.id === null))
          : Object.keys(data?.discounts ?? {}).map(code => code.includes(product?.code)) && product?.offers?.find((offer : any) => offer?.name === data?.name)
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
      <OText size={24} style={{ alignSelf: 'center', textAlign: 'center' }} mBottom={10}>
      {`${data?.name ||
              t('INHERIT_FROM_BUSINESS', 'Inherit from business')} ${data?.rate_type !== 2 ? `(${typeof data?.rate === 'number' ? `${data?.rate}%` : `${parsePrice(data?.fixed ?? 0)} + ${data?.percentage}%`})` : ''}  `}
      </OText>
      {!!data?.description ? (
        <OText size={20} style={{ alignSelf: 'center', textAlign: 'center' }} mBottom={10}>
          {t('DESCRIPTION', 'Description')}: {data?.description} {data?.type && !type?.includes('offer') && includedOnPriceString}
        </OText>
      ) : (
        <OText mBottom={10} size={18} style={{ alignSelf: 'center', textAlign: 'center' }}>
          {t('WITHOUT_DESCRIPTION', 'Without description')}
        </OText>
      )}
      {!hideProductsSectionOffers && !hideProductsSectionData && (
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
