import * as React from 'react'
import styled, { css } from 'styled-components/native'
import { OButton, OIcon, OText } from '../shared'
import { useTheme } from 'styled-components/native'
import { Platform, TextStyle } from 'react-native'
import { ViewStyle } from 'react-native'

const btnBackArrow = {
  borderWidth: 0,
  backgroundColor: '#FFF',
  borderColor: '#FFF',
  shadowColor: '#FFF',
  paddingLeft: 0,
  height: 40,
}

const Wrapper = styled.View`
    background-color: ${(props: any) => props.theme.colors.white};
    padding: 4px 40px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
  `
  const TitleWrapper = styled.View`
    flex-direction: column;
    padding-horizontal: 10px;
  `
  const TitleTopWrapper = styled.View`
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `

interface Props {
  navigation?: any,
  route?: any,
  title?: string,
  subTitle?: any,
  titleColor?: string,
  titleAlign?: any,
  withIcon?: boolean,
  icon?: any,
  leftImg?: any,
  isBackStyle?: boolean,
  onActionLeft?: () => void,
  onRightAction?: () => void,
  rightImg?: any,
  titleStyle?: TextStyle,
  btnStyle?: TextStyle,
  style?: ViewStyle,
  paddingTop?: number,
  noBorder?: boolean,
}

const NavBar = (props: Props) => {
  const theme = useTheme();
  const goSupport = () => {
    props.navigation.navigate('Supports', {});
  }
  return (
    <Wrapper style={{ paddingTop: props.paddingTop, borderBottomWidth: props.noBorder ? 0 : 1, borderBottomColor: theme.colors.border, ...props.style }}>
      <OButton
        imgLeftSrc={props.leftImg || theme.images.general.arrow_left}
        imgLeftStyle={{ width: 14 }}
        imgRightSrc={null}
        style={{ ...btnBackArrow, ...props.btnStyle }}
        onClick={props.onActionLeft}
      />
      <TitleTopWrapper style={{ marginEnd: !props.rightImg ? 34 : 0 }}>
        {props.withIcon
          ? (
            <OIcon
              url={props.icon}
              style={{
                borderColor: theme.colors.lightGray,
                borderRadius: 20,
              }}
              width={60}
              height={60}
            />
          )
          : null
        }
        <TitleWrapper>
          <OText
            weight={Platform.OS === 'ios' ? '600' : 'bold'}
            style={
              {
                textAlign: props.titleAlign ? props.titleAlign : 'center',
                color: props.titleColor || 'black',
                paddingHorizontal: props.titleAlign == 'left' ? 12 : 0,
                ...theme.labels.middle as TextStyle,
                ...props.titleStyle
              }
            }
          >
            {props.title || ''}
          </OText>
          {props.subTitle
            ? (props.subTitle)
            : null
          }
        </TitleWrapper>
      </TitleTopWrapper>
      {props.rightImg != null && (<OButton
        bgColor={theme.colors.clear}
        borderColor={theme.colors.clear}
        style={{ paddingEnd: 0 }}
        imgRightSrc={null}
        imgLeftStyle={{ tintColor: theme.colors.textPrimary, width: 16, height: 16 }}
        imgLeftSrc={props.rightImg || theme.images.general.support}
        onClick={props.onRightAction || goSupport} />)
      }
    </Wrapper>
  )
}

NavBar.defaultProps = {
  title: '',
  textAlign: 'center'
};

export default NavBar;
