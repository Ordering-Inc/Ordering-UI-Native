import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { OButton, OText } from '.';
import { useLanguage } from 'ordering-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ViewStyle } from 'react-native';

const BWrap = styled.View`
	position: absolute;
	min-height: 69px;
	background-color: white;
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-horizontal: 40px;
	padding-vertical: 12px;
	border-top-width: 1px;
	border-top-color: ${(props: any) => props.theme.colors.border};
`;

const TxtButton = styled.TouchableOpacity`

`;

interface Props {
	rightText?: string;
	rightAction?: any;
	leftText?: string;
	leftAction?: any;
	customLeftView?: any;
	customRightView?: any;
	rightBtnStyle?: ViewStyle;
}

const OBottomStickBar = (props: Props) => {
	const [, t] = useLanguage();
	const { rightText, rightAction, customRightView, leftText, leftAction, customLeftView, rightBtnStyle } = props;
	const { bottom } = useSafeAreaInsets();
	const theme = useTheme();

	return (
		<BWrap style={{bottom: 0, paddingBottom: bottom}}>
			{customLeftView ? customLeftView : 
				<TxtButton onPress={leftAction ? leftAction : () => {}}>
					<OText size={16} weight={'bold'} color={theme.colors.textSecondary}>{leftText || t('SKIP', 'Skip')}</OText>
				</TxtButton>
			}
			{customRightView ? customRightView :
				<OButton 
					onClick={rightAction ? rightAction : () => {}}
					text={rightText || t('CONTINUE', 'Continue')} textStyle={{fontSize: 14, color: 'white', marginEnd: 32}} 
					style={{paddingStart: 10, paddingEnd: 10, ...rightBtnStyle}}
					imgRightSrc={theme.images.general.arrow_left}
					imgRightStyle={{tintColor: 'white', transform: [{ rotate: '180deg' }]}}
				/>
			}
		</BWrap>
	)
}

export default OBottomStickBar;
