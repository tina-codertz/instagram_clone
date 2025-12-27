import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/api';
import { useAuth } from '../contexts/AuthContext';

export default function DiscoverScreen() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.filter(u => u.id !== user.id));
    } catch (err) {
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId) => {
    try {
      await api.post(`/users/${userId}/follow`);
      fetchUsers();
    } catch (err) {
      alert('Failed to follow');
    }
  };

  const unfollowUser = async (userId) => {
    try {
      await api.post(`/users/${userId}/unfollow`);
      fetchUsers();
    } catch (err) {
      alert('Failed to unfollow');
    }
  };

  const isFollowing = (targetId) => {
    // You'll need to fetch following list or check from backend
    // For now, assume we refresh list
    return false;
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Image
          source={{ uri: item.profilePic || 'https://via.placeholder.com/56' }}
          style={styles.avatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.username}</Text>
          {item.bio && <Text style={styles.userBio}>{item.bio}</Text>}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          item.isFollowing ? styles.unfollowButton : styles.followButton,
        ]}
        onPress={() => (item.isFollowing ? unfollowUser(item.id) : followUser(item.id))}
      >
        <Ionicons
          name={item.isFollowing ? 'person-remove-outline' : 'person-add-outline'}
          size={18}
          color={item.isFollowing ? '#6B7280' : '#fff'}
        />
        <Text style={{ color: item.isFollowing ? '#6B7280' : '#fff', fontWeight: '600' }}>
          {item.isFollowing ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text>No users found</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dfe3ef' },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  userDetails: { marginLeft: 16, flex: 1 },
  userName: { fontSize: 16, fontWeight: '600' },
  userBio: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  followButton: { backgroundColor: '#4F46E5' },
  unfollowButton: { backgroundColor: '#F3F4F6' },
});