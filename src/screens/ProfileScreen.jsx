import React, {useState, useContext} from 'react';
import {View, Image, Button, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import Header from './Header';
import Background from './Background';
import GradientButton from './GradientButton';
import database from '@react-native-firebase/database';
import {AuthContext} from '../navigation/AuthContext';

const namesData = [
  {
    name: 'Zara Nova',
    imagePath:
      'https://upload.wikimedia.org/wikipedia/en/5/58/Zara_by_Segovia.jpg',
  },
  {
    name: 'Max Stardust',
    imagePath:
      'https://static.wikia.nocookie.net/cookierunkingdom/images/a/a8/Stardust_illustration.png/revision/latest?cb=20230313213329',
  },
  {
    name: 'Luna Starbright',
    imagePath:
      'https://static.wikia.nocookie.net/characters/images/5/51/Alex_Noa_for_Lunar_Silver_Star_Harmony.jpg/revision/latest?cb=20201007131112',
  },
  {
    name: 'Orion Nebula',
    imagePath:
      'https://i.pinimg.com/originals/3d/17/ba/3d17bafb0ead3aab475d747a334bc077.jpg',
  },
  {
    name: 'Nova Quest',
    imagePath:
      'https://static.wikia.nocookie.net/dragonquest/images/b/ba/Nova_2020.png/revision/latest?cb=20210904133234',
  },
  {
    name: 'Cosmo Skyler',
    imagePath:
      'https://static.wikia.nocookie.net/petstarplanet-ultimate-fanon/images/9/9c/Cosmo.png/revision/latest?cb=20191222114410',
  },
  {
    name: 'Astro Nova',
    imagePath:
      'https://static.wikia.nocookie.net/monsterhigh/images/a/a9/Profile_art_-_Astranova.png/revision/latest?cb=20150508161334',
  },
  {
    name: 'Nebula Nova',
    imagePath:
      'https://static.wikia.nocookie.net/villains/images/c/cf/Nebula_Vol_1_1_textless.jpg/revision/latest?cb=20200304004059',
  },
  {
    name: 'Stella Starbeam',
    imagePath:
      'https://assets.mycast.io/actor_images/actor-stella-hanks-523403_large.jpg?1661352232',
  },
  {
    name: 'Remy Rocket',
    imagePath: 'https://mcdn.wallpapersafari.com/medium/38/53/DgmZev.png',
  },
  {
    name: 'Zoey Zero-G',
    imagePath:
      'https://static.wikia.nocookie.net/granblue-fantasy-versus/images/0/07/Characters_15_zooey.ab20c27c.png/revision/latest?cb=20230808114301',
  },
  {
    name: 'Captain Comet',
    imagePath:
      'https://upload.wikimedia.org/wikipedia/en/d/d5/Comet_shanedavis.jpg',
  },
  {
    name: 'Orion Thunderbolt',
    imagePath:
      'https://static.wikia.nocookie.net/character-stats-and-profiles/images/2/28/Orion_Eden.png/revision/latest?cb=20200903095732',
  },
  {
    name: 'Cosmic Cassidy',
    imagePath:
      'https://upload.wikimedia.org/wikipedia/en/0/0b/Blue_Devil_%28Dan_Cassidy%29.png',
  },
  {
    name: 'Nebula Nick',
    imagePath:
      'https://static.wikia.nocookie.net/nickelodeon/images/9/99/Crash_Nebula.jpg/revision/latest?cb=20181029192241',
  },
  {
    name: 'Quasar Quinn',
    imagePath:
      'https://static.wikia.nocookie.net/character-level/images/f/fd/QuasarRENDER.png/revision/latest?cb=20190522152640',
  },
  {
    name: 'Astro Alex',
    imagePath:
      'https://static.wikia.nocookie.net/characters/images/0/06/Astro_Boy_%281983%29.png/revision/latest?cb=20190406225854',
  },
  {
    name: 'Solaris Sam',
    imagePath:
      'https://static.wikia.nocookie.net/all-fiction-battles/images/1/1f/Solaris.png/revision/latest?cb=20210303221624',
  },
  {
    name: 'Galaxy Gabe',
    imagePath:
      'https://static.wikia.nocookie.net/marveldatabase/images/4/49/Gabriel_Vargas_%28Earth-616%29_from_Annihilation_Conquest_-_Starlord_Vol_1_1_0001.jpg/revision/latest?cb=20191209022000',
  },
  {
    name: 'Venus Vega',
    imagePath:
      'https://static.wikia.nocookie.net/nickelodeon/images/a/ac/Vexus.png/revision/latest?cb=20170313015138',
  },
];

const ProfileScreen = ({navigation}) => {
  const [selectedName, setSelectedName] = useState(namesData[0].name);
  const [selectedImage, setSelectedImage] = useState(namesData[0].imagePath);
  const user = auth().currentUser;
  const {setUser} = useContext(AuthContext);

  const handleContinue = () => {
    if (user) {
      const userRef = database().ref(`/users/${user.uid}`);
      userRef.update({
        name: selectedName,
      });
    }
    // setUser(user);
    navigation.navigate('Dashboard', {characterName: selectedName});
  };

  const handleValueChange = (itemValue, itemIndex) => {
    setSelectedName(itemValue);
    setSelectedImage(namesData[itemIndex].imagePath);
  };

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="Profile" />
        </View>
        <View style={styles.contentContainer}>
          {selectedImage && (
            <Image
              style={styles.image}
              source={{uri: selectedImage}}
              resizeMode="stretch"
            />
          )}
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedName}
              onValueChange={handleValueChange}
              itemStyle={styles.pickerItem}>
              {namesData.map((item, index) => (
                <Picker.Item key={index} label={item.name} value={item.name} />
              ))}
            </Picker>
          </View>
          <GradientButton title="Continue" onPress={handleContinue} />
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerContainer: {
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: 250,
    height: 150,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  pickerItem: {
    height: 150,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default ProfileScreen;
