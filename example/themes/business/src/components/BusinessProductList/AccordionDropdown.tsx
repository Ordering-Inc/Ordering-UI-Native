import { OText } from "../shared"
import React, { useState } from "react"
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import ToggleSwitch from 'toggle-switch-react-native';
import { useTheme } from 'styled-components/native';
import { CategoryTab } from './styles'

export const AccordionDropdown = (props: any) => {
  const { category, IterateCategories, handlerClickCategory, updateCategory } = props

  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false)

  const handleSwitch = (enabled: boolean, categoryId: any) => {
    updateCategory && updateCategory(categoryId, { enabled })
  };

  return (
    <View style={{ marginLeft: !!category?.parent_category_id ? 10 : 0 }}>
      <CategoryTab>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 5 }}>
          <TouchableOpacity onPress={() => setIsOpen(prev => !prev)} style={{ marginRight: 10 }}>
            <AntDesignIcon
              name={isOpen ? 'caretdown' : 'caretright'}
              size={14}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlerClickCategory(category)} style={{ flex: 1 }}>
            <OText numberOfLines={1}>
              {category.name}
            </OText>
          </TouchableOpacity>
        </View>
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
      {
        isOpen && (
          <View>
            <IterateCategories
              list={category.subcategories}
              isSub
              currentCat={category}
              handlerClickCategory={handlerClickCategory}
              updateCategory={updateCategory}
            />
          </View>
        )
      }
    </View>
  )
}