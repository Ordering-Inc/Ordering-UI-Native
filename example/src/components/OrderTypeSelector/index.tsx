import React from 'react'
import {
  OrderTypeControl,
  useLanguage,
  useOrder
} from 'ordering-components/native'
import {StyleSheet, Platform} from 'react-native'
import { OrderTypeWrapper } from './styles'
import { OrderTypeSelectParams } from '../../types'
import { colors } from '../../theme.json'
import RNPickerSelect from 'react-native-picker-select'

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
  const {
    handleChangeOrderType,
    typeSelected,
    defaultValue,
    configTypes,
    orderTypes
  } = props
  const [orderState] = useOrder()

  const _orderTypes = orderTypes.filter((type: any) => configTypes?.includes(type.value))

  const items = _orderTypes.map((type) => {
    return {
      value: type.value,
      label: type.content,
      inputLabel: type.content
    }
  })

  return (
    typeSelected !== undefined && (
      <OrderTypeWrapper>
        <RNPickerSelect
          onValueChange={(orderType: any) => handleChangeOrderType(orderType)}
          items={items}
          placeholder={{}}
          style={pickerStyle}
          value={defaultValue || typeSelected}
          useNativeAndroidPickerStyle={false}
          disabled={orderState.loading}
        />
      </OrderTypeWrapper>
    )
  )
}

const pickerStyle = StyleSheet.create({
  inputAndroid: {
    color: colors.secundaryContrast,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.inputDisabled,
    fontSize: 15
  },
  inputIOS: {
    color: colors.secundaryContrast,
    paddingEnd: 20,
    height: 50,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.inputDisabled,
    fontSize: 15
  },
  icon: {
    top: Platform.OS === 'ios' ? 10 : 15,
    right: Platform.OS === 'ios' ? 0 : 7,
    position: 'absolute',
    fontSize: 20
  },
  placeholder: {
    color: colors.secundaryContrast
  }
})

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
