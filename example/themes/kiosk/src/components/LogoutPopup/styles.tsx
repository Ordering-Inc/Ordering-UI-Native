import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const OSContainer = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.5);
`

export const OSContent = styled.View`
  width: 70%;
  max-width: ${(props: any) => props.isportrait ? '500px': '600px'};
  min-height: ${(props: any) => props.isportrait ? '350px': Platform.OS === 'ios' ? '400px' : '460px'};
  border-radius: 6px;
  padding: 10px;
  background-color: ${(props: any) => props.theme.colors.white};
`

export const OSBody = styled.View`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`
