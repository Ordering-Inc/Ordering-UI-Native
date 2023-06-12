import React from "react"
import { View, TouchableOpacity } from "react-native"
import { OText } from "../shared"
import ToggleSwitch from 'toggle-switch-react-native';
import { AccordionDropdown } from './AccordionDropdown'
import { useTheme } from 'styled-components/native';
import { CategoryTab } from './styles'

export const IterateCategories = (props: any) => {
  const { list, currentCat, isSub, handlerClickCategory, updateCategory } = props

  const theme = useTheme();

  const handleSwitch = (enabled: boolean, categoryId: any) => {
    updateCategory && updateCategory(categoryId, { enabled })
  };

  return (
    <>
      {list?.length > 0 && list.map((category: any, i: number) => (
        <View key={`${category?.id}_${i}`}>
          {(category?.subcategories?.length > 0 || isSub) ? (
            <>
              {category?.subcategories?.length > 0 && (
                <>
                  <View>
                    <AccordionDropdown
                      category={category}
                      IterateCategories={IterateCategories}
                      handlerClickCategory={handlerClickCategory}
                      updateCategory={updateCategory}
                    />
                  </View>
                </>
              )}
              {isSub && !category?.subcategories?.length && (
                <CategoryTab isSpace={!!category?.parent_category_id}>
                  <TouchableOpacity
                    style={{ flex: 1, marginRight: 5 }}
                    onPress={() => handlerClickCategory(category)}
                  >
                    <OText numberOfLines={1}>
                      {category.name}
                    </OText>
                  </TouchableOpacity>
                  <View>
                    <ToggleSwitch
                      isOn={category?.enabled}
                      onColor={theme.colors.primary}
                      offColor={theme.colors.offColor}
                      size="small"
                      onToggle={(value: boolean) => handleSwitch(value, category.id)}
                      // disabled={loading}
                      animationSpeed={200}
                    />
                  </View>
                </CategoryTab>
              )}
            </>
          ) : (
            <CategoryTab
              isSpace={!!category?.parent_category_id}
            >
              <TouchableOpacity onPress={() => handlerClickCategory(category)} style={{ flex: 1, marginRight: 5 }}>
                <OText numberOfLines={1}>
                  {category.name}
                </OText>
              </TouchableOpacity>
              <View>
                <ToggleSwitch
                  isOn={category?.enabled}
                  onColor={theme.colors.primary}
                  offColor={theme.colors.offColor}
                  size="small"
                  onToggle={(value: boolean) => handleSwitch(value, category.id)}
                  // disabled={loading}
                  animationSpeed={200}
                />
              </View>
            </CategoryTab>
          )}
        </View>
      ))}
      {list && list?.length === 0 && isSub && (
        <CategoryTab
          isSpace={!!currentCat?.parent_category_id}
        >
          <TouchableOpacity onPress={() => handlerClickCategory(currentCat)} style={{ flex: 1, marginRight: 5 }}>
            <OText numberOfLines={1}>
              {currentCat.name}
            </OText>
          </TouchableOpacity>
          <View>
            <ToggleSwitch
              isOn={currentCat?.enabled}
              onColor={theme.colors.primary}
              offColor={theme.colors.offColor}
              size="small"
              onToggle={(value: boolean) => handleSwitch(value, currentCat.id)}
              // disabled={loading}
              animationSpeed={200}
            />
          </View>
        </CategoryTab>
      )}
    </>
  )
}