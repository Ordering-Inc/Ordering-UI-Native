import React from 'react';
import { Dimensions, View, TouchableOpacity } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useLanguage } from 'ordering-components/native';

import { colors } from '../../theme.json';
import { OButton, OImage, OText } from '../shared';
import {
	StyledBottomContent,
	StyledCartItem,
	StyledContent,
	StyledTopBar,
} from './styles';
import { DELIVERY_TYPE_IMAGES, IMAGES } from '../../config/constants';

const _dim = Dimensions.get('window');

const CartBottomSheet = (props: Props): React.ReactElement => {

	const [, t] = useLanguage();

	return (
		<>
			{props.children}

			<RBSheet
				ref={props.refRBSheet}
        closeOnDragDown={false}
				height={_dim.height * 0.5}
        customStyles={{
					wrapper: {
						backgroundColor: "rgba(0,0,0,0.5)"
          },
        }}
      >
				<View>
					<StyledContent>
						<TopBar/>
						
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />
						<CartItem />

					</StyledContent>

					<StyledBottomContent>
						<OButton
							text={t('CONFIRM THIS ORDER', 'Confirm this ${{price}} order')}
							onClick={() => {
								console.log('Confirm order')
							}}
						/>
					</StyledBottomContent>
				</View>
      </RBSheet>
		</>
	);
}

const TopBar = (props:any) => {
	const [, t] = useLanguage();

	return (
		<StyledTopBar>
			<View>
				<OText
					size={_dim.width * 0.026}
					weight="700"
					mBottom={4}
				>
					{t('YOUR_ORDER', 'your order')}
				</OText>
				<OText
					size={_dim.width * 0.023}
					weight="500"
					color={colors.mediumGray}
				>
					{t('TAKE_OUT', 'Take out')}
				</OText>
			</View>

			<TouchableOpacity
				onPress={() => {
					console.log('cancel order')
				}}
			>
				<View>
					<OText
						size={_dim.width * 0.024}
						weight="500"
						color={colors.primary}
					>
						{t('CANCEL_ORDER', 'Cancel order')}
					</OText>
				</View>
			</TouchableOpacity>
		</StyledTopBar>
	);
}

const CartItem = (props: CartItemProps) => {
	const [, t] = useLanguage();

	return (
		<StyledCartItem>
			<View style={{ flexDirection: 'row' }}>
				<OImage
					source={DELIVERY_TYPE_IMAGES.eatIn}
					height={60}
					width={60}
					resizeMode="cover"
					borderRadius={6}
				/>

				<View style={{ flexDirection: 'column', justifyContent: 'space-evenly', marginHorizontal: 15 }}>
					<OText
						size={_dim.width * 0.025}
						weight="700"
					>
						full product name
					</OText>

					<OButton
						bgColor="transparent"
						borderColor="transparent"
						imgLeftSrc={IMAGES.edit}
						text={t('EDIT', 'Edit')}
						style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
						textStyle={{
							color: colors.primary,
							marginLeft: 6,
						}}
						onClick={() => {
							console.log('edit')
						}}
					/>
				</View>
			</View>
			
			<View style={{ alignItems: "flex-end" }} >
				<OText
					size={_dim.width * 0.025}
					weight="700"
					color={colors.primary}
				>
					$12.99
				</OText>

				<OText
					size={_dim.width * 0.023}
					weight="500"
				>
					- 1 +
				</OText>
			</View>
		</StyledCartItem>
	);
}

interface Props {
	refRBSheet: React.RefObject<any>;
	children: any;
}

interface CartItemProps {
	
}

export default CartBottomSheet;
