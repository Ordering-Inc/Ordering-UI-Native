import React, { useEffect, useState } from 'react'
// import { useSession } from '../../contexts/SessionContext'
// import { useApi } from '../../contexts/ApiContext'
// import { useWebsocket } from '../../contexts/WebsocketContext'
// import { ToastType, useToast } from '../../contexts/ToastContext'
// import { useLanguage } from '../../contexts/LanguageContext'
// import { useEvent } from '../../contexts/EventContext'
// import { useUtils } from '../../../src/contexts/UtilsContext'
import { useApi, useSession, useWebsocket, ToastType, useToast, useLanguage, useEvent, useUtils } from 'ordering-components/native'

export const OrderListGroups = (props) => {
  const {
    UIComponent,
    orderBy,
    useDefualtSessionManager,
    paginationSettings,
    asDashboard,
    orderGroupStatusCustom
  } = props

  const [ordering] = useApi()
  const [session] = useSession()
  const [events] = useEvent()
  const socket = useWebsocket()
  const [{ parseDate }] = useUtils()
  const [, t] = useLanguage()
  const [, { showToast }] = useToast()

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

  const [ordersGroup, setOrdersGroup] = useState({
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
  const [messages, setMessages] = useState({ loading: false, error: null, messages: [] })
  const [currentFilters, setCurrentFilters] = useState(null)
  const [search, setSearch] = useState({
    id: '',
    state: '',
    city: '',
    business: '',
    delivery_type: '',
    paymethod: '',
    driver: '',
    date: {
      from: '',
      to: '',
      type: ''
    }
  })

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
      if (!search.state) options.query.where.push({ attribute: 'status', value: orderStatus })

      if (ordersGroup[currentTabSelected].orders.length > 0 && !newFetch) {
        options.query = {
          ...options.query,
          page: 1
        }
        options.query.where.push({
          attribute: 'id',
          value: {
            condition: '!=',
            value: ordersGroup[currentTabSelected].orders.map((o) => o.id)
          }
        })
      }
    }

    if (search.id) {
      options.query.where.push({ attribute: 'id', value: search.id })
    }

    if (search.state) {
      options.query.where.push({ attribute: 'status', value: search.state })
    }

    if (search.city) {
      options.query.where.push({
        attribute: 'business',
        conditions: [{
          attribute: 'city_id',
          value: search.city
        }]
      })
    }

    if (search.paymethod) {
      options.query.where.push({ attribute: 'paymethod_id', value: search.paymethod })
    }

    if (search.driver) {
      options.query.where.push({ attribute: 'driver_id', value: search.driver })
    }

    if (search.delivery_type) {
      options.query.where.push({ attribute: 'delivery_type', value: search.delivery_type })
    }

    if (search?.date?.type) {
      const dateRange = calculateDate(search?.date?.type, search?.date?.from, search?.date?.to)
      if (dateRange.from) {
        options.query.where.push({
          attribute: 'delivery_datetime',
          value: {
            condition: '>=',
            value: dateRange.from
          }
        })
      }
      if (dateRange.to) {
        options.query.where.push({
          attribute: 'delivery_datetime',
          value: {
            condition: '<=',
            value: dateRange.to
          }
        })
      }
    }

    const source = {}
    requestsState.orders = source
    options.cancelToken = source
    
    const functionFetch = asDashboard
    ? ordering.setAccessToken(accessToken).orders().asDashboard()
    : ordering.setAccessToken(accessToken).orders()
    return await functionFetch.get(options)
  }

  const loadOrders = async ({ isNextPage, newFetch } = {}) => {
    if (
      !newFetch &&
      (
        (ordersGroup[currentTabSelected].pagination.currentPage > 0 &&
        ordersGroup[currentTabSelected].pagination.currentPage === ordersGroup[currentTabSelected].pagination.totalPages) ||
        ordersGroup[currentTabSelected].orders.length > 0 &&
        ordersGroup[currentTabSelected].pagination?.totalPages > 0
      )
    ) {
      return
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
      const nextPage = !isNextPage ? ordersGroup[currentTabSelected].pagination.currentPage + 1 : 1
      const { content: { error, result, pagination } } = await getOrders({
        page: 1 ?? nextPage,
        pageSize,
        orderStatus: ordersGroup[currentTabSelected].currentFilter,
        newFetch
      })

      setOrdersGroup({
        ...ordersGroup,
        [currentTabSelected]: {
          ...ordersGroup[currentTabSelected],
          loading: false,
          orders: error
            ? sortOrders(ordersGroup[currentTabSelected].orders)
            : sortOrders(ordersGroup[currentTabSelected].orders.concat(result)),
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

  const calculateDate = (type, from, to) => {
    switch (type) {
      case 'today':
        const date = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return {from: `${date} 00:00:00`, to: `${date} 23:59:59`}
      case 'yesterday':
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const start1 = parseDate(yesterday, { outputFormat: 'MM/DD/YYYY' })
        const end1 = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return {from: `${start1} 00:00:00`, to: `${end1} 23:59:59`}
      case 'last_7days':
        const last_7days = new Date()
        last_7days.setDate(last_7days.getDate() - 6)
        const start7 = parseDate(last_7days, { outputFormat: 'MM/DD/YYYY' })
        const end7 = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return {from: `${start7} 00:00:00`, to: `${end7} 23:59:59`}
      case 'last_30days':
        const last_30days = new Date()
        last_30days.setDate(last_30days.getDate() - 29)
        const start30 = parseDate(last_30days, { outputFormat: 'MM/DD/YYYY' })
        const end30 = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return {from: `${start30} 00:00:00`, to: `${end30} 23:59:59`}
      default:
        const start = from ? `${parseDate(from, { outputFormat: 'MM/DD/YYYY' })} 00:00:00` : ''
        const end = to ? `${parseDate(to, { outputFormat: 'MM/DD/YYYY' })} 23:59:59` : ''
        return {from: start, to: end}
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
        orderStatus: ordersGroup[currentTabSelected].currentFilter,
        newFetch: true
      })

      setOrdersGroup({
        ...ordersGroup,
        [currentTabSelected]: {
          ...ordersGroup[currentTabSelected],
          loading: false,
          orders: error
            ? sortOrders(ordersGroup[currentTabSelected].orders)
            : sortOrders(ordersGroup[currentTabSelected].orders.concat(result)),
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

  const sortOrders = (orders, sortBy = 'desc') => {
    const ordersSorted = orders.sort((a, b) => {
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
    const cancelled = orderGroupStatusCustom?.cancelled ?? [2, 5, 6, 10, 12, 16, 17]

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
    const orderList = ordersGroup[status].orders
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
    const status = getStatusById(order?.status)
    const orderList = ordersGroup[status].orders
    const indexToUpdate = orderList.findIndex((o) => o.id === order.id)
    orderList[indexToUpdate] = order
    setOrdersGroup({
      ...ordersGroup,
      [status]: {
        ...ordersGroup[status],
        orders: sortOrders(orderList)
      }
    })
  }

  const applyFilters = () => {
    console.log(ordersGroup, 'this is order group')
    loadOrders({ newFetch: true })
  }

  useEffect(() => {
    loadOrders({ newFetch: !!currentFilters })
  }, [currentTabSelected])

  useEffect(() => {
    if (currentFilters) {
      loadOrders({ newFetch: !!currentFilters })
    }
  }, [currentFilters])

  useEffect(() => {
    if (ordersGroup[currentTabSelected].loading) return

    const handleUpdateOrder = (order) => {
      let orderFound = null

      for (let i = 0; i < ordersStatusArray.length; i++) {
        const status = ordersStatusArray[i]
        orderFound = ordersGroup[status].orders.find((_order) => _order.id === order.id)
        if (orderFound) break
      }

      showToast(
        ToastType.Info,
        t('SPECIFIC_ORDER_UPDATED', 'Your order number _NUMBER_ has updated').replace('_NUMBER_', order.id)
      )

      if (!orderFound) {
        if (
          !order?.products ||
          !order?.summary ||
          !order?.status ||
          !order?.customer ||
          !order?.business ||
          !order?.paymethod ||
          !order?.total ||
          !order?.subtotal
        ) return
        delete order.total
        delete order.subtotal

        const currentFilter = ordersGroup[getStatusById(order?.status) ?? ''].currentFilter

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

        const currentFilter = ordersGroup[newOrderStatus].currentFilter
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
        t('SPECIFIC_ORDER_ORDERED', 'Order _NUMBER_ has been ordered').replace('_NUMBER_', order.id)
      )
      const status = getStatusById(order?.status) ?? ''
      const currentFilter = ordersGroup[status].currentFilter
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

  useEffect(() => {
    if (!session.user) return
    socket.on('disconnect', () => {
      const ordersRoom = session?.user?.level === 0 ? 'orders' : `orders_${session?.user?.id}`
      socket.join(ordersRoom)
    })
    const ordersRoom = session?.user?.level === 0 ? 'orders' : `orders_${session?.user?.id}`
    socket.join(ordersRoom)
    return () => {
      socket.leave(ordersRoom)
    }
  }, [socket, session])

  useEffect(() => {
    const request = requestsState.orders
    return () => {
      request && request.cancel && request.cancel()
    }
  }, [requestsState.orders])

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
          messages={messages}
          setMessages={setMessages}
          loadOrders={loadOrders}
          loadMessages={loadMessages}
          loadMoreOrders={loadMoreOrders}
          handleClickOrder={handleClickOrder}
          search={search}
          onSearch={setSearch}
          applyFilters={applyFilters}
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