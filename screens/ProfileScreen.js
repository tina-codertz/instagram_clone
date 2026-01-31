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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import PostCard from '../components/PostCard';

export default function ProfileScreen({ route, navigation }) {
  const { user } = useAuth();

  // Determine which profile we're viewing
  const targetUserIdFromParams = route?.params?.userId;
  const currentUserId = user?.id;

  // If no specific userId passed in params → this is own profile
  const isOwnProfile = !targetUserIdFromParams;
  const targetUserId = targetUserIdFromParams || currentUserId;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Debug logs (remove later if you want)
  useEffect(() => {
    console.log('[ProfileScreen] Current user:', user);
    console.log('[ProfileScreen] targetUserIdFromParams:', targetUserIdFromParams);
    console.log('[ProfileScreen] currentUserId:', currentUserId);
    console.log('[ProfileScreen] targetUserId:', targetUserId);
    console.log('[ProfileScreen] isOwnProfile:', isOwnProfile);
  }, [user, route]);

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      Alert.alert('Error', 'Cannot load profile – not logged in or invalid user');
      return;
    }
    fetchProfileAndPosts();
  }, [targetUserId]);

  const fetchProfileAndPosts = async () => {
    setLoading(true);
    try {
      let endpoint = isOwnProfile ? '/users/me' : `/users/${targetUserId}`;

      console.log(`[Profile Fetch] Using endpoint: ${endpoint}`);

      const res = await api.get(endpoint);
      const profileData = res.data;

      // Normalize posts to match PostCard expectations
      const formattedPosts = (profileData.posts || []).map(post => ({
        ...post,
        id: post.id,
        content: post.content || '',
        createdAt: post.created_at,
        imageUrl: post.image || null,
        userId: post.user_id || profileData.id,
        likes: post.likes || [],
        likes_count: post.likes_count || post.likes?.length || 0,
        comments_count: post.comments?.length || 0,
      }));

      setProfile(profileData);
      setPosts(formattedPosts);
    } catch (err) {
      console.error('Profile fetch failed:', err?.response?.data || err.message);
      Alert.alert('Error', err?.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    // ... (your existing follow logic)
  };

  const handleUnfollow = async () => {
    // ... (your existing unfollow logic)
  };

  const pickImage = async () => {
    // ... (your existing image picker logic – only for own profile)
    if (!isOwnProfile) return;
    // rest of your pickImage code...
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileAndPosts();
    setRefreshing(false);
  };

  if (!currentUserId && isOwnProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Please log in to view your profile</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Profile not found</Text>
      </SafeAreaView>
    );
  }

  const isFollowing = profile?.followers?.some(f => f.id === currentUserId) || false;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header / Profile Info */}
        <View style={styles.headerCard}>
          {/* ... your existing header content ... */}
          {/* Make sure upload button only shows for own profile */}
          {isOwnProfile && isEditing && (
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          )}
          {/* ... rest of header ... */}
        </View>

        <Text style={styles.postsTitle}>
          {isOwnProfile ? 'My Posts' : `${profile.username}'s Posts`}
        </Text>

        {posts.length === 0 ? (
          <Text style={styles.noPostsText}>No posts yet</Text>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              author={{
                name: profile.username,
                profilePicture: profile.profile_pic,
              }}
              currentUser={user}
              comments={post.comments || []}
              onToggleLike={() => Alert.alert('Like', 'Coming soon')}
              onDeletePost={() => Alert.alert('Delete', 'Coming soon')}
              onAddComment={() => {}}
              onDeleteComment={() => {}}
              getUser={() => ({ name: profile.username, profilePicture: profile.profile_pic })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
  },
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
    alignItems: 'flex-start',
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
    fontSize: 22,
    fontWeight: '700',
    marginRight: 8,
  },
  email: {
    color: '#6b7280',
    fontSize: 14,
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
    fontWeight: '700',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  actions: {
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontWeight: '600',
    color: '#111827',
  },
  followButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  unfollowButton: {
    backgroundColor: '#f3f4f6',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  messageButtonText: {
    fontWeight: '600',
    color: '#111827',
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  noPostsText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 40,
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    marginTop: 40,
    fontSize: 16,
  },
});