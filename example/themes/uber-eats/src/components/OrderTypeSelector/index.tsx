import React, { useState } from 'react'
import {
  OrderTypeControl,
  useLanguage,
  useOrder
} from 'ordering-components/native'
import {StyleSheet, Platform, I18nManager} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { OrderTypeWrapper } from './styles'
import { OrderTypeSelectParams } from '../../types'
import RNPickerSelect from 'react-native-picker-select'
import { useTheme } from 'styled-components/native'

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
  const {
    handleChangeOrderType,
    typeSelected,
    defaultValue,
    configTypes,
    orderTypes
  } = props

  const theme = useTheme()

  const pickerStyle = StyleSheet.create({
    inputAndroid: {
      color: theme.colors.secundaryContrast,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 30,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.mediumGray,
      fontSize: 14,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      height: 45,
    },
    inputIOS: {
      color: theme.colors.secundaryContrast,
      height: 40,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 30,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.mediumGray,
      fontSize: 14,
      textAlign: I18nManager.isRTL ? 'right' : 'left'
    },
    icon: {
      top: Platform.OS === 'ios' ? 10 : 12,
      right: Platform.OS === 'ios' ? 0 : 7,
      position: 'absolute',
      marginHorizontal: 10,
      fontSize: 20
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
          onValueChange={(orderType) => handleChangeOrderTypeCallback(orderType)}
          items={items}
          placeholder={{}}
          style={pickerStyle}
          value={defaultValue || typeSelected}
          Icon={() => <MaterialIcons name='keyboard-arrow-down' style={pickerStyle.icon} />}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          useNativeAndroidPickerStyle={false}
          disabled={orderState.loading && !open}
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
