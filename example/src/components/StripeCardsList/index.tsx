import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  PaymentOptionStripe,
  useSession,
  useLanguage
} from 'ordering-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getIconCard } from '../../utils';
import { OAlert, OText } from '../shared';

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
  const [alert, setAlert] = useState<any>({ show: false })

  const handleCardSelected = (card: any) => {
    handleCardClick(card);
    onSelectCard(card);
  }

  return (
    <>
      {token && !cardsList.loading && cardsList.cards && cardsList.cards.length === 0 && (
        <OSItem style={{ justifyContent: 'center', paddingTop: 0 }}>
          <OText size={22}>
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
          <Placeholder Animation={Fade}>
            {[...Array(2)].map((_, i) => (
              <PlaceholderLine
                key={i}
                height={50}
                style={{ marginBottom: 5 }}
              />
            ))}
          </Placeholder>
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
                <View style={styles.viewStyle}>
                  {card.id === cardSelected?.id ? (
                    <MaterialCommunityIcons
                      name='radiobox-marked'
                      size={24}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name='radiobox-blank'
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </View>
                <View style={styles.viewStyle}>
                  {getIconCard(card.brand, 26)}
                </View>
                <View style={styles.viewStyle}>
                  <OText size={18}>
                    XXXX-XXXX-XXXX-{card.last4}
                  </OText>
                </View>
              </OSItemContent>
              <OSItemActions>
                <MaterialCommunityIcons
                  name='trash-can-outline'
                  size={28}
                  color={theme.colors.primary}
                  onPress={() => setAlert({
                    show: true,
                    title: t('CARD', 'Card'),
                    onAccept: () => {
                      deleteCard && deleteCard(card)
                      setAlert({ show: false })
                    },
                    content: [t('QUESTION_DELETE_CARD', 'Are you sure that you want to delete the card?')]
                  })}
                />
              </OSItemActions>
            </OSItem>
          ))}
        </ScrollView>
      )}
      <OAlert
        open={alert.show}
        title={alert.title}
        onAccept={alert.onAccept}
        onClose={() => setAlert({ show: false })}
        onCancel={() => setAlert({ show: false })}
        content={alert.content}
      />
    </>
  )
}

const styles = StyleSheet.create({
  viewStyle: {
    marginRight: 5
  },
  cardsList: {
    width: '100%',
    minHeight: 90,
    maxHeight: 100
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
