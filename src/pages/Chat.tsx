import * as React from 'react'
import styled from 'styled-components/native'
import BottomWrapper from '../components/BottomWrapper'
import NavBar from '../components/NavBar'
import { OIconButton, OInput, OText } from '../components/shared'
import OChatBubble from '../components/shared/OChatBubble'
import { DIRECTION, USER_TYPE } from '../config/constants'
import { colors } from '../theme'
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';

const Wrapper = styled.View`
    flex: 1;
`
const Inner = styled.ScrollView`
    background-color: white;
    padding: 16px;
`
const ActionWrapper = styled.View`
    flex-direction: row;
`
const InputWrapper = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    border: 1px solid ${colors.lightGray};
    border-radius: 25px;
    padding-horizontal: 14px;
`
const SignatureWrap = styled.View`
    height: 150px;
`

interface Props {
    navigation: any,
    route: any,
    onOK: (signature: any) => void;
}

const Chat = (props: Props) => {
    const [orderData, getOrder] = React.useState(props.route.params.data);
    const [type, getType] = React.useState(props.route.params.type);
    const [showSignPad, onOffSignature] = React.useState(false)

    const ref = React.useRef<SignatureViewRef>(null);

    const handleSignature = (signature: any) => {
        console.log(signature);
        // props.onOK(signature);
    };

    const handleEmpty = () => {
        console.log('Empty');
    }

    const handleClear = () => {
        console.log('clear success!');
    }

    const handleEnd = () => {
        ref.current?.readSignature();
    }

    const style = `
        .m-signature-pad--footer
        .button {
            background-color: red;
            color: #FFF;
        }
    `;

    const goBack = () => {
        props.navigation.goBack();
    }
    const addImage = () => {

    }
    const addSignToggle = () => {
        onOffSignature(!showSignPad);
    }
    
    const onSend= () => {

    }

    return (
        <Wrapper>
            <NavBar 
                title={type == USER_TYPE.CUSTOMER ? orderData.customer.name : orderData.business.name}
                subTitle={(<OText color={colors.primary} size={17}>{'online'}</OText>)}
                titleAlign={'left'}
                withIcon={true}
                icon={type == USER_TYPE.CUSTOMER ? orderData.customer.photo : orderData.business.logo}
                onActionLeft={goBack}
            />
            <Inner>
                <OChatBubble side={DIRECTION.RIGHT} contents={'This is a test message , your order is placed to business and in progresss'} datetime={'2020/02/12'} />
                <OChatBubble side={DIRECTION.LEFT} contents={'This is a test message , your order is placed to business and in progresss'} datetime={'2020/02/12'} />
                <OChatBubble side={DIRECTION.LEFT} contents={'This is a test message '} datetime={'2020/02/12'} />
                <OChatBubble side={DIRECTION.RIGHT} contents={'This is a test message , your order is placed to business and in progresss'} datetime={'2020/02/12'} />
                <OChatBubble side={DIRECTION.RIGHT} contents={'How are you doing?'} datetime={'2020/02/12'} />
            </Inner>
            <BottomWrapper>
                {showSignPad ? (
                    <SignatureWrap>
                        <SignatureScreen
                            ref={ref}
                            onEnd={handleEnd}
                            onOK={handleSignature} 
                            onEmpty={handleEmpty}
                            onClear={handleClear}
                            autoClear={false}
                            descriptionText={''} 
                        />
                    </SignatureWrap>
                ) : null}
                <ActionWrapper>
                    <InputWrapper>
                        <OInput 
                            placeholder={'write a message...'} 
                            style={{flex: 1, paddingHorizontal: 0}} />
                        <OIconButton 
                            onClick={addImage}
                            iconColor={colors.lightGray} 
                            icon={require('../assets/icons/image.png')}
                            style={{borderWidth: 0, paddingLeft: 10, paddingRight: 0}} />
                    </InputWrapper>
                    <OIconButton 
                        onClick={addSignToggle}
                        icon={require('../assets/icons/autograph.png')} 
                        borderColor={colors.lightGray} 
                        style={{width: 50, height: 50, borderRadius: 25, marginHorizontal: 10}} 
                    />
                    <OIconButton 
                        onClick={onSend}
                        icon={require('../assets/icons/send.png')} 
                        borderColor={colors.primary}
                        bgColor={colors.primary} 
                        style={{width: 50, height: 50, borderRadius: 25}} 
                        iconStyle={{marginTop: 3, marginRight: 2}}
                    />
                </ActionWrapper>
            </BottomWrapper>
        </Wrapper>
    )
}

export default Chat;