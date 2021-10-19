import React from 'react';
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
import {
  ListWrapper
} from './styles'

const HighestRatedBusinessesUI = (props: HighestRatedBusinessesParams) => {
  const {
    businessesList,
    onBusinessClick
  } = props;

  const [, t] = useLanguage()
	const [orderState] = useOrder();

  const windowWidth = Dimensions.get('window').width;

  return (
    <>
      <ListWrapper>
        <OText size={16} mBottom={5} weight={Platform.OS === 'ios' ? '600' : 'bold'}>{t('HIGHEST_RATED', 'Highest rated')}</OText>
        <OText size={12}>{t('TOP_RATINGS_AND_GREAT_SERVICE', 'Top ratings and great service')}</OText>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          horizontal
          style={{ height: 300 }}
        >
          {businessesList.businesses?.map(
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
                  handleCustomClick={onBusinessClick}
                  orderType={orderState?.options?.type}
                />
              </View>
            )
          )}
          {businessesList.loading && (
            <>
              {[
                ...Array(10).keys()
              ].map((item, i) => (
                <Placeholder
                  Animation={Fade}
                  key={i}
                  style={{
                    marginBottom: 20,
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
            </>
          )}
        </ScrollView>
      </ListWrapper>
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
