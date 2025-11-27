import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/Colors';

export default function Header() {
  return (
    <LinearGradient
      colors={[COLORS.primary.pink, COLORS.primary.cyan]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>AGRIBANK</Text>
          <Text style={styles.subtitle}>DIGITAL GUARD</Text>
          <Text style={styles.tagline}>🛡️ Trợ lý phòng chống lừa đảo</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
});
