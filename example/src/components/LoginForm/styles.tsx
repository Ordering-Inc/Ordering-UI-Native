import styled from 'styled-components/native';
import {ViewInterface} from '../../types';

export const Wrapper = styled.View<ViewInterface>`
  background-color: ${(props: any) => props.backgroundColor};
  border: ${(props: any) => props.border};
  border-radius: 20px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;
