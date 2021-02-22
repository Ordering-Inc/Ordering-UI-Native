import styled, { css } from 'styled-components/native';
import { colors } from '../theme';

export const Container = styled.ScrollView`
  flex: 1;
  ${(props: any) => !props.nopadding && css`
    padding: 20px;
  `}
  background-color: ${colors.backgroundPage};
`;
