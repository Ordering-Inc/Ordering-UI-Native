import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../theme';
const Wrapper = styled.View`
    background-color: white;
    padding: 10px 14px;
    border-radius: 20px;
    border-width: 1px;
    border-color: ${colors.primary}
    flex-grow: 1;
    flex-basis: 0;
    align-items: center;
    justify-content: center;
`;
const InnerWrapper = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
const SelLabel = styled.Text`
    flex: 1;
    font-family: 'Poppins-Regular';
    color: grey;
    flex-grow: 1;
    margin: 0 10px;
`;
const DropIcon = styled.Image`
    tint-color: ${colors.primary};
    resize-mode: contain;
    width: 7px;
    height: 7px;
`;
const KindIcon = styled.Image`
    tint-color: ${colors.primary};
    resize-mode: contain;
    width: 14px;
    height: 14px;
`;
const DropView = styled.View`
    position: absolute;
    box-shadow: 0 4px 3px #00000022;
    background-color: white;
    top: 42px;
    left: 20px;
    width: 100%;
    padding: 4px 5px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
`;
const DropItems = styled.Text`
    padding: 9px 5px;
    border-bottom-width: 1px;
    border-bottom-color: red;
    margin-bottom: 2px;
`;

const ODropDown = props => {
  const [curIndex, onSelect] = React.useState(props.selectedIndex);
  const [items, getItems] = React.useState(props.items);
  const [isOpen, onOffToggle] = React.useState(false);
  const [value, setValue] = React.useState(curIndex && items ? items[curIndex] : null);

  const onSelectItem = index => {
    props.onSelect(index);
    onSelect(index);

    if (items) {
      setValue(items[index]);
    }

    onOffToggle(false);
  };

  React.useEffect(() => {
    if (props.items) {
      onSelect(0);
    } else alert('Undefined Items');
  }, [props.items]);

  const onToggle = () => {
    onOffToggle(is_opened => !is_opened);
  };

  return /*#__PURE__*/React.createElement(Wrapper, {
    style: props.style
  }, /*#__PURE__*/React.createElement(InnerWrapper, {
    onPress: onToggle
  }, props.kindImage ? /*#__PURE__*/React.createElement(KindIcon, {
    source: props.kindImage
  }) : null, /*#__PURE__*/React.createElement(SelLabel, {
    numberOfLines: 1,
    ellipsizeMode: 'tail'
  }, value || props.placeholder), /*#__PURE__*/React.createElement(DropIcon, {
    style: {
      tintColor: props.dropIconColor || 'grey'
    },
    source: require('../../assets/icons/drop_down.png')
  })), isOpen ? /*#__PURE__*/React.createElement(DropView, null, items ? items.map((item, index) => /*#__PURE__*/React.createElement(TouchableOpacity, {
    key: `key_${index}`,
    onPress: () => onSelectItem(index)
  }, /*#__PURE__*/React.createElement(DropItems, null, item))) : null) : null);
};

export default ODropDown;
//# sourceMappingURL=ODropDown.js.map