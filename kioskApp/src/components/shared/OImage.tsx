import * as React from 'react';
import styled, {css} from 'styled-components/native';

const SImage = styled.Image`
  width: ${(props:any) => props?.width ? css`${props?.width}px` : css`100%`};
  height: ${(props:any) => css`${props?.height || 0}px`};
	overflow: ${(props:any) => css`${props?.overflow || 'visible'}`};
  resizeMode: ${(props:any) => css`${props?.resizeMode || 'contain'}`};
	border-radius: ${(props:any) => css`${props?.borderRadius || 0}`}px;
`;

interface Props {
  source: string | { uri: string },
  width?: number,
  height?: number,
	resizeMode?: string,
  overflow?: string,
  borderRadius?:number,
}

const OImage = (props: Props): React.ReactElement => {
  return (
    <SImage
      {...props}
    />
  );
};

export default OImage;
