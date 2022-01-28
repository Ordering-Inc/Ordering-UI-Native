import React, { useEffect, useState } from 'react'
import { Messages as MessagesController, useSession, useUtils, useLanguage, ToastType, useToast } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { launchImageLibrary } from 'react-native-image-picker'
import { GiftedChat, Actions, ActionsProps, InputToolbar, Composer, Send, Bubble, MessageImage, InputToolbarProps, ComposerProps } from 'react-native-gifted-chat'
import { USER_TYPE } from '../../config/constants'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { OIcon, OIconButton, OText, OButton } from '../shared'
import { TouchableOpacity, ActivityIndicator, StyleSheet, View, Platform, Keyboard } from 'react-native'
import { Header, TitleHeader, Wrapper, QuickMessageContainer, ProfileMessageHeader } from './styles'
import { MessagesParams } from '../../types'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const MessagesUI = (props: MessagesParams) => {
	const {
		type,
		order,
		messages,
		image,
		message,
		messagesToShow,
		sendMessage,
		setCanRead,
		setMessage,
		handleSend,
		setImage,
		readMessages,
		onClose,
		business,
		driver,
		onMessages,
		isMeesageListing
	} = props

	const [{ user }] = useSession()
	const [{ parseDate }] = useUtils()
	const [, t] = useLanguage()
	const [, { showToast }] = useToast();

	const [formattedMessages, setFormattedMessages] = useState<Array<any>>([])
	const [isKeyboardShow, setIsKeyboardShow] = useState(false)
	const previousStatus = [1, 2, 5, 6, 10, 11, 12, 16, 17]
	const chatDisabled = previousStatus.includes(order?.status)
	const { height } = useWindowDimensions();
	const { top, bottom } = useSafeAreaInsets();

	const theme = useTheme();

	const quickMessageList = [
		{ key: 'customer_message_1', text: t('CUSTOMER_MESSAGE_1', 'Lorem ipsum 1') },
		{ key: 'customer_message_2', text: t('CUSTOMER_MESSAGE_2', 'Lorem ipsum 2') },
		{ key: 'customer_message_3', text: t('CUSTOMER_MESSAGE_3', 'Lorem ipsum 3') },
		{ key: 'customer_message_4', text: t('CUSTOMER_MESSAGE_4', 'Lorem ipsum 4') }
	]

	const handleClickQuickMessage = (text: string) => {
		setMessage && setMessage(`${message}${text}`)
	}

	const onChangeMessage = (val: string) => {
		setMessage && setMessage(val)
	}

	const removeImage = () => {
		setImage && setImage(null)
	}

	const handleImagePicker = () => {
		launchImageLibrary({ mediaType: 'photo', maxHeight: 300, maxWidth: 300, includeBase64: true }, (response: any) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.errorMessage) {
				console.log('ImagePicker Error: ', response.errorMessage);
				showToast(ToastType.Error, response.errorMessage);
			} else {
				if (Platform.OS === 'ios') {
					if (response.uri) {
						const url = `data:${response.type};base64,${response.base64}`
						setImage && setImage(url);
					} else {
						showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
					}
				} else {
					if (response?.assets?.length > 0) {
						const image = response?.assets[0]
						const url = `data:${image.type};base64,${image.base64}`
						setImage && setImage(url);
					} else {
						showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
					}
				}
			}
		});
	};

	const getStatus = (status: number) => {

		switch (status) {
			case 0:
				return 'ORDER_STATUS_PENDING'
			case 1:
				return 'ORDERS_COMPLETED'
			case 2:
				return 'ORDER_REJECTED'
			case 3:
				return 'ORDER_STATUS_IN_BUSINESS'
			case 4:
				return 'ORDER_READY'
			case 5:
				return 'ORDER_REJECTED_RESTAURANT'
			case 6:
				return 'ORDER_STATUS_CANCELLEDBYDRIVER'
			case 7:
				return 'ORDER_STATUS_ACCEPTEDBYRESTAURANT'
			case 8:
				return 'ORDER_CONFIRMED_ACCEPTED_BY_DRIVER'
			case 9:
				return 'ORDER_PICKUP_COMPLETED_BY_DRIVER'
			case 10:
				return 'ORDER_PICKUP_FAILED_BY_DRIVER'
			case 11:
				return 'ORDER_DELIVERY_COMPLETED_BY_DRIVER'
			case 12:
				return 'ORDER_DELIVERY_FAILED_BY_DRIVER'
			case 13:
				return 'PREORDER'
			case 14:
				return 'ORDER_NOT_READY'
			case 15:
				return 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER'
			case 16:
				return 'ORDER_STATUS_CANCELLED_BY_CUSTOMER'
			case 17:
				return 'ORDER_NOT_PICKEDUP_BY_CUSTOMER'
			case 18:
				return 'ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS'
			case 19:
				return 'ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER'
			case 20:
				return 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS'
			case 21:
				return 'ORDER_CUSTOMER_ARRIVED_BUSINESS'
			default:
				return status
		}
	}

	const onSubmit = (values: any) => {
		handleSend && handleSend()
		setImage && setImage(null)
		setMessage && setMessage('')
	}

	const messageConsole = (message: any) => {
		return message.change?.attribute !== 'driver_id'
			?
			`${t('ORDER', 'Order')} ${message.change.attribute} ${t('CHANGED_FROM', 'Changed from')} ${message.change.old !== null && t(getStatus(parseInt(message.change.old, 10)))} ${t('TO', 'to')} ${t(getStatus(parseInt(message.change.new, 10)))}`
			: message.change.new
				?
				`${message.driver?.name} ${message.driver?.lastname !== null ? message.driver.lastname : ''} ${t('WAS_ASSIGNED_AS_DRIVER', 'Was assigned as driver')} ${message.comment ? message.comment.length : ''}`
				:
				`${t('DRIVER_UNASSIGNED', 'Driver unassigned')}`
	}

	useEffect(() => {
		let newMessages: Array<any> = []
		const _console = `${t('ORDER_PLACED_FOR', 'Order placed for')} ${parseDate(order?.created_at)} ${t('VIA', 'Via')} ${order?.app_id ? t(order?.app_id.toUpperCase(), order?.app_id) : t('OTHER', 'Other')}`
		const firstMessage = {
			_id: 0,
			text: _console,
			createdAt: order?.created_at,
			system: true
		}
		const newMessage: any = [];
		messages.messages.map((message: any) => {
			if (business && message.type !== 0 && (messagesToShow?.messages?.length || message?.can_see?.includes('2'))) {
				newMessage.push({
					_id: message?.id,
					text: message.type === 1 ? messageConsole(message) : message.comment,
					createdAt: message.type !== 0 && message.created_at,
					image: message.source,
					system: message.type === 1,
					user: {
						_id: message.author.id,
						name: message.author.name,
						avatar: message.author.id !== user.id && type === USER_TYPE.DRIVER ? order?.driver?.photo : order?.business?.logo
					}
				});
			}

			if (driver && message.type !== 0 && (messagesToShow?.messages?.length || message?.can_see?.includes('4'))) {
				newMessage.push({
					_id: message?.id,
					text: message.type === 1 ? messageConsole(message) : message.comment,
					createdAt: message.type !== 0 && message.created_at,
					image: message.source,
					system: message.type === 1,
					user: {
						_id: message.author.id,
						name: message.author.name,
						avatar: message.author.id !== user.id && type === USER_TYPE.DRIVER ? order?.driver?.photo : order?.business?.logo
					}
				});
			}

			if (message.type === 0) {
				newMessage.push(firstMessage);
			}
		})
		setFormattedMessages(newMessage.reverse())
	}, [messages.messages.length, business, driver])

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
			setIsKeyboardShow(true)
		})
		const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
			setIsKeyboardShow(false)
		})
		return () => {
			keyboardDidShowListener.remove()
			keyboardDidHideListener.remove()
		}
	}, [])

	useEffect(() => {
		if (business) setCanRead({ business: true, administrator: true, customer: true, driver: false })
		else if (driver) setCanRead({ business: false, administrator: true, customer: true, driver: true })
	}, [business, driver])

	const RenderActions = (props: any) => {
		return (
			<Actions
				{...props}
				options={{
					'Send Image': () => handleImagePicker(),
				}}
				containerStyle={styles.containerActions}
				optionTintColor='#222845'
				icon={() => (
					<>
						<OIconButton
							borderColor={theme.colors.white}
							style={{ width: 32, height: 44, borderRadius: 10, backgroundColor: theme.colors.clear, borderColor: theme.colors.clear }}
							icon={image ? { uri: image } : theme.images.general.image}
							iconStyle={{ borderRadius: image ? 10 : 0, width: image ? 32 : 16, height: image ? 32 : 16 }}
							onClick={handleImagePicker}
							iconCover
						/>
						{image && (
							<TouchableOpacity
								style={{ position: 'absolute', top: -5, right: -5, borderColor: theme.colors.backgroundDark, backgroundColor: theme.colors.white, borderRadius: 25 }}
								onPress={() => removeImage()}
							>
								<MaterialCommunityIcon name='close-circle-outline' color={theme.colors.backgroundDark} size={24} />
							</TouchableOpacity>
						)}
					</>
				)}
			/>
		)
	}

	const renderAccessory = () => {
		return (
			<QuickMessageContainer
				style={{
					marginLeft: 10,
					marginBottom: 10
				}}
				contentContainerStyle={{
					alignItems: 'center',
				}}
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{quickMessageList.map((quickMessage, i) => (
					<OButton
						key={i}
						text={quickMessage.text}
						bgColor='#E9ECEF'
						borderColor='#E9ECEF'
						imgRightSrc={null}
						textStyle={{
							fontSize: 11,
							lineHeight: 16,
							color: '#414954'
						}}
						style={{ ...styles.editButton }}
						onClick={() => handleClickQuickMessage(quickMessage.text)}
					/>
				))}
			</QuickMessageContainer>
		)
	}

	const renderInputToolbar = (props: typeof InputToolbarProps) => (
		<InputToolbar
			{...props}
			containerStyle={{
				padding: Platform.OS === 'ios' && isKeyboardShow ? 0 : 10,
				flexDirection: 'column-reverse'
			}}
			primaryStyle={{ alignItems: 'center', justifyContent: 'flex-start' }}
			renderAccessory={() => renderAccessory()}
		/>
	)

	const renderComposer = (props: typeof ComposerProps) => (
		chatDisabled ? (
			<View
				style={{
					width: '100%',
					flexDirection: 'column',
					alignItems: 'center'
				}}
			>
				<MaterialCommunityIcon
					name='close-octagon-outline'
					size={24}
				/>
				<OText size={14}>{t('NOT_SEND_MESSAGES', 'You can\'t send messages because the order has ended')}</OText>
			</View>
		) : (
			<View style={{
				flexDirection: 'row', width: '80%', alignItems: 'center', backgroundColor: theme.colors.backgroundGray100,
				borderRadius: 7.6,
			}}>
				<Composer
					{...props}
					textInputStyle={{
						height: 32,
						minHeight: 32,
						alignItems: 'center',
						justifyContent: 'center',
						paddingHorizontal: 12,
						borderColor: '#DBDCDB',
						color: '#010300',
					}}
					textInputProps={{
						value: message,
						onSubmitEditing: onSubmit,
						returnKeyType: message ? 'send' : 'done',
						blurOnSubmit: true,
						multiline: false,
						numberOfLines: 1,
						autoCorrect: false,
						autoCompleteType: 'off',
						enablesReturnKeyAutomatically: false
					}}
					placeholder={t('WRITE_MESSAGE', 'Write message...')}
				/>
				<RenderActions {...props} />
			</View>
		)
	)

	const renderSend = (props: any) => (
		<Send
			{...props}
			disabled={(sendMessage?.loading || (message === '' && !image) || messages?.loading)}
			alwaysShowSend
			containerStyle={styles.containerSend}
		>
			<OIconButton
				onClick={onSubmit}
				style={{
					height: 44,
					width: 44,
					borderRadius: 7.6,
					opacity: (sendMessage?.loading || (message === '' && !image) || messages?.loading) ? 0.4 : 1,
					borderColor: theme.colors.primary,
					backgroundColor: theme.colors.primary,
				}}
				iconStyle={{ marginTop: 3, marginRight: 2 }}
				icon={theme.images.general.enter}
				disabled={(sendMessage?.loading || (message === '' && !image) || messages?.loading)}
				disabledColor={theme.colors.white}
			/>
		</Send>
	)

	const renderBubble = (props: any) => (
		<Bubble
			{...props}
			textStyle={{
				left: {},
				right: { color: theme.colors.white }
			}}
			containerStyle={{
				left: { marginVertical: 5, borderBottomRightRadius: 7.6 },
				right: { marginVertical: 5, borderBottomRightRadius: 7.6 }
			}}
			wrapperStyle={{
				left: { backgroundColor: '#f7f7f7', padding: 5, borderBottomLeftRadius: 0 },
				right: { backgroundColor: theme.colors.primary, padding: 5, borderBottomRightRadius: 0 }
			}}
		/>
	)

	const renderMessageImage = (props: any) => (
		<MessageImage
			{...props}
		/>
	)

	const renderScrollToBottomComponent = () => (
		<MaterialCommunityIcon name='chevron-double-down' size={32} />
	)

	const getViewHeight = () => {
		if (Platform.OS === 'android') {
			return height - top - bottom - (isKeyboardShow ? 300 : 24);
		} else {
			return height - top - bottom - 10;
		}
	}

	return (
		<View style={{ height: getViewHeight(), width: '100%', paddingTop: 12, backgroundColor: 'white' }}>
			<Wrapper>
				{!isMeesageListing ? (
					<Header>
						<OIconButton icon={theme.images.general.arrow_left} style={{ paddingStart: 10, borderColor: theme.colors.clear }} onClick={onClose} />
						<View style={{ marginRight: 10, shadowColor: theme.colors.black, shadowOpacity: 0.1, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2 }}>
							<OIcon
								url={type === USER_TYPE.DRIVER ? order?.driver?.photo : order?.business?.logo}
								width={32}
								height={32}
								style={{ borderRadius: 7.6 }}
							/>
						</View>
						<TitleHeader>
							<OText size={14} lineHeight={21} weight={'600'}>{type === USER_TYPE.DRIVER ? order?.driver?.name : order?.business?.name}</OText>
							<OText size={12} color={theme.colors.textSecondary}>{type === USER_TYPE.DRIVER ? t('DRIVER', 'Driver') : t('BUSINESS', 'Business')}</OText>
						</TitleHeader>
					</Header>
				) : (
					<ProfileMessageHeader>
						<View style={{ ...styles.headerTitle }}>
							<TouchableOpacity
								style={styles.headerItem}
								onPress={onClose}>
								<OIcon src={theme.images.general.arrow_left} width={16} />
							</TouchableOpacity>
							<OText size={18}>{t('ORDER', theme?.defaultLanguages?.ORDER || 'Order')} #{order?.id}</OText>
						</View>
						<View style={{ ...styles.typeWraper }}>
							{order.business && (
								<TouchableOpacity
									onPress={() => onMessages({ business: true, driver: false })}
								>
									<MessageTypeItem
										active={business}
									>
										<OIcon
											url={order?.business?.logo}
											width={32}
											height={32}
											style={{ borderRadius: 32 }}
										/>
									</MessageTypeItem>
								</TouchableOpacity>
							)}

							{order?.driver && (
								<TouchableOpacity
									onPress={() => onMessages({ business: false, driver: true })}
								>
									<MessageTypeItem
										active={driver}
									>
										<OIcon
											url={order?.driver?.photo}
											width={32}
											height={32}
											style={{ borderRadius: 32 }}
										/>
									</MessageTypeItem>
								</TouchableOpacity>
							)}
						</View>
					</ProfileMessageHeader>
				)}
				<GiftedChat
					messages={formattedMessages}
					user={{
						_id: user.id,
						name: user.name,
						avatar: user.photo
					}}
					onSend={onSubmit}
					onInputTextChanged={onChangeMessage}
					alignTop
					scrollToBottom
					renderAvatarOnTop
					renderUsernameOnMessage
					renderInputToolbar={renderInputToolbar}
					renderComposer={renderComposer}
					renderSend={renderSend}
					renderBubble={renderBubble}
					renderMessageImage={renderMessageImage}
					scrollToBottomComponent={() => renderScrollToBottomComponent()}
					messagesContainerStyle={{
						paddingTop: 18,
						paddingHorizontal: 28,
						paddingBottom: 55
					}}
					isLoadingEarlier={messages.loading}
					renderLoading={() => <ActivityIndicator size="small" color="#000" />}
					keyboardShouldPersistTaps='handled'
				/>
			</Wrapper>
		</View>
	)
}

const styles = StyleSheet.create({
	containerActions: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 4,
		marginBottom: 0,
	},
	containerSend: {
		width: 64,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 4
	},
	editButton: {
		borderRadius: 50,
		backgroundColor: '#E9ECEF',
		marginRight: 10,
		height: 24,
		borderWidth: 1,
		paddingLeft: 0,
		paddingRight: 0
	},
	headerTitle: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	headerItem: {
		overflow: 'hidden',
		width: 35,
		marginVertical: 18,
	},
	typeWraper: {
		flexDirection: 'row',
		height: 45,
		alignItems: 'center'
	}

})

export const Messages = (props: MessagesParams) => {
	const MessagesProps = {
		...props,
		UIComponent: MessagesUI
	}
	return <MessagesController {...MessagesProps} />
}
