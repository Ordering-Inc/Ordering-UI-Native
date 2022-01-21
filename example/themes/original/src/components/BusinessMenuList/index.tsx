import React, { useState } from 'react'
import { useLanguage, BusinessMenuListing } from 'ordering-components/native'
import { OModal, OText } from '../shared'
import { BusinessMenuListParams } from '../../types'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { useTheme } from 'styled-components/native'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { MenuListWrapper, DropOption } from './styles'

const BusinessMenuListUI = (props: BusinessMenuListParams) => {
  const {
    menu,
    businessMenuList,
    setMenu
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [isShowMenuList, setIsShowMenuList] = useState(false)

  const styles = StyleSheet.create({
    selectOption: {
      backgroundColor: theme.colors.backgroundGray100,
      borderRadius: 7.6,
      paddingVertical: 10,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 44
    }
	})

  const handleClickMenu = (option: any) => {
    setMenu(option)
    setIsShowMenuList(false)
  }

  return (
    <>
      {businessMenuList.loading ? (
        <Placeholder Animation={Fade}>
          <View>
            <PlaceholderLine height={44}/>
          </View>
        </Placeholder>
      ) : (
        <TouchableOpacity onPress={() => setIsShowMenuList(true)}>
          <View style={styles.selectOption}>
            <OText
              size={14}
              color={theme.colors.disabled}
              style={{
                lineHeight: 24,
                flex: 1
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {menu?.name || t('MENU_NAME', 'Menu name')}
            </OText>
            <IconAntDesign
              name='down'
              color={theme.colors.textThird}
              size={16}
            />
          </View>
        </TouchableOpacity>
      )}

      <OModal
        open={isShowMenuList}
        onClose={() => setIsShowMenuList(false)}
        customClose
        entireModal
      >
        <MenuListWrapper>
          <TouchableOpacity onPress={() => setIsShowMenuList(false)} style={{ marginBottom: 12 }}>
            <IconAntDesign
              name='close'
              color={theme.colors.textThird}
              style={{ marginLeft: 7 }}
              size={24}
            />
          </TouchableOpacity>
          {businessMenuList?.menus && businessMenuList?.menus.length > 0 && businessMenuList.menus.map((option: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleClickMenu(option)}
            >
              <DropOption
                selected={option.id === menu.id}
              >
                <View style={{ marginRight: 10 }}>
                  {option.id === menu.id ? (
                    <MaterialCommunityIcons
                      name='radiobox-marked'
                      size={24}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name='radiobox-blank'
                      size={24}
                      color={theme.colors.arrowColor}
                    />
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{flex: 1}}
                >{option.name}</Text>
              </DropOption>
            </TouchableOpacity>
          ))}
          {businessMenuList?.menus && businessMenuList?.menus.length === 0 && (
            <View>
              <OText>{t('NO_RESULTS_FOUND', 'Sorry, no results found')}</OText>
            </View>
          )}
        </MenuListWrapper>
      </OModal>
    </>

  )
}

export const BusinessMenuList = (props: any) => {
  const businessMenuListProps = {
    ...props,
    UIComponent: BusinessMenuListUI,
  };

  return <BusinessMenuListing {...businessMenuListProps} />;
};