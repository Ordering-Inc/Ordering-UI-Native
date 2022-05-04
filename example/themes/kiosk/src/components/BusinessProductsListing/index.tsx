import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native'
import { BusinessAndProductList, useLanguage } from 'ordering-components/native'
import { BusinessProductsListingParams, Business } from '../../types'
import { OCard, OText, OIcon } from '../shared'
import GridContainer from '../../layouts/GridContainer'
import Spinner from 'react-native-loading-spinner-overlay';
import { LANDSCAPE, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import styled, { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image'

const BusinessProductsListingUI = (props: BusinessProductsListingParams) => {
  const {navigation, businessState, resetInactivityTimeout, clearInactivityTimeout, bottomSheetVisibility } = props;

  const business: Business = businessState.business;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [orientationState] = useDeviceOrientation();
  const WIDTH_SCREEN = orientationState?.dimensions?.width

  const styles = StyleSheet.create({
    logo: {
      width: 500,
      height: 400,
      alignSelf: 'center',
    },
    soldOut: {
      top: 0,
      left: 0,
      position: 'absolute',
      width: WIDTH_SCREEN * 0.15,
      height: 50,
      justifyContent: 'center',
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      borderRadius: 15,
      opacity: 0.8,
    },
  });

  const _categories: any = business?.categories;
  let _promos: any = [];
  _categories?.forEach((categ: any) => {
    const _featuredProds = categ?.products?.filter(
      (prod: any) => prod.featured,
    );

    if (_featuredProds?.length > 0) {
      _promos = [..._promos, ..._featuredProds];
    }
  });

  const _renderTitle = (title: string): React.ReactElement => (
    <View style={{paddingHorizontal: 20, paddingVertical: 15 }}>
      <OText size={orientationState?.dimensions?.width * 0.022} weight="bold">
        {title}
      </OText>
    </View>
  );

  const RenderCategories = ({ item, cardStyle, widthScreen }: any) => {
    const stylesCat = StyleSheet.create({
      categoryStyle: {
        height: 150,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }
    })

    const WrapText = styled.View`
      height: 90px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
    `

    const Category = (props: any) => {
      const imageProps = {
        style: props.style,
        source: props.source,
        resizeMode: props.resizeMode,
      }
      return (
        props.uri ? (
          <FastImage {...imageProps}>
            {props.children}
          </FastImage>
        ) : (
          <ImageBackground {...imageProps}>
            {props.children}
          </ImageBackground>
        )
      )
    }

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={1}
        onPress={() => {
          resetInactivityTimeout()
          navigation.navigate('ProductDetails', {
            businessId: business?.api?.businessId,
            businessSlug: business?.slug,
            product: item,
          });
        }}
      >
        <Category
          style={{ ...cardStyle, ...stylesCat.categoryStyle, width: widthScreen * 0.45 }}
          uri={!!item.images}
          source={!!item.images
            ? {
              uri: item.images,
              priority: FastImage.priority.high,
              cache:FastImage.cacheControl.web
            }
            : theme.images.categories.all
          }
          resizeMode={FastImage.resizeMode.cover}
        >
          {item?.inventoried && (
            <View style={styles.soldOut}>
              <OText size={28} color={theme.colors.error}>
                {t('SOLD_OUT', 'SOLD OUT')}
              </OText>
            </View>
          )}
          <WrapText>
            <OText
              color={theme.colors.white}
              mLeft={0}
              size={32}
              numberOfLines={1}
              style={{...props?.titleStyle}}
              weight="bold"
            >
              {item.name}
            </OText>
            {!!item?.description && (
              <OText
                color={theme.colors.white}
                numberOfLines={1}
                size={18}
                style={{...props?.descriptionStyle}}
                weight="400"
              >
                {item.description}
              </OText>
            )}
          </WrapText>
        </Category>
      </TouchableOpacity>
    )
  }

  const _renderPromos = (): React.ReactElement => (
    <>
      {_renderTitle(t('FEATURED', 'Featured'))}
      <View style={{ paddingVertical: 20, marginLeft: 20, width: '100%' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
        >
          {_promos.map((category: any) => (
            <RenderCategories
              key={category.id}
              item={category}
              widthScreen={WIDTH_SCREEN}
              cardStyle={{ marginRight: 20 }}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );

  const _renderCategories = (): React.ReactElement => (
    <>
      {_renderTitle(t('CATEGORIES', 'Categories'))}
      <GridContainer
        style={{
          paddingLeft: orientationState?.orientation === LANDSCAPE
          ? bottomSheetVisibility ? orientationState?.dimensions?.width * 0.004 :orientationState?.dimensions?.width * 0.008
          : 0
        }}
      >
        {_categories && _categories.map((category: any) => (
          <OCard
            key={category.id}
            isCentered
            isUri={!!category.image}
            title={category?.name || ''}
            image={category.image ? {uri: category.image} : theme.images.categories.all}
            style={{
              borderRadius: 10,
              width:
                orientationState?.orientation === LANDSCAPE
                  ? bottomSheetVisibility ? orientationState?.dimensions?.width * 0.145 :orientationState?.dimensions?.width * 0.16
                  : orientationState?.dimensions?.width * 0.20,
            }}
            onPress={() => {
              resetInactivityTimeout()
              navigation.navigate('Category', {
                category,
                categories: business?.categories,
                businessId: business?.id,
                businessSlug: business?.slug,
                clearInactivityTimeout,
                resetInactivityTimeout,
              });
            }}
            titleStyle={{textAlign: 'center'}}
          />
        ))}
      </GridContainer>
    </>
  );

  if (businessState?.error) {
    return <OText>{t('ERROR', 'Error')}</OText>;
  }

  return (
    <View>
      <Spinner visible={businessState?.loading} />
      {!businessState?.loading && (_promos?.length > 0 || _categories?.length > 0) && (
        <>
          {_promos?.length > 0 && _renderPromos()}
          {_categories?.length > 0 && _renderCategories()}
        </>
      )}

      {!businessState?.loading && _promos && _promos?.length === 0 && _categories && _categories?.length === 0 && (
        <OIcon src={theme.images.general.notFound} style={styles.logo} />
      )}
    </View>
  );
};

export const BusinessProductsListing = (props: any) => {
  const businessProductslistingProps = {
    ...props,
    UIComponent: BusinessProductsListingUI,
  };
  return <BusinessAndProductList {...businessProductslistingProps} />;
};
