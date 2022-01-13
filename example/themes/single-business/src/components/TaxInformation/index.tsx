import React from 'react'
import { useLanguage, useUtils } from 'ordering-components/native'
import { SingleProductCard } from '../SingleProductCard'
import { TaxInformationContainer, ProductContainer } from './styles'
import { OText } from '../shared'

interface taxInformationParams {
  data: { name: string, description?: string, rate: string | number, type: number, fixed?: number, percentage?: number, id: number },
  products: Array<any>
}

export const TaxInformation = (props: taxInformationParams) => {
  const {
    data,
    products
  } = props

  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()

  const isTax = typeof data?.rate === 'number'
  const TaxFeeString = isTax ? 'tax' : 'fee'
  const includedOnPriceString = data?.type === 1 ? `(${t('INCLUDED_ON_PRICE', 'Included on price')})` : `(${t('NOT_INCLUDED_ON_PRICE', 'Not included on price')})`
  const productsWithTaxes = products
    .filter((product: any) => isTax
      ? (product.tax?.id ? product.tax?.id === data?.id: product.tax?.id === null && data?.id === null)
      : (product.fee?.id ? product.fee?.id === data?.id : (product.fee?.id === null && data?.id === null))) ?? []

  return (
    <TaxInformationContainer>
      <OText size={18} style={{ alignSelf: 'flex-start', textAlign: 'left' }} mBottom={10}>
        {`${data?.name ?? t('INHERIT_FROM_BUSINESS', 'Inherit from business')} (${typeof data?.rate === 'number' ? `${data?.rate}%` : `${parsePrice(data?.fixed ?? 0)} + ${data?.percentage}%`})`}
      </OText>
      {data?.description && (
        <OText mBottom={10} size={16} style={{ alignSelf: 'flex-start', textAlign: 'left' }}>
          {t('DESCRIPTION', 'Description')}: {data?.description} {data?.type && includedOnPriceString}
        </OText>
      )}
      {productsWithTaxes.length > 0 && (
        <>
          <OText>{`${t(`OTHER_PRODUCTS_WITH_THIS_${TaxFeeString.toUpperCase()}`, `Other products with this ${TaxFeeString}`)}:`}</OText>
          <ProductContainer>
            {productsWithTaxes.map(product => (
              <SingleProductCard
                key={product.id}
                product={product}
                isSoldOut={false}
                businessId={product?.business_id}
              />
            ))}
          </ProductContainer>
        </>
      )}
    </TaxInformationContainer>
  )
}
