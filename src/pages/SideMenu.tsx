import * as React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styled from 'styled-components/native'
import { OText } from '../components/shared'

const Wrapper = styled.View`

`
interface Props {
    navigation: any
}

const SideMenu = (props: Props) => {
    return(
        <Wrapper>
            <TouchableOpacity onPress={() => {props.navigation.navigate('Forgot')}} style={{marginTop: 50}} >
                <OText>{'This is a test content'}</OText>
            </TouchableOpacity>
        </Wrapper>
    )
}

export default SideMenu;