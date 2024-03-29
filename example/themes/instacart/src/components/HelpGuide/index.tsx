import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { HelpGuideParams } from '../../types'
import { OText, OButton, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'
import { StyleSheet } from 'react-native'
import {
  Content
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
    <>
      <OButton
        imgLeftSrc={theme.images.general.arrow_left}
        imgRightSrc={null}
        style={styles.btnBackArrow}
        onClick={() => goToBack()}
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