import * as React from 'react'
import AwesomeAlert from 'react-native-awesome-alerts'
import { getTraduction } from '../utils'
import { useLanguage } from 'ordering-components/native'
interface Props {
  colors: any,
  open: boolean,
  title: string,
  content: Array<string>,
  onClose: () => void,
  onAccept: () => void
}

const Alert = (props: Props) => {
  const {
    open,
    title,
    content,
    onClose,
    onAccept,
  } = props
  const [, t] = useLanguage()
  const parseContent = (list: Array<string>) => {
    let allMessages: string = ''
    list?.map((message: string) => {
      allMessages = `* ${getTraduction(message)}\n` + allMessages
    })
    return allMessages
  }
  return (
    <AwesomeAlert
      show={open}
      showProgress={false}
      title={title}
      message={getTraduction(content?.[0])}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showConfirmButton={true}
      confirmText={t('ACCEPT', 'Accept')}
      confirmButtonColor={props?.colors?.primary}
      onCancelPressed={() => onClose()}
      onConfirmPressed={() => onAccept()}
    />
  )
}

export default Alert;
