import * as React from 'react'
import styled, { css } from 'styled-components/native'
import { Alert, Vibration } from 'react-native'
import { useLanguage } from 'ordering-components/native'

const Wrapper = styled.TouchableOpacity`
	
`

interface Props {
  children: any,
  title: string,
  message?: string,
  onCancel?: any,
  onAccept?: any,
  onClick?: () => void,
  disabled?: boolean
}

const OAlert = (props: Props) => {

  const [, t] = useLanguage()

  const createTwoButtonAlert = () => {
    Alert.alert(
      props.title,
      props.message,
      [
        {
          text: t('CANCEL', 'cancel'),
          onPress: () => props.onCancel && props.onCancel(),
          style: 'cancel'
        },
        {
          text: t('ACCEPT', 'Accept'),
          onPress: () => props.onAccept && props.onAccept()
        }
      ],
      { cancelable: false }
    )
  }

  const handleClick = () => {
    Vibration.vibrate(100)
    props.onClick && props.onClick()
    createTwoButtonAlert()
  }

  return (
    <Wrapper onPress={handleClick} disabled={props.disabled}>
      {props.children}
    </Wrapper>
  )
}

export default OAlert;
