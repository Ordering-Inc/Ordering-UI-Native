import styled from 'styled-components/native'

export const Container = styled.View`
  padding-bottom: 20px;
  padding-top: ${(props: any) => props.pdng};
`
export const Header = styled.View`
  flex-direction: row;
`
export const SectionContent = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
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
  margin-bottom: 20px;
`

export const OTabs = styled.View`
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  padding-vertical: 5px;
`;

export const OTab = styled.View`
  padding-horizontal: 10px;
  padding-vertical: 10px;
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
export const WalletTransactionsWrapper = styled.View`
  padding-horizontal: 40px;
  padding-top: 20px;
`
