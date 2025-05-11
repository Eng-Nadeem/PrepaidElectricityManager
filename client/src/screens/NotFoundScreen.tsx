import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Spacing } from '../styles/Theme';

const NotFoundScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Page Not Found</Text>
        <Text style={styles.description}>
          The page you are looking for doesn't exist or has been moved.
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[6],
  },
  title: {
    fontSize: FontSize['6xl'],
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing[2],
  },
  subtitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.semibold,
    color: Colors.gray800,
    marginBottom: Spacing[4],
  },
  description: {
    fontSize: FontSize.base,
    color: Colors.gray600,
    textAlign: 'center',
    marginBottom: Spacing[8],
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: Spacing[2],
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
});

export default NotFoundScreen;