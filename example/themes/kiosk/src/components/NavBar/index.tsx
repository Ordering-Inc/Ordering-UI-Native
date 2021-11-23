import * as React from 'react'
import styled from 'styled-components/native'
import { OIcon, OButton, OText } from '../shared'
import { ImageStyle, TextStyle, View } from 'react-native'
import { OrderTypeSelector } from '../OrderTypeSelector'
import { useConfig } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'

const Wrapper = styled.View`
  background-color: ${(props: any) => props.theme.colors.white};
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
  shadowColor: '#FFF',
  paddingTop: '5%'
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
  paddingTop?: number,
  includeOrderTypeSelector?: boolean,
  imgLeftStyle?: ImageStyle
}

const NavBar = (props: Props) => {
  const theme = useTheme();
  const [{ configs }] = useConfig();
  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || [];

  return (
    <Wrapper style={{ paddingTop: props.paddingTop, ...props.style }}>
      {(props?.onActionLeft || props?.leftImg) && (
        <OButton
          imgLeftSrc={props.leftImg || theme.images.general.arrow_left}
          imgRightSrc={null}
          style={{ ...btnBackArrow, ...props.btnStyle }}
          onClick={props.onActionLeft}
          imgLeftStyle= {props.imgLeftStyle}
        />)
      }
      <TitleTopWrapper>
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

      {props?.includeOrderTypeSelector && (
        <View style={{ paddingHorizontal: props.rightComponent ? 4 : 20 }}>
          <OrderTypeSelector configTypes={configTypes} />
        </View>
      )}

      { props.rightComponent }
    </Wrapper>
  )
}

NavBar.defaultProps = {
  title: '',
  textAlign: 'center'
};

export default NavBar;
