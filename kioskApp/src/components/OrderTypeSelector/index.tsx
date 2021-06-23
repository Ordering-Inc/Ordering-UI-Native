import React from 'react'
import {
  OrderTypeControl,
  useLanguage,
  useOrder
} from 'ordering-components/native'
import { View, Dimensions} from 'react-native'
import { } from './styles'
import { OrderTypeSelectParams } from '../../types'
import { OText } from '../shared'
import { DELIVERY_TYPE_IMAGES, IMAGES } from '../../config/constants'
import OptionCard from '../OptionCard'
import { Container } from '../../layouts/Container'
import NavBar from '../NavBar'

const _dim = Dimensions.get('window');

const OrderTypeSelectorUI = (props: OrderTypeSelectParams) => {
  const {
    handleChangeOrderType,
    typeSelected,
    defaultValue,
    configTypes,
    orderTypes,
    goBack,
    callback
  } = props

  const [orderState] = useOrder();
	const [, t] = useLanguage();

  const _orderTypes = orderTypes.filter((type: any) => configTypes?.includes(type.value))

  const _takeOut = _orderTypes?.find(item => item?.value === 2);
  const _eatIn = _orderTypes?.find(item => item?.value === 3);
  const _selected: number | undefined = defaultValue || typeSelected;

  return (
    typeSelected !== undefined && (
      <Container>
        <NavBar
          title={t('DELIVERY_TYPE', 'Delivery type')}
          {...(goBack && { onActionLeft: goBack } )}
        />

        <View style={{ marginVertical: _dim.height * 0.03 }}>
          <OText
            size={_dim.width * 0.05}
          >
            {t('WHERE_WILL_YOU_BE', 'Where will you be')} {'\n'}
            <OText
              size={_dim.width * 0.05}
              weight={'700'}
            >
              {_selected === _takeOut?.value && _takeOut.content}
              {_selected === _eatIn?.value && _eatIn.content}
              {'?'}
            </OText>
          </OText>
        </View>

        <OptionCard
          title={t('EAT_IN','Eat In')}
          description={t('EAT_IN_DESCRIPTION', 'We are very glad to have you here. Bon appetit!')}
          bgImage={DELIVERY_TYPE_IMAGES.eatIn}
          icon={IMAGES.pushPin}
          callToActionText={t('START_MY_ORDER', 'Start my order')}
          onClick={() => {
            handleChangeOrderType(_eatIn?.value);
            callback && callback();
          }}
        />

        <View style={{ height: _dim.height * 0.02 }} />

        <OptionCard
          title={t('TAKE_OUT','Take out')}
          description={t('TAKE_OUT_DESCRIPTION', 'You are very welcome anytime you visit us!')}
          bgImage={DELIVERY_TYPE_IMAGES.takeOut}
          icon={IMAGES.shoppingCart}
          callToActionText={t('START_MY_ORDER', 'Start my order')}
          onClick={() => {
            handleChangeOrderType(_takeOut?.value);
            callback && callback();
          }}
        />

        <View style={{ height: _dim.height * 0.05 }} />
      </Container>
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
        content: t('TAKE_OUT', 'Take out')
      },
      {
        value: 3,
        content: t('EAT_IN', 'Eat in')
      },
    ]
  }

  return <OrderTypeControl {...orderTypeProps} />
}
