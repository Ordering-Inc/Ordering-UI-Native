import styled from 'styled-components/native'

export const Container = styled.ScrollView``

export const ProfessionalPhoto = styled.ImageBackground`
  width: 100%;
  position: relative;
  max-height: 258px;
  height: 258px;
  resize-mode: cover;
`;

export const InfoWrapper = styled.View`
  padding-horizontal: 20px;
  margin-vertical: 30px;
`

export const Divider = styled.View`
  width: 100%;
  height: 8px;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
`

export const ProfessionalWrapper = styled.View`
  padding-horizontal: 20px;
  margin-top: 30px;
`

export const ScheduleWrapper = styled(ProfessionalWrapper)``

export const CalendarWrapper = styled.View`
  flex: 1;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.backgroundGray200};
  border-radius: 7.6px;
  padding: 15px;
`

export const ButtonWrapper = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding-vertical: 13px;
  padding-horizontal: 20px;
  margin-top: 30px;
  margin-bottom: 40px;
  width: 100%;
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.backgroundGray200};
`
