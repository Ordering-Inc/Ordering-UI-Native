import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { HelpParams } from '../../types'
import { OText, OButton, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'
import { StyleSheet } from 'react-native'
import {
  Content
} from './styles'
import NavBar from '../NavBar'

export const HelpGuide = (props: HelpParams) => {
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
    <>
      <NavBar
        style={{ paddingBottom: 0, marginLeft:-20, backgroundColor: 'transparent' }}
        btnStyle={{ backgroundColor: 'transparent' }}
        leftImageStyle={{ tintColor: theme.colors.textThird }}
        onActionLeft={() => goToBack()}
      />
      <OText size={22} weight={600}>{t('GUIDE_TO_ORDERING', 'Guide to Ordering')}</OText>
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
    </>
  )
}
