import { string } from 'prop-types'
import * as React from 'react'
import { StyleSheet, TextStyle } from 'react-native'
import styled from 'styled-components/native'
import { OButton, OText } from './shared'
import { colors, Theme } from '../theme'

const Wrapper = styled.View`
    background-color: ${({theme}): string => theme.navBackground}
    padding: 44px 20px 10px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
`
const TitleWrapper = styled.View`
    flex-grow: 1;
    flex-direction: column;
    padding-horizontal: 10px;
`

interface Props {
    title?: string,
    subTitle?: any,
    titleAlign?: any,
    isBackStyle?: boolean,
    onActionLeft?: () => void,
    onRightAction?: () => void,
    showCall?: boolean
}

const NavBar = (props: Props) => {
    return(
        <Wrapper>
            <OButton 
                imgLeftSrc={require('../assets/icons/arrow_left.png')}
                imgRightSrc={null}
                isCircle={true}
                onClick={props.onActionLeft}
            />
            <TitleWrapper>
                <OText 
                    size={22}
                    weight={'600'}
                    style={
                        {textAlign: props.titleAlign ? props.titleAlign : 'center', 
                        marginRight: props.showCall ? 0 : 40}
                    }
                >
                    {props.title || ''}
                </OText>
                { props.subTitle
                    ? ( props.subTitle )
                    : null 
                }
            </TitleWrapper>
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
