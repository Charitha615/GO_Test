import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import LottieView from 'lottie-react-native';

function App(): React.JSX.Element {
  const [splash, setSplash] = React.useState(true);

  const handleButtonClick = () => {
    setSplash(false);
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      {splash ? (
        <View style={styles.splashContainer}>
          <Text>Welcome to My App</Text>
          <LottieView
            source={require('./Animation.json')}
            autoPlay
            loop
            style={{width: 200, height: 200}}
          />
          <TouchableOpacity onPress={handleButtonClick}>
            <Text>Continue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {/* Your existing content */}
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#fff',
  },
});

export default App;
