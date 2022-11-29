import React from 'react';
import { PlaceholderLine } from 'rn-placeholder';
import { View, ScrollView, Platform } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import {
  BusinessList as BusinessesListingController,
  useLanguage,
  useOrder,
} from 'ordering-components/native';

import { ListWrapper, CardsContainer, WrapperList } from './styles';

import { NotFoundSource } from '../NotFoundSource';
import { BusinessController } from '../BusinessController';
import { OText } from '../shared';
import { LogoutButton } from '../LogoutButton';

const BusinessesListingUI = (props: any) => {
  const {
    navigation,
    businessesList,
    paginationProps,
    handleBusinessClick,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const [orientationState] = useDeviceOrientation();

  const WIDTH_SCREEN = orientationState?.dimensions?.width

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ListWrapper>
        {!businessesList.loading ? (
          <>
            <OText
              size={WIDTH_SCREEN * 0.02}
              weight='bold'
              style={{ paddingHorizontal: 15 }}
            >
              {t('STORES', 'Stores')}
            </OText>
            <OText
              size={WIDTH_SCREEN * 0.014}
              color={theme.colors.letterGray}
              style={{
                paddingHorizontal: 15,
                paddingBottom: 40
              }}
            >
              {t('SELECT_STORE_MESSAGE', 'Please select the store that do you need')}
            </OText>
            <View style={{ position: 'absolute', top: 25, right: 20 }}>
              <LogoutButton />
            </View>
          </>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            <PlaceholderLine width={80} height={50} style={{ marginBottom: 10 }} />
            <PlaceholderLine height={50} style={{ marginBottom: 40 }} />
          </View>
        )}
        <CardsContainer>
          {!businessesList.loading && businessesList.businesses?.map(
            (business: any) => (
              <BusinessController
                key={business.id}
                business={business}
                isBusinessOpen={business.open}
                handleCustomClick={handleBusinessClick}
                orderType={orderState?.options?.type}
                navigation={navigation}
              />
            )
          )}
        </CardsContainer>


        {!businessesList.loading && businessesList.businesses.length === 0 && paginationProps.totalPages !== null && (
          <NotFoundSource
            content={t(
              'NOT_FOUND_BUSINESSES',
              'No businesses to delivery / pick up at this address, please change filters or change address.',
            )}
          />
        )}

        {businessesList.loading && (
          <WrapperList>
            {[...Array(24).keys()].map(i => (
              <PlaceholderLine
                key={i}
                width={15}
                height={120}
                style={{
                  marginBottom: 20,
                  borderRadius: 8
                }}
              />
            ))}
          </WrapperList>
        )}
      </ListWrapper>
    </ScrollView>
  );
};

export const BusinessesListing = (props: any) => {
  const BusinessesListingProps = {
    ...props,
    isForceSearch: Platform.OS === 'ios',
    UIComponent: BusinessesListingUI,
  };

  return <BusinessesListingController {...BusinessesListingProps} />;
};
