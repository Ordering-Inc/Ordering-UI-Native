import React, { useState, useEffect } from 'react'
import {
  OrderTypeControl,
  useLanguage,
  useOrder
} from 'ordering-components/native'
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import Picker from 'react-native-country-picker-modal';
import { useTheme } from 'styled-components/native'

import { OrderTypeWrapper, SelectItem, SelectItemBtn } from './styles'
import { OrderTypeSelectParams } from '../../types'
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
  const [optionSelected, setOptionSelected] = useState<any>(null)
  let currentDriver;

  const styles = StyleSheet.create({
    itemSelected: {
      backgroundColor: theme.colors.disabled,
    }
  })

  const _orderTypes = orderTypes.filter((type: any) => configTypes?.includes(type.value))

  const items: any[] = _orderTypes.map((type) => {
    return {
      key: type.value,
      value: type.value,
      label: type.content
    }
  })

  const typeSelectedObj: any = items.find(item => item.value === (defaultValue || typeSelected)) || {}

  const handleChangeOrderTypeCallback = (orderType: number) => {
    setOptionSelected(orderType)
    if(!orderState.loading){
      handleChangeOrderType(orderType)
    }
  }

  useEffect(() => {
    if (optionSelected === orderState?.options?.type && !orderState.loading) {
      setIsOpen(false)
    }
  }, [orderState])

  return (
    typeSelected !== undefined && (
      <OrderTypeWrapper>
        <Picker
          countryCodes={currentDriver}
          visible={isOpen}
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
                disabled={items.length === 0 || orderState.loading}
              >
                <SelectItemBtn>
                  <OText
                    color={theme.colors.secundaryContrast}
                    size={14}
                  >
                    {typeSelectedObj.label}
                  </OText>
                </SelectItemBtn>
              </TouchableOpacity>
            </>
          )}
          flatListProps={{
            keyExtractor: (item: any) => item.value,
            data: items || [],
            renderItem: ({ item }: any) => (
              <TouchableOpacity
                style={typeSelectedObj.value === item.value && styles.itemSelected}
                disabled={typeSelectedObj.value === item.value || orderState.loading}
                onPress={() => handleChangeOrderTypeCallback(item.value)}
              >
                <SelectItem>
                  <View style={{ width: 40 }}>
                    {optionSelected === item.value && orderState.loading && (
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                    )}
                  </View>
                  <OText
                    size={14}
                    style={{ marginRight: 10 }}
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
