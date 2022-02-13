import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../context/Theme';
import {
  MessagesOption,
  SafeAreaContainerLayout,
} from '../../themes/business';

const Messages = ({ navigation }: any) => {
  const [theme] = useTheme();

  const MyOrderProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return;
      navigation.navigate(page, params);
    },
    firstFetch: 'orders',
    sortParams: {
      param: 'last_direct_message_at',
      direction: 'asc',
    },
    paginationSettings: {
      page: 1,
      pageSize: 45,
      controlType: 'infinity',
    },
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundLight,
      padding: 20,
    },
  });

  return (
    <SafeAreaContainerLayout style={styles.container}>
      <MessagesOption {...MyOrderProps} />
    </SafeAreaContainerLayout>
  );
};

export default Messages;