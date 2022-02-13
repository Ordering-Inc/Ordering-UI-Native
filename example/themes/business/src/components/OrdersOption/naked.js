import React, { useEffect, useState, useCallback } from 'react'
// import { useSession } from '../../contexts/SessionContext'
// import { useApi } from '../../contexts/ApiContext'
// import { useWebsocket } from '../../contexts/WebsocketContext'
// import { ToastType, useToast } from '../../contexts/ToastContext'
// import { useLanguage } from '../../contexts/LanguageContext'
// import { useEvent } from '../../contexts/EventContext'
// import { useConfig } from '../../contexts/ConfigContext'
import { useSession, useApi, useWebsocket, ToastType, useToast, useLanguage, useEvent, useConfig } from 'ordering-components/native'

export const OrderListGroups = (props) => {
  const {
    UIComponent,
    orderBy,
    isIos,
    useDefualtSessionManager,
    paginationSettings,
    asDashboard,
    orderGroupStatusCustom,
    onOrdersDeleted,
    customOrderTypes,
    customPaymethods
  } = props

  const [ordering] = useApi()
  const [session] = useSession()
  const [events] = useEvent()
  const socket = useWebsocket()
  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const [{ configs }] = useConfig()
  const isLogisticActivated = configs?.logistic_module?.value
  const ordersStatusArray = ['pending', 'inProgress', 'completed', 'cancelled']

  const ordersGroupStatus = {
    pending: orderGroupStatusCustom?.pending ?? [0, 13],
    inProgress: orderGroupStatusCustom?.inProgress ?? [3, 4, 7, 8, 9, 14, 18, 19, 20, 21],
    completed: orderGroupStatusCustom?.completed ?? [1, 11, 15],
    cancelled: orderGroupStatusCustom?.cancelled ?? [2, 5, 6, 10, 12, 16, 17]
  }

  const orderStructure = {
    loading: false,
    error: null,
    orders: [],
    pagination: {
      currentPage: (paginationSettings.controlType === 'pages' && paginationSettings.initialPage && paginationSettings.initialPage >= 1)
        ? paginationSettings.initialPage - 1
        : 0,
      pageSize: paginationSettings.pageSize ?? 10,
      total: null
    }
  }

  let [ordersGroup, setOrdersGroup] = useState({
    pending: {
      ...orderStructure,
      defaultFilter: ordersGroupStatus.pending,
      currentFilter: ordersGroupStatus.pending
    },
    inProgress: {
      ...orderStructure,
      defaultFilter: ordersGroupStatus.inProgress,
      currentFilter: ordersGroupStatus.inProgress
    },
    completed: {
      ...orderStructure,
      defaultFilter: ordersGroupStatus.completed,
      currentFilter: ordersGroupStatus.completed
    },
    cancelled: {
      ...orderStructure,
      defaultFilter: ordersGroupStatus.cancelled,
      currentFilter: ordersGroupStatus.cancelled
    }
  })
  const [currentTabSelected, setCurrentTabSelected] = useState('pending')
  const [logisticOrders, setlogisticOrders] = useState({ loading: false, error: null, orders: null })
  const [messages, setMessages] = useState({ loading: false, error: null, messages: [] })
  const [currentFilters, setCurrentFilters] = useState(null)
  const [filtered, setFiltered] = useState(null)
  const [ordersDeleted, setOrdersDeleted] = useState({ loading: false, error: null, result: [] })
  const [controlsState, setControlsState] = useState({ loading: true, error: null, paymethods: [] })
  const accessToken = useDefualtSessionManager ? session.token : props.accessToken
  const requestsState = {}
  const getOrders = async ({
    page,
    pageSize = paginationSettings.pageSize,
    orderStatus,
    newFetch
  }) => {
    const options = {
      query: {
        orderBy,
        page: page,
        page_size: pageSize
      }
    }
    options.query.where = []
    if (orderStatus) {
      if (!filtered?.state) {
        options.query.where.push({ attribute: 'status', value: orderStatus })
      }

      if (ordersGroup[currentTabSelected]?.orders?.length > 0 && !newFetch) {
        options.query = {
          ...options.query,
          page: 1
        }
        if (!filtered?.id) {
          options.query.where.push({
            attribute: 'id',
            value: {
              condition: '!=',
              value: ordersGroup[currentTabSelected]?.orders.map((o) => o.id)
            }
          })
        }
      }
    }

    if (filtered?.id) {
      options.query.where.push({
        attribute: 'id',
        value: {
          condition: 'ilike',
          value: isIos ? `%${filtered?.id}%` : encodeURI(`%${filtered?.id}%`)
        }
      })
    }

    if (filtered?.state) {
      options.query.where.push({ attribute: 'status', value: filtered.state })
    }

    if (filtered?.city) {
      options.query.where.push({
        attribute: 'business',
        conditions: [{
          attribute: 'city_id',
          value: filtered?.city
        }]
      })
    }

    if (filtered?.paymethod || customPaymethods) {
      let paymethodResult = controlsState
      if (!controlsState.paymethods.length) {
        paymethodResult = await getControls()
      }
      options.query.where.push({
        attribute: 'paymethod_id',
        value: (!!filtered?.paymethod && filtered?.paymethod) || paymethodResult?.paymethods
      })
    }

    if (filtered?.driver) {
      options.query.where.push({ attribute: 'driver_id', value: filtered?.driver })
    }

    if (filtered?.driver_groups) {
      options.query.where.push({ attribute: 'driver_id', value: filtered?.driver_groups?.drivers })
    }

    if (filtered?.customer?.email || filtered?.customer?.phone) {
      const customerOptions = []
      if (filtered?.customer?.email) {
        customerOptions.push({
          attribute: 'email',
          value: {
            condition: 'ilike',
            value: isIos ? `%${filtered?.customer?.email}%` : encodeURI(`%${filtered?.customer?.email}%`)
          }
        })
      }
      if (filtered?.customer?.phone) {
        customerOptions.push({
          attribute: 'cellphone',
          value: {
            condition: 'ilike',
            value: isIos ? `%${filtered?.customer?.phone}%` : encodeURI(`%${filtered?.customer?.phone}%`)
          }
        })
      }

      options.query.where.push({
        attribute: 'customer',
        conditions: customerOptions
      })
    }

    if (filtered?.delivery_type || customOrderTypes) {
      options.query.where.push({
        attribute: 'delivery_type',
        value: (!!filtered?.delivery_type && filtered?.delivery_type) || customOrderTypes
      })
    }

    if (filtered?.date?.from) {
      options.query.where.push({
        attribute: 'delivery_datetime',
        value: {
          condition: '>=',
          value: filtered?.date?.from
        }
      })
    }
    if (filtered?.date?.to) {
      options.query.where.push({
        attribute: 'delivery_datetime',
        value: {
          condition: '<=',
          value: filtered?.date?.to
        }
      })
    }

    const source = {}
    requestsState.orders = source
    options.cancelToken = source

    const functionFetch = asDashboard
      ? ordering.setAccessToken(accessToken).orders().asDashboard()
      : ordering.setAccessToken(accessToken).orders()
    return await functionFetch.get(options)
  }

  const getControls = async () => {
    try {
      setControlsState({ ...controlsState, loading: true })
      const { content: { error, result } } = await ordering
        .setAccessToken(accessToken)
        .controls()
        .get()
      const obj = {
        ...controlsState,
        loading: false,
        paymethods: result?.paymethods
          ?.filter((p) => customPaymethods?.includes(p.name))
          ?.map((pay) => pay.id),
        error: error ? result : null
      }
      setControlsState(obj)
      return obj
    } catch (e) {
      setControlsState({
        ...controlsState,
        loading: false,
        error: e?.message ? controlsState.error?.push(e?.message) : ['ERROR']
      })
    }
  }

  const loadOrders = async ({ newFetch, newFetchCurrent } = {}) => {
    if (
      !(newFetch || newFetchCurrent) &&
      ordersGroup[currentTabSelected].pagination.currentPage === ordersGroup[currentTabSelected].pagination.totalPages &&
      ordersGroup[currentTabSelected].pagination.total !== null
    ) {
      return
    }

    if (newFetch) {
      ordersStatusArray.map(tab => {
        ordersGroup = {
          ...ordersGroup,
          [tab]: {
            ...orderStructure,
            defaultFilter: ordersGroupStatus[tab],
            currentFilter: ordersGroup[tab].currentFilter
          }
        }
      })
    } else if (newFetchCurrent) {
      ordersGroup = {
        ...ordersGroup,
        [currentTabSelected]: {
          ...orderStructure,
          defaultFilter: ordersGroupStatus[currentTabSelected],
          currentFilter: ordersGroup[currentTabSelected]?.currentFilter
        }
      }
    }

    const pageSize = paginationSettings.pageSize

    try {
      setOrdersGroup({
        ...ordersGroup,
        [currentTabSelected]: {
          ...ordersGroup[currentTabSelected],
          loading: true
        }
      })
      const { content: { error, result, pagination } } = await getOrders({
        page: 1,
        pageSize,
        orderStatus: ordersGroup[currentTabSelected]?.currentFilter,
        newFetch
      })

      setOrdersGroup({
        ...ordersGroup,
        [currentTabSelected]: {
          ...ordersGroup[currentTabSelected],
          loading: false,
          orders: error
            ? (newFetch || newFetchCurrent)
              ? []
              : sortOrders(ordersGroup[currentTabSelected]?.orders)
            : (newFetch || newFetchCurrent)
              ? sortOrders(result)
              : sortOrders(ordersGroup[currentTabSelected]?.orders.concat(result)),
          error: error ? result : null,
          pagination: {
            ...ordersGroup[currentTabSelected].pagination,
            currentPage: pagination.current_page,
            pageSize: pagination.page_size,
            totalPages: pagination.total_pages,
            total: pagination.total,
            from: pagination.from,
            to: pagination.to
          }
        }
      })
    } catch (err) {
      if (err.constructor.name !== 'Cancel') {
        setOrdersGroup({
          ...ordersGroup,
          [currentTabSelected]: {
            ...ordersGroup[currentTabSelected],
            loading: false,
            error: [err?.message ?? 'ERROR']
          }
        })
      }
    }
  }

  const loadMoreOrders = async () => {
    setOrdersGroup({
      ...ordersGroup,
      [currentTabSelected]: {
        ...ordersGroup[currentTabSelected],
        loading: true
      }
    })
    try {
      const { content: { error, result, pagination } } = await getOrders({
        page: ordersGroup[currentTabSelected].pagination.currentPage + 1,
        orderStatus: ordersGroup[currentTabSelected]?.currentFilter,
        newFetch: true
      })

      setOrdersGroup({
        ...ordersGroup,
        [currentTabSelected]: {
          ...ordersGroup[currentTabSelected],
          loading: false,
          orders: error
            ? sortOrders(ordersGroup[currentTabSelected]?.orders)
            : sortOrders(ordersGroup[currentTabSelected]?.orders?.concat(result)),
          error: error ? result : null,
          pagination: !error
            ? {
              ...ordersGroup[currentTabSelected].pagination,
              currentPage: pagination.current_page,
              pageSize: pagination.page_size,
              totalPages: pagination.total_pages,
              total: pagination.total,
              from: pagination.from,
              to: pagination.to
            }
            : ordersGroup[currentTabSelected].pagination
        }
      })
    } catch (err) {
      if (err.constructor.name !== 'Cancel') {
        setOrdersGroup({
          ...ordersGroup,
          [currentTabSelected]: {
            ...ordersGroup[currentTabSelected],
            loading: false,
            error: [err?.message ?? 'ERROR']
          }
        })
      }
    }
  }

  const loadMessages = async (orderId) => {
    try {
      setMessages({ ...messages, loading: true })
      const url = `${ordering.root}/orders/${orderId}/messages?mode=dashboard`

      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } })
      const { error, result } = await response.json()
      if (!error) {
        setMessages({
          messages: result,
          loading: false,
          error: null
        })
      } else {
        setMessages({
          ...messages,
          loading: false,
          error: result
        })
      }
    } catch (error) {
      setMessages({ ...messages, loading: false, error: [error.Messages] })
    }
  }

  const deleteOrders = async (orderIds) => {
    try {
      setOrdersDeleted({ ...ordersDeleted, loading: true })
      const errorState = []

      if (orderIds.length === 1) {
        const { content: { error } } = await ordering.setAccessToken(accessToken).orders(orderIds[0]).delete()
        errorState.push({ error, id: orderIds[0] })
      } else if (orderIds.length > 1) {
        for (const id of orderIds) {
          const { content: { error: multiError } } = await ordering.setAccessToken(accessToken).orders(id).delete()
          errorState.push({ error: multiError, id })
        }
      }

      const isError = errorState.some((e) => e.error)
      const idsDeleted = errorState.map((obj) => !obj.error && obj.id)

      onOrdersDeleted && onOrdersDeleted({ isError, list: idsDeleted })
      setOrdersDeleted({ ...ordersDeleted, loading: false })
      setOrdersGroup({
        ...ordersGroup,
        [currentTabSelected]: {
          ...ordersGroup[currentTabSelected],
          orders: idsDeleted.length
            ? sortOrders(ordersGroup[currentTabSelected]?.orders?.filter((order) => !idsDeleted.includes(order.id)))
            : sortOrders(ordersGroup[currentTabSelected]?.orders)
        }
      })
    } catch (err) {
      if (err.constructor.name !== 'Cancel') {
        setOrdersGroup({
          ...ordersGroup,
          [currentTabSelected]: {
            ...ordersGroup[currentTabSelected],
            loading: false,
            error: [err?.message ?? 'ERROR']
          }
        })
      }
    }
  }

  const loadLogisticOrders = async (isAlreadyFetched) => {
    if (isAlreadyFetched) return
    try {
      setlogisticOrders({ ...logisticOrders, loading: true })
      const url = `${ordering.root}/drivers/${session.user?.id}/assign_requests`
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } })
      const { result, error } = await response.json()
      if (!error) {
        setlogisticOrders({ ...logisticOrders, loading: false, orders: result.filter(order => !(order?.order_group && order?.order_group?.orders?.length === 0)) })
        return
      }
      setlogisticOrders({ loading: false, orders: [], error: result })
    } catch (err) {
      setlogisticOrders({ loading: false, orders: [], error: err.message })
    }
  }

  const sortOrders = (orders, sortBy = 'desc') => {
    const ordersSorted = orders?.sort((a, b) => {
      if (sortBy === 'desc') {
        return b.id - a.id
      }
      return a.id - b.id
    })

    return ordersSorted
  }

  const getStatusById = (id) => {
    if (!id && id !== 0) return
    const pending = orderGroupStatusCustom?.pending ?? [0, 13]
    const inProgress = orderGroupStatusCustom?.inProgress ?? [3, 4, 7, 8, 9, 14, 18, 19, 20, 21]
    const completed = orderGroupStatusCustom?.completed ?? [1, 11, 15]
    // const cancelled = orderGroupStatusCustom?.cancelled ?? [2, 5, 6, 10, 12, 16, 17]

    const status = pending.includes(id)
      ? 'pending'
      : inProgress.includes(id)
        ? 'inProgress'
        : completed.includes(id)
          ? 'completed'
          : 'cancelled'

    return status
  }

  const actionOrderToTab = (orderAux, status, type) => {
    const orderList = ordersGroup[status]?.orders
    let orders
    const order = {
      ...orderAux,
      showNotification: true
    }
    if (type === 'update') {
      const indexToUpdate = orderList.findIndex((o) => o.id === order.id)
      orderList[indexToUpdate] = order
      orders = orderList
    } else {
      orders = type === 'add'
        ? [order, ...orderList]
        : orderList.filter((_order) => _order.id !== order.id)
    }

    ordersGroup[status].orders = sortOrders(orders)

    if (type !== 'update') {
      ordersGroup[status].pagination = {
        ...ordersGroup[status].pagination,
        total: ordersGroup[status].pagination.total + (type === 'add' ? 1 : -1)
      }
    }
  }

  const handleClickOrder = (orderAux) => {
    const order = {
      ...orderAux,
      showNotification: false
    }
    const ordersGroups = order?.order_group?.orders
    if (!ordersGroups) {
      const status = getStatusById(order?.status)
      const orderList = ordersGroup[status]?.orders
      const indexToUpdate = orderList?.findIndex((o) => o?.id === order?.id)
      orderList[indexToUpdate] = order
      setOrdersGroup({
        ...ordersGroup,
        [status]: {
          ...ordersGroup[status],
          orders: sortOrders(orderList)
        }
      })
    } else {
      const status = getStatusById(order?.order_group?.orders?.[0]?.status)
      let orderList
      ordersGroups.map(order => {
        orderList = ordersGroup[status]?.orders
        const indexToUpdate = orderList?.findIndex((o) => o?.id === order?.id)
        orderList[indexToUpdate] = order
      })
      setOrdersGroup({
        ...ordersGroup,
        [status]: {
          ...ordersGroup[status],
          orders: sortOrders(orderList)
        }
      })
    }
  }

  const handleClickLogisticOrder = async (status, orderId) => {
    try {
      const response = await fetch(`${ordering.root}/drivers/${session.user?.id}/assign_requests/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          status,
          user_id: session.user?.id
        })
      })
      const { result, error } = await response.json()
      if (!error) {
        const order = logisticOrders?.orders?.find(order => order?.id === orderId)
        const newOrders = sortOrders(logisticOrders?.orders?.filter(_order => _order?.id !== orderId))
        setlogisticOrders({ ...logisticOrders, orders: newOrders })
        if (status === 1) {
          handleClickOrder(order?.order ?? order)
          showToast(
            ToastType.Success,
            t('SPECIFIC_ORDER_ACCEPTED', 'Your accepted the order number _NUMBER_').replace('_NUMBER_', order?.order?.id ?? order?.id)
          )
        } else {
          showToast(
            ToastType.Info,
            t('SPECIFIC_ORDER_REJECTED', 'Your rejected the order number _NUMBER_').replace('_NUMBER_', order?.order?.id ?? order?.id)
          )
        }
        return
      }
      showToast(ToastType.Error, result)
    } catch (err) {
      setlogisticOrders({ ...logisticOrders, error: err.message })
      showToast(ToastType.Error, err.message)
    }
  }

  useEffect(() => {
    if (currentTabSelected === 'logisticOrders') {
      loadLogisticOrders(!!logisticOrders?.orders)
    } else {
      loadOrders({
        newFetchCurrent: ordersGroup[currentTabSelected]?.pagination?.total === null
      })
    }
  }, [currentTabSelected])

  useEffect(() => {
    if (currentFilters) {
      loadOrders({ newFetchCurrent: true })
    }
  }, [currentFilters])

  useEffect(() => {
    if (!filtered) return
    loadOrders({ newFetch: true })
  }, [filtered])

  useEffect(() => {
    if (ordersGroup[currentTabSelected]?.loading) return

    const handleUpdateOrder = (order) => {
      events.emit('order_updated', order)
      let orderFound = null
      for (let i = 0; i < ordersStatusArray.length; i++) {
        const status = ordersStatusArray[i]
        if (order?.products) {
          orderFound = ordersGroup[status]?.orders?.find((_order) => _order.id === order.id)
        }
        if (orderFound) break
      }

      showToast(
        ToastType.Info,
        t('SPECIFIC_ORDER_UPDATED', 'Your order number _NUMBER_ has updated').replace('_NUMBER_', order.id),
        1000
      )

      if (!orderFound) {
        if (
          !order?.products ||
          !order?.summary ||
          typeof order?.status !== 'number' ||
          !order?.customer ||
          !order?.business ||
          !order?.paymethod
        ) {
          return
        }
        delete order.total
        delete order.subtotal

        const currentFilter = ordersGroup[getStatusById(order?.status) ?? '']?.currentFilter

        !currentFilter.includes(order.status)
          ? actionOrderToTab(order, getStatusById(order?.status), 'remove')
          : actionOrderToTab(order, getStatusById(order?.status), 'add')

        return
      }

      if (
        orderFound.id === order.id &&
        orderFound?.driver?.id !== order?.driver?.id &&
        session?.user?.level === 4
      ) {
        actionOrderToTab(orderFound, getStatusById(orderFound.status), 'remove')
      }

      if (orderFound.id === order.id) {
        delete order.total
        delete order.subtotal
      }

      if (!order?.status && order?.status !== 0) {
        Object.assign(orderFound, order)
      } else {
        const newOrderStatus = getStatusById(order?.status) ?? ''
        const currentOrderStatus = getStatusById(orderFound?.status) ?? ''

        const currentFilter = ordersGroup[newOrderStatus]?.currentFilter
        Object.assign(orderFound, order)

        if (newOrderStatus !== currentOrderStatus) {
          actionOrderToTab(orderFound, currentOrderStatus, 'remove')

          const total = ordersGroup[newOrderStatus].pagination.total ?? null

          if (
            currentFilter.includes(orderFound.status) &&
            total !== null
          ) {
            actionOrderToTab(orderFound, newOrderStatus, 'add')
          }
        } else {
          !currentFilter.includes(orderFound.status)
            ? actionOrderToTab(orderFound, newOrderStatus, 'remove')
            : actionOrderToTab(orderFound, newOrderStatus, 'update')
        }
      }
    }

    const handleAddNewOrder = (order) => {
      events.emit('order_added', order)
      showToast(
        ToastType.Info,
        t('SPECIFIC_ORDER_ORDERED', 'Order _NUMBER_ has been ordered').replace('_NUMBER_', order.id),
        1000
      )
      const status = getStatusById(order?.status) ?? ''
      const currentFilter = ordersGroup[status]?.currentFilter
      if (currentFilter.includes(order.status)) {
        actionOrderToTab(order, status, 'add')
      }
    }

    socket.on('orders_register', handleAddNewOrder)
    socket.on('update_order', handleUpdateOrder)
    return () => {
      socket.off('orders_register', handleAddNewOrder)
      socket.off('update_order', handleUpdateOrder)
    }
  }, [ordersGroup, socket, session])

  const handleAddAssignRequest = useCallback(
    (order) => {
      setlogisticOrders(prevState => ({ ...prevState, orders: sortOrders([...prevState?.orders, order]) }))
      showToast(
        ToastType.Info,
        t('SPECIFIC_LOGISTIC_ORDER_ORDERED', 'Logisitc order _NUMBER_ has been ordered').replace('_NUMBER_', order?.order?.id ?? order.id),
        1000
      )
    },
    []
  )

  const handleDeleteAssignRequest = useCallback(
    (order) => {
      setlogisticOrders(prevState => ({
        ...prevState,
        orders: prevState?.orders?.some(_order => _order?.id === order?.id)
          ? sortOrders([...prevState?.orders?.filter(_order => _order?.id !== order?.id), { ...prevState?.orders?.find(_order => _order?.id === order?.id), expired: true }])
          : sortOrders(prevState?.orders)
      }))
    },
    []
  )

  const handleUpdateAssignRequest = useCallback(
    (order) => {
      setlogisticOrders(prevState => ({
        ...prevState,
        orders: prevState?.orders?.some(_order => _order?.id === order?.id)
          ? sortOrders([...prevState?.orders?.filter(_order => _order?.id !== order?.id), { ...prevState?.orders?.find(_order => _order?.id === order?.id), ...order }])
          : sortOrders(prevState?.orders)
      }))
      showToast(
        ToastType.Info,
        t('SPECIFIC_LOGISTIC_ORDER_UPDATED', 'Your logisitc order number _NUMBER_ has updated').replace('_NUMBER_', order?.order?.id ?? order.id),
        1000
      )
    },
    []
  )

  useEffect(() => {
    if (isLogisticActivated) {
      socket.on('request_register', handleAddAssignRequest)
      socket.on('request_update', handleUpdateAssignRequest)
      socket.on('request_cancel', handleDeleteAssignRequest)
    }
    return () => {
      socket.off('request_register')
      socket.off('request_update')
      socket.off('request_cancel')
    }
  }, [socket, session, isLogisticActivated])

  useEffect(() => {
    if (!session.user) return
    socket.on('disconnect', () => {
      const ordersRoom = session?.user?.level === 0 ? 'orders' : `orders_${session?.user?.id}`
      socket.join(ordersRoom)
      const requestsRoom = `requests_${session?.user?.id}`
      socket.join(requestsRoom)
      const groupsRoom = `ordergroups_${session?.user?.id}`
      socket.join(groupsRoom)
    })
    const ordersRoom = session?.user?.level === 0 ? 'orders' : `orders_${session?.user?.id}`
    const requestsRoom = `requests_${session?.user?.id}`
    const groupsRoom = `ordergroups_${session?.user?.id}`

    socket.join(ordersRoom)
    socket.join(requestsRoom)
    socket.join(groupsRoom)

    return () => {
      socket.leave(ordersRoom)
      socket.leave(requestsRoom)
      socket.leave(groupsRoom)
    }
  }, [socket, session])

  useEffect(() => {
    const request = requestsState?.orders
    return () => {
      request && request.cancel && request.cancel()
    }
  }, [requestsState?.orders])

  useEffect(() => {
    const handleCustomerReviewed = (review) => {
      let orderFound = null
      for (let i = 0; i < ordersStatusArray.length; i++) {
        const status = ordersStatusArray[i]
        orderFound = ordersGroup[status]?.orders?.find((_order) => _order.id === review.order_id)
        if (orderFound) break
      }
      if (orderFound) {
        const newOrderStatus = getStatusById(orderFound?.status) ?? ''
        orderFound.user_review = review
        actionOrderToTab(orderFound, newOrderStatus, 'update')
      }
    }
    events.on('customer_reviewed', handleCustomerReviewed)
    return () => {
      events.off('customer_reviewed', handleCustomerReviewed)
    }
  }, [ordersGroup])

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          currentFilters={currentFilters}
          setCurrentFilters={setCurrentFilters}
          currentTabSelected={currentTabSelected}
          setCurrentTabSelected={setCurrentTabSelected}
          ordersGroup={ordersGroup}
          setOrdersGroup={setOrdersGroup}
          logisticOrders={logisticOrders}
          messages={messages}
          ordersDeleted={ordersDeleted}
          setOrdersDeleted={setOrdersDeleted}
          setMessages={setMessages}
          loadOrders={loadOrders}
          loadLogisticOrders={loadLogisticOrders}
          deleteOrders={deleteOrders}
          loadMessages={loadMessages}
          loadMoreOrders={loadMoreOrders}
          handleClickOrder={handleClickOrder}
          handleClickLogisticOrder={handleClickLogisticOrder}
          filtered={filtered}
          onFiltered={setFiltered}
          isLogisticActivated={isLogisticActivated}
        />
      )}
    </>
  )
}

OrderListGroups.defaultProps = {
  orderBy: '-id',
  orderDirection: 'desc',
  paginationSettings: { initialPage: 1, pageSize: 10, controlType: 'infinity' },
  beforeComponents: [],
  afterComponents: [],
  beforeElements: [],
  afterElements: []
}