import React from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { BusinessTypeFilter as BusinessTypeFilterController, useLanguage } from 'ordering-components/native'

import { BusinessCategoriesTitle, BusinessCategories, Category, BCContainer } from './styles'
import { OIcon, OText } from '../shared'
import { BusinessTypeFilterParams } from '../../types'
import { useTheme } from 'styled-components/native'

import Carousel from 'react-native-snap-carousel';
const windowWidth = Dimensions.get('window').width;

export const BusinessTypeFilterUI = (props: BusinessTypeFilterParams) => {
  const {
    typesState,
    currentTypeSelected,
    handleChangeBusinessType,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();

  const renderTypes = ({ item }: any) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleChangeBusinessType(item.id)}
      >
        <Category>
          {item.image ? (
            <OIcon
              url={item.image}
              style={styles.logo}
            />
          ) : (
            <OIcon
              src={theme.images.categories.all}
              style={styles.logo}
            />
          )}
          <OText
            style={{ textAlign: 'center' }}
            size={20}
            color={currentTypeSelected === item.id ? theme.colors.primary : theme.colors.textSecondary}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {t(`BUSINESS_TYPE_${item.name.replace(/\s/g, '_').toUpperCase()}`, item.name)}
          </OText>
        </Category>
      </TouchableOpacity>
    )
  }

  let _carousel: Carousel<any> | null;

  const typeSelectedIndex = typesState?.types?.length > 0
    ? typesState?.types.findIndex((type: any) => type.id === (currentTypeSelected ?? 0))
    : 0

  return (
    <BCContainer>
      {typesState?.loading && (
        <View>
          <Placeholder
            style={{ marginVertical: 10 }}
            Animation={Fade}
          >
            <ScrollView
              horizontal
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {[...Array(4)].map((_, i) => (
                <View key={i} style={{ width: 80, borderRadius: 10, marginRight: 15 }}>
                  <PlaceholderLine
                    height={80}
                    noMargin
                  />
                </View>
              ))}
            </ScrollView>
          </Placeholder>
        </View>
      )}
      {!typesState?.loading && !typesState?.error && typesState?.types && typesState?.types.length > 0 && (
        <>
          <BusinessCategoriesTitle>
            <OText
              size={16}
              color={theme.colors.textSecondary}
            >
              {t('BUSINESS_CATEGORIES', 'Business Categories')}
            </OText>
          </BusinessCategoriesTitle>
          <BusinessCategories>
            <Carousel
              keyExtractor={(item: any) => item.name}
              ref={(c: any) => { _carousel = c }}
              data={typesState?.types || []}
              renderItem={renderTypes}
              sliderWidth={windowWidth}
              itemWidth={100}
              alwaysBounceHorizontal
              layout={'default'}
              slideStyle={{
                width: 100,
                marginRight: 15,
              }}
              activeSlideOffset={15}
              inactiveSlideScale={1}
              snapToAlignment="start"
              activeSlideAlignment="start"
              inactiveSlideOpacity={1}
              firstItem={typeSelectedIndex ?? 0}
            />
          </BusinessCategories>
        </>
      )}
    </BCContainer>
  )
}

const styles = StyleSheet.create({
  icons: {
    padding: 10
  },
  logo: {
    width: 75,
    height: 75,
    marginBottom: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export const BusinessTypeFilter = (props: BusinessTypeFilterParams) => {
  const businessTypeFilterProps = {
    ...props,
    UIComponent: BusinessTypeFilterUI,
    businessTypes: props.businessTypes,
    defaultBusinessType: props.defaultBusinessType || null,
    onChangeBusinessType: props.handleChangeBusinessType
  }

  return (
    <BusinessTypeFilterController {...businessTypeFilterProps} />
  )
}
