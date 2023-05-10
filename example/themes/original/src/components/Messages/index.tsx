import React, { useEffect, useState } from 'react'
import Clipboard from '@react-native-clipboard/clipboard';
import { Messages as MessagesController, useSession, useUtils, useLanguage, ToastType, useToast } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { launchImageLibrary } from 'react-native-image-picker'
import { GiftedChat, Actions, ActionsProps, InputToolbar, Composer, Send, Bubble, MessageImage, InputToolbarProps, ComposerProps } from 'react-native-gifted-chat'
import { USER_TYPE } from '../../config/constants'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { OIcon, OIconButton, OText, OButton } from '../shared'
import { TouchableOpacity, ActivityIndicator, StyleSheet, View, Platform, Keyboard } from 'react-native'
import { Header, TitleHeader, Wrapper, QuickMessageContainer, ProfileMessageHeader, MessageTypeItem } from './styles'
import { MessagesParams } from '../../types'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getLogisticTag } from '../../utils'

const ORDER_STATUS: any = {
	0: 'ORDER_STATUS_PENDING',
	1: 'ORDERS_COMPLETED',
	2: 'ORDER_REJECTED',
	3: 'ORDER_STATUS_IN_BUSINESS',
	4: 'ORDER_READY',
	5: 'ORDER_REJECTED_RESTAURANT',
	6: 'ORDER_STATUS_CANCELLEDBYDRIVER',
	7: 'ORDER_STATUS_ACCEPTEDBYRESTAURANT',
	8: 'ORDER_CONFIRMED_ACCEPTED_BY_DRIVER',
	9: 'ORDER_PICKUP_COMPLETED_BY_DRIVER',
	10: 'ORDER_PICKUP_FAILED_BY_DRIVER',
	11: 'ORDER_DELIVERY_COMPLETED_BY_DRIVER',
	12: 'ORDER_DELIVERY_FAILED_BY_DRIVER',
	13: 'PREORDER',
	14: 'ORDER_NOT_READY',
	15: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
	16: 'ORDER_STATUS_CANCELLED_BY_CUSTOMER',
	17: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
	18: 'ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS',
	19: 'ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER',
	20: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
	21: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
	22: 'ORDER_LOOKING_FOR_DRIVER',
	23: 'ORDER_DRIVER_ON_WAY'
}

const filterSpecialStatus = ['prepared_in', 'delivered_in', 'delivery_datetime']


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
		launchImageLibrary({ mediaType: 'photo', maxHeight: 2048, maxWidth: 2048, includeBase64: true }, (response: any) => {
			if (response?.didCancel) {
				showToast(ToastType.Error, t('IMAGE_CANCELLED', 'User cancelled image picker'));
			} else if (response?.errorMessage) {
				showToast(ToastType.Error, response.errorMessage);
			} else {
				if (response?.assets?.length > 0) {
					const image = response?.assets[0]
					const url = `data:${image.type};base64,${image.base64}`
					setImage && setImage(url);
				} else {
					showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
				}
			}
		});
	};

	const onSubmit = (values: any) => {
		handleSend && handleSend()
		setImage && setImage(null)
		setMessage && setMessage('')
	}

	const messageConsole = (message: any) => {
		return message.change?.attribute !== 'driver_id'
			?
			`${t('ORDER', 'Order')} ${t(message.change.attribute.toUpperCase(), message.change.attribute.replace('_', ' '))} ${t('CHANGED_FROM', 'Changed from')} ${filterSpecialStatus.includes(message.change.attribute)
        ? `${message.change.old === null ? '0' : message.change.old} ${t('TO', 'to')} ${message.change.new} ${t('MINUTES', 'Minutes')}`
        : `${message.change?.attribute !== 'logistic_status'
          ? message.change.old !== null && t(ORDER_STATUS[parseInt(message.change.old, 10)])
          : message.change.old !== null && getLogisticTag(message.change.old)} ${t('TO', 'to')} ${message.change?.attribute !== 'logistic_status'
            ? t(ORDER_STATUS[parseInt(message.change.new, 10)])
            : getLogisticTag(message.change.new)}`
			}`
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
			createdAt: parseDate(order?.created_at, { outputFormat: 'YYYY-MM-DD HH:mm:ss' }),
			system: true
		}
		const newMessage: any = [];
		messages.messages.map((message: any) => {
			if (business && message.type !== 0 && (messagesToShow?.messages?.length || message?.can_see?.includes('2'))) {
				newMessage.push({
					_id: message?.id,
					text: message.type === 1 ? messageConsole(message) : message.comment,
					createdAt: message.type !== 0 && parseDate(message?.created_at, { outputFormat: 'YYYY-MM-DD HH:mm:ss' }),
					image: message.source,
					system: message.type === 1,
					user: {
						_id: message.author && message.author.id,
						name: message.author && message.author.name,
						avatar: message.author && (message.author.id !== user.id && type === USER_TYPE.DRIVER ? order?.driver?.photo : order?.business?.logo)
					}
				});
			}

			if (driver && message.type !== 0 && (messagesToShow?.messages?.length || message?.can_see?.includes('4'))) {
				newMessage.push({
					_id: message?.id,
					text: message.type === 1 ? messageConsole(message) : message.comment,
					createdAt: message.type !== 0 && parseDate(message?.created_at, { outputFormat: 'YYYY-MM-DD HH:mm:ss' }),
					image: message.source,
					system: message.type === 1,
					user: {
						_id: message.author && message.author.id,
						name: message.author && message.author.name,
						avatar: message.author && (message.author.id !== user.id && type === USER_TYPE.DRIVER ? order?.driver?.photo : order?.business?.logo)
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
		const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => {
			setIsKeyboardShow(false)
		})
		return () => {
			keyboardDidShowListener.remove()
			keyboardDidHideListener.remove()
			keyboardWillHideListener.remove()
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
								onPress={removeImage}
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
			!chatDisabled &&
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

	const renderSend = (props: any) => {
		const isDisabled = (sendMessage?.loading || (message === '' && !image) || messages?.loading)
		return (
			<Send
				{...props}
				disabled={isDisabled}
				alwaysShowSend
				containerStyle={styles.containerSend}
			>
				<OIconButton
					onClick={onSubmit}
					style={{
						height: 44,
						width: 44,
						borderRadius: 7.6,
						opacity: isDisabled ? 0.2 : 1,
						borderColor: isDisabled ? theme.colors.secondary : theme.colors.primary,
						backgroundColor: isDisabled ? theme.colors.secondary : theme.colors.primary,
					}}
					iconStyle={{ marginTop: 3, marginRight: 2 }}
					icon={theme.images.general.enter}
					iconColor={isDisabled ? '#000' : '#fff'}
					disabled={isDisabled}
					disabledColor={theme.colors.secondary}
				/>
			</Send>
		)
	}

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
			return '100%';
		} else {
			return height - top - bottom - (isKeyboardShow ? 48 : 0);
		}
	}

	const onLongPress = (context: any, message: any) => {
		const options = [
			t('COPY_TEXT', 'Copy text'),
			t('CANCEL', 'Cancel'),
		];
		const cancelButtonIndex = options.length - 1;
		context.actionSheet().showActionSheetWithOptions({
			options,
			cancelButtonIndex
		}, (buttonIndex: any) => buttonIndex === 0 && Clipboard.setString(message.text)
		);
	}

	useEffect(() => {
		if (!order?.id || messages?.loading) return
		readMessages && readMessages()
	}, [order?.id, messages?.loading])

	return (
		<View style={{ height: getViewHeight(), width: '100%', paddingTop: 12, backgroundColor: 'white' }}>
			<Wrapper>
				{!isMeesageListing ? (
					<Header>
						<TouchableOpacity onPress={onClose} style={{ paddingStart: 10, borderColor: theme.colors.clear }}>
							<AntDesignIcon name='arrowleft' size={26} />
						</TouchableOpacity>
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
							<TouchableOpacity onPress={onClose} style={styles.headerItem}>
								<AntDesignIcon name='arrowleft' size={26} />
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
					onLongPress={(context: any, message: any) => onLongPress(context, message)}
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
	const [allMessages, setAllMessages] = useState(props.messages)

	useEffect(() => {
		setAllMessages(props.messages)
	}, [props.messages])

	const MessagesProps = {
		...props,
		UIComponent: MessagesUI,
		messages: allMessages,
		setMessages: (values: any) => {
			props.setMessages && props.setMessages(values)
			setAllMessages(values)
		}
	}
	return <MessagesController {...MessagesProps} />
}
