import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfileAndPosts();
  }, []);

  const fetchProfileAndPosts = async () => {
    try {
      await getAccountInfo();
      const res = await api.get(`/users/${user.id}`);
      const profileData = res.data;
      
      // Transform posts to match what PostCard expects
      const formattedPosts = (profileData.posts || []).map(post => ({
        ...post,
        author: {
          name: profileData.username,
          profilePicture: profileData.profile_pic || 'https://via.placeholder.com/150'
        }
      }));

      setProfile(profileData);
      setPosts(formattedPosts);
    } catch (err) {
      console.error('Error fetching profile:', err);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const handleFollow = async () => {
    try {
      await api.post(`/users/${profile.id}/follow`);
      await fetchProfileAndPosts();
    } catch (err) {
      console.error('Error following user:', err);
      Alert.alert('Error', 'Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.post(`/users/${profile.id}/unfollow`);
      await fetchProfileAndPosts();
    } catch (err) {
      console.error('Error unfollowing user:', err);
      Alert.alert('Error', 'Failed to unfollow user');
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Please allow access to your photos to upload a profile picture');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const formData = new FormData();
      formData.append('profilePic', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'profile.jpg'
      });

      const response = await api.patch('/users/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update local state with new profile picture
      setProfile(prev => ({ ...prev, profile_pic: response.data.profilePic }));
      Alert.alert('Success', 'Profile picture updated successfully');
    } catch (err) {
      console.error('Error uploading image:', err);
      Alert.alert('Error', 'Failed to upload profile picture');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileAndPosts();
    setRefreshing(false);
  };

  const isFollowing = profile?.followers?.some(follower => follower.id === user?.id);
  const isOwnProfile = user?.id === profile?.id;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView 
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: profile?.profile_pic || 'https://via.placeholder.com/150' }}
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
                {isOwnProfile && (
                  <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Ionicons name="pencil" size={18} color="#6366f1" />
                  </TouchableOpacity>
                )}
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

              {/* Follow/Edit Profile Buttons */}
              <View style={styles.actions}>
                {isOwnProfile ? (
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => setIsEditing(!isEditing)}
                  >
                    <Text style={styles.editButtonText}>
                      {isEditing ? 'Save' : 'Edit Profile'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.followButtons}>
                    <TouchableOpacity 
                      style={[styles.followButton, isFollowing && styles.unfollowButton]}
                      onPress={isFollowing ? handleUnfollow : handleFollow}
                    >
                      <Text style={styles.followButtonText}>
                        {isFollowing ? 'Following' : 'Follow'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.messageButton}>
                      <Text style={styles.messageButtonText}>Message</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.postsTitle}>My Posts</Text>

        {posts.length === 0 ? (
          <Text style={styles.noPostsText}>No posts yet</Text>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                userId: post.user_id || user.id,
                content: post.content || '',
                createdAt: post.created_at,
                likes: post.likes || [],
                imageUrl: post.image
              }}
              author={post.author || {
                name: profile?.username || 'Unknown',
                profilePicture: profile?.profile_pic || 'https://via.placeholder.com/150'
              }}
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
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  uploadBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  email: {
    color: '#6b7280',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  noPostsText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 32,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  editButtonText: {
    fontWeight: '600',
    color: '#000',
  },
  followButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  followButton: {
    backgroundColor: '#0095f6',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    flex: 2,
  },
  unfollowButton: {
    backgroundColor: '#f0f0f0',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  unfollowButtonText: {
    color: '#000',
  },
  messageButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButtonText: {
    fontWeight: '600',
  },
});