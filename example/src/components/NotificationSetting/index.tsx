import React, { useEffect } from 'react';
import { useTheme } from 'styled-components/native';
import { StyleSheet, View } from 'react-native';
import {
  openSettings,
  checkNotifications
} from 'react-native-permissions';
import { useLanguage } from 'ordering-components/native'
import { OBottomPopup, OButton, OText } from '../shared';
interface NotificationSettingPropsParams {
  checkNotificationStatus: { open: boolean, checked: boolean };
  setCheckNotificationStatus: (notificationStatus: any) => void;
}
export const NotificationSetting = (props: NotificationSettingPropsParams) => {
  const { checkNotificationStatus, setCheckNotificationStatus } = props
  const theme = useTheme();
  const [, t] = useLanguage();

  const requestLocationPermission = async () => {
    const notificationStatus = await checkNotifications()
    if (notificationStatus?.status === 'blocked') {
      setCheckNotificationStatus({ open: true, checked: false })
      return
    }
    setCheckNotificationStatus({ open: false, checked: true })
  };

  const callOpenSettings = () => {
    openSettings().catch(() => console.warn('cannot open settings'));
    setCheckNotificationStatus({ open: false, checked: true })
  }

  useEffect(() => {
    requestLocationPermission()
  }, [])
  return (
    <OBottomPopup
      open={checkNotificationStatus?.open}
      onClose={() => setCheckNotificationStatus({ open: false, checked: true })}
      title={t('ENABLE_NOTIFICATIONS', 'Enable notifications')}
      titleStyle={{ textAlign: 'center' }}
      containerStyle={{ borderRadius: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <OText style={{ textAlign: 'center' }}>
            {t('ACTIVE_NOTIFICATION_TO_RECEIVE_INFORMATION', 'Activate notifications to receive information about your orders')}
          </OText>
        </View>
        <OButton
          text={t('ENABLE_NOTIFICATIONS', 'Enable notifications')}
          bgColor={theme.colors.primary}
          borderColor={theme.colors.primary}
          parentStyle={styles.parentStyle}
          style={styles.button}
          textStyle={{ color: 'white' }}
          onClick={() => callOpenSettings()}
        />
      </View>
    </OBottomPopup>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    textAlign: 'center'
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: 25,
    paddingBottom: 20
  },
  parentStyle: {
    display: 'flex',
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 25

  },
  button: {
    borderRadius: 5
  }
});
