import React, { useState, useEffect } from 'react'
import { OrderReview as ReviewOrderController, useLanguage, ToastType, useToast } from 'ordering-components/native'
import { useForm, Controller } from 'react-hook-form'

import {
	ReviewOrderContainer,
	FormReviews,
	Category,
	Stars
} from './styles'
import { OButton, OIcon, OInput, OText } from '../shared'
import { TouchableOpacity, StyleSheet, View, TextStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

import NavBar from '../NavBar'
import Spinner from 'react-native-loading-spinner-overlay'

import { ReviewOrderParams } from '../../types'
import moment from 'moment'

export const ReviewOrderUI = (props: ReviewOrderParams) => {
	const {
		order,
		stars,
		handleChangeInput,
		handleChangeRating,
		handleSendReview,
		formState,
		navigation
	} = props
	const theme = useTheme();

	const styles = StyleSheet.create({
		inputTextArea: {
			borderColor: theme.colors.clear,
			borderRadius: 7.6,
			marginVertical: 20,
			height: 100,
			alignItems: 'flex-start'
		}
	})

	const [, t] = useLanguage()
	const [, { showToast }] = useToast()
	const { handleSubmit, control, errors } = useForm()

	const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })

	const categories = {
		quality: { name: 'quality', show: t('QUALITY', 'Quality of Product') },
		punctuality: { name: 'punctiality', show: t('PUNCTUALITY', 'Punctuality') },
		service: { name: 'service', show: t('SERVICE', 'Service') },
		packaging: { name: 'packaging', show: t('PRODUCT_PACKAGING', 'Product Packaging') }
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

	const getStarArr = (rating: number) => {
		switch (rating) {
			case 0:
				return [0, 0, 0, 0, 0];
			case 1:
				return [1, 0, 0, 0, 0];
			case 2:
				return [1, 1, 0, 0, 0];
			case 3:
				return [1, 1, 1, 0, 0];
			case 4:
				return [1, 1, 1, 1, 0];
			case 5:
				return [1, 1, 1, 1, 1];
			default:
				return [0, 0, 0, 0, 0];
		}
	}

	useEffect(() => {
		if (formState.error && !formState?.loading) {
			showToast(ToastType.Error, formState.result)
		}
		if (!formState.loading && !formState.error && alertState.success) {
			showToast(ToastType.Success, t('REVIEW_SUCCESS_CONTENT', 'Thank you, Review successfully submitted!'))
			navigation?.canGoBack() && navigation.goBack()
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


	const getStar = (star: number, index: number, category: string) => {
		switch (star) {
			case 0:
				return (
					<TouchableOpacity key={index} onPress={() => handleChangeRating({ target: { name: category, value: index + 1 } })}>
						<OIcon src={theme.images.general.star} color={theme.colors.backgroundGray} width={30} />
					</TouchableOpacity>
				)
			case 1:
				return (
					<TouchableOpacity key={index} onPress={() => handleChangeRating({ target: { name: category, value: index + 1 } })}>
						<OIcon src={theme.images.general.star} color={theme.colors.primary} width={30} />
					</TouchableOpacity>
				)
		}
	}

	return (
		<>
			<NavBar
				title={t('RATE_YOUR_DELIVERY', 'Rate your Delivery')}
				subTitle={<OText size={10} style={{ textAlign: 'center' }}>{moment().format('MMM D, yyyy')}</OText>}
				titleAlign={'center'}
				onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
				rightImg={null}
				btnStyle={{ paddingLeft: 0 }}
				paddingTop={0}
			/>
			<ReviewOrderContainer>
				{/* <BusinessLogo>
					<OIcon url={order?.logo} width={100} height={100} />
				</BusinessLogo> */}
				<View style={{ flex: 1, justifyContent: 'flex-end' }}>

					<FormReviews>
						{Object.values(categories).map(category => (
							<Category key={category.name}>
								<OText>{category.show}</OText>
								<Stars>
									{getStarArr(stars[category?.name]).map((star, index) => getStar(star, index, category.name))}
								</Stars>
							</Category>
						))}
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
									bgColor={theme.colors.inputDisabled}
								/>
							)}
						/>
					</FormReviews>
					<OButton
						textStyle={{ color: theme.colors.white, ...theme.labels.middle } as TextStyle}
						style={{ marginTop: 20, height: 40, shadowOpacity: 0 }}
						text={t('SUBMIT', 'Submit')}
						imgRightSrc=''
						onClick={handleSubmit(onSubmit)}
					/>
				</View>
				<Spinner visible={formState.loading} />
			</ReviewOrderContainer>
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
