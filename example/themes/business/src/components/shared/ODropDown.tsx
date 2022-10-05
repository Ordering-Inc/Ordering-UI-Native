import React, { useState, useEffect } from 'react'
import styled, { css, useTheme } from 'styled-components/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { ScrollView as CustomScrollView, TouchableOpacity as CustomTouchableOpacity, View } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Text } from 'react-native-paper';

interface Props {
  secondary?: boolean,
  options?: any;
  defaultValue?: any,
  placeholder?: string,
  onSelect?: any,
  style?: any,
  dropViewMaxHeight?: any,
  isModal?: any,
  bgcolor?: string,
  textcolor?: string,
  handleClear?: any,
  handleOpenSelect?: any,
  openedSelect?: string,
  selectType?: string
}

const Wrapper = styled.View`
  position: relative;
`
const Selected = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 15px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${(props: any) => props.bgcolor || (props.secondary ? props.theme.colors.lightGray : props.theme.colors.primary)};
  background-color: ${(props: any) => props.bgcolor || (props.secondary ? props.theme.colors.white : props.theme.colors.primary)};
`
const SelectedLabel = styled.Text`
  font-size: 16px;
  color: ${(props: any) => props.textcolor || (props.secondary ? props.theme.colors.black : props.theme.colors.white)};
`

const DropView = styled.View`
  position: absolute;
  z-index: 9999;
  top: 65px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.inputChat};
  shadow-color: 'rgba(0.0, 0.0, 0.0, 0.5)';
  shadow-opacity: 0.21;
  elevation: 7;
  background-color: ${(props: any) => props.theme.colors.white};
  border-radius: 7.6px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
`
const DropOption = styled.View`
  padding: 15px;
  font-size: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.lightGray};
  flex-direction: row;
  align-items: center;
`

const ODropDown = (props: Props) => {
  const {
    secondary,
    options,
    defaultValue,
    placeholder,
    onSelect,
    dropViewMaxHeight,
    isModal,
    handleClear,
    handleOpenSelect,
    openedSelect,
    selectType
  } = props

  const theme = useTheme();

  const [isOpen, setIsOpen] = useState(false)
  const defaultOption = options?.find((option: any) => option.value === defaultValue)
  const [selectedOption, setSelectedOption] = useState<any>(defaultOption)
  const [value, setValue] = useState(defaultValue)

  const onToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) handleOpenSelect?.()
  }

  const onSelectOption = (option: any) => {
    setSelectedOption(option)
    setValue(option.value)
    onSelect(option.name || option.value)
    setIsOpen(false)
  }

  const handleClearSearch = () => {
    handleClear()
    if (isOpen) {
      onToggle()
    }
  }

  useEffect(() => {
    const _defaultOption = options?.find((option: any) => option.value === defaultValue)
    setSelectedOption(_defaultOption)
    setValue(defaultValue)
  }, [defaultValue, options])

  useEffect(() => {
    if (openedSelect !== selectType && typeof openedSelect === 'string') {
      setIsOpen(false)
    }
  }, [openedSelect])

  return (
    <Wrapper style={props.style}>
      <Selected
        secondary={secondary}
        bgcolor={props.bgcolor}
        onPress={() => onToggle()}
      >
        <SelectedLabel
          secondary={secondary}
          textcolor={props.textcolor}
        >
          {selectedOption?.content || selectedOption?.name || placeholder}
        </SelectedLabel>
        {selectedOption && handleClear ? (
          <AntDesign
            name={'close'}
            size={20}
            onPress={() => handleClearSearch()}
            style={{ position: 'absolute', right: 12, top: 13 }}
          />
        ) : (
          <FeatherIcon
            name='chevron-down'
            color={props.textcolor}
            size={24}
            style={{ position: 'absolute', right: 12, top: 13 }}

          />
        )}
      </Selected>
      {isOpen && options && (
        <DropView
          secondary={secondary}
        >
          {!isModal ? (
            <ScrollView style={{
              maxHeight: dropViewMaxHeight || null
            }}
            >
              {options.map((option: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => onSelectOption(option)}
                >
                  <View style={{ marginRight: 10 }}>
                    {value === option.value ? (
                      <MaterialCommunityIcons
                        name='radiobox-marked'
                        size={24}
                        color={theme.colors.primary}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name='radiobox-blank'
                        size={24}
                        color={theme.colors.primary}
                      />
                    )}
                  </View>
                  <Text>{option.content || option.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <CustomScrollView style={{
              maxHeight: dropViewMaxHeight || null,
              paddingBottom: 15
            }}
              nestedScrollEnabled={true}
            >
              {options.map((option: any, index: number) => (
                <CustomTouchableOpacity
                  key={index}
                  onPress={() => onSelectOption(option)}
                >
                  <DropOption
                    numberOfLines={1}
                    selected={value === option.value}
                  >
                    <View style={{ marginRight: 10 }}>
                      {value === option.value ? (
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
                    <Text>{option.content || option.name}</Text>
                  </DropOption>
                </CustomTouchableOpacity>
              ))}
            </CustomScrollView>
          )}
        </DropView>
      )}
    </Wrapper>
  )
}

export default ODropDown
