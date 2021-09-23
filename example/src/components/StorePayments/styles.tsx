import styled, {css} from 'styled-components/native';

export const Item = styled.View`
  width: 120px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 10px;
  margin-top: 10px;
  text-align: center;
  background-color: ${(props: any) => props.theme.colors.inputDisabled};

  ${(props: any) =>
    props.theme?.rtl &&
    css`
      margin-left: 10px;
      margin-right: 0;
    `}

  ${(props: any) =>
    props.isActive
      ? css`
          background-color: ${(props: any) => props.theme.colors.primary};
        `
      : css`
          border: 1px solid #eaeaea;
        `}
`;
