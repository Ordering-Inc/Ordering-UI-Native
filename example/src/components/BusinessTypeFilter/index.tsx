import React from 'react'
import { BusinessTypeFilter as BusinessTypeFilterController, useLanguage } from 'ordering-components/native'
import { BusinessCategoriesTitle, BusinessCategories, Category, IconContainer } from './styles'
import { OText } from '../shared'
import { StyleSheet } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../../theme.json'
import { BusinessTypeFilterParams } from '../../types'

export const BusinessTypeFilterUI = (props: BusinessTypeFilterParams) => {
  const {
    businessTypes,
    handleChangeBusinessType,
    currentTypeSelected
  } = props;

  const [, t] = useLanguage();

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

  return (
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
        {businessTypes?.map((category: any) => (
          <Category key={category.key} >
            <IconContainer
              style={{
                backgroundColor: currentTypeSelected === category.value
                  ? colors.primary
                  : colors.primaryContrast
              }}
            >
              {categoryIcons(category)}
            </IconContainer>
            <OText
              style={{ textAlign: 'center' }}
              color={currentTypeSelected === category.value ? colors.btnFont : colors.textSecondary}
            >
              {t(`BUSINESS_TYPE_${category.value ? category.value.toUpperCase() : 'ALL'}`, category.key)}
            </OText>
          </Category>
        ))}
      </BusinessCategories>
    </>
  )
}

const styles = StyleSheet.create({
  icons: {
    padding: 10
  },
})

export const BusinessTypeFilter = (props: BusinessTypeFilterParams) => {
  const businessTypeFilterProps = {
    ...props,
    UIComponent: BusinessTypeFilterUI,
    businessTypes: props.businessTypes || [
      { key: 'All', value: null },
      { key: 'Food', value: 'food' },
      { key: 'Groceries', value: 'groceries' },
      { key: 'Laundry', value: 'laundry' },
      { key: 'Alcohol', value: 'alcohol' },
    ],
    defaultBusinessType: props.defaultBusinessType || null,
    onChangeBusinessType: props.handleChangeBusinessType
  }

  return (
    <BusinessTypeFilterController {...businessTypeFilterProps} />
  )
}
