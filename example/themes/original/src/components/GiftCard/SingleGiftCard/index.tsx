import React from 'react';
import { useLanguage, useUtils, useEvent } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { View, StyleSheet } from 'react-native';
import {
	Placeholder,
	PlaceholderLine,
	Fade
} from 'rn-placeholder';
import FastImage from 'react-native-fast-image';
import { OText } from '../../shared'

import {
  CardContainer
} from './styles'

export const SingleGiftCard = (props: any) => {
  const {
    card,
    isSkeleton,
    onNavigationRedirect
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [events] = useEvent()
  const [{ parsePrice, optimizeImage, parseDate }] = useUtils()

  const styles = StyleSheet.create({
    logo: {
      borderRadius: 8,
      width: 64,
      height: 64
    },
    innerContainer: {
      flexDirection: 'row',
      marginBottom: 24
    }
  });

  const getGiftCardStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return t('PENDING', 'Pending')
      case 'activated':
        return t('REDEEMED', 'Redeemed')
      default:
        return status
    }
  }

  const handleClickGiftCardOrder = (card: any) => {
    onNavigationRedirect?.('OrderDetails', { orderId: card.order_product?.order_id });
  }

  return (
    <CardContainer
      activeOpacity={0.8}
      onPress={() => handleClickGiftCardOrder(card)}
    >
      {isSkeleton ? (
        <Placeholder style={{ marginBottom: 10 }} Animation={Fade}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 64, marginRight: 14 }}>
              <PlaceholderLine
                width={100}
                height={64}
                style={{ marginRight: 10, marginBottom: 10 }}
              />
            </View>
            <Placeholder style={{ paddingTop: 5 }}>
              <PlaceholderLine width={60} style={{ marginBottom: 6}} />
              <PlaceholderLine width={40} style={{ marginBottom: 6 }} />
              <PlaceholderLine width={20} style={{ marginBottom: 0 }} />
            </Placeholder>
          </View>
        </Placeholder>
      ) : (
        <View style={styles.innerContainer}>
          <View>
            <FastImage
              style={styles.logo}
              source={card?.order_product?.images ? {
                uri: optimizeImage(card?.order_product?.images, 'h_86,c_limit')
              } : theme?.images?.dummies?.businessLogo}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'  }}>
            <OText size={12} lineHeight={18}>{card?.order_product?.name}</OText>
            <OText size={12} lineHeight={18}>{parsePrice(card?.order_product?.price)}</OText>
          </View>
          <OText size={10} color={theme.colors.textSecondary} lineHeight={15}>{parseDate(card?.created_at)}</OText>
          <OText size={10} color={theme.colors.primary}>{getGiftCardStatus(card?.status)}</OText>
        </View>
        </View>
      )}
    </CardContainer>
  )
}
