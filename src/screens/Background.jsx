import React from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Background = ({children}) => {
  return (
    <LinearGradient colors={['#A8EDF9', '#FED6E3']} style={styles.gradient}>
      <ImageBackground
        source={require('../images/background-img.jpg')} // replace 'path_to_your_pattern.png' with your pattern image path
        style={styles.imageBackground}
        resizeMode="repeat">
        {children}
      </ImageBackground>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
});

export default Background;
