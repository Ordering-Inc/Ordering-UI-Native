import * as React from 'react'
import AwesomeAlert from 'react-native-awesome-alerts'

interface Props {
    
}

const AlertProvider = () => {
    const [isShow, showAlert] = React.useState(false)
    const show = () => {
        showAlert(true);
    };
    
    const hide = () => {
        showAlert(false)
    };

    return (
        <AwesomeAlert
          show={isShow}
          showProgress={false}
          title="AwesomeAlert"
          message="I have a message for you!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            hide();
          }}
          onConfirmPressed={() => {
            hide();
          }}
        />
    )
}

export default AlertProvider;