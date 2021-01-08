import * as React from 'react'
import { OButton, OIcon, OText } from '../shared'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Platform, TextStyle } from 'react-native'
import { IMAGES } from '../../config/constants'
import { Wrapper, TitleTopWrapper, TitleWrapper } from './styles'
import { buttonTheme, labelTheme } from '../../globalStyles'

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
    titleStyle?: TextStyle
}

const NavBar = (props: Props) => {
    const safeAreaInset = useSafeAreaInsets();
    const goSupport = () => {
        props.navigation.navigate('Supports',{});
    }
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
                                borderColor: labelTheme.lightGray, 
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
                                color: props.titleColor || 'black',
                                paddingHorizontal: props.titleAlign == 'left' ? 12 : 0,
                                ...props.titleStyle
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
                        bgColor={buttonTheme.backgroundColor} 
                        borderColor={buttonTheme.backgroundColor} 
                        imgRightSrc={null} 
                        imgLeftStyle={{tintColor: labelTheme.light, width:30, height: 30}} 
                        imgLeftSrc={IMAGES.support}
                        onClick={props.onRightAction || goSupport} /> ) 
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
