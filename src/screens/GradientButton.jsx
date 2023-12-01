import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = ({title, onPress, disabled}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={styles.buttonContainer}>
      <LinearGradient
        colors={['#FFA726', '#FF5722']} // Gradient colors of awareness
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradient}>
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10, // Reduced border radius for a rectangular look
    overflow: 'hidden',
    width: '90%', // 90% of the parent container's width
    alignSelf: 'center', // Aligns button to center in parent container
  },
  gradient: {
    paddingVertical: 10, // Increased padding for height
    paddingHorizontal: 10, // Adjust horizontal padding as needed
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18, // Increased font size for better visibility
    fontWeight: 'bold',
    color: 'white',
  },
});

export default GradientButton;
