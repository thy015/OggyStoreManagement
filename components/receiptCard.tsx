import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const ReceiptCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>Receipt</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2, 
    height: 100, 
    marginVertical: 10, 
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default ReceiptCard
