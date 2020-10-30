import * as React from 'react'
import styled from 'styled-components/native'
import BottomWrapper from '../components/BottomWrapper'
import NavBar from '../components/NavBar'
import { OButton, OInput, OText, OTextarea } from '../components/shared'
import { colors } from '../theme'

const Wrapper = styled.View`
    flex-grow: 1;
    background-color: white;
    min-height: 200px;
    padding: 30px 25px; 
`

const Reject = ({ navigation, route, props, theme }: any) => {
    let onBack = () => {
        navigation.goBack();
    }
    let onReject = () => {
        alert('Reject Order')
    }
    return(
        <>
            <NavBar 
                title={`Order #${route.params.id}`}
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
                    {`Mark the order as rejected.`}
                </OText>
                <OText
                    color={'gray'}
                    size={16}
                    weight={'300'}
                    style={{marginBottom: 30}}
                >
                    {`Note: Your customer will receive a notification about this action`}
                </OText>
                <OTextarea 
                    placeholder={'Reason of reject'}
                    lines={12}
                />
            </Wrapper>
            <BottomWrapper>
                <OButton 
                    text={'Reject Order'}
                    textStyle={{color: 'white'}}
                    imgRightSrc={null}
                    bgColor={colors.error}
                    borderColor={colors.error}
                    onClick={onReject}
                />
            </BottomWrapper>
        </>
    )
}

export default Reject;
