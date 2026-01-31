import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../hooks/usePost';

export default function FeedScreen() {
  const { user } = useAuth();
  const {
    posts,
    loading,
    createPost,
    toggleLike,
    deletePost,
    addComment,
    deleteComment,
    getCommentsByPost,
    refresh,
  } = usePosts(user?.id);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading feed...</Text>
      </SafeAreaView>
    );
  }

  const getUserFromPost = (post) => post.user || { username: 'Unknown' };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <CreatePost onCreatePost={createPost} currentUser={user} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No posts yet. Be the first to share!
              </Text>
            </View>
          }
          renderItem={({ item }) => (
              console.log("Post data:", JSON.stringify(item, null, 2)),
            <PostCard
              post={item}
              author={getUserFromPost(item)}
              currentUser={user}
              comments={getCommentsByPost(item.id)}
              onToggleLike={() => toggleLike(item.id)}
              onDeletePost={() => deletePost(item.id)}
              onAddComment={(content) => addComment(item.id, content)}
              onDeleteComment={deleteComment}
              getUser={(userId) => posts.find(p => p.user?.id === userId)?.user}
              
            />
            
          )}
          

          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          refreshing={loading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
});