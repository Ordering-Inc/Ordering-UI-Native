import React, { useState } from 'react'
import {
  OrderTypeControl,
  useLanguage,
  useOrder
} from 'ordering-components/native'
import {StyleSheet, Platform, View} from 'react-native'
import { OrderTypeWrapper } from './styles'
import { OrderTypeSelectParams } from '../../../../types'
import RNPickerSelect from 'react-native-picker-select'
import { useTheme } from 'styled-components/native'
import { OIcon } from '../shared'

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
  const {
    handleChangeOrderType,
    typeSelected,
    defaultValue,
    configTypes,
    orderTypes
  } = props

  const theme = useTheme();

  const pickerStyle = StyleSheet.create({
    inputAndroid: {
      color: theme.colors.secundaryContrast,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 3,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.inputDisabled,
      fontSize: 12,
		lineHeight: 18
    },
    inputIOS: {
      color: theme.colors.secundaryContrast,
      paddingEnd: 25,
		paddingStart: 10,
      height: 28,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 3,
      backgroundColor: theme.colors.inputDisabled,
      fontSize: 12
    },
    icon: {
      top: 2.5,
      right: 10,
      position: 'absolute',
    },
    placeholder: {
      color: theme.colors.secundaryContrast
    }
  })

  const [orderState] = useOrder()
  const [open,setOpen] = useState(false)

  const _orderTypes = orderTypes.filter((type: any) => configTypes?.includes(type.value))

  const items = _orderTypes.map((type) => {
    return {
      value: type.value,
      label: type.content,
      inputLabel: type.content
    }
  })

  const handleChangeOrderTypeCallback = (orderType : number) => {
    if(!orderState.loading){
      handleChangeOrderType(orderType)
    }
  }

  return (
    typeSelected !== undefined && (
      <OrderTypeWrapper>
        <RNPickerSelect
          onValueChange={(orderType: any) => handleChangeOrderTypeCallback(orderType)}
          items={items}
          placeholder={{}}
          style={pickerStyle}
          value={defaultValue || typeSelected}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          useNativeAndroidPickerStyle={false}
          disabled={orderState.loading && !open}
			 Icon={() => <View style={pickerStyle.icon}><OIcon src={theme.images.general.drop_down} color={theme.colors.textPrimary} width={10} /></View>}
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
