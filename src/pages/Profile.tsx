import * as React from 'react'
import styled from 'styled-components/native'
import NavBar from '../components/NavBar'
import { ODropDown, OIcon, OIconButton, OInput, OText, OToggle } from '../components/shared'
import { IMAGES } from '../config/constants'
import { colors } from '../theme'

const Wrapper = styled.ScrollView`
    flex: 1;
    background-color: white;
    padding-horizontal: 24px;
`
const CenterView = styled.View`
    align-items: center;
`
const DetailView = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    padding-vertical: 15px;
`
const PushSetting = styled.View`
    height: 50px;
    border-radius: 25px;
    border: 1px solid ${colors.whiteGray};
    flex-direction: row;
    justify-content: space-between;
`

interface Props {
    navigation: any,
    route: any
}

const Profile = (props: Props) => {
    const [canGetOrders, changeGetOrders] = React.useState(true)
    const [canPush, changeCanPush] = React.useState(true)

    const onMenu = () => {
        props.navigation.openDrawer()
    }

    const toggleGetOrder = () => {
        changeGetOrders(status => !status)
    }
    const togglePush = () => {
        changeCanPush(status => !status)
    }
    const onChangeTimeFormat = (idx: number) => {
        alert(idx);
    }

    const userData: any = {};

    return (
        <>
            <NavBar 
                title={'Profile'}
                titleAlign={'left'}
                onActionLeft={onMenu}
                leftImg={IMAGES.menu}
                showCall={false} 
            />
            <Wrapper >
                <CenterView>
                    <OIcon 
                        src={userData.photo || IMAGES.avatar} 
                        width={100}
                        height={100}
                        style={{borderRadius: 12}}
                    />
                    <OIconButton 
                        icon={IMAGES.camera} 
                        borderColor={colors.clear}
                        iconStyle={{width: 30, height: 30}}
                        style={{maxWidth: 40}}
                        onClick={() => {}}
                    />
                </CenterView>
                <OInput 
                    placeholder={'Full Name'}
                    borderColor={colors.whiteGray}
                    style={{marginVertical: 8}}
                />
                <OInput 
                    placeholder={'Email'}
                    borderColor={colors.whiteGray}
                    style={{marginVertical: 8}}
                />
                <OInput 
                    placeholder={'Mobile number'}
                    borderColor={colors.whiteGray}
                    style={{marginVertical: 8}}
                />
                <OInput 
                    placeholder={'Password'}
                    borderColor={colors.whiteGray}
                    style={{marginVertical: 8}}
                />
                <DetailView>
                    <OText>{'On Shift: Available to receive orders'}</OText>
                    <OToggle size={'small'} isOn={canGetOrders} onToggle={toggleGetOrder} />
                </DetailView>

                <OText size={20} style={{marginTop: 20}}>{'Settings'}</OText>
                
                <PushSetting>
                    <OText>{'Push Notifications'}</OText>
                    <OToggle isOn={true} onToggle={() => {}} />
                </PushSetting>

                <ODropDown 
                    items={[]} 
                    placeholder={'Select your language'} 
                    style={{borderColor: colors.whiteGray, height: 50, borderRadius: 25, marginTop: 16}} 
                />
                <ODropDown 
                    items={[]} 
                    placeholder={'Currency Position'} 
                    style={{borderColor: colors.whiteGray, height: 50, borderRadius: 25, marginTop: 16}} 
                />
                <ODropDown 
                    items={['12H','24H']} 
                    placeholder={'Time Format'} 
                    onSelect={() => onChangeTimeFormat}
                    style={{borderColor: colors.whiteGray, height: 50, borderRadius: 25, marginTop: 16}} 
                />
                

            </Wrapper>
        </>
    )
}

export default Profile;