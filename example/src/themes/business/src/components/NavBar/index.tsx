import * as React from 'react';
import styled from 'styled-components/native';
import { OButton, OIcon, OText } from '../shared';
import { TextStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

const Wrapper = styled.View`
  background-color: ${(props: any) => props.theme.colors.white};
  padding: 10px 20px 20px 0px;
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

const btnBackArrow = {
  borderWidth: 0,
  backgroundColor: '#FFF',
  borderColor: '#FFF',
  shadowColor: '#FFF',
};

interface Props {
  navigation?: any;
  route?: any;
  title?: string;
  subTitle?: any;
  titleColor?: string;
  titleAlign?: any;
  withIcon?: boolean;
  icon?: any;
  leftImg?: any;
  isBackStyle?: boolean;
  onActionLeft?: () => void;
  onRightAction?: () => void;
  showCall?: boolean;
  titleStyle?: TextStyle;
  btnStyle?: TextStyle;
  style?: TextStyle;
  paddingTop?: number;
}

const NavBar = (props: Props) => {
  const goSupport = () => {
    props.navigation.navigate('Supports', {});
  };
  const theme = useTheme();
  return (
    <Wrapper style={{ paddingTop: props.paddingTop, ...props.style }}>
      <OButton
        imgLeftSrc={props.leftImg || theme.images.general.arrow_left}
        imgRightSrc={null}
        style={{ ...btnBackArrow, ...props.btnStyle }}
        onClick={props.onActionLeft}
        bgColor={theme.colors.transparent}
      />
      <TitleTopWrapper>
        {props.withIcon ? (
          <OIcon
            url={props.icon}
            style={{
              borderColor: theme.colors.lightGray,
              borderRadius: 20,
            }}
            width={60}
            height={60}
          />
        ) : null}
        <TitleWrapper>
          <OText
            size={22}
            weight={'600'}
            style={{
              textAlign: props.titleAlign ? props.titleAlign : 'center',
              marginRight: props.showCall ? 0 : 40,
              color: props.titleColor || 'black',
              paddingHorizontal: props.titleAlign == 'left' ? 12 : 0,
              ...props.titleStyle,
            }}>
            {props.title || ''}
          </OText>
          {props.subTitle ? props.subTitle : null}
        </TitleWrapper>
      </TitleTopWrapper>
      {props.showCall ? (
        <OButton
          isCircle={true}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          imgRightSrc={null}
          imgLeftStyle={{ tintColor: 'white', width: 30, height: 30 }}
          imgLeftSrc={theme.images.general.support}
          onClick={props.onRightAction || goSupport}
        />
      ) : null}
    </Wrapper>
  );
};

NavBar.defaultProps = {
  title: '',
  textAlign: 'center',
};

export default NavBar;
