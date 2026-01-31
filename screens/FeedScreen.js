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

  // Helper to get author object from post
  const getAuthor = (post) => {
    // post.user might be the full user object or just partial
    if (post.user) {
      return {
        name: post.user.username || post.user.name || 'Unknown',
        profilePicture: post.user.profilePicture || post.user.avatar || null,
      };
    }
    // Fallback if no user object attached
    return {
      name: post.username || 'Unknown',
      profilePicture: null,
    };
  };

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
          renderItem={({ item: post }) => {
            // Optional: keep this log until everything works
            // console.log("Post data:", JSON.stringify(post, null, 2));

            const author = getAuthor(post);

            return (
              <PostCard
                post={{
                  ...post,
                  // Normalize field names so PostCard doesn't break
                  createdAt: post.created_at,
                  imageUrl: post.image,
                  // If your hook doesn't return likes array yet, we fake it for display
                  likes: post.likes_count > 0 ? new Array(post.likes_count).fill(null) : [],
                  // If you later fetch real likes array → replace this
                }}
                author={author}
                currentUser={user}
                comments={getCommentsByPost(post.id) || []}
                onToggleLike={() => toggleLike(post.id)}
                onDeletePost={() => deletePost(post.id)}
                onAddComment={(content) => addComment(post.id, content)}
                onDeleteComment={(postId, commentId) => deleteComment(postId, commentId)}
                // Optional: improve getUser if comments need author lookup
                getUser={(userId) => {
                  // Very basic fallback — improve later if needed
                  if (userId === user?.id) return user;
                  // Look in posts (not ideal, but works if users post multiple times)
                  const matchingPost = posts.find(p => p.user?.id === userId);
                  return matchingPost?.user || { name: 'Unknown User', profilePicture: null };
                }}
              />
            );
          }}
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