import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import Background from './Background';
import Header from './Header';
import GradientButton from './GradientButton';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../navigation/AuthContext';

// add the feelings name along with the emoji
const emojis = [
  {name: 'happy', emoji: '😀'},
  {name: 'angry', emoji: '😡'},
  {name: 'fear', emoji: '😱'},
  {name: 'suicidal', emoji: '🤐'},
  {name: 'stress', emoji: '😞'},
  {name: 'obsession', emoji: '😏'},
  {name: 'satisfied', emoji: '😋'},
  {name: 'lonely', emoji: '😒'},
  {name: 'confused', emoji: '🤔'},
  {name: 'harmful', emoji: '🤕'},
  {name: 'joyful', emoji: '🥳'},
];

const DashboardScreen = ({navigation, route}) => {
  const {characterName} = route.params;
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const user = auth().currentUser;
  const {setUser} = useContext(AuthContext);

  const handleEmojiSelect = (index, item) => {
    if (user) {
      const userRef = database().ref(`/users/${user.uid}/emojis`);

      // Get the current count for the selected emoji and update it
      userRef
        .child(item.name)
        .once('value')
        .then(snapshot => {
          let currentCount = snapshot.val();
          if (currentCount) {
            // Increment the count if it exists
            userRef.child(item.name).set(currentCount + 1);
          } else {
            // Set the count to 1 if it's the first time
            userRef.child(item.name).set(1);
          }
        });
    }
    Alert.alert('Feelings', `${item.name} ${item.emoji}`);
    setSelectedEmojis([...selectedEmojis, index]);
    console.log(selectedEmojis);
  };

  const handleLogout = () => {
    console.log('test');
    if (user) {
      try {
        auth()
          .signOut()
          .then(() => {
            setUser(null);
            navigation.navigate('Login');
          });
      } catch (error) {
        console.error('Error signing out: ', error);
      }
    } else {
      navigation.navigate('Login');
      console.log('No user currently signed in.');
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="Dashboard" />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.box}>
            <Text style={styles.welcomeText}>
              Welcome, {characterName ? characterName : ''}!
            </Text>
          </View>

          <View style={styles.feelingBox}>
            <Text style={styles.feelingText}>How are you feeling today?</Text>
            <FlatList
              data={emojis}
              style={{marginTop: 15}}
              horizontal={true}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  style={styles.emoji}
                  onPress={() => handleEmojiSelect(index, item)}>
                  <Text style={styles.emojiText}>{item.emoji}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.box}>
            <Text style={styles.dateText}>{new Date().toLocaleString()}</Text>
          </View>

          <View style={[styles.box]}>
            <View style={styles.buttonWrapper}>
              <GradientButton
                title="Bodyshaming"
                onPress={() =>
                  navigation.navigate('Story', {folderName: 'BodyShaming'})
                }
              />
            </View>
            <View style={[styles.buttonWrapper, {marginTop: 10}]}>
              <GradientButton
                title="Catfishing"
                onPress={() =>
                  navigation.navigate('Story', {folderName: 'Catfishing'})
                }
              />
            </View>
          </View>

          <View style={[styles.box]}>
            <View style={styles.buttonWrapper}>
              <GradientButton title="Logout" onPress={handleLogout} />
            </View>
          </View>
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  box: {
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight translucent background
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  feelingBox: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  welcomeText: {
    fontSize: 20,
    color: 'white',
  },
  feelingText: {
    fontSize: 18,
    color: 'white',
  },
  dateText: {
    fontSize: 16,
    color: 'white',
  },
  emoji: {
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  emojiText: {
    fontSize: 24,
    color: 'white',
  },
  buttonWrapper: {
    width: '100%',
  },
});

export default DashboardScreen;
