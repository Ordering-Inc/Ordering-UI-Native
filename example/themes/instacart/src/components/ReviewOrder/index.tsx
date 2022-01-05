import React, { useState, useEffect, useCallback } from 'react'
import { OrderReview as ReviewOrderController, useLanguage, ToastType, useToast } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useForm, Controller } from 'react-hook-form'

import {
	ReviewOrderContainer,
	BusinessLogo,
	FormReviews,
	Category,
	Stars,
	BlockWrap,
	CommentItem
} from './styles'
import { OButton, OIcon, OInput, OText } from '../shared'
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import NavBar from '../NavBar'
import Spinner from 'react-native-loading-spinner-overlay'

import { ReviewOrderParams } from '../../types'
import { ProgressBar } from 'react-native-paper';
import { REVIEW_ORDER_COMMENTS } from '../../config/constants';
import TagSelector from '../TagSelector';
import OBottomStickBar from '../shared/OBottomStickBar';
import { Container } from '../../..';

export const ReviewOrderUI = (props: ReviewOrderParams) => {
	const {
		order,
		stars,
		handleChangeInput,
		handleChangeRating,
		handleSendReview,
		formState,
		navigation,
		orderComments,
		setStars,
	} = props

	const theme = useTheme();

	const styles = StyleSheet.create({
		inputTextArea: {
			borderColor: theme.colors.border,
			borderRadius: 7.6,
			marginVertical: 10,
			height: 100,
			alignItems: 'flex-start',
			paddingVertical: 12,
			fontSize: 10,
			marginBottom: 30
		},
		progress: {
			borderRadius: 5,
			height: 4,
			backgroundColor: theme.colors.backgroundGray200,
			marginVertical: 9,
		},
		progressLabel: {
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
	})

	const [, t] = useLanguage()
	const [, { showToast }] = useToast()
	const { handleSubmit, control, errors } = useForm()
	
	const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })

	const [curVal, setReviewVal] = useState(-1);
	const [curSuggest, setSuggest] = useState(orderComments?.map(({key, value}: any) => t(key, value)) || REVIEW_ORDER_COMMENTS?.map(({key, value}) => t(key, value)));
	const [selectedSuggest, setSelectedSuggest] = useState([]);
	const [comment, setComment] = useState('');

	const categories = {
		quality: { name: 'quality', show: t('QUALITY', 'Quality of Product') },
		punctuality: { name: 'punctiality', show: t('PUNCTUALITY', 'Punctuality') },
		service: { name: 'service', show: t('SERVICE', 'Service') },
		packaging: { name: 'packaging', show: t('PRODUCT_PACKAGING', 'Product Packaging') }
	}

	const scores = [
		{
			val: 0.5,
			color: theme.colors.strength_1,
			text: t('REVIEW_TERRIBLE', 'Terrible')
		},
		{
			val: 1.5,
			color: theme.colors.strength_2,
			text: t('REVIEW_BAD', 'Bad')
		},
		{
			val: 2.5,
			color: theme.colors.strength_3,
			text: t('REVIEW_OKAY', 'Okay')
		},
		{
			val: 3.7,
			color: theme.colors.strength_4,
			text: t('REVIEW_GOOD', 'Good')
		},
		{
			val: 5,
			color: theme.colors.strength_5,
			text: t('REVIEW_GREAT', 'Great')
		},
	]

	const getProgColor = () => {
		return scores.find(({val}) => val == curVal)?.color || theme.colors.textNormal;
	}

	const onSubmit = () => {
		if (Object.values(stars).some(value => value === 0)) {
			setAlertState({
				open: true,
				content: Object.values(categories).map((category, i) => stars[category.name] === 0 ? `- ${t('CATEGORY_ATLEAST_ONE', `${category.show} must be at least one point`).replace('CATEGORY', category.name.toUpperCase())} ${i !== 3 && '\n'}` : ' ')
			})
			return
		}
		handleSendReview()
		setAlertState({ ...alertState, success: true })
	}


	const timer = (ms: number) => new Promise(res => setTimeout(res, ms))

	const setStar = async (val: number) => { // We need to wrap the loop into an async function for this to work
		setReviewVal(val);
		const cats = Object.values(categories);
		for (var i = 0; i < cats.length; i++) {
			handleChangeRating({ target: { name: cats[i].name, value: val } });
			// console.log(`Index: ${i} ---- Value: ${val} --- Category: ${cats[i].name}`);
			await timer(1000);
		}
	}

	const handleChangeStars = async (val: number) => {
    if (val) {
			setStars({ 
				...stars, 
				quality: parseInt(val.toString()), 
				punctiality: parseInt(val.toString()), 
				service: parseInt(val.toString()), 
				packaging: parseInt(val.toString())
			})
			setReviewVal(val);
			// await setStar(val);
		} 
  }

	const onSuggestUpdate = useCallback((items) => {
		if (items.length > 0) {
			let selected: Array<never> = [];
			items.map(({label, checked}: never) => {
				if (checked === true) {
					selected.push(label);
				}
			});
			setSelectedSuggest(selected);
		}
	}, []);

	/**
	 * 
	 * @param type next type as 0: skip,1: continue
	 */
	const handleNext = (type: number) => {
		if (type === 1)	handleSubmit(onSubmit);
		navigation?.navigate('ReviewProduct', {	order: order });
	}

	useEffect(() => {
		if (formState.error && !formState?.loading) {
			showToast(ToastType.Error, formState.result)
		}
		if (!formState.loading && !formState.error && alertState.success) {
			showToast(ToastType.Success, t('REVIEW_SUCCESS_CONTENT', 'Thank you, Review successfully submitted!'))
			navigation?.navigate('ReviewProduct', {	order: order });
		}
	}, [formState.result])

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			// Convert all errors in one string to show in toast provider
			const list = Object.values(errors);
			let stringError = '';
			list.map((item: any, i: number) => {
				stringError +=
					i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
			});
			showToast(ToastType.Error, stringError);
		}
	}, [errors]);

	useEffect(() => {
		if (alertState.open) {
			alertState.content && showToast(
				ToastType.Error,
				alertState.content
			)
		}
	}, [alertState.content])
	
	useEffect(() => {
		setStars({ 
			...stars, 
			quality: 0, 
			punctiality: 0, 
			service: 0, 
			packaging: 0
		})
	}, [])


	const getStar = (star: number, index: number, category: string) => {
		switch (star) {
			case 0:
				return (
					<TouchableOpacity key={index} onPress={() => handleChangeRating({ target: { name: category, value: index + 1 } })}>
						<MaterialCommunityIcon name='star-outline' size={24} color={theme.colors.backgroundDark} />
					</TouchableOpacity>
				)
			case 1:
				return (
					<TouchableOpacity key={index} onPress={() => handleChangeRating({ target: { name: category, value: index + 1 } })}>
						<MaterialCommunityIcon name='star' size={24} color={theme.colors.primary} />
					</TouchableOpacity>
				)
		}
	}

	return (
		<>
		<Container>
			<ReviewOrderContainer>
				<NavBar
					title={t('REVIEW_ORDER', 'Review Order')}
					titleAlign={'center'}
					onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
					showCall={false}
					btnStyle={{ paddingLeft: 0 }}
					paddingTop={0}
					isVertical
					leftImg={theme.images.general.close}
					leftImageStyle={{width: 16}}
				/>
				<BusinessLogo>
					<OIcon url={order?.logo} width={72} height={72} style={{borderRadius: 7.6}} />
				</BusinessLogo>
				<View style={{ paddingBottom: 30 }}>
					<BlockWrap>
						<OText mBottom={10}>{t('HOW_WAS_YOUR_ORDER', 'How was your order?')}</OText>
						<ProgressBar
							progress={curVal / 5}
							color={getProgColor()}
							style={styles.progress}
						/>
						<View style={styles.progressLabel}>
							{scores.map(({ val, text, color }, idx) => 
								<TouchableOpacity key={idx} onPress={() => handleChangeStars(val)}>
									<OText
										size={10}
										color={
											curVal === val
												? color
												: theme.colors.backgroundGray400
										}>
										{text}
									</OText>
								</TouchableOpacity>
							)}
						</View>
					</BlockWrap>
					<BlockWrap>
						<OText mBottom={16}>{t('COMMENTS', 'Comments')}</OText>
						<View style={{flexShrink: 1}}>
							<TagSelector items={curSuggest} activeColor={theme.colors.primary} normalColor={'#E9ECEF'} onUpdated={onSuggestUpdate} />
						</View>
					</BlockWrap>
					<FormReviews>
						<OText mBottom={10}>{t('DO_YOU_WANT_TO_ADD_SOMETHING', 'Do you want to add something?')}</OText>
						<Controller
							control={control}
							defaultValue=''
							name='comments'
							render={({ onChange }: any) => (
								<OInput
									name='comments'
									placeholder={t('COMMENTS', 'Comments')}
									onChange={(val: string) => {
										onChange(val)
										handleChangeInput(val)
									}}
									style={styles.inputTextArea}
									multiline
									inputStyle={{fontSize: 12}}
								/>
							)}
						/>
					</FormReviews>
				</View>
				<Spinner visible={formState.loading} />
			</ReviewOrderContainer>
		</Container>
		<OBottomStickBar 
			rightBtnStyle={{borderRadius: 7.6, height: 44}} 
			rightAction={() => handleNext(0)}
			leftAction={() => handleNext(1)}
		/>
		</>
	)
}


export const ReviewOrder = (props: ReviewOrderParams) => {
	const reviewOrderProps = {
		...props,
		UIComponent: ReviewOrderUI
	}
	return <ReviewOrderController {...reviewOrderProps} />
}
