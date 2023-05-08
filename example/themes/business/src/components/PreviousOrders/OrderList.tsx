import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { OButton } from '../shared';
import { useLanguage } from 'ordering-components/native'
import { OrderItem } from './OrderItem';
import { AcceptOrRejectOrder as AcceptOrRejectOrderStyle } from './styles';

function OrderListPropsAreEqual(prevProps: any, nextProps: any) {
	return JSON.stringify(prevProps.order) === JSON.stringify(nextProps.order) &&
        JSON.stringify(prevProps._order) === JSON.stringify(nextProps._order) && 
        JSON.stringify(prevProps.currentOrdenSelected) === JSON.stringify(nextProps.currentOrdenSelected) &&
        prevProps.currentTabSelected === nextProps.currentTabSelected
}

export const OrdersList = React.memo((props: any) => {
    const {
        order,
        _order,
        hideBtns,
        currentOrdenSelected,
        isLogisticOrder,
        handlePressOrder,
        currentTabSelected,
        getOrderStatus,
        handleClickLogisticOrder
    } = props

    const theme = useTheme()
    const [, t] = useLanguage()

    return (
        <View
            style={{
                backgroundColor: currentOrdenSelected === order?.id ? theme.colors.gray100 : order?.locked && isLogisticOrder ? '#ccc' : '#fff',
                marginBottom: isLogisticOrder ? 10 : 0
            }}
        >
            <OrderItem
                order={order}
                _order={_order}
                isLogisticOrder={isLogisticOrder}
                handlePressOrder={handlePressOrder}
                currentTabSelected={currentTabSelected}
                getOrderStatus={getOrderStatus}
            />
            {isLogisticOrder && !hideBtns && (
                <AcceptOrRejectOrderStyle>
                    {!!order?.order_group_id && !!order?.order_group ? (
                        <OButton
                            text={t('VIEW_ORDER', 'View order')}
                            onClick={() => handlePressOrder({ ...order, logistic_order_id: _order?.id })}
                            bgColor={theme.colors.blueLight}
                            borderColor={theme.colors.blueLight}
                            imgRightSrc={null}
                            style={{ borderRadius: 7, height: 40 }}
                            parentStyle={{ width: '100%' }}
                            textStyle={{ color: theme?.colors?.white }}
                        />
                    ) : (
                        <>
                            <OButton
                                text={t('REJECT', 'Reject')}
                                onClick={() => handleClickLogisticOrder(2, _order?.id)}
                                bgColor={theme.colors.red}
                                borderColor={theme.colors.red}
                                imgRightSrc={null}
                                style={{ borderRadius: 7, height: 40 }}
                                parentStyle={{ width: '45%' }}
                                textStyle={{ color: theme.colors.white }}
                            />
                            <OButton
                                text={t('ACCEPT', 'Accept')}
                                onClick={() => handleClickLogisticOrder(1, _order?.id)}
                                bgColor={theme.colors.green}
                                borderColor={theme.colors.green}
                                imgRightSrc={null}
                                style={{ borderRadius: 7, height: 40 }}
                                parentStyle={{ width: '45%' }}
                                textStyle={{ color: theme.colors.white }}
                            />
                        </>
                    )}
                </AcceptOrRejectOrderStyle>
            )}
        </View>
    )
}, OrderListPropsAreEqual)
