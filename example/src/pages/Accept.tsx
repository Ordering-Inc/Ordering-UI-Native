import * as React from 'react'
import styled from 'styled-components/native'
import BottomWrapper from '../components/BottomWrapper'
import NavBar from '../components/NavBar'
import NumberKey from '../components/NumberKey'
import { OButton, OText } from '../components/shared'
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


const Accept = ({ navigation, props }: any) => {
    const [deliveryTime, onChangeTime] = React.useState('00:00');

    let onBack = () => {
        navigation.goBack();
    }
    let onAccept = () => {
        alert(`Accept Order ${deliveryTime}`);
    }

    let onClickKey = (val: number) => {
        var str = ''
        let l = deliveryTime.split(':')[0];
        var r = deliveryTime.split(':')[1];
        if (val == -1) {
            let tmp = `${l.charAt(1)}${r.slice(0, -1)}`
            str = (parseInt(l) > 0 ? `0${l.charAt(0)}` : `00`) + `:` + tmp;
        } else {
            if (parseInt(l) < 10) {
                str = `${l.charAt(1)}${r.charAt(0)}:${r.charAt(1)}${val}`;
            } else str = deliveryTime;
        }
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
                        size={60}
                        weight={'500'}
                        style={{}}
                    >
                        {deliveryTime}
                    </OText>
                </InnerCircle>
                <OText style={{marginVertical: 20}} size={19}>{'Delivery Time'}</OText>
            </Wrapper>
            <NumberKey onChangeValue={onClickKey} />
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
