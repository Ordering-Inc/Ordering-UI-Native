import React, { useEffect } from 'react';
import { useLanguage, GiftCardOrdersList as GiftCardOrdersListController } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
  Placeholder,
  PlaceholderLine,
  Fade
} from 'rn-placeholder';
import { SingleGiftCard } from '../SingleGiftCard';
import { OButton, OText } from '../../shared';
import {
  ProductsListContainer,
  SingleGiftCardWrapper,
  WrappButton
} from './styles'

const VerticalGiftCardOrdersLayoutUI = (props: any) => {
  const {
    giftCards,
    paginationProps,
    loadMoreOrders,
    title,
    setIsEmpty,
    onNavigationRedirect
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()

  useEffect(() => {
    if (giftCards.loading) return
    if (giftCards.list?.length === 0) setIsEmpty(true)
  }, [giftCards])

  return (
    <ProductsListContainer>
      {
        giftCards.loading ? (
          <Placeholder Animation={Fade} style={{ marginVertical: 16 }}>
            <PlaceholderLine width={30} height={16} />
          </Placeholder>
        ) : giftCards.list?.length > 0 && (
          <OText size={16} lineHeight={24} weight={'500'} color={theme.colors.textNormal} mBottom={24} style={{ marginTop: 24 }}>{title}</OText>
        )}
      {giftCards.list.map(card => (
        <SingleGiftCardWrapper key={card.id}>
          <SingleGiftCard
            card={card}
            onNavigationRedirect={onNavigationRedirect}
          />
        </SingleGiftCardWrapper>
      ))}
      {giftCards.loading && (
        [...Array(10).keys()].map(i => (
          <SingleGiftCardWrapper key={i}>
            <SingleGiftCard
              isSkeleton
            />
          </SingleGiftCardWrapper>
        ))
      )}
      {paginationProps.totalPages && paginationProps.currentPage < paginationProps.totalPages && (
        <WrappButton>
          <OButton
            onClick={loadMoreOrders}
            text={t('LOAD_MORE_ORDERS', 'Load more orders')}
            imgRightSrc={null}
            style={{ borderRadius: 7.6, shadowOpacity: 0 }}
          />
        </WrappButton>
      )}
    </ProductsListContainer>
  )
}

export const VerticalGiftCardOrdersLayout = (props: any) => {
  const giftCardsProps = {
    ...props,
    UIComponent: VerticalGiftCardOrdersLayoutUI
  }
  return <GiftCardOrdersListController {...giftCardsProps} />
}
