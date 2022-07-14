import React from 'react'
import { Platform, KeyboardAvoidingView, StyleSheet } from 'react-native'
import { MultiCheckout as MultiCheckoutController } from '../../themes/original/src/components/MultiCheckout'

const MultiCheckout = (props: any) => {
  const multiCheckoutProps = {
    ...props,
    onPlaceOrderClick: (orderUuids: any) => {
      props.navigation.navigate('MultiOrders', { orderUuids: orderUuids })
    }
  }

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <MultiCheckoutController {...multiCheckoutProps} />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 70,
  },
});

export default MultiCheckout
