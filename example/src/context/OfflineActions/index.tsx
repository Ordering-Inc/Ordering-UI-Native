import React, { useState, createContext, useEffect, useContext } from 'react';
import { useApi, useSession, useEvent, useWebsocket } from 'ordering-components/native'
import { useNetInfo } from '@react-native-community/netinfo';

import { _retrieveStoreData, _setStoreData, _removeStoreData } from '../../providers/StoreUtil'

type State = {
  isNetConnected: boolean | null
  isCombinedTabs: boolean | null
  canSaveChangesOffline: boolean | null
  actions: { [key: string]: any }
  orders: { [key: string]: any } | null
}

type Functions = {
  applyOffAction: (changes: any) => any
  registerOffOrder: (order: any) => any
  setState: React.Dispatch<React.SetStateAction<State>>
}

const defaultState = {
  isNetConnected: null,
  isCombinedTabs: null,
  canSaveChangesOffline: false,
  actions: {},
  orders: null,
}


export const OfflineActionsContext = createContext<[State, Functions]>([
  defaultState,
  {
    applyOffAction: () => {},
    registerOffOrder: () => {},
    setState: () => {}
  }
]);

export const OfflineActionsProvider = (props: any) => {
  const netInfo = useNetInfo()
  const [ordering] = useApi()
  const [{ token }] = useSession()
  const [events] = useEvent()
  const socket = useWebsocket()

  const [state, setState] = useState<State>({
    isNetConnected: netInfo.isConnected,
    isCombinedTabs: false,
    canSaveChangesOffline: false,
    actions: [],
    orders: null
  })

  const getStatusById = (id: number) => {
    if (!id && id !== 0) return
    const active = [0, 3, 4, 7, 8, 9, 13, 14, 18, 19, 20, 21]
    const pending = [0, 13]
    const inProgress = [3, 4, 7, 8, 9, 14, 18, 19, 20, 21]
    const completed = [1, 11, 15]

    const status = pending.includes(id)
      ? 'pending'
      : inProgress.includes(id)
        ? 'inProgress'
        : completed.includes(id)
          ? 'completed'
          : 'cancelled'

    const combinedStatus = active.includes(id)
      ? 'active'
      : completed.includes(id)
        ? 'completed'
        : 'cancelled'

    return state.isCombinedTabs ? combinedStatus : status
  }

  const applyOffAction = async (changes: any) => {
    if (state.canSaveChangesOffline === false) return false

    let _actions: any = state.actions?.[changes?.data?.orderId] ?? []

    if (state.actions?.[changes?.data?.orderId]) {
      _actions.push(changes)
    } else {
      _actions = [changes]
    }
    const actions = { ...state.actions, [changes?.data?.orderId]: _actions }

    setState(state => ({ ...state, actions }))
    await _setStoreData('offline_actions_array', actions)
    return true
  }

  const registerOffOrder = async (order: any) => {
    if (!order) return

    const oldStatusString = getStatusById(order?.oldStatus)
    const newStatusString = getStatusById(order?.status)

    const orderStatuses: any = [oldStatusString]
    oldStatusString !== newStatusString && orderStatuses.push(newStatusString)

    const ordersStoraged: any = {}
    for (const status of orderStatuses) {
      ordersStoraged[status] = await _retrieveStoreData(`${status}_orders`)

      if (ordersStoraged[status]) {
        if (orderStatuses.length === 1) {
          ordersStoraged[status] = [
            ...ordersStoraged[status].filter((_order: any) => _order.id !== order.id),
            order
          ].sort((a: any, b: any) => b.id - a.id)
        } else if (orderStatuses.length === 2) {
          if (status === oldStatusString) {
            ordersStoraged[status] = ordersStoraged[status]
              .filter((_order: any) => _order.id !== order.id)
              .sort((a: any, b: any) => b.id - a.id)
          }
          if (status === newStatusString) {
            ordersStoraged[status] = [
              ...ordersStoraged[status],
              order
            ].sort((a: any, b: any) => b.id - a.id)
          }
        }
        await _setStoreData(`${status}_orders`, ordersStoraged[status]);
      } else {
        ordersStoraged[status] = [order]
      }
    }
    if (Object.keys(ordersStoraged).length) {
      setState(state => ({ ...state, orders: ordersStoraged }))
    }
  }

  const syncChanges = async (changes: any) => {
    const ordersIdUpdated: any = []

    Object.keys(changes).forEach(async (orderId) => {
      const arr = changes[orderId]

      const [lastChange, ...restOfChanges] = arr.reverse();

      if (restOfChanges.length > 0) {
        const ordersString = restOfChanges
          .map((obj: any) => (
            Object.entries(obj?.data?.body).map(([clave, valor]) => `${clave}: '${valor}'`).join(', ')
          ))
          .join(', ')
        handleSendMessage({ message: ordersString, orderId })
      }
      const id = await updateOrderStatus({ orderId, body: lastChange?.data?.body })
      id && ordersIdUpdated.push(id);
    });

    ordersIdUpdated.length && events.emit('offline_order_updated', ordersIdUpdated)
    await _removeStoreData('offline_actions_array');
    setState(state => ({ ...state, actions: [] }));
  }

  const actionsFromStorage = async (isConnected: boolean) => {
    setState(state => ({ ...state, isNetConnected: isConnected }))
    const storedActions = await _retrieveStoreData('offline_actions_array');

    if (isConnected && Object.keys(storedActions)?.length) {
      syncChanges(storedActions)
      return
    }

    Object.keys(storedActions)?.length && setState(state => ({ ...state, actions: storedActions }));
  }

  useEffect(() => {
    if (netInfo.isConnected === null || state.canSaveChangesOffline === false) return
    actionsFromStorage(netInfo.isConnected)
  }, [netInfo.isConnected])

  const functions: any = {
    applyOffAction,
    registerOffOrder,
    setState
  }

  const updateOrderStatus = async (offlineData: any) => {
    try {
      const { content: { result: order, error } } = await ordering
        .setAccessToken(token)
        .orders(offlineData?.orderId)
        .save(offlineData?.body)

      return error ? null : order?.id
    } catch {
      return null
    }
  }

  const handleSendMessage = async (offlineData: any) => {
    try {
      const _canRead = [0, 2, 3, 4]
      const body = {
        comment: offlineData?.message,
        type: 2,
        can_see: _canRead.join(',')
      }
      const response = await fetch(`${ordering.root}/orders/${offlineData?.orderId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-App-X': ordering.appId,
          'X-Socket-Id-X': socket?.getId()
        },
        body: JSON.stringify(body)
      })
      const { error, result } = await response.json()
    } catch {
      return null
    }
  }

  const eventsDictiorary: any = {
    evt_off_change_order_status: updateOrderStatus
  }

  return (
    <OfflineActionsContext.Provider value={[{ ...state, isNetConnected: netInfo.isConnected }, functions]}>
      {props.children}
    </OfflineActionsContext.Provider>
  );
};

export const useOfflineActions = () => {
  const actionsManager = useContext(OfflineActionsContext)
  return actionsManager || [defaultState, {}]
}
