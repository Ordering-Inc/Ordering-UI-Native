import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { BusinessTypeFilter as BusinessTypeFilterController, useLanguage } from 'ordering-components/native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BusinessCategories, BCContainer } from './styles'
import { OIcon, OText, OModal } from '../shared'
import { BusinessTypeFilterParams } from '../../types'
import { useTheme } from 'styled-components/native'

const windowWidth = Dimensions.get('window').width;

export const BusinessTypeFilterUI = (props: BusinessTypeFilterParams) => {
  const {
    typesState,
    currentTypeSelected,
    handleChangeBusinessType,
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage();
  const [isOpenAllCategories, setIsOpenAllCategories] = useState(false)


  const styles = StyleSheet.create({
    icons: {
      padding: 10
    },
    logo: {
      width: isOpenAllCategories ? windowWidth / 3 - 27 : windowWidth / 4 - 20,
      height: isOpenAllCategories ? windowWidth / 3 - 27 : windowWidth / 4 - 20,
      marginBottom: 15,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryStyle: {
      width: isOpenAllCategories ? windowWidth / 3 - 27 : windowWidth / 4 - 20,
      height: 150,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: isOpenAllCategories ? 10 : 0,
      marginBottom: isOpenAllCategories ? 40 : 0
    },
    allCategoriesContainer : {
      paddingHorizontal: 10,
      paddingVertical: 30
    },
    allCategoriesWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    }
  })

  const RenderTypes = ({ item }: any ) => {
    return (
      <TouchableOpacity
        style={styles.categoryStyle}
        onPress={() => {
          handleChangeBusinessType(item.id)
          isOpenAllCategories && setIsOpenAllCategories(false)
        }}
      >
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
          size={14}
          color={currentTypeSelected === item.id ? theme.colors.primary : theme.colors.textSecondary}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {t(`BUSINESS_TYPE_${item.name.replace(/\s/g, '_').toUpperCase()}`, item.name)}
        </OText>
      </TouchableOpacity>
    )
  }

  return (
    <>
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
                  <View key={i} style={{ width: 80, borderRadius: 8, marginRight: 15 }}>
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
            {/* <BusinessCategoriesTitle>
              <OText
                size={16}
                color={theme.colors.textSecondary}
              >
                {t('BUSINESS_CATEGORIES', 'Business Categories')}
              </OText>
            </BusinessCategoriesTitle> */}
            <BusinessCategories>
              {typesState?.types.slice(0, 3).map((type: any) => (
                <RenderTypes
                  key={type.id}
                  item={type}
                />
              ))}
              {typesState?.types.length > 3 && (
                <TouchableOpacity
                    style={styles.categoryStyle}
                    onPress={() => setIsOpenAllCategories(true)}
                  >
                    <View
                      style={{ ...styles.logo, backgroundColor: theme.colors.lightGray }}
                    >
                      <MaterialIcon
                        name='dots-horizontal'
                        size={32}
                        color={theme.colors.black}
                      />
                    </View>
                    <OText
                      style={{ textAlign: 'center' }}
                      size={14}
                      color={theme.colors.textSecondary}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {t('SEE_ALL', 'See all')}
                    </OText>
                  </TouchableOpacity>
              )}
            </BusinessCategories>
          </>
        )}
      </BCContainer>
      <OModal
        open={isOpenAllCategories}
        onClose={() => setIsOpenAllCategories(false)}
        entireModal
      >
        <ScrollView style={styles.allCategoriesContainer}>
          <OText
            size={20}
            mBottom={30}
            color={theme.colors.textSecondary}
            style={{ paddingHorizontal: 10 }}
          >
            {t('ALL_CATEGORIES', 'All categories')}
          </OText>
          <View style={styles.allCategoriesWrapper}>
            {typesState?.types.map((type: any) => (
              <RenderTypes
                key={type.id}
                item={type}
              />
            ))}
          </View>
        </ScrollView>
      </OModal>
    </>
  )
}

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
