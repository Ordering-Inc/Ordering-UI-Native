import * as React from 'react'
import AwesomeAlert from 'react-native-awesome-alerts'
import { getTraduction } from '../utils'
import { useLanguage } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
interface Props {
  open: boolean,
  title: string,
  content: Array<string>,
  onClose: () => void,
  onAccept: () => void,
  onCancel: () => void
}

const Alert = (props: Props) => {
  const {
    open,
    title,
    content,
    onClose,
    onAccept,
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();

  return (
    <AwesomeAlert
      show={open}
      showProgress={false}
      title={title}
      message={typeof content === 'string'
        ? content
        : getTraduction(content?.[0], t)
      }
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showConfirmButton={true}
      confirmText={t('ACCEPT', 'Accept')}
      confirmButtonColor={theme.colors.primary}
      onCancelPressed={() => onClose()}
      showCancelButton={!!props.onCancel}
      onConfirmPressed={() => onAccept()}
    />
  )
}

export default Alert;
