import styled from 'styled-components/native'

export const Container = styled.View`
  display: flex;
  flex-direction: column;
`

export const SectionContent = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`

export const TransactionsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  border-left-width: 2px;
  border-left-color: ${(props: any) => props.theme.colors.disabled};
`

export const BalanceElement = styled.View`
  width: 100%;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${(props: any) => props.theme.colors.backgroundGray100};
  border-radius: 8px;
`

export const OTabs = styled.View`
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
`;

export const OTab = styled.View`
  padding-horizontal: 10px;
`;

export const LoyaltyContent = styled.View`
  width: 100%;
  margin-bottom: 20px;
`

export const LoyaltyWrapp = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const LoyaltyImg = styled.ImageBackground`
  position: relative;
  height: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
