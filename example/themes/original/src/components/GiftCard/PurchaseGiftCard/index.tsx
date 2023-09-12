import React from 'react'
import {
  useLanguage,
  PurchaseGiftCard as PurchaseGiftCardController
} from 'ordering-components/native'
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import { OText, OButton, OIcon } from '../../shared';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import {
  Container
} from './styles'

const PurchaseGiftCardUI = (props: any) => {
  const {
    productsListState,
    selectedProduct,
    setSelectedProduct,
    handleAccept,
    onClose
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  const style = StyleSheet.create({
    itemStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.disabled
    },
    btnStyle: {
      borderRadius: 7.6,
      paddingLeft: 0,
      paddingRight: 0,
      height: 44,
      marginTop: 50
    }
  })

  return (
    <Container>
      <View style={{
        marginBottom: 40,
        marginTop: Platform.OS === 'ios' ? 30 : 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <OButton
          imgLeftStyle={{ width: 18 }}
          imgRightSrc={null}
          style={{
            borderWidth: 0,
            width: 26,
            height: 26,
            paddingLeft: 0,
            paddingRight: 0,
          }}
          useArrow
          onClick={onClose}
          icon={AntDesignIcon}
          iconProps={{
            name: 'arrowleft',
            size: 26,
            style: {
              color: theme.colors.textNormal
            }
          }}
        />
        <OText color={theme.colors.textNormal} weight='bold' size={20} mLeft={10}>{t('PURCHASE_GIFT_CARD', 'Purchase gift card')}</OText>
      </View>
      <OText color={theme.colors.textNormal} size={14}>{t('SELECT_ONE_OPTION', 'Select one option')}</OText>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
      >
        {productsListState.loading && (
          [...Array(5).keys()].map(i => (
            <View key={i} style={style.itemStyle}>
              <Placeholder
                Animation={Fade}
              >
                <PlaceholderLine width={80} height={20} style={{ marginBottom: 0 }} />
              </Placeholder>
            </View>
          ))
        )}
        {productsListState.products.map(product => (
          <TouchableOpacity
            key={product.id}
            style={style.itemStyle}
            onPress={() => setSelectedProduct(product)}
          >
            <View style={{ marginRight: 10 }}>
              {selectedProduct?.id === product.id ? (
                <OIcon src={theme.images.general.radio_act} color={theme.colors.primary} width={16} />
              ) : (
                <OIcon src={theme.images.general.radio_nor} color={theme.colors.disabled} width={16} />
              )}
            </View>
            <OText color={theme.colors.textNormal} size={14}>{product.name}</OText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <OButton
        onClick={() => handleAccept()}
        text={t('ACCEPT', 'Accept')}
        bgColor={theme.colors.primary}
        borderColor={theme.colors.primary}
        textStyle={{ color: 'white', fontSize: 13 }}
        imgRightSrc={null}
        style={style.btnStyle}
        isDisabled={!selectedProduct}
      />
    </Container>
  )
}

export const PurchaseGiftCard = (props: any) => {
  const purchaseGiftCardProps = {
    ...props,
    UIComponent: PurchaseGiftCardUI
  }
  return <PurchaseGiftCardController {...purchaseGiftCardProps} />
}
