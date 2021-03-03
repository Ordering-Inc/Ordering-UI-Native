import React, { useState } from 'react';
import styled from 'styled-components/native';
import ToggleSwitch from 'toggle-react-native';
import { OIcon, OIconButton, OText } from '../components/shared';
import { colors } from '../theme';
import { LogoutButton } from '../components/LogoutButton';

const Wrapper = styled.ScrollView`
  flex: 1;
  padding-top: 50px;
`
const TopWrapper = styled.View`
  flex: 1;
  align-items: center;
`
const MenuItemsWrap = styled.View`
  padding-horizontal: 50px;
  padding-top: 20px;
`
interface Props {
  navigation: any,
  route: any
}

const SideMenu = (props: Props) => {
  const [isOnline, setOnline] = useState(false)

  const onSwitchStatus = () => {
    setOnline((status: boolean) => !status)
  }

  return (
    <Wrapper>
      <TopWrapper>
        <OIcon src={require('../assets/images/app-logo.png')} width={190} height={90} />
        <OIcon src={require('../assets/images/avatar.jpg')} width={100} height={100} style={{ borderRadius: 14 }} />

        <OText size={20} style={{ marginTop: 15 }}>{'Dragon Team'}</OText>
        <OText size={14} style={{ marginTop: 12, marginBottom: 6, textTransform: 'uppercase' }} color={isOnline ? colors.primary : 'grey'}>{isOnline ? 'You\'re online' : 'You\'re offline'}</OText>

        <ToggleSwitch isOn={isOnline} onColor={colors.primary} onToggle={onSwitchStatus} />
      </TopWrapper>
      <MenuItemsWrap>
        <OIconButton
          icon={require('../assets/icons/menu-orders.png')}
          title={'MyOrders'}
          style={{ justifyContent: 'flex-start', height: 50 }}
          borderColor={'transparent'}
          textStyle={{ marginHorizontal: 20 }}
          onClick={() => {
            props.navigation.navigate('MapOrders')
          }}
        />
        <OIconButton
          icon={require('../assets/icons/menu-user.png')}
          title={'Profile'}
          style={{ justifyContent: 'flex-start', height: 50 }}
          borderColor={'transparent'}
          textStyle={{ marginHorizontal: 20 }}
          onClick={() => {
            props.navigation.navigate('Profile')
          }}
        />
        <OIconButton
          icon={require('../assets/icons/menu-help.png')}
          title={'Supports'}
          style={{ justifyContent: 'flex-start', height: 50 }}
          borderColor={'transparent'}
          textStyle={{ marginHorizontal: 20 }}
          onClick={() => {
            props.navigation.navigate('Supports')
          }}
        />
        <LogoutButton/>
      </MenuItemsWrap>
    </Wrapper>
  )
}

export default SideMenu;
