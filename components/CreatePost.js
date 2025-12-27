import React,{ useState } from 'react';

import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Text,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CreatePost =({ onCreatePost, currentUser }) => {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = () => {
    Alert.alert(
      'Image Upload',
      'In a real app, expo-image-picker would open here to select a photo.'
    );
  };

  const removeImage = () => setImageUri(null);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onCreatePost(content.trim(), imageUri || undefined);
    setContent('');
    setImageUri(null);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{
            uri: currentUser?.profilePicture || 'https://via.placeholder.com/48',
          }}
          style={styles.avatar}
        />
        <TextInput
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
            <Ionicons name="close-circle" size={32} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="#4F46E5" />
          <Text style={styles.iconText}>Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.postButton,
            { opacity: content.trim() ? 1 : 0.5 },
          ]}
          onPress={handleSubmit}
          disabled={!content.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default CreatePost

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginVertical: 12,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});