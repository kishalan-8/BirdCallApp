import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Modal, ScrollView } from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const keypadButtons = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['menu', '0', 'backspace']
];

const birdMap = {
  '0': 'Black Hooded Oriole',
  '1': 'Changeable Hawk-Eagle',
  '2': 'Rose-ringed Parakeet',
  '3': 'Asian Brown Flycatcher',
  '4': 'Yellow-browed Bulbul',
  '5': 'Brown-capped Babbler',
  '6': 'Ceylon Jungle Fowl',
  '7': 'Sri Lankan Blue Magpie',
  '8': 'Asian Koel',
  '9': 'Oriental Magpie Robin',
};

const shortSounds = {
  '0': require('./assets/sounds/short/0.mp3'),
  '1': require('./assets/sounds/short/1.mp3'),
  '2': require('./assets/sounds/short/2.mp3'),
  '3': require('./assets/sounds/short/3.mp3'),
  '4': require('./assets/sounds/short/4.mp3'),
  '5': require('./assets/sounds/short/5.mp3'),
  '6': require('./assets/sounds/short/6.mp3'),
  '7': require('./assets/sounds/short/7.mp3'),
  '8': require('./assets/sounds/short/8.mp3'),
  '9': require('./assets/sounds/short/9.mp3'),
};

const longSounds = {
  '0': require('./assets/sounds/long/0.mp3'),
  '1': require('./assets/sounds/long/1.mp3'),
  '2': require('./assets/sounds/long/2.mp3'),
  '3': require('./assets/sounds/long/3.mp3'),
  '4': require('./assets/sounds/long/4.mp3'),
  '5': require('./assets/sounds/long/5.mp3'),
  '6': require('./assets/sounds/long/6.mp3'),
  '7': require('./assets/sounds/long/7.mp3'),
  '8': require('./assets/sounds/long/8.mp3'),
  '9': require('./assets/sounds/long/9.mp3'),
};

export default function App() {
  const [input, setInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const playSound = async (soundAsset) => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(soundAsset);
      await soundObject.playAsync();
      return new Promise((resolve) => {
        soundObject.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            soundObject.unloadAsync();
            resolve();
          }
        });
      });
    } catch (error) {
      console.warn('Sound playback error:', error);
    }
  };

  const handlePress = async (value) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (value === 'backspace') {
      setInput(prev => prev.slice(0, -1));
    } else if (value === 'menu') {
      setModalVisible(true);
    } else if (/^[0-9]$/.test(value)) {
      setInput(prev => prev + value);

      const soundAsset = shortSounds[value];
      if (soundAsset) {
        await playSound(soundAsset);
      }
    }
  };

  const handleCallPress = async () => {
    if (!input) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    for (const digit of input) {
      const soundAsset = longSounds[digit];
      if (soundAsset) {
        await playSound(soundAsset);
      }
    }

    setInput('');
  };

  const renderIcon = (value) => {
    switch (value) {
      case 'backspace':
        return <MaterialIcons name="backspace" size={30} color="#1a3d33" />;
      case 'menu':
        return <Entypo name="menu" size={30} color="#1a3d33" />;
      default:
        return <Text style={styles.keyText}>{value}</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📞 Dial Into the Forest</Text>
      <Text style={styles.input}>{input}</Text>

      <View style={styles.keypad}>
        {keypadButtons.map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.key}
                onPress={() => handlePress(key)}
                onLongPress={() => {
                  if (key === 'backspace') {
                    setInput(''); //
                  }
                }}
                delayLongPress={500}
              >
                {renderIcon(key)}
              </TouchableOpacity>
            ))}

          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.callButton} onPress={handleCallPress}>
        <MaterialIcons name="phone" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bird Sounds</Text>
            <ScrollView>
              {Object.entries(birdMap).map(([digit, name]) => (
                <Text key={digit} style={styles.birdEntry}>
                  {digit} - {name}
                </Text>
              ))}
            </ScrollView>

            <Text style={styles.credit}>
              App developed by Kishalan | Bird Sounds Recorded by Dinoj
            </Text>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7f5ee',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e5e4e',
  },
  input: {
    fontSize: 30,         
    fontWeight: 'bold',   
    marginBottom: 30,
    color: '#333',
  },
  keypad: {
    marginBottom: 25,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  key: {
    backgroundColor: '#cfe3da',
    borderRadius: 100,
    width: 80,
    height: 80,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1a3d33',
  },
  callButton: {
    backgroundColor: '#2e5e4e',
    width: 80,
    height: 80,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  birdEntry: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2e5e4e',
  },
  modalClose: {
    backgroundColor: '#2e5e4e',
    padding: 10,
    marginTop: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  credit: {
  fontSize: 12,
  color: '#666',
  textAlign: 'center',
  marginTop: 15,
},

});
