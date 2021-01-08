export const HTTP_CONF = {
    PAGE_SIZE: 5
}

export const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const ORDER_STATUS = {
    GROUPED                       : -1,
    PENDING                       : 0,
    COMPLETED                     : 1,
    REJECTED                      : 2,
    DRIVER_ARRIVED_BUSINESS       : 3,
    READY_FOR_PICKUP              : 4,
    REJECTED_BY_BUSINESS          : 5,
    CANCELLED_BY_DRIVER           : 6,
    ACCEPTED_BY_BUSINESS          : 7,
    ACCEPTED_BY_DRIVER            : 8,
    PICKUP_COMPLETED_BY_DRIVER    : 9,
    PICKUP_FAILED_BY_DRIVER       : 10,
    DELIVERY_COMPLETED_BY_DRIVER  : 11,
    DELIVERY_FAILED_BY_DRIVER     : 12
}

export const STATUS_GROUP = {
    PENDINGS : [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.READY_FOR_PICKUP,
        ORDER_STATUS.ACCEPTED_BY_BUSINESS
    ],
    INPROGRESSES : [
        ORDER_STATUS.DRIVER_ARRIVED_BUSINESS,
        ORDER_STATUS.ACCEPTED_BY_DRIVER
    ],
    COMPLETES : [
        ORDER_STATUS.COMPLETED,
        ORDER_STATUS.PICKUP_COMPLETED_BY_DRIVER,
        ORDER_STATUS.DELIVERY_COMPLETED_BY_DRIVER
    ],
    CANCELES : [
        ORDER_STATUS.REJECTED,
        ORDER_STATUS.REJECTED_BY_BUSINESS,
        ORDER_STATUS.CANCELLED_BY_DRIVER,
        ORDER_STATUS.PICKUP_FAILED_BY_DRIVER,
        ORDER_STATUS.DELIVERY_FAILED_BY_DRIVER
    ]
}

export const DECIMAL = { // They are no longer configured from the builder, by default they are "Point" and "2"
    separator: '.',
    length: 2,
    currency: '$'
}

export const STORAGE_KEY = {
    ONLINE : 'app_is_online',
    USER : 'user_information'
}

export const DIRECTION = {
    RIGHT : 'right',
    LEFT : 'left'
}

export const USER_TYPE = {
    BUSINESS : 'business',
    CUSTOMER : 'customer',
    DRIVER : 'driver'
}

export const IMAGES = {
    menu        : require('../assets/icons/menu.png'),
    lunch       : require('../assets/icons/lunch.png'),
    avatar      : require('../assets/images/avatar.jpg'),
    arrow_up    : require('../assets/icons/arrow_up.png'),
    arrow_left  : require('../assets/icons/arrow_left.png'),
    map         : require('../assets/icons/map.png'),
    marker      : require('../assets/images/marker.png'),
    email       : require('../assets/icons/ic_email.png'),
    lock        : require('../assets/icons/ic_lock.png'),
    camera      : require('../assets/icons/camera.png'),
    support     : require('../assets/icons/help.png'),
    trash       : require('../assets/icons/trash.png'),
    phone       : require('../assets/icons/phone.png'),
    mail        : require('../assets/icons/mail.png'),
    chat        : require('../assets/icons/chat.png'),
    home        : require(`../assets/icons/home.png`),
    pending     : require(`../assets/icons/pending.png`),
    inprogress  : require(`../assets/icons/inprogress.png`),
    completed   : require(`../assets/icons/completed.png`),
    canceled    : require(`../assets/icons/canceled.png`),
    home_bg     : require(`../assets/images/home_bg.png`),
    dropdown    : require('../assets/icons/drop_down.png'),
    group       : require('../assets/icons/group.png'),
    calendar    : require('../assets/icons/calendar.png')
}