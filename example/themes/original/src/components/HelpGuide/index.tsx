import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { HelpGuideParams } from '../../types'
import { OText, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'
import { Platform, StyleSheet } from 'react-native'
import NavBar from '../NavBar'
import {
  Content,
  Container
} from './styles'

export const HelpGuide = (props: HelpGuideParams) => {
  const {
    navigation
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()

  const styles = StyleSheet.create({
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.white,
      shadowColor: theme.colors.white,
      display: 'flex',
      justifyContent: 'flex-start',
      paddingLeft: 0,
    },
    imageStyle: {
      width: '100%',
      height: 120,
      marginVertical: 20
    },
  })

  const goToBack = () => navigation?.canGoBack() && navigation.goBack()

  return (
    <Container pdng={Platform.OS === 'ios' ? '10px' : '0px'}>
      <NavBar
        title={t('GUIDE_TO_ORDERING', 'Guide to Ordering')}
        onActionLeft={goToBack}
        btnStyle={{ paddingLeft: 0 }}
        showCall={false}
        buttonProps={{
          bgColor: theme.colors.white,
          borderColor: theme.colors.white,
          textStyle: { color: theme.colors.btnFont }
        }}
      />
      <Content>
        <OText mBottom={15}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit mauris varius faucibus varius condimentum morbi pretium mus. Aliquam bibendum erat venenatis feugiat sed.
        </OText>
        <OText mBottom={15}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit mauris varius faucibus varius condimentum morbi pretium mus. Aliquam bibendum erat venenatis feugiat sed.
        </OText>
        <OText mBottom={15}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit mauris varius faucibus varius condimentum morbi pretium mus. Aliquam bibendum erat venenatis feugiat sed.
        </OText>
        <OText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit mauris varius faucibus varius condimentum morbi pretium mus. Aliquam bibendum erat venenatis feugiat sed.
        </OText>
        <OIcon
          src={theme.images.general.help}
          style={styles.imageStyle}
          cover
        />
      </Content>
    </Container>
  )
}
