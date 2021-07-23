import styled from 'styled-components/native';

export const FormStripe = styled.ScrollView`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 0;
`

export const FormRow = styled.View``

export const ErrorMessage = styled.View`
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  color: #D81212;
  margin: 10px 0px 0px 10px;
`

export const FormActions = styled.View`
  width: 100%;
  display: flex;
  padding: 30px 20px 0px;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`
