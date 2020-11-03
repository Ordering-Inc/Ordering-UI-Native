import * as React from 'react'
import styled from 'styled-components/native'
import { OButton, OIcon, OText } from './shared'
import { colors } from '../theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Platform } from 'react-native'
import { IMAGES } from '../config/constants'

const Wrapper = styled.View`
    background-color: ${({theme}): string => theme.navBackground}
    padding: 44px 20px 10px;
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
`

interface Props {
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
    showCall?: boolean
}

const NavBar = (props: Props) => {
    const safeAreaInset = useSafeAreaInsets()
    return(
        <Wrapper style={{paddingTop: Platform.OS == 'ios' ? safeAreaInset.top : 16}}>
            <OButton 
                imgLeftSrc={props.leftImg || IMAGES.arrow_left}
                imgRightSrc={null}
                isCircle={true}
                onClick={props.onActionLeft}
            />
            <TitleTopWrapper> 
                {props.withIcon
                    ? (
                        <OIcon 
                            url={props.icon} 
                            style={{
                                borderColor: colors.lightGray, 
                                borderRadius: 10, 
                                borderWidth: 1,
                                marginLeft: 12,
                            }}
                            width={60}
                            height={60} />
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
                                color: props.titleColor || 'black'
                            }
                        }
                    >
                        {props.title || ''}
                    </OText>
                    { props.subTitle
                        ? ( props.subTitle )
                        : null 
                    }
                </TitleWrapper>
            </TitleTopWrapper>
            { props.showCall 
                ? ( <OButton 
                        isCircle={true} 
                        bgColor={colors.primary} 
                        borderColor={colors.primary} 
                        imgRightSrc={null} 
                        imgLeftStyle={{tintColor: 'white', width:30, height: 30}} 
                        imgLeftSrc={require('../assets/icons/help.png')}
                        onClick={props.onRightAction} /> ) 
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
