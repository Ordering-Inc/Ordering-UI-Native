import React from 'react';
import { Share } from 'react-native';
import {useLanguage} from 'ordering-components/native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {useToast, ToastType} from '../../providers/ToastProvider'

export const ShareComponent = (props) => {

  const {orderId, hashkey} = props
  const [ ,t] = useLanguage()
  const {showToast} = useToast()
  const url = `https://reactdemo.ordering.co/orders/${orderId}?=${hashkey}`
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: t('SHARE_YOUR_ORDER', 'Share your order'),
        message:
          `My order ${url}`,
        url: `https://reactdemo.ordering.co/orders/${orderId}?=${hashkey}`
      });
      if (result.action === Share.sharedAction && result.activityType) {
          showToast(ToastType.Success, t('ORDER_SHARED_SUCCESSFULLY', 'Order shared successfully'))
      }
    } catch (error) {
      showToast(ToastType.Success, t('ORDER_SHARED_ERROR', 'Order shared successfully'))
    }
  };
  return (
    <MaterialIcon name='share-variant' onPress={onShare} size={26} />
  );
};

