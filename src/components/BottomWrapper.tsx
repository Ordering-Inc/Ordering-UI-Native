import * as React from 'react'
import { ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

const Wrapper = styled.View`
    border-top-right-radius: 25px;
    border-top-left-radius: 25px;
    box-shadow: 0 -1px 3px #00000010;
    background-color: white;
    margin-top: -20px;
    min-height: 100px;
    padding: 20px;
    padding-bottom: 40px;
`

interface Props {
    style?: ViewStyle,
    children: any
}

const BottomWrapper = (props: Props) => {
    const safeAreaInset = useSafeAreaInsets();
    return (
        <Wrapper 
            style={{paddingBottom: safeAreaInset.bottom || 16, ...props.style}}
        >
                { props.children }
        </Wrapper>
    )
}

export default BottomWrapper