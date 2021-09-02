import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { OButton, OIcon, OText } from '../shared'
import { TextStyle } from 'react-native'

const Wrapper = styled.View`
  background-color: ${(props: any) => props.theme.colors.white};
  justify-content: center;
  align-items: flex-start;
  position: relative;
  paddingBottom: 12px;
`
const TitleWrapper = styled.View`
  flex-direction: column;
  padding-horizontal: 0px;
  width: 100%;
  align-items: center;
`
const TitleTopWrapper = styled.View`
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const btnBackArrow = {
  borderWidth: 0,
  backgroundColor: '#FFF',
  borderColor: '#FFF',
  shadowColor: '#FFF',
  paddingLeft: 0,
  paddingRight: 0,
  height: 40
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
  onRightAction?: () => void,
  showCall?: boolean,
  titleStyle?: TextStyle,
  btnStyle?: TextStyle,
  style?: TextStyle,
  paddingTop?: number,
}

const NavBar = (props: Props) => {
  const theme = useTheme()

  const goSupport = () => {
    props.navigation.navigate('Supports', {});
  }

  return (
    <Wrapper style={{ paddingTop: props.paddingTop, ...props.style }}>
      <OButton
        imgLeftSrc={props.leftImg || theme.images.general.arrow_left}
		    imgLeftStyle={{tintColor: theme.colors.primary}}
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
                  borderRadius: 20,
                }}
					      color={theme.colors.primary}
                width={60}
                height={60}
              />
          )
          : null
        }
        <TitleWrapper>
          <OText
            size={20}
				    lineHeight={30}
            weight={'600'}
            style={
              {
                textAlign: props.titleAlign ? props.titleAlign : 'center',
                color: props.titleColor || 'black',
                paddingHorizontal: props.titleAlign == 'left' ? 12 : 0,
                ...props.titleStyle,
					      alignSelf: 'center',
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
      { props.showCall
        ? (<OButton
          isCircle={true}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          imgRightSrc={null}
          imgLeftStyle={{ tintColor: 'white', width: 30, height: 30 }}
          imgLeftSrc={theme.images.general.support}
          onClick={props.onRightAction || goSupport} />)
        : null
      }
    </Wrapper>
  )
}

NavBar.defaultProps = {
  title: '',
  textAlign: 'center'
};

export default NavBar;
