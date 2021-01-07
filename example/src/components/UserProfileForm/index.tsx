import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import NavBar from '../NavBar';
import {OButton, ODropDown, OIcon, OIconButton, OInput, OText} from '../shared';
import {UserFormDetails as UserProfileController} from 'ordering-components/Native';
import {IMAGES} from '../../config/constants';
import {colors} from '../../theme';
import ToggleSwitch from 'toggle-react-native';
import {
  Wrapper,
  CenterView,
  DetailView,
  PushSetting,
  UserInfoView,
} from './styles';

interface Props {
  navigation: any;
  route: any;
  isEdit: boolean;
  toggleIsEdit: any;
  handleChangeInput: any;
}

const ProfileUI = (props: Props) => {
  const [canGetOrders, setCanGetOrders] = useState(true);
  const [canPush, setCanPush] = useState(true);

  const onMenu = () => {
    props.navigation.openDrawer();
  };

  const toggleGetOrder = () => {
    setCanGetOrders((status) => !status);
  };

  const togglePush = () => {
    setCanPush((status) => !status);
  };

  const onChangeTimeFormat = (idx: number) => {
    alert(idx);
  };

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
      <Wrapper>
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
        {props.isEdit ? (
          <>
            <OInput
              placeholder={'Full Name'}
              borderColor={colors.whiteGray}
              style={styles.inputbox}
              onChange={(value: string) =>
                props.handleChangeInput({target: {name: 'name', value}})
              }
            />
            <OInput
              placeholder={'Email'}
              borderColor={colors.whiteGray}
              style={styles.inputbox}
              onChange={(value: string) =>
                props.handleChangeInput({target: {name: 'email', value}})
              }
            />
            <OInput
              placeholder={'Mobile number'}
              borderColor={colors.whiteGray}
              style={styles.inputbox}
              onChange={(value: string) =>
                props.handleChangeInput({target: {name: 'cellphone', value}})
              }
            />
            <OInput
              placeholder={'Password'}
              borderColor={colors.whiteGray}
              style={styles.inputbox}
              onChange={(value: string) =>
                props.handleChangeInput({target: {name: 'password', value}})
              }
            />
            <OButton text="Accept" onClick={props.toggleIsEdit} />
          </>
        ) : (
          <UserInfoView>
            <OText size={18} weight="bold">
              {"Customer's Name"}
            </OText>
            <OText>{'customer@email.com'}</OText>
            <OText>{'00 0000 0000'}</OText>

            <OButton
              text="Edit"
              imgRightSrc={null}
              bgColor="white"
              borderColor={colors.primary}
              textStyle={{color: `${colors.primary}`}}
              onClick={props.toggleIsEdit}
              style={{height: 40, width: 100, marginTop: 10}}
            />
          </UserInfoView>
        )}
        <DetailView>
          <OText>{'On Shift: Available to receive orders'}</OText>
          <ToggleSwitch
            size={'small'}
            onColor={colors.success}
            isOn={canGetOrders}
            onToggle={toggleGetOrder}
          />
        </DetailView>

        <OText size={20} style={{marginVertical: 20}}>
          {'Settings'}
        </OText>

        <PushSetting>
          <OText color={'grey'}>{'Push Notifications'}</OText>
          <ToggleSwitch
            onColor={colors.success}
            isOn={canPush}
            onToggle={togglePush}
          />
        </PushSetting>

        <ODropDown
          items={[]}
          placeholder={'Select your language'}
          style={styles.dropdown}
        />
        <ODropDown
          items={[]}
          placeholder={'Currency Position'}
          style={styles.dropdown}
        />
        <ODropDown
          items={['12H', '24H']}
          placeholder={'Time Format'}
          onSelect={() => onChangeTimeFormat}
          style={{marginBottom: 120, ...styles.dropdown}}
        />
      </Wrapper>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderColor: colors.whiteGray,
    height: 50,
    borderRadius: 25,
    marginTop: 16,
  },
  inputbox: {
    marginVertical: 8,
  },
});

export const Profile = (props: any) => {
  const userProfileProps = {
    ...props,
    UIComponent: ProfileUI,
  };

  return <UserProfileController {...userProfileProps} />;
};
