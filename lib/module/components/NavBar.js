import * as React from 'react';
import styled from 'styled-components/native';
import { OButton, OIcon, OText } from './shared';
import { colors } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { IMAGES } from '../config/constants';
const Wrapper = styled.View`
    background-color: ${colors.white};
    padding: 44px 20px 10px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
`;
const TitleWrapper = styled.View`
    flex-direction: column;
    padding-horizontal: 10px;
`;
const TitleTopWrapper = styled.View`
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
`;

const NavBar = props => {
  const safeAreaInset = useSafeAreaInsets();

  const goSupport = () => {
    props.navigation.navigate('Supports', {});
  };

  return /*#__PURE__*/React.createElement(Wrapper, {
    style: {
      paddingTop: Platform.OS == 'ios' ? safeAreaInset.top : 16
    }
  }, /*#__PURE__*/React.createElement(OButton, {
    imgLeftSrc: props.leftImg || IMAGES.arrow_left,
    imgRightSrc: null,
    isCircle: true,
    onClick: props.onActionLeft
  }), /*#__PURE__*/React.createElement(TitleTopWrapper, null, props.withIcon ? /*#__PURE__*/React.createElement(OIcon, {
    url: props.icon,
    style: {
      borderColor: colors.lightGray,
      borderRadius: 10,
      borderWidth: 1,
      marginLeft: 12
    },
    width: 60,
    height: 60
  }) : null, /*#__PURE__*/React.createElement(TitleWrapper, null, /*#__PURE__*/React.createElement(OText, {
    size: 22,
    weight: '600',
    style: {
      textAlign: props.titleAlign ? props.titleAlign : 'center',
      marginRight: props.showCall ? 0 : 40,
      color: props.titleColor || 'black',
      paddingHorizontal: props.titleAlign == 'left' ? 12 : 0,
      ...props.titleStyle
    }
  }, props.title || ''), props.subTitle ? props.subTitle : null)), props.showCall ? /*#__PURE__*/React.createElement(OButton, {
    isCircle: true,
    bgColor: colors.primary,
    borderColor: colors.primary,
    imgRightSrc: null,
    imgLeftStyle: {
      tintColor: 'white',
      width: 30,
      height: 30
    },
    imgLeftSrc: IMAGES.support,
    onClick: props.onRightAction || goSupport
  }) : null);
};

NavBar.defaultProps = {
  title: '',
  textAlign: 'center'
};
export default NavBar;
//# sourceMappingURL=NavBar.js.map