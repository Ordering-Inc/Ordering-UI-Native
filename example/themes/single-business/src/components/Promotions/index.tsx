import React from 'react'
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { PromotionsController, useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';

import { OText, OButton } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import { PromotionCard } from '../PromotionCard'
import { Container } from './styles'

const PromotionsUI = (props: any) => {
  const {
    loading,
    error,
    offers,
    pagination
   } = props.offersState

  const [, t] = useLanguage();
  const [theme] = useTheme();
  const { height } = useWindowDimensions();

  return (
    <Container>
      <OText size={20} mBottom={20} style={{ marginTop: 20 }}>
        {t('PROMOTIONS', 'Promotions')}
      </OText>

      {!error && (
        <>
          <ScrollView style={{ paddingBottom: 20 }}>
            {offers?.length > 0 && offers?.map((offer: any) => (
              <PromotionCard
                key={offer.id}
                promotion={offer}
              />
            ))}
            {loading && (
              <ScrollView>
                {[...Array(8)].map((_, i) => (
                  <PromotionCard
                    key={i}
                    isLoading
                  />
                ))}
              </ScrollView>
            )}
            {pagination.totalPages && pagination.currentPage < pagination.totalPages && (
              <View>
                <OButton
                  onClick={props.loadMoreOffers}
                  text={t('LOAD_MORE_PROMOTIONS', 'Load more promotions')}
                  imgRightSrc={null}
                  textStyle={{ color: theme.colors.white }}
                  style={{ borderRadius: 8, shadowOpacity: 0, marginTop: 20 }}
                />
              </View>
            )}
          </ScrollView>
        </>
      )}

      {(error || offers?.length === 0) && !loading && (
        <View style={{ height: height * 0.7, justifyContent: 'center' }}>
          <NotFoundSource
            content={error
              ? error[0]
              : t('NO_PROMOTIONS_FOUND', 'Sorry, no promotions found')}
            image={theme.images.general.notFound}
          />
        </View>
      )}
    </Container>
  )
}

export const Promotions = (props: any) => {
  const promotionsProps = {
    ...props,
    UIComponent: PromotionsUI,
  };
  return <PromotionsController {...promotionsProps} />;
};
