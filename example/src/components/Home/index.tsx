import React from 'react';
import {useLanguage} from 'ordering-components/native';
import {StyleSheet} from 'react-native';
import {colors} from '../../theme';
import {OButton, OIcon, OText} from '../shared';
import {BgWrapper, LogoWrapper, Slogan} from './styles';

const sloganImage = require('../assets/images/product.png');
const applogo = require('../assets/images/app-logo.png');

export const Home = (props: any) => {
  const {redirectLogin, redirectSignup, sloganTitle, sloganSubtitle} = props;

  const [, t] = useLanguage();

  return (
    <BgWrapper>
      <LogoWrapper>
        <OIcon src={applogo} style={styles.logo} />
      </LogoWrapper>
      <Slogan>
        <OIcon src={sloganImage} style={styles.slogan} />
        <OText size={48}>{sloganTitle}</OText>
        <OText size={18}>{sloganSubtitle}</OText>
      </Slogan>
      <OButton
        text={t('LOGIN', 'Login now')}
        bgColor={colors.primary}
        borderColor={colors.primary}
        style={styles.buttons}
        onClick={redirectLogin}
      />
      <OButton
        text="signup"
        bgColor={colors.white}
        borderColor={colors.primary}
        style={styles.buttons}
        onClick={redirectSignup}
      />
    </BgWrapper>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 200,
    width: 260,
  },
  slogan: {
    height: 300,
    width: 300,
    marginVertical: 10,
  },
  buttons: {
    marginVertical: 10,
    marginHorizontal: 30,
  },
});
