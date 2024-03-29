import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { OButton, OIcon, OText } from '../shared'
import { Platform, TextStyle, ViewStyle, I18nManager, ImageStyle } from 'react-native'

const TitleWrapper = styled.View`
  flex-direction: column;
  padding-horizontal: 10px;
`
const TitleTopWrapper = styled.View`
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
`

const Wrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.white};
	padding: 10px 20px 20px 0px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: relative;
`

const btnBackArrow = {
	borderWidth: 0,
	backgroundColor: '#FFF',
	borderColor: '#FFF',
	shadowColor: '#FFF'
}

interface Props {
	navigation?: any,
	route?: any,
	title?: string,
	subTitle?: any,
	titleColor?: string,
	titleAlign?: any,
	withIcon?: boolean,
	icon?: any,
	leftImg?: any,
	isBackStyle?: boolean,
	onActionLeft?: () => void,
	onRightAction?: () => void,
	showCall?: boolean,
	titleStyle?: TextStyle,
	btnStyle?: TextStyle,
	style?: ViewStyle,
	titleWrapStyle?: ViewStyle,
	paddingTop?: number,
	isVertical?: boolean,
	leftImageStyle?: ImageStyle
}

const NavBar = (props: Props) => {

	const theme = useTheme();

	const goSupport = () => {
		props.navigation.navigate('Supports', {});
	}
	return (
		<Wrapper {...props} style={{ paddingTop: props.paddingTop, flexDirection: props.isVertical ? 'column' : 'row', alignItems: props.isVertical ? 'flex-start' : 'center', ...props.style }}>
			<OButton
				imgLeftSrc={props.leftImg || theme.images.general.arrow_left}
				imgRightSrc={null}
				style={{ ...btnBackArrow, ...props.btnStyle, ...props.isVertical ? (I18nManager.isRTL ? { paddingRight: 0 } : { paddingLeft: 0 }) : {} }}
				onClick={props?.onActionLeft}
				imgLeftStyle={{width: 20, ...props.leftImageStyle}}
			/>
			<TitleTopWrapper>
				{props.withIcon
					? (
						<OIcon
							url={props.icon}
							style={{
								borderColor: theme.colors.lightGray,
								borderRadius: 20,
							}}
							width={60}
							height={60}
						/>
					)
					: null
				}
				<TitleWrapper style={{ paddingStart: props.isVertical ? 0 : 10, ...props.titleWrapStyle }}>
					<OText
						size={24}
						lineHeight={36}
						weight={Platform.OS === 'ios' ? '600' : 'bold'}
						style={
							{
								textAlign: props.titleAlign ? props.titleAlign : 'center',
								marginRight: props.showCall ? 0 : 40,
								color: props.titleColor || theme.colors.textNormal,
								paddingHorizontal: props.titleAlign == 'left' ? 12 : 0,
								...props.titleStyle,
							}
						}
					>
						{props.title || ''}
					</OText>
					{props.subTitle
						? (props.subTitle)
						: null
					}
				</TitleWrapper>
			</TitleTopWrapper>
			{props.showCall
				? (<OButton
					isCircle={true}
					bgColor={theme.colors.primary}
					borderColor={theme.colors.primary}
					imgRightSrc={null}
					imgLeftStyle={{ tintColor: 'white', width: 30, height: 30 }}
					imgLeftSrc={theme.images.general.support}
					onClick={props.onRightAction || goSupport} />)
				: null
			}
		</Wrapper>
	)
}

NavBar.defaultProps = {
	title: '',
	textAlign: 'center'
};

export default NavBar;
