import * as React from 'react';
import { Alert, Linking, Pressable, TextStyle } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import OText from './OText';

interface Props {
  url: string | undefined;
  shorcut: string;
  color?: string;
  PressStyle?: TextStyle;
  TextStyle?: TextStyle;
  type?: string;
}

const OLink = (props: Props): React.ReactElement => {
  const { url, shorcut, color, PressStyle, TextStyle, type } = props;
  const [, t] = useLanguage();

  const handleAlert = () =>
    Alert.alert(
      t('ERROR_OPENING_THE_LINK', 'Error opening the link'),
      t('LINK_UNSUPPORTED', 'Link could not be opened or is not supported'),
      [
        {
          text: t('OK', 'Ok'),
        },
      ],
    );

  const handleOpenUrl = async () => {
    if (!url) {
      handleAlert();
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        handleAlert();
      }
    } catch (err) {
      handleAlert();
    }
  };

  return (
    <Pressable style={PressStyle} onPress={() => handleOpenUrl()}>
      <OText
        style={TextStyle}
        numberOfLines={1}
        ellipsizeMode="tail"
        color={color}>
        {shorcut}
      </OText>
    </Pressable>
  );
};

export default OLink;
