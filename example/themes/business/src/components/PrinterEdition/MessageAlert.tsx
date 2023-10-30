import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components/native'
import { OText } from '../shared'

export const MessageAlert = ({ message, resetMsg }: any) => {
  const theme = useTheme()

  const [text, setText] = useState(message)

  useEffect(() => {
    setText(message)
  }, [message])

  useEffect(() => {
    if (text) {
      setTimeout(() => {
        setText(null)
        resetMsg()
      }, 2000);
    }
  }, [text])

  return (
    text ? (
      <OText
        size={14}
        color={theme.colors.danger500}
      >
        {text}
      </OText>
    ) : null
  )
}
