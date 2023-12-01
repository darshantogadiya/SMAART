import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Header from '../screens/Header';
import Background from '../screens/Background';
import GradientButton from './GradientButton';
import database from '@react-native-firebase/database';

const imgData = [
  'https://static.wikia.nocookie.net/characters/images/5/51/Alex_Noa_for_Lunar_Silver_Star_Harmony.jpg/revision/latest?cb=20201007131112',
  'https://upload.wikimedia.org/wikipedia/en/5/58/Zara_by_Segovia.jpg',
  'https://assets.mycast.io/actor_images/actor-stella-hanks-523403_large.jpg?1661352232',
  'https://static.wikia.nocookie.net/characters/images/0/06/Astro_Boy_%281983%29.png/revision/latest?cb=20190406225854',
  'https://static.wikia.nocookie.net/villains/images/c/cf/Nebula_Vol_1_1_textless.jpg/revision/latest?cb=20200304004059',
];

const countries = [
  {label: 'US (+1)', value: '+1'},
  {label: 'IN (+91)', value: '+91'},
  {label: 'SP (+65)', value: '+65'},
];

const LoginScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentItem, setCurrentItem] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(countries[0].value);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const userRef = database().ref(`/users/${user.uid}`);

        // Update the timestamp
        await userRef.update({
          lastLogin: Date.now(),
        });

        userRef.once('value').then(snapshot => {
          const userData = snapshot.val();
          if (userData && userData.name) {
            navigation.navigate('Dashboard', {characterName: userData.name});
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItem(prevIndex => {
        if (prevIndex < imgData.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(interval);
          return prevIndex;
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLoginPress = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error!', 'Please enter a valid phone number.');
      return;
    }

    const fullNumber = selectedCountry + phoneNumber;

    // Check if phoneNumber exists in the database
    database()
      .ref('/users')
      .orderByChild('phoneNumber')
      .equalTo(fullNumber)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          // If phoneNumber is found in the database, navigate to Dashboard
          const userData = Object.values(snapshot.val())[0]; // get the first match (assuming phone numbers are unique)
          navigation.navigate('Dashboard', {characterName: userData.name});
        } else {
          // If phoneNumber isn't found, initiate OTP process
          initiateOTP(fullNumber);
        }
      })
      .catch(error => {
        console.error('Error checking phone number:', error);
      });
  };

  const initiateOTP = async fullNumber => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(fullNumber);
      navigation.navigate('OTP', {confirmation, fullNumber});
    } catch (error) {
      console.log('Err in handleLoginPress:', error);
      Alert.alert(
        'Error!',
        'There was an issue sending the OTP. Please ensure you entered a valid phone number.',
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
            <Header title="Login" />
          </View>
          <View style={styles.contentContainer}>
            <Image
              style={styles.image}
              source={{uri: imgData[currentItem]}}
              resizeMode="stretch"
            />

            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.countryPicker}
                onPress={() => setDropdownVisible(!dropdownVisible)}>
                <Text>{selectedCountry}</Text>
                {dropdownVisible && (
                  <View style={styles.dropdown}>
                    <ScrollView style={styles.dropdownScroll}>
                      {countries.map((country, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setSelectedCountry(country.value);
                            setDropdownVisible(false);
                          }}
                          style={styles.countryItem}>
                          <Text>{country.value}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={handleLoginPress}
              />
            </View>

            <GradientButton title="Next" onPress={handleLoginPress} />
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
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    zIndex: 10,
  },
  countryPicker: {
    width: 40,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#eee',
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    width: 40,
    position: 'absolute',
    top: '70%',
    left: 0,
    right: 0,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    zIndex: 2121,
  },
  dropdownScroll: {
    flex: 1,
  },
  countryItem: {
    padding: 5,
  },
  input: {
    flex: 1,
    padding: 10,
  },
});

export default LoginScreen;
