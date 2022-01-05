export const USER_TYPE = {
	BUSINESS: 'business',
	CUSTOMER: 'customer',
	DRIVER: 'driver'
}

export const ORDER_TYPES = [
	{
		value: 1,
		content: 'DELIVERY',
		description: 'DELIVERY_DESCRIPTION'
	},
	{
		value: 2,
		content: 'PICKUP',
		description: 'PICKUP_DESCRIPTION',
	},
	{
		value: 3,
		content: 'EAT_IN',
		description: 'EAT_IN_DESCRIPTION',
	},
	{
		value: 4,
		content: 'CURBSIDE',
		description: 'CURBSIDE_DESCRIPTION',
	},
	{
		value: 5,
		content: 'DRIVE_THRU',
		description: 'DRIVE_THRU_DESCRIPTION',
	}
]

export const REVIEW_ORDER_COMMENTS = [
	'IT_WASNT_TASTY',
	'IT_DOESNT_PACK_WELL',
	'IT_ISNT_WORTH_WHAT_IT_COASTS',
	'TO_SLOW',
	'SUSTAINABLE_PACKAGING_WASNT_USED',
	'THEY_DID_NOT_FOLLOW_THE_ORDER_NOTES'
]