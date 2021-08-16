import React, { useState, useEffect } from 'react'
import styled, { css, useTheme } from 'styled-components/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { ScrollView as CustomScrollView, TouchableOpacity as CustomTouchableOpacity } from 'react-native'

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
}

const ODropDown = (props: Props) => {
  const {
    secondary,
    options,
    defaultValue,
    placeholder,
    onSelect,
    dropViewMaxHeight,
    isModal
  } = props

  const theme = useTheme();

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
    border-color: ${(props: any) => props.bgcolor || (props.secondary ? theme.colors.lightGray : theme.colors.primary)};
    background-color: ${(props: any) => props.bgcolor || (props.secondary ? theme.colors.white : theme.colors.primary)};
  `
  const SelectedLabel = styled.Text`
    font-size: 16px;
    color: ${(props: any) => props.textcolor || (props.secondary ? theme.colors.black : theme.colors.white)};
  `
  const DropIcon = styled.Image`
    tint-color: ${(props: any) => props.textcolor || (props.secondary ? theme.colors.black : theme.colors.white)};
    resize-mode: contain;
    width: 7px;
    height: 7px;
    margin-left: 5px;
  `
  const DropView = styled.View`
    position: absolute;
    z-index: 9999;
    top: 54px;
    border-width: 1px;
    border-color: ${theme.colors.lightGray};
    background-color: ${theme.colors.white};
    border-radius: 10px;
    width: 100%;
  `
  const DropOption = styled.Text`
    padding: 15px;
    font-size: 16px;
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.lightGray};
    ${(props: any) => props.selected && css`
      color: ${theme.colors.primary};
    `};
  `

  const [isOpen, setIsOpen] = useState(false)
  const defaultOption = options?.find((option: any) => option.value === defaultValue)
  const [selectedOption, setSelectedOption] = useState<any>(defaultOption)
  const [value, setValue] = useState(defaultValue)

  const onToggle = () => {
    setIsOpen(!isOpen)
  }

  const onSelectOption = (option: any) => {
    setSelectedOption(option)
    setValue(option.value)
    onSelect(option.value || option.name)
    setIsOpen(false)
  }

  useEffect(() => {
    const _defaultOption = options?.find((option: any) => option.value === defaultValue)
    setSelectedOption(_defaultOption)
    setValue(defaultValue)
  }, [defaultValue, options])

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
        <DropIcon
          textcolor={props.textcolor}
          secondary={secondary}
          source={require('../../assets/icons/drop_down.png')}
        />
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
                  <DropOption
                    numberOfLines={1}
                    selected={value === option.value}
                  >
                    {option.content || option.name}
                  </DropOption>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <CustomScrollView style={{
              maxHeight: dropViewMaxHeight || null
            }}
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
                    {option.content || option.name}
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
