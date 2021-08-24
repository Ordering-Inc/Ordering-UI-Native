import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import {
  ToastType,
  useToast,
  useLanguage,
  useOrder,
  BusinessList,
} from 'ordering-components/native';
import { NotFoundSource } from '../NotFoundSource';
import { SearchBar } from '../SearchBar';
import { BusinessController } from '../BusinessController';
import { OText } from '../shared';
import { BusinessesListingParams } from '../../types';

const StoresListUI = (props: BusinessesListingParams) => {
  const {
    navigation,
    businessesList,
    searchValue,
    getBusinesses,
    handleChangeBusinessType,
    handleBusinessClick,
    paginationProps,
    handleChangeSearch,
  } = props;

  const { loading, error, businesses } = businessesList;

  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const theme = useTheme();
  const [, { showToast }] = useToast();
  const [isUpdateStore, setIsUpdateStore] = useState(false);

  const [loadBusinesses, setLoadBusinesses] = useState(loading);
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );
  const [windowsHeight, setWindowsHeight] = useState(
    parseInt(parseFloat(String(Dimensions.get('window').height)).toFixed(0)),
  );

  const handleScroll = ({ nativeEvent }: any) => {
    const y = nativeEvent.contentOffset.y;
    const height = nativeEvent.contentSize.height;
    const hasMore = !(
      paginationProps.totalPages === paginationProps.currentPage
    );

    if (y + windowsHeight > height && !businessesList?.loading && hasMore) {
      setLoadBusinesses(true);
      getBusinesses();
      showToast(
        ToastType.Info,
        t('LOADING_MORE_BUSINESSES', 'Loading more businesses'),
      );
    }
  };

  useEffect(() => {
    if (error) {
      showToast(ToastType.Error, error);
    }

    if (loadBusinesses && !loading) {
      setLoadBusinesses(false);
    }
  }, [loading]);

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    setWindowsHeight(
      parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0)),
    );

    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      marginBottom: 0,
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 25,
    },
    sectionTitle: {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 26,
      color: theme.colors.textGray,
    },
    icons: {
      flexDirection: 'row',
    },
    borderStyle: {
      borderColor: theme.colors.red,
      borderWidth: 0,
      borderRadius: 10,
    },
  });

  return (
    <ScrollView style={styles.container} onScroll={(e: any) => handleScroll(e)}>
      <View style={styles.header}>
        <OText style={styles.sectionTitle}>{t('STORES', 'Stores')}</OText>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <SearchBar
            borderStyle={styles.borderStyle}
            onSearch={handleChangeSearch}
            searchValue={searchValue}
            lazyLoad
            isCancelXButtonShow={!!searchValue}
            onCancel={() => handleChangeSearch('')}
            placeholder={t('FIND_BUSINESS', 'Find a business')}
          />
        </View>
      </View>

      {!loading && businesses?.length === 0 && (
        <NotFoundSource
          content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
          image={theme.images.general.notFound}
          conditioned={false}
        />
      )}

      {!error &&
        businesses?.map((business: any) => (
          <BusinessController
            key={business?.id}
            business={business}
            handleCustomClick={handleBusinessClick}
            orderType={orderState?.options?.type}
            isBusinessOpen={business?.open}
            setIsUpdateStore={setIsUpdateStore}
            isUpdateStore={isUpdateStore}
          />
        ))}

      {(loadBusinesses || isUpdateStore) && (
        <View>
          {[...Array(6)].map((item, i) => (
            <Placeholder key={i} Animation={Fade}>
              <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}>
                <PlaceholderLine
                  width={orientation === 'Portrait' ? 22 : 11}
                  height={74}
                  style={{
                    marginRight: 20,
                    marginBottom: 20,
                    borderRadius: 7.6,
                  }}
                />
                <Placeholder>
                  <PlaceholderLine width={30} style={{ marginTop: 5 }} />
                  <PlaceholderLine width={50} />
                  <PlaceholderLine width={20} />
                </Placeholder>
              </View>
            </Placeholder>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export const StoresList = (props: BusinessesListingParams) => {
  const BusinessesListProps = {
    ...props,
    isForceSearch: Platform.OS === 'ios',
    UIComponent: StoresListUI,
  };

  return <BusinessList {...BusinessesListProps} />;
};
