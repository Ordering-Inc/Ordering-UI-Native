import * as React from 'react';
import styled from 'styled-components/native';
import { colors } from '../../theme';
const Wrapper = styled.View`

`;
const Inner = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`;
const Box = styled.View`
    width: 20px;
    height: 20px;
    border: 1px solid grey;
    margin-right: 8px;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
`;
const Check = styled.View`
    width: 12px;
    height: 7px;
    transform: rotate(-45deg);
    border: 3px solid grey;
    border-top-width: 0;
    border-right-width: 0;
    margin-top: -2px;
`;
const Title = styled.Text`
    font-family: 'Poppins-Regular';
`;

const OCheckbox = props => {
  const [is_checked, onChanged] = React.useState(props.checked);

  const checkToggle = state => {
    onChanged(!state);
    props.onChange(!state);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Inner, {
    onPress: () => checkToggle(is_checked || false)
  }, /*#__PURE__*/React.createElement(Box, {
    style: {
      backgroundColor: is_checked ? colors.primary : 'white',
      borderColor: is_checked ? colors.primary : props.checkColor,
      width: props.size ? props.size + 5 : 20,
      height: props.size ? props.size + 5 : 20
    }
  }, is_checked ? /*#__PURE__*/React.createElement(Check, {
    style: {
      borderColor: 'white'
    }
  }) : null), /*#__PURE__*/React.createElement(Title, {
    style: {
      color: props.textColor,
      fontSize: props.size
    }
  }, props.label ? props.label : ''))));
};

OCheckbox.defaultProps = {
  checkColor: 'grey',
  textColor: 'black'
};
export default OCheckbox;
//# sourceMappingURL=OCheckbox.js.map