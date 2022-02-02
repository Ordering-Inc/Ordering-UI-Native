import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  padding: 0 30px;
`

export const CountDownContainer = styled.View`
  background-color: ${(props: any) => `${props.color}4D`};
  border-radius: 30px;
  padding: 5px 80px 0px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
`

export const ResendSection = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const WrappCountdown = styled.View`
  padding-bottom: 20px;
  padding-top: 20px;
`

export const InputsSection = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 20px;
`

export const ErrorSection = styled.View`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`
