import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';

const Header = ({title}) => {
  const window = useWindowDimensions();

  const isLargeScreen = window.width > 768;
  const headerHeight = isLargeScreen ? 120 : 100;
  const fontSize = isLargeScreen ? 28 : 22;

  const dynamicStyles = {
    header: {
      height: headerHeight,
    },
    headerText: {
      fontSize: fontSize,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, dynamicStyles.header]}>
        <Text style={[styles.headerText, dynamicStyles.headerText]}>
          {title}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
    }),
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff44',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
});

export default Header;
