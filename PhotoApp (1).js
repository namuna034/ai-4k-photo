import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// ⚠️ Apni API keys yahan daalein
const REMOVE_BG_KEY = 'YOUR_REMOVE_BG_KEY_HERE';
const STABILITY_KEY = 'YOUR_STABILITY_API_KEY_HERE'; // starts with sk-

export default function App() {
  const [originalUri, setOriginalUri] = useState(null);
  const [resultUri, setResultUri] = useState(null);
  const [stylePrompt, setStylePrompt] = useState('oil painting');
  const [loading, setLoading] = useState(false);

  // Photo select karna
  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission chahiye', 'Photo access allow karein.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setOriginalUri(result.assets[0].uri);
      setResultUri(null);
    }
  };

  // Binary response ko base64 image URI mein badalna
  const blobToDataUri = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // Background remove karna (remove.bg)
  const removeBackground = async () => {
    if (!originalUri) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('image_file', {
        uri: originalUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      form.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': REMOVE_BG_KEY },
        body: form,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'remove.bg error');
      }

      const blob = await response.blob();
      const dataUri = await blobToDataUri(blob);
      setResultUri(dataUri);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Style badalna (Stability AI)
  const applyStyle = async () => {
    if (!originalUri) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('image', {
        uri: originalUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      form.append('prompt', stylePrompt);
      form.append('fidelity', '0.5');

      const response = await fetch(
        'https://api.stability.ai/v2beta/stable-image/control/style',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${STABILITY_KEY}`,
            Accept: 'image/*',
          },
          body: form,
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Stability AI error');
      }

      const blob = await response.blob();
      const dataUri = await blobToDataUri(blob);
      setResultUri(dataUri);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>AI Photo Editor</Text>

        <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
          <Text style={styles.pickButtonText}>
            {originalUri ? 'Dusri Photo Chuniye' : 'Photo Chuniye'}
          </Text>
        </TouchableOpacity>

        {originalUri && (
          <Image source={{ uri: originalUri }} style={styles.preview} />
        )}

        {originalUri && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={removeBackground}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>Background Hataein</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Style (jaise: cartoon, oil painting, anime)</Text>
            <TextInput
              style={styles.input}
              value={stylePrompt}
              onChangeText={setStylePrompt}
              placeholder="Style likhein"
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={applyStyle}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>Style Lagayein</Text>
            </TouchableOpacity>
          </>
        )}

        {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

        {resultUri && !loading && (
          <View style={styles.resultBox}>
            <Text style={styles.label}>Result:</Text>
            <Image source={{ uri: resultUri }} style={styles.preview} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 16, alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  pickButton: {
    backgroundColor: '#D97757',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  pickButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  preview: {
    width: 260,
    height: 260,
    borderRadius: 12,
    marginVertical: 12,
    backgroundColor: '#f0f0f0',
  },
  actionButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: { color: '#fff', fontWeight: '600' },
  label: { alignSelf: 'flex-start', marginTop: 10, marginBottom: 4, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginBottom: 8,
  },
  resultBox: { marginTop: 20, alignItems: 'center', width: '100%' },
});
