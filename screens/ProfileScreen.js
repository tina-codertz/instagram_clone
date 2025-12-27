import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import PostCard from '../components/PostCard';

export default function ProfileScreen() {
  const { user, getAccountInfo } = useAuth();
  const [profile, setProfile] = useState(user);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfileAndPosts();
  }, []);

  const fetchProfileAndPosts = async () => {
    try {
      await getAccountInfo();
      const res = await api.get(`/users/${user.id}`);
      setProfile(res.data);
      setPosts(res.data.posts || []);
    } catch (err) {
      console.log(err);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      // Upload logic can be added later
      setProfile({ ...profile, profilePic: result.assets[0].uri });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: profile?.profilePic || 'https://via.placeholder.com/150' }}
                style={styles.avatar}
              />
              {isEditing && (
                <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{profile?.username}</Text>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                  <Ionicons name="pencil" size={18} color="#6366f1" />
                </TouchableOpacity>
              </View>

              <Text style={styles.email}>{profile?.email}</Text>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{posts.length}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{profile?.followerCount || 0}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>{profile?.followingCount || 0}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.postsTitle}>My Posts</Text>

        {posts.length === 0 ? (
          <Text>No posts yet</Text>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              author={profile}
              currentUser={user}
              comments={post.comments || []}
              onToggleLike={() => {}}
              onDeletePost={() => {}}
              onAddComment={() => {}}
              onDeleteComment={() => {}}
              getUser={() => profile}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 28 },
  headerRow: { flexDirection: 'row', gap: 20 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#4007dc' },
  uploadBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#6366f1', padding: 10, borderRadius: 30 },
  infoContainer: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { color: '#666', marginVertical: 8 },
  statsRow: { flexDirection: 'row', gap: 32, marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#666' },
  postsTitle: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
});