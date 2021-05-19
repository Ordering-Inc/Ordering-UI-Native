import React from 'react'
import { StyleSheet, FlatList, View, ScrollView, TouchableOpacity } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { BusinessTypeFilter as BusinessTypeFilterController, useLanguage } from 'ordering-components/native'

import { BusinessCategoriesTitle, BusinessCategories, Category, IconContainer, BCContainer } from './styles'
import { OIcon, OText } from '../shared'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../../theme.json'
import { BusinessTypeFilterParams } from '../../types'
import { CATEGORIES_IMAGES } from '../../config/constants'

export const BusinessTypeFilterUI = (props: BusinessTypeFilterParams) => {
  const {
    typesState,
    businessTypes,
    currentTypeSelected,
    handleChangeBusinessType,
  } = props;

  const [, t] = useLanguage();
  const { loading, error, types } = typesState;

  const defaultImage = CATEGORIES_IMAGES.all;

  const categoryIcons = (category: any) => {
    switch (category.key) {
      case 'All':
        return (
          <MaterialIcon
            name='view-grid-plus-outline'
            size={40}
            style={{
              ...styles.icons,
              color: currentTypeSelected === category.value
                ? colors.primaryContrast
                : colors.backgroundGray
            }}
            onPress={() => handleChangeBusinessType(category.value)}
          />
        )
      case 'Food':
        return (
          <Ionicons
            name='fast-food-outline'
            size={40}
            style={{
              ...styles.icons,
              color: currentTypeSelected === category.value
                ? colors.primaryContrast
                : colors.backgroundGray
            }}
            onPress={() => handleChangeBusinessType(category.value)}
          />
        )
      case 'Groceries':
        return (
          <MaterialIcon
            name='baguette'
            size={40}
            style={{
              ...styles.icons,
              color: currentTypeSelected === category.value
                ? colors.primaryContrast
                : colors.backgroundGray
            }}
            onPress={() => handleChangeBusinessType(category.value)}
          />
        )
      case 'Laundry':
        return (
          <MaterialIcon
            name='washing-machine'
            size={40}
            style={{
              ...styles.icons,
              color: currentTypeSelected === category.value
                ? colors.primaryContrast
                : colors.backgroundGray
            }}
            onPress={() => handleChangeBusinessType(category.value)}
          />
        )
      case 'Alcohol':
        return (
          <MaterialIcon
            name='glass-wine'
            size={40}
            style={{
              ...styles.icons,
              color: currentTypeSelected === category.value
                ? colors.primaryContrast
                : colors.backgroundGray
            }}
            onPress={() => handleChangeBusinessType(category.value)}
          />
        )
    }
  }

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
              src={CATEGORIES_IMAGES.all}
              style={styles.logo}
            />
          )}
          <OText
            style={{ textAlign: 'center' }}
            size={20}
            color={currentTypeSelected === item.id ? colors.primary : colors.textSecondary}
          >
            {t(`BUSINESS_TYPE_${item.name.replace(/\s/g, '_').toUpperCase()}`, item.name)}
          </OText>
        </Category>
      </TouchableOpacity>
    )
  }

  return (
    <BCContainer>
      {loading && (
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
                <View style={{ width: 80, borderRadius: 10, marginRight: 15 }}>
                  <PlaceholderLine
                    key={i}
                    height={80}
                    noMargin
                  />
                </View>
              ))}
            </ScrollView>
          </Placeholder>
        </View>
      )}
      {!loading && !error && types && types.length > 0 && (
        <>
          <BusinessCategoriesTitle>
            <OText
              size={16}
              color={colors.textSecondary}
            >
              {t('BUSINESS_CATEGORIES', 'Business Categories')}
            </OText>
          </BusinessCategoriesTitle>
          <BusinessCategories>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={types}
              renderItem={renderTypes}
              keyExtractor={type => type.name}
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
