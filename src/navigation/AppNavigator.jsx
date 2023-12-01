import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthContext} from './AuthContext';

import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';
import StoryScreen from '../screens/StoryScreen';

const AppStack = createNativeStackNavigator();

const AppNavigator = () => {
  const {user} = useContext(AuthContext);

  return (
    <NavigationContainer>
      <AppStack.Navigator
        initialRouteName={user ? 'Dashboard' : 'Login'}
        screenOptions={{headerShown: false}}>
        <AppStack.Screen name="Login" component={LoginScreen} />
        <AppStack.Screen name="OTP" component={OTPScreen} />
        <AppStack.Screen name="Profile" component={ProfileScreen} />
        <AppStack.Screen name="Dashboard" component={DashboardScreen} />
        <AppStack.Screen name="Story" component={StoryScreen} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
