import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  PaymentOptionStripe,
  useSession,
  useLanguage
} from 'ordering-components/native';
import { PlaceholderLine } from 'rn-placeholder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getIconCard } from '../../../../utils';
import { OAlert, OIcon, OText } from '../shared';

import { NotFoundSource } from '../NotFoundSource';

import {
  OSItem,
  OSItemContent,
  OSItemActions,
} from '../PaymentOptionStripe/styles';
import { useTheme } from 'styled-components/native';

const StripeCardsListUI = (props: any) => {
  const {
    onSelectCard,
    deleteCard,
    cardSelected,
    cardsList,
    handleCardClick,
  } = props;

  const theme = useTheme();
  const [{ token }] = useSession();
  const [, t] = useLanguage();

  const handleCardSelected = (card: any) => {
    handleCardClick(card);
    onSelectCard(card);
  }

  return (
    <>
      {token && !cardsList.loading && cardsList.cards && cardsList.cards.length === 0 && (
        <OSItem style={{ justifyContent: 'center', paddingTop: 0 }}>
          <OText size={14}>
            {t('YOU_DONT_HAVE_CARDS', 'You don\'t have cards')}
          </OText>
        </OSItem>
      )}

      {token && cardsList.error && cardsList.error.length > 0 && (
        <NotFoundSource
          content={cardsList?.error[0]?.message || cardsList?.error[0]}
        />
      )}

      {token && cardsList.loading && (
        <View style={{ width: '100%' }}>
          {[...Array(2)].map((_, i) => (
            <PlaceholderLine
              key={i}
              height={30}
              noMargin
              style={{ marginBottom: 20 }}
            />
          ))}
        </View>
      )}

      {token && cardsList.cards && cardsList.cards.length > 0 && (
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={styles.cardsList}
        >
          {cardsList.cards.map((card: any) => (
            <OSItem key={card.id} isUnique={cardsList.cards.length}>
              <OSItemContent onPress={() => handleCardSelected(card)}>
                <View style={{...styles.viewStyle, marginEnd: 17}}>
                  {card.id === cardSelected?.id ? (
                    <OIcon
                      src={theme.images.general.radio_act}
                      width={16}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <OIcon
                      src={theme.images.general.radio_nor}
                      width={16}
                      color={theme.colors.primary}
                    />
                  )}
                </View>
                <View style={styles.viewStyle}>
                  {getIconCard(card.brand, 17)}
                </View>
                <View style={styles.viewStyle}>
                  <OText size={12} color={theme.colors.textSecondary}>
                    XXXX-XXXX-XXXX-{card.last4}
                  </OText>
                </View>
              </OSItemContent>
              <OSItemActions>
                <OAlert
                  title={t('CARD', 'Card')}
                  message={t('QUESTION_DELETE_CARD', 'Are you sure that you want to delete the card?')}
                  onAccept={() => deleteCard(card)}
                >
                  <OIcon
                    src={theme.images.general.trash}
                    width={16}
                    color={theme.colors.red}
                  />
                </OAlert>
              </OSItemActions>
            </OSItem>
          ))}
        </ScrollView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  viewStyle: {
    marginEnd: 9
  },
  cardsList: {
    width: '100%',
    maxHeight: 130
  },
})

export const StripeCardsList = (props: any) => {
  const stripeCardsListProps = {
    ...props,
    UIComponent: StripeCardsListUI
  }
  return (
    <PaymentOptionStripe {...stripeCardsListProps} />
  )
}
