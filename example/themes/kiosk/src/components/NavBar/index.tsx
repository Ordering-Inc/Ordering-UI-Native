import * as React from 'react'
import styled from 'styled-components/native'
import { OIcon, OButton, OText } from '../shared'
import { ImageStyle, TextStyle, View, Platform, TouchableOpacity } from 'react-native'
import { useConfig, useLanguage, useOrder } from 'ordering-components/native'
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
  margin-top: ${Platform.OS === 'ios' ? '10px' : '0px'};
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
  onClickTypes?: any
}

const NavBar = (props: Props) => {
  const theme = useTheme();
  const [orderState] = useOrder()
  const [, t] = useLanguage();

  const selectedOrderType = orderState?.options?.type;

  return (
    <Wrapper style={{ paddingTop: props.paddingTop, ...props.style }}>
      {(props?.onActionLeft) && (
        <OButton
          imgLeftSrc={props.leftImg}
          imgRightSrc={null}
          style={{ ...btnBackArrow, ...props.btnStyle }}
          onClick={props.onActionLeft}
          imgLeftStyle={props.imgLeftStyle}
          {...(!props.leftImg && { iconProps: { name: 'arrowleft', size: 28, color: props.btnStyle?.color } })}
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
        <View
          style={{
            paddingHorizontal: props.rightComponent ? 4 : 20,
            flexDirection: 'row'
          }}
        >
          <OText style={{ paddingRight: 5 }}>{t('THIS_ORDER_IS_TO', 'This order is to')}</OText>
          <TouchableOpacity
            activeOpacity={1}
            onPress={props.onClickTypes}
          >
            <OText color={theme.colors.primary}>
              {selectedOrderType === 2 && t('TAKE_OUT', 'Take out')}
              {selectedOrderType === 3 && t('EAT_IN', 'Eat in')}
            </OText>
          </TouchableOpacity>
        </View>
      )}

      {props.rightComponent}
    </Wrapper>
  )
}

NavBar.defaultProps = {
  title: '',
  textAlign: 'center',
};

export default NavBar;
