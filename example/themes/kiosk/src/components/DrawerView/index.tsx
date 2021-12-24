import React from 'react';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Container,
  Wrapper,
  WrapperFloatBtn,
  IconControl
} from './styles';

export const DrawerView = (props: any) => {
  const {
    children,
    isOpen,
    width,
    height,
    onClickIcon,
    iconStyles
  } = props;

  return (
    isOpen && (
      <>
        <WrapperFloatBtn>
          <IconControl
            activeOpacity={1}
            style={{ ...iconStyles, ...styles.shadow}}
            onPress={() => onClickIcon()}
          >
            <MaterialCommunityIcon
              name='arrow-expand-right'
              size={24}
            />
          </IconControl>
        </WrapperFloatBtn>
        <Container style={styles.shadow}>
          <Wrapper width={width} height={height}>
            {children}
          </Wrapper>
        </Container>
      </>
    )
  )
}

const styles = StyleSheet.create({
  shadow:{
    shadowColor: 'rgba(0.0, 0.0, 0.0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.21,
    shadowRadius: 5,
  }
})
