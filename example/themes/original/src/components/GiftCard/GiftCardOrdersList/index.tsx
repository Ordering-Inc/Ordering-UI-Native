import React, { useState } from 'react';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { View } from 'react-native';
import { OText } from '../../shared'
import { VerticalGiftCardOrdersLayout } from '../VerticalGiftCardOrdersLayout'

import {
  Container,
  NoOrdersWrapper
} from './styles'

export const GiftCardOrdersList = (props: any) => {
  const {
    onNavigationRedirect
  } = props;

	const theme = useTheme();
  const [, t] = useLanguage();
  const [isEmptyPending, setIsEmptyPending] = useState(false);
  const [isEmptySent, setIsEmptySent] = useState(false);
  const [isEmptyRedeemed, setIsEmptyRedeemed] = useState(false);

  return (
    <Container>
      <VerticalGiftCardOrdersLayout
        title={t('PENDING', 'Pending')}
        defaultStatus='pending'
        setIsEmpty={setIsEmptyPending}
        onNavigationRedirect={onNavigationRedirect}
      />

      {!isEmptyPending && (
        <View
          style={{
            height: 8,
            backgroundColor: theme.colors.backgroundGray100,
            marginHorizontal: -40,
          }}
        />
      )}

      <VerticalGiftCardOrdersLayout
        title={t('SENT', 'Sent')}
        defaultStatus='sent'
        setIsEmpty={setIsEmptySent}
        onNavigationRedirect={onNavigationRedirect}
      />

      <VerticalGiftCardOrdersLayout
        title={t('REDEEMED', 'Redeemed')}
        defaultStatus='activated'
        setIsEmpty={setIsEmptyRedeemed}
        onNavigationRedirect={onNavigationRedirect}
      />

      {isEmptyPending && isEmptySent && isEmptyRedeemed && (
        <NoOrdersWrapper>
          <OText size={16} color={theme.colors.textNormal}>{t('YOU_DONT_HAVE_CARDS', 'You don\'t have cards')}</OText>
        </NoOrdersWrapper>
      )}
    </Container>
  )
}