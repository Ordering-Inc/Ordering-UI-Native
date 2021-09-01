import React, { useState } from 'react'
import {
  OrderTypeControl,
  useLanguage,
  useOrder
} from 'ordering-components/native'
import { StyleSheet, Platform, TouchableOpacity, View } from 'react-native'
import { OrderTypeWrapper, SelectItem } from './styles'
import { OrderTypeSelectParams } from '../../types'
// import RNPickerSelect from 'react-native-picker-select'
// import { Picker } from '@react-native-picker/picker'
import Picker from 'react-native-country-picker-modal';
import { useTheme } from 'styled-components/native'
import { OText } from '../shared'

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
  const {
    handleChangeOrderType,
    typeSelected,
    defaultValue,
    configTypes,
    orderTypes
  } = props

  const theme = useTheme();
  const [orderState] = useOrder();
  const [isOpen, setIsOpen] = useState(false);
  let currentDriver;

  const styles = StyleSheet.create({
    itemSelected: {
      backgroundColor: theme.colors.notAvailable,
    }
  })

  const pickerStyle = StyleSheet.create({
    inputAndroid: {
      color: theme.colors.secundaryContrast,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 10,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.inputDisabled,
      fontSize: 15
    },
    inputIOS: {
      color: theme.colors.secundaryContrast,
      paddingEnd: 20,
      height: 50,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 10,
      paddingHorizontal: 20,
      backgroundColor: theme.colors.inputDisabled,
      fontSize: 15
    },
    icon: {
      top: Platform.OS === 'ios' ? 10 : 15,
      right: Platform.OS === 'ios' ? 0 : 7,
      position: 'absolute',
      fontSize: 20
    },
    placeholder: {
      color: theme.colors.secundaryContrast
    }
  })

  const _orderTypes = orderTypes.filter((type: any) => configTypes?.includes(type.value))

  const items = _orderTypes.map((type) => {
    return {
      key: type.value,
      value: type.value,
      label: type.content
    }
  })

  const typeSelectedObj: any = items.find(item => item.value === (defaultValue || typeSelected)) || {}

  const handleChangeOrderTypeCallback = (orderType : number) => {
    if(!orderState.loading){
      handleChangeOrderType(orderType)
      setIsOpen(false)
    }
  }

  return (
    typeSelected !== undefined && (
      <OrderTypeWrapper>
        {/* <RNPickerSelect
          onValueChange={(orderType: any) => handleChangeOrderTypeCallback(orderType)}
          items={items}
          placeholder={{}}
          style={pickerStyle}
          value={defaultValue || typeSelected}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          useNativeAndroidPickerStyle={false}
          disabled={orderState.loading && !open}
        /> */}
        <Picker
          countryCodes={currentDriver}
          visible={isOpen && !orderState.loading}
          onClose={() => setIsOpen(false)}
          withCountryNameButton
          closeButtonStyle={{
            width: '100%',
            alignItems: 'flex-end',
            padding: 10
          }}
          renderFlagButton={() => (
            <>
              <TouchableOpacity
                onPress={() => setIsOpen(true)}
                disabled={items.length === 0}>
                <SelectItem>
                  <OText
                    color={theme.colors.secundaryContrast}
                    size={14}
                  >
                    {typeSelectedObj.label}
                  </OText>
                </SelectItem>
              </TouchableOpacity>
            </>
          )}
          flatListProps={{
            keyExtractor: (item: any) => item.value,
            data: items || [],
            renderItem: ({ item }: any) => (
              <TouchableOpacity
                style={typeSelectedObj.value === item.value && styles.itemSelected}
                disabled={typeSelectedObj.value === item.value}
                onPress={() => handleChangeOrderTypeCallback(item.value)}
              >
                <SelectItem>
                  <View style={{ width: 40 }} />
                  <OText
                    size={14}
                    color={typeSelectedObj.value === item.value && theme.colors.grey}
                  >
                    {item.label}
                  </OText>
                </SelectItem>
              </TouchableOpacity>
            ),
          }}
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
