import React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
interface Props {
  iconName: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  materialIcon?: boolean
}
const OFab = ({ iconName, materialIcon, onPress, style = {} }: Props) => {
  return (
    <View style={{ ...(style as any) }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.blackButton}>
        {materialIcon ? (
          <MaterialIcon name={iconName} color="white" size={20} />
        ) : (
          <Icon name={iconName} color="white" size={20} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  blackButton: {
    zIndex: 9999,
    height: 30,
    width: 30,
    backgroundColor: 'black',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default OFab;
