import React from 'react'
import { View } from 'react-native'
import {
  OrderTypeControl,
  useLanguage,
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native'

import { } from './styles'
import { OrderTypeSelectParams } from '../../types'
import { OText } from '../shared'
import OptionCard from '../OptionCard'
import { Container } from '../../layouts/Container'
import NavBar from '../NavBar'
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation'
import GridContainer from '../../layouts/GridContainer'

const OrderTypeSelectorCardUI = (props: OrderTypeSelectParams) => {
  const {
    handleChangeOrderType,
    typeSelected,
    defaultValue,
    configTypes,
    orderTypes,
    goBack,
    callback
  } = props

	const theme = useTheme();
  const [, t] = useLanguage();
  const [orientationState] = useDeviceOrientation();

  const _orderTypes = orderTypes.filter((type: any) => configTypes?.includes(type.value))

  const _takeOut = _orderTypes?.find(item => item?.value === 2);
  const _eatIn = _orderTypes?.find(item => item?.value === 3);
  const _selected: number | undefined = defaultValue || typeSelected;

  const cardStyle = {
    width: orientationState?.orientation === PORTRAIT ? orientationState?.dimensions?.width - 40 : orientationState?.dimensions?.width * 0.47,
    height: orientationState?.orientation === PORTRAIT ? orientationState?.dimensions?.height * 0.34 : orientationState?.dimensions?.height * 0.38,
  }

  return (
    typeSelected !== undefined && (
      <Container>
        <NavBar
          title={t('DELIVERY_TYPE', 'Delivery type')}
          {...(goBack && { onActionLeft: goBack } )}
        />

        <View style={{ marginVertical: orientationState?.dimensions?.height * 0.03 }}>
          <OText
            size={orientationState?.dimensions?.width * 0.048}
          >
            {t('WHERE_WILL_YOU_BE', 'Where will you be')} {'\n'}
            <OText
              size={orientationState?.dimensions?.width * 0.048}
              weight={'700'}
            >
              {t('EATING_TODAY', 'eating today')}{'?'}
            </OText>
          </OText>
        </View>


        <GridContainer
          style={{ justifyContent: 'space-between' }}
        >
          <OptionCard
            style={cardStyle}
            title={t('EAT_IN','Eat In')}
            description={t('EAT_IN_DESCRIPTION', 'We are very glad to have you here. Bon appetit!')}
            bgImage={theme.images.general.eatIn}
            icon={theme.images.general.pushPin}
            callToActionText={t('START_MY_ORDER', 'Start my order')}
            onClick={() => {
              handleChangeOrderType(_eatIn?.value);
              callback && callback();
            }}
          />

          <View style={{
            width: orientationState?.orientation === LANDSCAPE ? orientationState?.dimensions?.width * 0.0016 : 1,
            height: orientationState?.orientation === PORTRAIT ? orientationState?.dimensions?.height * 0.018 : 1,
          }} />

          <OptionCard
            style={cardStyle}
            title={t('TAKE_OUT','Take out')}
            description={t('TAKE_OUT_DESCRIPTION', 'You are very welcome anytime you visit us!')}
            bgImage={theme.images.general.takeOut}
            icon={theme.images.general.shoppingCart}
            callToActionText={t('START_MY_ORDER', 'Start my order')}
            onClick={() => {
              handleChangeOrderType(_takeOut?.value);
              callback && callback();
            }}
          />
        </GridContainer>
      </Container>
    )
  )
}

export const OrderTypeCardSelector = (props: any) => {
  const [, t] = useLanguage()

  const orderTypeProps = {
    ...props,
    UIComponent: OrderTypeSelectorCardUI,
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
