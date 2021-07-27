import React from 'react'
import { useConfig } from 'ordering-components/native'
import { MomentOption as MomentOptionController } from '../themes/original/components'

const MomentOption = ({ navigation, props }: any) => {
  const [{ configs }] = useConfig()
  const limitDays = configs?.max_days_preorder?.value
  const currentDate = new Date()
  const time = limitDays > 1
  ? currentDate.getTime() + ((limitDays - 1) * 24 * 60 * 60 * 1000)
  : limitDays === 1 ? currentDate.getTime() : currentDate.getTime() + (6 * 24 * 60 * 60 * 1000)

  currentDate.setTime(time)
  currentDate.setHours(23)
  currentDate.setMinutes(59)
  const momentOptionProps = {
    ...props,
    navigation: navigation,
    maxDate: currentDate
  }
  return (
    <>
      {currentDate && (
        <MomentOptionController {...momentOptionProps} />
      )}
    </>
  )
}

export default MomentOption
