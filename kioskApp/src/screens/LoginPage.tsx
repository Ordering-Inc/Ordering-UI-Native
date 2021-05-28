import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const LoginPage = () => {
  return (
    <View>
        <Text style={styles.baseText}>
            LOGIN
            <Text style={styles.innerText}> PAGE</Text>
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontWeight: 'bold'
  },
  innerText: {
    color: 'red'
  }
});

export default LoginPage;
