import React from 'react';
import styled from 'styled-components/native';

const ContainerStyled = styled.ScrollView`
  flex: 1;
`;

const SafeAreaStyled = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

const ContentView = styled.View`
  padding-horizontal: 30px;
`


export const Container = (props: any) => {
  return (
    <SafeAreaStyled>
      <ContainerStyled keyboardShouldPersistTaps='handled'>
        <ContentView>
          {props.children}
        </ContentView>
      </ContainerStyled>
    </SafeAreaStyled>
  )
}
