import React from 'react'
import { BusinessTypeFilter as BusinessTypeFilterController, useLanguage } from 'ordering-components'
import { BusinessCategoriesTitle, BusinessCategories, Category } from './styles'
import { OText } from '../shared'
import { View, StyleSheet } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { colors } from '../../theme'

export const BusinessTypeFilterUI = (props) => {
  const { businessTypes, handleChangeBusinessType, currentTypeSelected } = props
  const [, t] = useLanguage()
  return (
    <>
      <BusinessCategoriesTitle>
        <OText>{t('BUSINESS_CATEGORIES', 'Business Categories')}</OText>
      </BusinessCategoriesTitle>
      <BusinessCategories>
        {businessTypes.map((category: any) => (
          <Category key={category.key}>
            <View style={{ ...styles.iconContainer, backgroundColor: currentTypeSelected === category.value ? colors.primary : colors.primaryContrast }}>
              <MaterialIcon name={category.icon} size={50} style={{ ...styles.icons, color: currentTypeSelected === category.value ? colors.primaryContrast : colors.backgroundGray }} onPress={() => handleChangeBusinessType(category.value)} />
            </View>
            <OText>{t(`BUSINESS_TYPE_${category.value ? category.value.toUpperCase() : 'ALL'}`, category.key)}</OText>
          </Category>
        ))}
      </BusinessCategories>
    </>
  )
}

const styles = StyleSheet.create({
  icons: {
    borderRadius: 20,
    height: 60,
    padding: 5
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
})

export const BusinessTypeFilter = (props) => {
  const businessTypeFilterProps = {
    ...props,
    UIComponent: BusinessTypeFilterUI,
    businessTypes: props.businessTypes || [
      { key: 'All', value: null, icon: 'view-grid-plus-outline' },
      { key: 'Food', value: 'food', icon: 'food', },
      { key: 'Groceries', value: 'groceries', icon: 'fruit-watermelon' },
      { key: 'Laundry', value: 'laundry', icon: 'washing-machine' },
      { key: 'Alcohol', value: 'alcohol', icon: 'glass-wine' },
    ],
    defaultBusinessType: props.defaultBusinessType || null,
    onChangeBusinessType: props.handleChangeBusinessType
  }

  return (
    <BusinessTypeFilterController {...businessTypeFilterProps} />
  )
}
