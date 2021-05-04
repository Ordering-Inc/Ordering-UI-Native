import * as React from 'react';
import styled from 'styled-components/native';
const SText = styled.Text`
    color: black;
    font-family: 'Poppins-Regular';
    font-size: 14px;
    flex-wrap: wrap;
`;

const OText = props => {
  return /*#__PURE__*/React.createElement(SText, {
    style: {
      color: props.color || 'black',
      fontSize: props.size,
      fontWeight: props.weight,
      flex: props.isWrap ? 1 : 0,
      marginBottom: props.hasBottom ? 10 : 0,
      ...props.style
    }
  }, props.children);
};

export default OText;
//# sourceMappingURL=OText.js.map