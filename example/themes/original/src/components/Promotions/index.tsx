import React, { useState } from 'react'
import { PromotionsController, useLanguage, useUtils } from 'ordering-components/native'
import FastImage from 'react-native-fast-image'
import {
  PromotionsContainer,
  SingleOfferContainer,
  OfferInformation,
  SearchBarContainer,
  SingleBusinessOffer,
  AvailableBusinesses,
  OfferData,
  Code,
  BusinessInfo,
  WrapperSingleOffer
} from './styles'
import { SearchBar } from '../SearchBar'
import NavBar from '../NavBar'
import { useTheme } from 'styled-components/native';
import { OButton, OIcon, OModal, OText } from '../shared'
import { Placeholder, PlaceholderLine } from 'rn-placeholder'
import { NotFoundSource } from '../NotFoundSource'
import { View, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native'
import { PromotionParams } from '../../types'
import { Container } from '../../layouts/Container'

const PromotionsUI = (props: PromotionParams) => {
  const {
    navigation,
    offersState,
    handleSearchValue,
    searchValue,
    loadOffers,
    offerSelected,
    setOfferSelected
  } = props

  const theme = useTheme();

  const styles = StyleSheet.create({
    productStyle: {
      width: 75,
      height: 75,
      borderRadius: 7.6
    },
    buttonStyle: {
      width: '100%',
      height: 35,
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: 8
    },
    offerTitle: {
      fontSize: 14
    },
    offerDescription: {
      color: '#909BA9',
      fontSize: 12
    },
    offerExtraInfo: {
      fontSize: 12
    },
    modalButtonStyle: {
      width: 100,
      height: 35,
      paddingLeft: 0,
      paddingRight: 0,
      borderRadius: 7.6
    }
  });

  const [, t] = useLanguage()
  const [{ parseDate, parsePrice, optimizeImage }] = useUtils()
  const [openModal, setOpenModal] = useState(false)
  const [refreshing] = useState(false);

  const handleClickOffer = (offer: any) => {
    setOpenModal(true)
    setOfferSelected(offer)
  }

  const handleBusinessClick = (store: any) => {
    setOpenModal(false)
    navigation.navigate('Business', { store: store.slug })
  }

  const handleOnRefresh = () => {
    if (!offersState.loading) {
      loadOffers();
    }
  }

  const filteredOffers = offersState?.offers?.filter((offer: any) => offer.name.toLowerCase().includes(searchValue.toLowerCase()))
  const targetString = offerSelected?.target === 1
    ? t('SUBTOTAL', 'Subtotal')
    : offerSelected?.target === 2
      ? t('DELIVERY_FEE', 'Delivery fee')
      : t('SERVICE_FEE', 'Service fee')

  return (
    <Container
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => handleOnRefresh()}
        />
      }
    >
      <NavBar
        title={t('PROMOTIONS', 'Promotions')}
        titleAlign={'center'}
        onActionLeft={() => navigation.goBack()}
        showCall={false}
        paddingTop={Platform.OS === 'ios' ? 20 : 10}
        style={{ paddingVertical: 0 }}
        btnStyle={{ paddingLeft: 0 }}
      />
      <PromotionsContainer>
        <SearchBarContainer>
          <SearchBar
            placeholder={t('SEARCH_OFFERS', 'Search offers')}
            onSearch={handleSearchValue}
          />
        </SearchBarContainer>

        {offersState?.loading && (
          <>
            {[...Array(5).keys()].map((key, i) => (
              <Placeholder key={i} style={{ flexDirection: 'row', marginBottom: 20 }}>
                <PlaceholderLine height={10} width={45} />
                <PlaceholderLine height={10} width={60} />
                <PlaceholderLine height={10} width={75} />
              </Placeholder>
            ))}
          </>
        )}
        {((!offersState?.loading && filteredOffers?.length === 0) || offersState?.error) && (
          <NotFoundSource
            content={offersState?.error || t('NOT_FOUND_OFFERS', 'Not found offers')}
          />
        )}
        <ScrollView>
          {!offersState?.loading && offersState.offers?.length > 0 && filteredOffers?.map((offer: any) => (
            <WrapperSingleOffer key={offer.id}>
              <SingleOfferContainer>
                <FastImage
                  style={{ height: 80, width: 80, aspectRatio: 1, borderRadius: 8 }}
                  source={typeof offer?.image !== 'number' ? {
                    uri: optimizeImage(offer?.image, 'h_1024,c_limit'),
                    priority: FastImage.priority.normal,
                  } : theme.images?.dummies?.businessLogo}
                />
                <OfferInformation>
                  <OText style={styles.offerTitle} numberOfLines={2}>{offer?.name}</OText>
                  {!!offer?.description && (
                    <OText style={styles.offerDescription} numberOfLines={2}>{offer?.description}</OText>
                  )}
                  <OText style={styles.offerExtraInfo}>
                    {t('EXPIRES', 'Expires')} {parseDate(offer?.end, { outputFormat: 'MMM DD, YYYY' })}
                  </OText>
                  <AvailableBusinesses>
                    <OText style={styles.offerExtraInfo} numberOfLines={1}>
                      {t('APPLY_FOR', 'Apply for')}:
                      {offer.businesses.map((business: any, i: number) => (
                        <React.Fragment key={i}>{' '}{business?.name}{i + 1 < offer.businesses?.length ? ',' : ''}</React.Fragment>
                      ))}
                    </OText>
                  </AvailableBusinesses>
                </OfferInformation>
              </SingleOfferContainer>
              <OButton
                onClick={() => handleClickOffer(offer)}
                text={t('VIEW', 'View')}
                style={styles.buttonStyle}
                textStyle={{ fontSize: 14, flexWrap: 'nowrap' }}
              />
            </WrapperSingleOffer>
          ))}
        </ScrollView>
        <OModal
          open={openModal}
          entireModal
          title={``}
          onClose={() => setOpenModal(false)}
        >
          <ScrollView style={{ padding: 20 }}>
            <OText style={{ alignSelf: 'center', fontWeight: '700' }} mBottom={20}>
              {offerSelected?.name} / {t('VALUE_OF_OFFER', 'Value of offer')}: {offerSelected?.rate_type === 1 ? `${offerSelected?.rate}%` : `${parsePrice(offerSelected?.rate)}`}
            </OText>
            <OfferData>
              {offerSelected?.type === 2 && (
                <Code>
                  <OText>{t('YOUR_CODE', 'Your code')}</OText>
                  <OText color={theme.colors.primary}>{offerSelected.coupon}</OText>
                </Code>
              )}
              <OText>{t('APPLIES_TO', 'Applies to')}: {targetString}</OText>
              {offerSelected?.auto && (
                <OText>{t('OFFER_AUTOMATIC', 'This offer applies automatic')}</OText>
              )}
              {!!offerSelected?.minimum && (
                <OText>{t('MINIMUM_PURCHASE_FOR_OFFER', 'Minimum purchase for use this offer')}: {parsePrice(offerSelected?.minimum)}</OText>
              )}
              {!!offerSelected?.max_discount && (
                <OText>{t('MAX_DISCOUNT_ALLOWED', 'Max discount allowed')}: {parsePrice(offerSelected?.max_discount)}</OText>
              )}
              {!!offerSelected?.description && (
                <OText>{offerSelected?.description}</OText>
              )}
            </OfferData>
            <OText style={{ marginTop: 10, marginBottom: 10 }}>
              {t('AVAILABLE_BUSINESSES_FOR_OFFER', 'Available businesses for this offer')}:
            </OText>
            <View style={{ marginBottom: 70 }}>
              {offerSelected?.businesses?.map((business: any) => {
                return (
                  <SingleBusinessOffer key={business.id}>
                    {business?.logo ? (
                      <FastImage
                        style={styles.productStyle}
                        source={{
                          uri: optimizeImage(business?.logo, 'h_250,c_limit'),
                          priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : (
                      <OIcon
                        src={theme?.images?.dummies?.product}
                        style={styles.productStyle}
                      />
                    )}
                    <BusinessInfo>
                      <OText style={{ maxWidth: '60%' }}>{business.name}</OText>
                      <OButton
                        onClick={() => handleBusinessClick(business)}
                        text={t('GO_TO_BUSINESSS', 'Go to business')}
                        style={styles.modalButtonStyle}
                        textStyle={{ fontSize: 10 }}
                      />
                    </BusinessInfo>
                  </SingleBusinessOffer>
                )
              })}
            </View>
          </ScrollView>
        </OModal>
      </PromotionsContainer>
    </Container>
  )
}

export const Promotions = (props: PromotionParams) => {
  const PromotionsProps = {
    ...props,
    UIComponent: PromotionsUI
  }

  return (
    <PromotionsController {...PromotionsProps} />
  )
}
