import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import Feather from 'react-native-vector-icons/Feather'
import { useTheme } from 'styled-components/native';
import { OText, OButton } from '../../shared';
import { OModal } from '../../../../../../src/components/shared';
import { PurchaseGiftCard } from '../PurchaseGiftCard'
import { RedeemGiftCard } from '../RedeemGiftCard'

import {
  Container
} from './styles'

export const GiftCardUI =  React.memo((props: any) => {
  const {
    navigation
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()
  const [openModal, setOpenModal] = useState<any>(null)

  const style = StyleSheet.create({
    title: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    actionWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10
    },
    btnStyle: {
      borderRadius: 7.6,
      paddingLeft: 0,
      paddingRight: 0,
      height: 44
    }
  })

  const handleCustomGoToCheckout = (uuid: any) => {
    setOpenModal(null)
    navigation.navigate('CheckoutNavigator', {
      screen: 'CheckoutPage',
      cartUuid: uuid
    })
  }

  return (
    <Container>
      <View style={style.title}>
        <OText size={16} color={theme.colors.textNormal} weight='bold' mBottom={0} mRight={12}>{t('GIFT_CARD', 'Gift card')}</OText>
        <Feather name='gift' color={theme.colors.textNormal} size={16} />
      </View>

      <View style={style.actionWrapper}>
        <OButton
          onClick={() => setOpenModal('purchase')}
          text={t('PURCHASE_GIFT_CARD', 'Purchase gift card')}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          textStyle={{ color: 'white', fontSize: 13 }}
          imgRightSrc={null}
          style={{ ...style.btnStyle, marginRight: 14 }}
        />

        <OButton
          onClick={() => setOpenModal('redeem')}
          text={t('REDEEM_GIFT_CARD', 'Redeem gift card')}
          bgColor={theme.colors.lightPrimary}
          borderColor={theme.colors.lightPrimary}
          textStyle={{ color: theme.colors.primary, fontSize: 13 }}
          imgRightSrc={null}
          style={style.btnStyle}
        />
      </View>

      <OModal
				open={openModal === 'purchase'}
				onClose={() => setOpenModal(null)}
				entireModal
			>
				<PurchaseGiftCard handleCustomGoToCheckout={handleCustomGoToCheckout} />
			</OModal>
      <OModal
				open={openModal === 'redeem'}
				onClose={() => setOpenModal(null)}
				entireModal
			>
				<RedeemGiftCard
          onClose={() => setOpenModal(null)}
        />
			</OModal>
    </Container>
  )
})