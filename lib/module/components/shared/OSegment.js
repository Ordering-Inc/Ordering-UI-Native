import * as React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { normalize } from '../../providers/Responsive';
import { colors } from '../../theme';
const Wrapper = styled.View`
    background-color: white;
    flex-direction: row;
    justify-content: space-between;
`;
const SegItem = styled.View`
    background-color: grey;
    padding: 8px 8px;
    flex-direction: row;
    align-items: center;
    border-radius: 18px;
`;
const ItemIcon = styled.Image`
    resize-mode: contain;
    margin-right: 5px;
    width: 14px;
    height: 14px;
`;
const ItemLabel = styled.Text`
    font-family: 'Poppins-Regular';
`; // Props for component

const OSegment = props => {
  var [curIndex, onSelected] = React.useState(props.selectedIdx);

  const onSelectItem = idx => {
    onSelected(idx);
    props.onSelectItem(idx);
  };

  return /*#__PURE__*/React.createElement(Wrapper, null, props.items.map((item, index) => {
    var _item$text;

    return /*#__PURE__*/React.createElement(TouchableOpacity, {
      key: `SegmentItem_${index}`,
      onPress: () => onSelectItem(index)
    }, /*#__PURE__*/React.createElement(SegItem, {
      style: {
        backgroundColor: index == curIndex ? colors.primary : 'white'
      }
    }, /*#__PURE__*/React.createElement(ItemIcon, {
      source: item.image,
      style: {
        tintColor: index == curIndex ? 'white' : '#ADADAD'
      }
    }), /*#__PURE__*/React.createElement(ItemLabel, {
      style: {
        fontSize: normalize(8.8),
        color: index == curIndex ? 'white' : '#ADADAD'
      }
    }, props.labelStyle == 'uppercase' ? (_item$text = item.text) === null || _item$text === void 0 ? void 0 : _item$text.toUpperCase() : item.text)));
  }));
};

OSegment.defaultProps = {
  labelStyle: 'uppercase'
};
export default OSegment;
//# sourceMappingURL=OSegment.js.map