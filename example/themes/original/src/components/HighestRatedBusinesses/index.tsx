import React, { useEffect } from 'react';
import {
  BusinessList as BusinessesListingController,
  useLanguage,
  useOrder
} from 'ordering-components/native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { View, ScrollView, Platform, Dimensions } from 'react-native';
import { OText } from '../shared';
import { HighestRatedBusinessesParams } from '../../types';
import { BusinessController } from '../BusinessController'
import { NotFoundSource } from '../NotFoundSource'
import {
  ListWrapper
} from './styles'

const HighestRatedBusinessesUI = (props: HighestRatedBusinessesParams) => {
  const {
    businessesList,
    onBusinessClick,
    navigation,
    isLoading,
    getBusinesses,
    favoriteIds,
    setFavoriteIds,
    handleUpdateBusinessList
  } = props;

  const [, t] = useLanguage()
  const [orderState] = useOrder()

  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (businessesList?.loading || !isLoading) return
    getBusinesses(true)
  }, [isLoading])

  useEffect(() => {
    if (!businessesList?.businesses?.length) return
    const ids = [...favoriteIds]
    businessesList.businesses.forEach(business => {
      if (business?.favorite) {
        ids.push(business.id)
      }
    })
    setFavoriteIds([...new Set(ids)])
  }, [businessesList?.businesses?.length])

  return (
    <>

      {businessesList.loading ? (
        <>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            horizontal
            style={{ height: 300, paddingHorizontal: 20 }}
          >
            {[
              ...Array(10).keys()
            ].map((item, i) => (
              <Placeholder
                Animation={Fade}
                key={i}
                style={{
                  marginTop: 20,
                  width: windowWidth - 100,
                  paddingHorizontal: 5,
                  height: '100%'
                }}>
                <View style={{ width: '100%' }}>
                  <PlaceholderLine
                    height={150}
                    style={{ marginBottom: 20, borderRadius: 8 }}
                  />
                  <View style={{ paddingHorizontal: 10 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <PlaceholderLine
                        height={15}
                        width={40}
                        style={{ marginBottom: 15 }}
                      />
                      <PlaceholderLine
                        height={15}
                        width={20}
                        style={{ marginBottom: 15 }}
                      />
                    </View>
                    <PlaceholderLine
                      height={15}
                      width={30}
                      style={{ marginBottom: 10 }}
                    />
                    <PlaceholderLine
                      height={15}
                      width={80}
                      style={{ marginBottom: 10 }}
                    />
                  </View>
                </View>
              </Placeholder>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          {businessesList.businesses.length > 0 && (
            <ListWrapper>
              <OText size={16} mBottom={5} weight={Platform.OS === 'ios' ? '600' : 'bold'}>{t('HIGHEST_RATED', 'Highest rated')}</OText>
              <OText size={12}>{t('TOP_RATINGS_AND_GREAT_SERVICE', 'Top ratings and great service')}</OText>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                horizontal
                style={{ height: 300 }}
              >
                {
                  businessesList.businesses?.map(
                    (business: any) => (
                      <View
                        key={business.id}
                        style={{
                          width: windowWidth - 100,
                          paddingHorizontal: 5,
                          height: '100%'
                        }}
                      >
                        <BusinessController
                          business={business}
                          isBusinessOpen={business?.open}
                          handleCustomClick={onBusinessClick}
                          orderType={orderState?.options?.type}
                          navigation={navigation}
                          favoriteIds={favoriteIds}
                          setFavoriteIds={setFavoriteIds}
                          handleUpdateBusinessList={handleUpdateBusinessList}
                        />
                      </View>
                    )
                  )
                }
              </ScrollView>
            </ListWrapper>
          )}
        </>
      )}
    </>
  )
}

export const HighestRatedBusinesses = (props: any) => {
  const highestRatedBusinessesProps = {
    ...props,
    UIComponent: HighestRatedBusinessesUI,
    initialOrderByValue: 'rating'
  };

  return <BusinessesListingController {...highestRatedBusinessesProps} />;
}; 
