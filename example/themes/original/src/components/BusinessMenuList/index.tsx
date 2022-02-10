import React from 'react'
import { useLanguage, BusinessMenuListing } from 'ordering-components/native'
import { OText } from '../shared'
import { BusinessMenuListParams } from '../../types'
import { View, StyleSheet, Dimensions, Platform } from 'react-native'
import { useTheme } from 'styled-components/native'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import SelectDropdown from 'react-native-select-dropdown'

const windowHeight = Dimensions.get('window').height;

const BusinessMenuListUI = (props: BusinessMenuListParams) => {
  const {
    businessMenuList,
    setMenu
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()

  const styles = StyleSheet.create({
    container: {
      height: windowHeight
    },
    selectOption: {
      backgroundColor: theme.colors.backgroundGray100,
      borderRadius: 7.6,
      paddingVertical: 10,
      paddingHorizontal: 14,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 44,
      width: '100%'
    }
	})

  const dropDownIcon = () => {
    return (
      <IconAntDesign
        name='down'
        color={theme.colors.textThird}
        size={16}
      />
    )
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
        <>
          {
            businessMenuList?.menus && businessMenuList?.menus.length > 0 && (
              <SelectDropdown
                defaultButtonText={t('MENU_NAME', 'Menu name')}
                data={businessMenuList?.menus}
                disabled={businessMenuList?.loading || businessMenuList?.menus?.length === 0}
                onSelect={(selectedItem, index) => {
                  setMenu(selectedItem)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.name
                }}
                rowTextForSelection={(item, index) => {
                  return item.name
                }}
                buttonStyle={styles.selectOption}
                buttonTextStyle={{
                  color: theme.colors.disabled,
                  fontSize: 14,
                  textAlign: 'left',
                  marginHorizontal: 0
                }}
                dropdownStyle={{
                  borderRadius: 8,
                  borderColor: theme.colors.lightGray,
                  marginTop: Platform.OS === 'ios' ? 12 : -15,
                  maxHeight: 160
                }}
                rowStyle={{
                  borderBottomColor: theme.colors.backgroundGray100,
                  backgroundColor: theme.colors.backgroundGray100,
                  height: 40,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  paddingTop: 8,
                  paddingHorizontal: 14
                }}
                rowTextStyle={{
                  color: theme.colors.disabled,
                  fontSize: 14,
                  marginHorizontal: 0
                }}
                renderDropdownIcon={() => dropDownIcon()}
                dropdownOverlayColor='transparent'
              />
            )
          }

          {businessMenuList?.menus && businessMenuList?.menus.length === 0 && (
            <View>
              <OText>{t('NO_RESULTS_FOUND', 'Sorry, no results found')}</OText>
            </View>
          )}
        </>
      )}
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
