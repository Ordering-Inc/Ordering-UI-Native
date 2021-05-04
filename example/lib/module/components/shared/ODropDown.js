import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { ScrollView as CustomScrollView, TouchableOpacity as CustomTouchableOpacity } from 'react-native';
import { colors } from '../../theme';
const Wrapper = styled.View`
  position: relative;
`;
const Selected = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 15px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${props => props.bgcolor || (props.secondary ? colors.lightGray : colors.primary)};
  background-color: ${props => props.bgcolor || (props.secondary ? colors.white : colors.primary)};
`;
const SelectedLabel = styled.Text`
  font-size: 16px;
  color: ${props => props.textcolor || (props.secondary ? 'black' : colors.white)};
`;
const DropIcon = styled.Image`
  tint-color: ${props => props.textcolor || (props.secondary ? 'black' : colors.white)};
  resize-mode: contain;
  width: 7px;
  height: 7px;
  margin-left: 5px;
`;
const DropView = styled.View`
  position: absolute;
  z-index: 9999;
  top: 54px;
  border-width: 1px;
  border-color: ${colors.lightGray};
  background-color: ${colors.white};
  border-radius: 10px;
  width: 100%;
`;
const DropOption = styled.Text`
  padding: 15px;
  font-size: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGray};
  ${props => props.selected && css`
    color: ${colors.primary};
  `};
`;

const ODropDown = props => {
  const {
    secondary,
    options,
    defaultValue,
    placeholder,
    onSelect,
    dropViewMaxHeight,
    isModal
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const defaultOption = options === null || options === void 0 ? void 0 : options.find(option => option.value === defaultValue);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [value, setValue] = useState(defaultValue);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelectOption = option => {
    setSelectedOption(option);
    setValue(option.value);
    onSelect(option.value || option.name);
    setIsOpen(false);
  };

  useEffect(() => {
    const _defaultOption = options === null || options === void 0 ? void 0 : options.find(option => option.value === defaultValue);

    setSelectedOption(_defaultOption);
    setValue(defaultValue);
  }, [defaultValue, options]);
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: props.style
  }, /*#__PURE__*/React.createElement(Selected, {
    secondary: secondary,
    bgcolor: props.bgcolor,
    onPress: () => onToggle()
  }, /*#__PURE__*/React.createElement(SelectedLabel, {
    secondary: secondary,
    textcolor: props.textcolor
  }, (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.content) || (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.name) || placeholder), /*#__PURE__*/React.createElement(DropIcon, {
    textcolor: props.textcolor,
    secondary: secondary,
    source: require('../../assets/icons/drop_down.png')
  })), isOpen && options && /*#__PURE__*/React.createElement(DropView, {
    secondary: secondary
  }, !isModal ? /*#__PURE__*/React.createElement(ScrollView, {
    style: {
      maxHeight: dropViewMaxHeight || null
    }
  }, options.map((option, index) => /*#__PURE__*/React.createElement(TouchableOpacity, {
    key: index,
    onPress: () => onSelectOption(option)
  }, /*#__PURE__*/React.createElement(DropOption, {
    numberOfLines: 1,
    selected: value === option.value
  }, option.content || option.name)))) : /*#__PURE__*/React.createElement(CustomScrollView, {
    style: {
      maxHeight: dropViewMaxHeight || null
    }
  }, options.map((option, index) => /*#__PURE__*/React.createElement(CustomTouchableOpacity, {
    key: index,
    onPress: () => onSelectOption(option)
  }, /*#__PURE__*/React.createElement(DropOption, {
    numberOfLines: 1,
    selected: value === option.value
  }, option.content || option.name))))));
};

export default ODropDown;
//# sourceMappingURL=ODropDown.js.map