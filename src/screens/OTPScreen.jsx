import React, {useState, useContext} from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import Background from './Background';
import Header from './Header';
import GradientButton from './GradientButton';
import {AuthContext} from '../navigation/AuthContext';

const OTPScreen = ({navigation, route}) => {
  const [otp, setOtp] = useState('');
  const {confirmation, fullNumber} = route.params;
  const {setUser} = useContext(AuthContext);

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Error!', 'Please enter a valid OTP.');
      return;
    }
    try {
      await confirmation.confirm(otp);
      const user = firebase.auth().currentUser;
      if (user) {
        const userRef = database().ref(`/users/${user.uid}`);
        userRef.update({
          phoneNumber: fullNumber,
          timestamp: Date.now(),
        });
        userRef.once('value').then(snapshot => {
          const userData = snapshot.val();
          if (userData && userData.name) {
            setUser(userData);
            navigation.navigate('Dashboard', {characterName: userData.name});
          } else {
            navigation.navigate('Profile');
          }
        });
      } else {
        Alert.alert('Error!', 'The OTP is incorrect.');
      }
    } catch (error) {
      console.log('Err in handleVerifyOTP:', error);
      Alert.alert(
        'Error!',
        'There was an issue verifying the OTP. Please try again.',
      );
    }
  };

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Header title="OTP" />
          </View>
          <View style={styles.contentContainer}>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
            />
            <View style={styles.buttonMain}>
              <View style={styles.buttonWrapper}>
                <GradientButton title="Verify" onPress={handleVerifyOTP} />
              </View>
              <View style={styles.buttonWrapper}>
                <GradientButton
                  title="Back"
                  onPress={() => navigation.goBack()}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    alignSelf: 'center',
  },
  buttonMain: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonWrapper: {
    width: '48%',
  },
});

export default OTPScreen;
