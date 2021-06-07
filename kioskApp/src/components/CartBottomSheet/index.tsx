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


						<CartItem
							name="Product name #1"
							price={20.29}
							quantity={1}
							image={DELIVERY_TYPE_IMAGES.eatIn}
							onEdit={() => {}}
							onDecrease={() => {}}
							onIncrease={() => {}}
						/>

						<CartItem
							name="Product name #2"
							price={8.97}
							quantity={1}
							image={DELIVERY_TYPE_IMAGES.takeOut}
							onEdit={() => {}}
							onDecrease={() => {}}
							onIncrease={() => {}}
						/>

						<CartItem
							name="Product name #3"
							price={23.49}
							quantity={1}
							image={DELIVERY_TYPE_IMAGES.eatIn}
							onEdit={() => {}}
							onDecrease={() => {}}
							onIncrease={() => {}}
						/>

						<CartItem
							name="Product name #4"
							price={10.99}
							quantity={1}
							image={DELIVERY_TYPE_IMAGES.takeOut}
							onEdit={() => {}}
							onDecrease={() => {}}
							onIncrease={() => {}}
						/>

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
					source={props.image}
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
						{props.name}
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
						onClick={props.onEdit}
					/>
				</View>
			</View>
			
			<View style={{ alignItems: "flex-end" }} >
				<OText
					size={_dim.width * 0.025}
					weight="700"
					color={colors.primary}
				>
					{`$${props.price}`}
				</OText>

				<OText
					size={_dim.width * 0.023}
					weight="500"
				>
					{`${props.quantity}`}
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
	image: string | { uri: string; };
	name: string;
	price: number;
	quantity: number;
	onEdit: () => void;
	onIncrease: () => void;
	onDecrease: () => void;
}

export default CartBottomSheet;
