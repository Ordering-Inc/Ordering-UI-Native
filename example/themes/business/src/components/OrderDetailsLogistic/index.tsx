//React & React Native
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

// Thirds
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';

//OrderingComponent
import {
    useLanguage,
    OrderDetails as OrderDetailsConTableoller,
    useSession,
} from 'ordering-components/native';

//Components
import Alert from '../../providers/AlertProvider';
import { FloatingButton } from '../FloatingButton';
import { OrderDetailsLogisticParams } from '../../types';
import { useTheme } from 'styled-components/native';
import { NotFoundSource } from '../NotFoundSource';
import { getOrderStatus } from '../../utils';
import { OrderHeaderComponent } from '../OrderDetails/OrderHeaderComponent';
import { OrderContentComponent } from '../OrderDetails/OrderContentComponent';
//Styles
import { OrderDetailsContainer } from './styles';

export const OrderDetailsLogisticUI = (props: OrderDetailsLogisticParams) => {
    const {
        navigation,
        handleClickLogisticOrder,
        orderAssingId,
    } = props;
    const { order } = props.order
    const theme = useTheme();
    const [, t] = useLanguage();
    const [session] = useSession();
    const [alertState, setAlertState] = useState<{
        open: boolean;
        content: Array<string>;
        key?: string | null;
    }>({ open: false, content: [], key: null });

    const logisticOrderStatus = [4, 6, 7]

    const showFloatButtonsAcceptOrReject: any = {
        0: true,
        4: true,
        7: true,
        14: true
    };

    const handleArrowBack: any = () => {
        navigation?.canGoBack() && navigation.goBack();
    };

    const handleRejectLogisticOrder = (order: any) => {
        handleClickLogisticOrder?.(2, orderAssingId || order?.logistic_order_id, order)
        handleArrowBack()
    }

    const handleAcceptLogisticOrder = (order: any) => {
        handleClickLogisticOrder?.(1, orderAssingId || order?.logistic_order_id, order)
        handleArrowBack()
    }

    useEffect(() => {
        if (order?.driver === null && session?.user?.level === 4) {
            setAlertState({
                open: true,
                content: [
                    t(
                        'YOU_HAVE_BEEN_REMOVED_FROM_THE_ORDER',
                        'You have been removed from the order',
                    ),
                ],
                key: null,
            });
        }
    }, [order?.driver]);

    const OrderDetailsInformation = (props: { order: any, isOrderGroup?: boolean, lastOrder?: boolean }) => {
        const {
            order,
            isOrderGroup,
            lastOrder,
        } = props
        return (
            <>
                <OrderContentComponent
                    order={order}
                    logisticOrderStatus={logisticOrderStatus}
                    isOrderGroup={isOrderGroup}
                    lastOrder={lastOrder}
                />
                <View
                    style={{
                        height:
                            order?.status === 8 && order?.delivery_type === 1 ? 50 : 35,
                    }}
                />

            </>
        )
    }

    return (
        <>
            {(!order || Object.keys(order).length === 0) &&
                (props.order?.error?.length < 1 || !props.order?.error) && (
                    <View style={{ flex: 1 }}>
                        {[...Array(6)].map((item, i) => (
                            <Placeholder key={i} Animation={Fade}>
                                <View style={{ flexDirection: 'row', paddingVertical: 20 }}>
                                    <Placeholder>
                                        <PlaceholderLine width={100} />
                                        <PlaceholderLine width={70} />
                                        <PlaceholderLine width={30} />
                                        <PlaceholderLine width={20} />
                                    </Placeholder>
                                </View>
                            </Placeholder>
                        ))}
                    </View>
                )}

            {(!!props.order?.error || props.order?.error) && (
                <NotFoundSource
                    btnTitle={t('GO_TO_MY_ORDERS', 'Go to my orders')}
                    content={
                        props.order.error[0] ||
                        props.order.error ||
                        t('NETWORK_ERROR', 'Network Error')
                    }
                    onClickButton={() => navigation.navigate('Orders')}
                />
            )}
            {!((!order || Object.keys(order).length === 0) &&
                (props.order?.error?.length < 1 || !props.order?.error)) && (
                    <View style={{ flex: 1 }}>
                        <OrderHeaderComponent
                            order={order}
                            getOrderStatus={getOrderStatus}
                            handleArrowBack={handleArrowBack}
                            logisticOrderStatus={logisticOrderStatus}
                        />
                        {order && Object.keys(order).length > 0 && (props.order?.error?.length < 1 || !props.order?.error) && (
                            <>
                                <OrderDetailsContainer
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                >
                                    {order?.order_group && order?.order_group_id && order?.isLogistic ? order?.order_group?.orders.map((order: any, i: number, hash: any) => (
                                        <OrderDetailsInformation key={order?.id} order={order} isOrderGroup lastOrder={hash?.length === i + 1} />
                                    )) : (
                                        <OrderDetailsInformation order={order} />
                                    )}
                                </OrderDetailsContainer>

                                {showFloatButtonsAcceptOrReject[order?.status] && (
                                    <FloatingButton
                                        btnText={t('REJECT', 'Reject')}
                                        isSecondaryBtn={false}
                                        secondButtonClick={() => handleAcceptLogisticOrder(order)}
                                        firstButtonClick={() => handleRejectLogisticOrder(order)}
                                        secondBtnText={t('ACCEPT', 'Accept')}
                                        secondButton={true}
                                        firstColorCustom={theme.colors.red}
                                        secondColorCustom={theme.colors.green}
                                        widthButton={'45%'}
                                    />
                                )}
                            </>
                        )}
                    </View>
                )}
            {alertState?.open && (
                <Alert
                    open={alertState.open}
                    onAccept={handleArrowBack}
                    onClose={handleArrowBack}
                    content={alertState.content}
                    title={t('WARNING', 'Warning')}
                />
            )}
        </>
    );
};

export const OrderDetailsLogistic = (props: OrderDetailsLogisticParams) => {
    const orderDetailsProps = {
        ...props,
        UIComponent: OrderDetailsLogisticUI,
    };
    return <OrderDetailsConTableoller {...orderDetailsProps} />;
};
