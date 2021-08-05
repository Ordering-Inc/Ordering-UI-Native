import styled from 'styled-components/native';

export const OSContainer = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.5);
`

export const OSContent = styled.View`
  width: 70%;
  max-width: 500px;
  min-height: 350px;
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
