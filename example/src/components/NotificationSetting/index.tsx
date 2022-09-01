import React from 'react';
import { useTheme } from 'styled-components/native';
import { StyleSheet, View } from 'react-native';
import { useLanguage } from 'ordering-components/native'
import { OButton, OText } from '../shared';

export const NotificationSetting = (props: any) => {
  const { actFunction } = props
  const theme = useTheme();
  const [, t] = useLanguage();

  return (
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
        onClick={() => actFunction()}
      />
    </View>
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
