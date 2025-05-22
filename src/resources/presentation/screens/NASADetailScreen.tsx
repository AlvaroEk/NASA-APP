import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types/navigation';
import Animated, { FadeInDown } from 'react-native-reanimated';

type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;

export default function NASADetailScreen() {
  const { params } = useRoute<DetailRouteProp>();
  const { imageUrl, title, description } = params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Text entering={FadeInDown.duration(400)} style={styles.title}>
        {title}
      </Animated.Text>

      <Animated.Image
        entering={FadeInDown.delay(200).duration(400)}
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />

      <Animated.Text
        entering={FadeInDown.delay(400).duration(500)}
        style={styles.description}
      >
        {description}
      </Animated.Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'justify',
  },
});
