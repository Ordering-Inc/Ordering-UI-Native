import * as React from 'react'
import styled from 'styled-components/native'
import BottomWrapper from '../components/BottomWrapper'
import NavBar from '../components/NavBar'
import NumberKey from '../components/NumberKey'
import { OButton, OIconButton, OInput, OText } from '../components/shared'
import { colors } from '../theme'

const Wrapper = styled.View`
    background-color: white;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
`
const InnerCircle = styled.View`
    background-color: ${colors.paleGray};
    width: 270px;
    height: 270px;
    border-radius: 135px;
    align-items: center;
    justify-content: center;
`


const Accept = ({ navigation, props, theme }: any) => {
    const [deliveryTime, onChangeTime] = React.useState('00:30');

    let onBack = () => {
        navigation.goBack();
    }
    let onAccept = () => {
        alert('Sent Recover Email!')
    }

    let onClickKey = (val: number) => {
        let str = `${deliveryTime}${val}`
        onChangeTime(str);
    }

    return(
        <>
            <NavBar 
                title={'Accept'}
                titleAlign={'center'}
                onActionLeft={onBack}
                showCall={false} 
            />
            <Wrapper >
                <InnerCircle>
                    <OText
                        size={46}
                        weight={'500'}
                        style={{}}
                    >
                        {deliveryTime}
                    </OText>
                </InnerCircle>
                <OText style={{marginVertical: 20}} size={19}>{'Delivery Time'}</OText>
            </Wrapper>
            <NumberKey />
            <BottomWrapper>
                <OButton 
                    text={'Accept'}
                    textStyle={{color: 'white'}}
                    bgColor={colors.primary}
                    borderColor={colors.primary}
                    imgRightSrc={null}
                    onClick={onAccept}
                />
            </BottomWrapper>
        </>
    )
}

export default Accept;
