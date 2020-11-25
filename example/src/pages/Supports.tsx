import * as React from 'react'
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import MainWrapper from '../components/MainWrapper'
import NavBar from '../components/NavBar'
import { OIcon, OText } from '../components/shared'
import { IMAGES } from '../config/constants'
import { colors } from '../theme'

const Wrapper = styled.View`
    flex: 1;
    background-color: white;
    padding: 16px;
`
const SubWrapper = styled.View`
    
`
const TutorView = styled.ScrollView`
    background-color: yellow;
    height: 190px;
`
const ContactWrapper = styled.View`
    flex-direction: row;
`
const ContactItem = styled.TouchableOpacity`
    flex: 1;
    border-radius: 10px;
    border: 1px solid ${colors.primary};
    padding: 12px 4px;
    align-items: center;
`

interface Props {
    navigation: any
}

const Supports = (props: Props) => {
    
    const safeAreaInset = useSafeAreaInsets();

    const onMenu = () => {
        props.navigation.openDrawer()
    }
    
    const onSendEmail = () => {

    }
    const onCall = () => {

    }
    const onChat = () => {

    }

    return (
        <>
        <NavBar
            title={'Support'}
            titleAlign={'left'}
            onActionLeft={onMenu}
            leftImg={IMAGES.menu}
            showCall={false} 
        />
        <MainWrapper>
            <SubWrapper>
                <OText size={17} weight={'500'} hasBottom={true}>{`Tutorials`}</OText>
                <TutorView>

                </TutorView>
            </SubWrapper>
            <SubWrapper style={{flexGrow: 1}}>
                <OText size={17} weight={'500'} hasBottom={true}>{`FAQ`}</OText>
                
            </SubWrapper>
            <SubWrapper>
                <OText size={17} weight={'500'} hasBottom={true}>{`Contact us`}</OText>
                <ContactWrapper>
                    <ContactItem onPress={onSendEmail}>
                        <OIcon src={IMAGES.mail} />
                        <OText size={12}>{`Send us a email`}</OText>
                    </ContactItem>
                    <ContactItem onPress={onCall} style={{marginHorizontal: 10}}>
                        <OIcon src={IMAGES.phone} />
                        <OText size={12}>{`Call with us`}</OText>
                    </ContactItem>
                    <ContactItem onPress={onChat}>
                        <OIcon src={IMAGES.chat} />
                        <OText size={12}>{`Chat with us`}</OText>
                    </ContactItem>
                </ContactWrapper>
            </SubWrapper>
        </MainWrapper>
        </>
    )
}

export default Supports;