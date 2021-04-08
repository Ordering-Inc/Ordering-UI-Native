import React from 'react'
import {
  OrderTypeControl,
  useLanguage
} from 'ordering-components/native'
import { ODropDown } from '../shared'
import { OrderTypeWrapper } from './styles'
import { OrderTypeSelectParams } from '../../types'

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
  const {
    handleChangeOrderType,
    typeSelected,
    defaultValue,
    configTypes,
    orderTypes
  } = props
  return (
    typeSelected !== undefined && (
      <OrderTypeWrapper>
        <ODropDown
          options={orderTypes.filter((type: any) => configTypes?.includes(type.value))}
          defaultValue={defaultValue || typeSelected}
          onSelect={(orderType: any) => handleChangeOrderType(orderType)}
        />
      </OrderTypeWrapper>
    )
  )
}


export const OrderTypeSelector = (props: any) => {
  const [, t] = useLanguage()

  const orderTypeProps = {
    ...props,
    UIComponent: OrderTypeSelectorUI,
    orderTypes: props.orderType || [
      {
        value: 1,
        content: t('DELIVERY', 'Delivery')
      },
      {
        value: 2,
        content: t('PICKUP', 'Pickup')
      },
      {
        value: 3,
        content: t('EAT_IN', 'Eat in')
      },
      {
        value: 4,
        content: t('CURBSIDE', 'Curbside')
      },
      {
        value: 5,
        content: t('DRIVE_THRU', 'Drive thru')
      }
    ]
  }

  return <OrderTypeControl {...orderTypeProps} />
}
