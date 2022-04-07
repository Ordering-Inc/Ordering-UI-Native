import React from 'react'
import styled from 'styled-components/native'
import { Platform, Dimensions } from 'react-native'
const windowWidth = Dimensions.get('window').width

export const Container = styled.View`
  position: absolute;
  flex: 1;
  bottom: 0px;
  left: 0;
  right: 0;
  padding: 10px;
  border-top-width: 1px;
  border-color: ${(props: any) => props.theme.colors.backgroundGray200};
  z-index: 1000;
  background-color: ${(props: any) => props.bgColor ? props.bgColor : '#FFF'};
  padding-bottom: ${Platform.OS === 'ios' ? '20px' : '10px'};
`

export const FloatingBottomContainer = (props: any) => {
  return (
    <Container style={{ width: windowWidth }}>
      {props.children}
    </Container>
  )
}
