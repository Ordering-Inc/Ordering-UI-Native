import * as React from 'react'
import styled from 'styled-components/native'
import BottomWrapper from '../components/BottomWrapper'
import NavBar from '../components/NavBar'
import { OButton, OInput, OText } from '../components/shared'
import { colors } from '../theme'

const Wrapper = styled.View`
    flex-grow: 1;
    background-color: white;
    min-height: 200px;
    padding: 30px 25px; 
`

const Forgot = ({ navigation, props }: any) => {
    let onBack = () => {
        navigation.navigate('Login');
    }
    let onRecover = () => {
        alert('Sent Recover Email!')
    }
    return(
        <>
            <NavBar 
                title={'Forgot your password?'}
                titleAlign={'center'}
                onActionLeft={onBack}
                showCall={false} 
            />
            <Wrapper >
                <OText
                    color={'gray'}
                    size={16}
                    weight={'300'}
                    style={{marginBottom: 30}}
                >
                    {'Enter your email address and we\'ll sent a link to reset your password.'}
                </OText>
                <OInput 
                    placeholder={'Mail'}
                    borderColor={colors.whiteGray}
                />
            </Wrapper>
            <BottomWrapper>
                <OButton 
                    text={'Recover Password'}
                    textStyle={{color: 'white'}}
                    bgColor={colors.primary}
                    borderColor={colors.primary}
                    onClick={onRecover}
                />
            </BottomWrapper>
        </>
    )
}

export default Forgot;
