import * as React from 'react'
import styled from 'styled-components/native'
import { OIcon, OButton, OText } from '../shared'
import { colors } from '../../theme.json'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TextStyle } from 'react-native'
import { IMAGES } from '../../config/constants'

const Wrapper = styled.View`
  background-color: ${colors.white};
  padding: 10px 0px 20px 0px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  border-bottom-color: #E1E8ED;
  border-bottom-width: 1px;
`
const TitleWrapper = styled.View`
  flex-direction: column;
  padding-horizontal: 10px;
`
const TitleTopWrapper = styled.View`
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
`

const btnBackArrow = {
  borderWidth: 0,
  backgroundColor: '#FFF',
  borderColor: '#FFF',
  shadowColor: '#FFF'
}

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
  rightComponent?: any,
  showCall?: boolean,
  titleStyle?: TextStyle,
  btnStyle?: TextStyle,
  style?: TextStyle,
  paddingTop?: number
}

const NavBar = (props: Props) => {
  const safeAreaInset = useSafeAreaInsets();
  const goSupport = () => {
    props.navigation.navigate('Supports', {});
  }
  return (
    <Wrapper style={{ paddingTop: props.paddingTop, ...props.style }}>
      <OButton
        imgLeftSrc={props.leftImg || IMAGES.arrow_left}
        imgRightSrc={null}
        style={{ ...btnBackArrow, ...props.btnStyle }}
        onClick={props.onActionLeft}
      />
      <TitleTopWrapper>
        {props.withIcon
          ? (
              <OIcon
                url={props.icon}
                style={{
                  borderColor: colors.lightGray,
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
            size={22}
            weight={'600'}
            style={
              {
                textAlign: props.titleAlign ? props.titleAlign : 'center',
                marginRight: props.showCall ? 0 : 40,
                color: props.titleColor || 'black',
                paddingHorizontal: props.titleAlign == 'left' ? 12 : 0,
                fontWeight: "700",
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
      { props.rightComponent }
    </Wrapper>
  )
}

NavBar.defaultProps = {
  title: '',
  textAlign: 'center'
};

export default NavBar;
