import React from 'react'
import { StyleSheet, TouchableOpacity, View,ActivityIndicator } from 'react-native'
import {
  OrderTypeControl,
  useLanguage,
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native'

// import { OrderTypeSelectParams } from '../../types'
import { ActivityIndicatorContainer } from './styles'
import { useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import { OText } from '../shared'
import {Container} from '../../layouts/Container'
import NavBar from '../NavBar'
const OrderTypeSelectorCardUI = (props: any) => {
  const {
    onClose
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const [orientationState] = useDeviceOrientation();
  const styles = StyleSheet.create({
    button: {
        backgroundColor: '#e6f0ff',
        padding: 20,
        width: 280,
        borderRadius: 8
    }
  })
  return (
      <Container>
        <NavBar
          title={t('CARD_PAYMENT', 'Card payment')}
          onActionLeft={onClose}
        />
        <View style={{ marginVertical: orientationState?.dimensions?.height * 0.03 }}>
          <OText
            size={orientationState?.dimensions?.width * 0.048}
          >
            {t('FOLLOW_THE_PIN_PAD', 'Follow the PIN pad')} {'\n'}
            <OText
              size={orientationState?.dimensions?.width * 0.048}
              weight={'700'}
            >
              {t('INSTRUCTIONS', 'instructions')}
            </OText>
          </OText>
        </View>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <OText size={18} color={theme.colors.primary} weight={700}>{t('WILL_PAY_WITH_CASH', 'I\'m sorry. I will pay with cash')}</OText>
        </TouchableOpacity>
        <ActivityIndicatorContainer>
            <ActivityIndicator size='large' color={theme.colors.primary} />
        </ActivityIndicatorContainer>
      </Container>
  )
}

export const PaymentOptionStripe = (props: any) => {
  const [, t] = useLanguage()

  const orderTypeProps = {
    ...props,
    UIComponent: OrderTypeSelectorCardUI,
  }

  return <OrderTypeControl {...orderTypeProps} />
}

