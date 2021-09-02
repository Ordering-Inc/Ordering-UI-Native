import React from 'react'
import {
  OrderTypeControl,
  useLanguage,
  useOrder
} from 'ordering-components/native'
import {View} from 'react-native'
import { OrderTypeSelectParams } from '../../types'
import ModalDropdown from 'react-native-modal-dropdown'
import { OText } from '../shared'
import { useTheme } from 'styled-components/native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
  const {
    handleChangeOrderType,
    typeSelected,
    defaultValue,
    configTypes,
    orderTypes
  } = props

  const theme = useTheme()
  const [orderState] = useOrder()

  const _orderTypes = orderTypes.filter((type: any) => configTypes?.includes(type.value))

  const items = _orderTypes.map((type) => {
    return {
      value: type.value,
      label: type.content,
      inputLabel: type.content
    }
  })

  const _selectedValue: number | undefined = defaultValue || typeSelected;
  const _selectedOrderType = items?.find((item) => item.value === _selectedValue);

  const handleChangeOrderTypeCallback = (orderType : number) => {
    if(!orderState.loading){
      handleChangeOrderType(orderType)
    }
  }

  return (
    typeSelected !== undefined && (
      <ModalDropdown
        defaultValue={_selectedOrderType?.label}
        options={items}
        onSelect={(_ : any, orderType : any) => {
          handleChangeOrderTypeCallback(orderType?.value);
        }}
        /* @ts-ignore */
        renderButtonText={(value) => value?.label}
        renderRow={(item : any) => (
          <View style={{ padding: 5, backgroundColor: theme.colors.white }}>
            <OText>{item.label}</OText>
          </View>
        )}
        renderRightComponent={() => (
          <View>
            <MaterialIcon name='keyboard-arrow-down' size={24}/>
          </View>
        )}
        dropdownStyle={{
          height: 110,
          borderRadius: 6,
          padding: 10,
        }}
        textStyle={{
          fontSize: 18,
          color: theme.colors.primary,
          maxWidth: 210,
        }}
      />
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
        value: 2,
        content: `${t('THIS_ORDER_IS_TO', 'This order is to')} ${t('TAKE_OUT', 'Take out')}`
      },
      {
        value: 3,
        content: `${t('THIS_ORDER_IS_TO', 'This order is to')} ${t('EAT_IN', 'Eat in')}`
      },
    ]
  }

  return <OrderTypeControl {...orderTypeProps} />
}
