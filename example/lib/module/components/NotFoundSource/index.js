import React from 'react';
import { View } from 'react-native';
import { colors } from '../../theme';
import { OButton, OIcon, OText } from '../shared';
import { NotFound, NotFoundImage } from './styles';
export const NotFoundSource = props => {
  const {
    image,
    content,
    btnTitle,
    conditioned,
    onClickButton
  } = props;

  const errorImage = image || require('../../assets/images/not-found.png');

  return /*#__PURE__*/React.createElement(NotFound, null, errorImage && /*#__PURE__*/React.createElement(NotFoundImage, null, /*#__PURE__*/React.createElement(OIcon, {
    src: errorImage,
    width: 300,
    height: 260
  })), content && conditioned && !errorImage && /*#__PURE__*/React.createElement(OText, {
    color: colors.disabled,
    size: 18,
    style: {
      textAlign: 'center'
    }
  }, content), content && !conditioned && /*#__PURE__*/React.createElement(OText, {
    color: colors.disabled,
    size: 18,
    style: {
      textAlign: 'center'
    }
  }, content), !onClickButton && props.children && props.children, onClickButton && /*#__PURE__*/React.createElement(View, {
    style: {
      marginTop: 10,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(OButton, {
    style: {
      width: '100%',
      height: 50
    },
    bgColor: colors.primary,
    borderColor: colors.primary,
    onClick: () => onClickButton(),
    text: btnTitle,
    textStyle: {
      color: colors.white
    }
  })));
};
//# sourceMappingURL=index.js.map