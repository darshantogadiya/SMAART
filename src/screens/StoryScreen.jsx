import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Button,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';
import GradientButton from './GradientButton';
import CheckBox from '@react-native-community/checkbox';
import storage from '@react-native-firebase/storage';
import Header from './Header';
import Background from './Background';
import {firebase} from '@react-native-firebase/database';

const {width, height} = Dimensions.get('window');

const StoryScreen = ({route, navigation}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedQuestions, setFetchedQuestions] = useState(false);
  const [answers, setAnswers] = useState({});
  const [answerValidation, setAnswerValidation] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);
  const [scale, setScale] = useState(new Animated.Value(1));
  const [lastScale, setLastScale] = useState(1);

  const database = firebase.database();

  const folderName = route.params.folderName;

  const scrollViewRef = useRef(null);

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: {scale: scale},
      },
    ],
    {
      useNativeDriver: false,
    },
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {scale: scale}], {
        useNativeDriver: false,
        listener: (event, gestureState) => {
          let touches = event.nativeEvent.touches;
          if (touches.length > 1) {
            let touch1 = touches[0];
            let touch2 = touches[1];
            let distance = Math.sqrt(
              Math.pow(touch1.pageX - touch2.pageX, 2) +
                Math.pow(touch1.pageY - touch2.pageY, 2),
            );
            if (!this.distance) {
              this.distance = distance;
            }
            let newScale = gestureState.scale * (distance / this.distance);
            setScale(new Animated.Value(newScale));
          }
        },
      }),
      onPanResponderRelease: () => {
        setLastScale(scale);
        this.distance = null;
      },
    }),
  ).current;

  useEffect(() => {
    const fetchImages = async () => {
      const imageRefs = await storage().ref(folderName).listAll();
      return Promise.all(imageRefs.items.map(ref => ref.getDownloadURL()));
    };

    const fetchQuestions = async () => {
      return new Promise((resolve, reject) => {
        database.ref('/questions').once(
          'value',
          snapshot => {
            const data = snapshot.val();
            const questionsArray = Object.keys(data).map(key => data[key]);
            resolve(questionsArray);
          },
          reject,
        );
      });
    };

    const fetchData = async () => {
      try {
        const [imageURLs, questionsArray] = await Promise.all([
          fetchImages(),
          fetchQuestions(),
        ]);
        console.log('IMG::::', [...imageURLs, ...questionsArray]);
        setItems([...imageURLs, ...questionsArray]);
      } catch (err) {
        setError(err.message);
        console.error('There was an error fetching data: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folderName]);

  const handleAnswerQuestion = (questionId, answer) => {
    console.log('>>', answers, questionId, answer);
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const allQuestionsAnswered = () => {
    let questions_length = items
      .map(item => !item.includes('https'))
      .filter(i => i == true).length;
    return questions_length && Object.keys(answers).length === questions_length;
  };

  const handleGoBack = () => {
    if (firebase.auth().currentUser) {
      const userId = firebase.auth().currentUser.uid;
      const userRef = firebase.database().ref(`/users/${userId}/questions`);

      // Store each question and its answer to Firebase
      Object.entries(answers).forEach(([question, answer]) => {
        userRef
          .child(question)
          .once('value')
          .then(snapshot => {
            let currentAnswers = snapshot.val();
            if (currentAnswers && Array.isArray(currentAnswers)) {
              userRef.child(question).set([...currentAnswers, answer]);
            } else {
              userRef.child(question).set([answer]);
            }
          });
      });
    }
    navigation.goBack();
  };

  const renderItemImage = (item, idx) => (
    <View style={styles.imageContainer} key={idx}>
      <Image source={{uri: item}} style={styles.image} />
    </View>
  );

  const renderQuestionTile = () => {
    return (
      <View style={styles.questionTileContainer}>
        {items
          .filter(item => !item.includes('https'))
          .map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <Text style={{marginBottom: 5, fontSize: 18, fontWeight: '500'}}>
                {question}
              </Text>
              <View style={styles.checkBoxContainer}>
                <View style={styles.checkBoxInnerContainer}>
                  <CheckBox
                    value={answers[index] === true}
                    onValueChange={() => handleAnswerQuestion(index, true)}
                  />
                  <Text>{'Yes'}</Text>
                </View>
                <View style={styles.checkBoxInnerContainer}>
                  <CheckBox
                    value={answers[index] === false}
                    onValueChange={() => handleAnswerQuestion(index, false)}
                  />
                  <Text>{'No'}</Text>
                </View>
              </View>
            </View>
          ))}
      </View>
    );
  };

  // Navigate to previous image or question
  const handlePrevious = () => {
    if (currentItem > 0) {
      setCurrentItem(prevItem => prevItem - 1);
      scrollViewRef.current.scrollTo({
        x: (currentItem - 1) * width,
        animated: true,
      });
    }
  };

  // Navigate to next image or question
  const handleNext = () => {
    if (currentItem < items.length - 1) {
      setCurrentItem(prevItem => prevItem + 1);
      scrollViewRef.current.scrollTo({
        x: (currentItem + 1) * width,
        animated: true,
      });
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <Header title={`${folderName}`} />
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : error ? (
            <Text style={{color: 'red'}}>{error}</Text>
          ) : (
            <View style={styles.listWrapper}>
              {/* <FlatList
                data={images}
                contentContainerStyle={styles.listContainer}
                keyExtractor={(item, index) => index.toString()}
                // onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                renderItem={({item}) => (
                  <Image
                    source={{uri: item}}
                    style={styles.image}
                    resizeMode="contain"
                  />
                )}
              /> */}
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                {...panResponder.panHandlers}>
                {items
                  .filter(item => item.includes('https'))
                  .map((item, index) => (
                    <Animated.View
                      style={{
                        transform: [{scale: scale}],
                      }}
                      key={index}>
                      {renderItemImage(item)}
                    </Animated.View>
                  ))}
                {renderQuestionTile()}
              </ScrollView>
            </View>
          )}
          <View style={styles.navButtons}>
            <TouchableOpacity onPress={handlePrevious}>
              <Text style={styles.navButtonText}>{'< Previous'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext}>
              <Text style={styles.navButtonText}>{'Next >'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{marginVertical: 10, width: '90%'}}>
            <GradientButton
              title={
                allQuestionsAnswered() ? 'Go Back' : 'Answer the Questions'
              }
              disabled={allQuestionsAnswered() ? false : true}
              onPress={handleGoBack}
            />
          </View>
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.9, // 90% of screen width
    height: height * 0.9, // 40% of screen height
    resizeMode: 'contain',
    flex: 1,
    alignSelf: 'center',
    // margin: 10,
  },
  questionTileContainer: {
    width: width,
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  questionContainer: {
    width: width * 0.9, // 90% of screen widths
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'column',
    borderBottomColor: '#ccc',
    marginVertical: 5,
    padding: 5,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxInnerContainer: {
    width: '20%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  navButtonText: {
    fontSize: 16,
    color: '#007BFF', // Example color
  },
  imageScrollView: {
    width: '100%',
    height: (width / 16) * 9, // assuming a 16:9 aspect ratio
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
  },
});

export default StoryScreen;
