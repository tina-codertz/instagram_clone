import { useState, useEffect } from 'react';
import api from '../api/api';

export function usePosts(currentUserId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/posts/feed');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) fetchFeed();
  }, [currentUserId]);

  const createPost = async (content, imageFile) => {
    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', {
        uri: imageFile,
        type: 'image/jpeg',
        name: 'post.jpg',
      });
    }

    try {
      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPosts(prev => [res.data, ...prev]);
    } catch (err) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const toggleLike = async (postId) => {
    try {
      // Try like first
      await api.post(`/posts/${postId}/likes`);
    } catch (err) {
      if (err.response?.status === 400) {
        // Already liked → unlike
        await api.delete(`/posts/${postId}/likes`);
      }
    }
    // Refresh feed
    fetchFeed();
  };

  const deletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      Alert.alert('Error', 'Cannot delete post');
    }
  };

  const addComment = async (postId, content) => {
    try {
      await api.post(`/posts/${postId}/comments`, { content });
      fetchFeed();
    } catch (err) {
      Alert.alert('Error', 'Failed to comment');
    }
  };

  const deleteComment = async (commentId) => {
    // Note: You may need to add this endpoint in backend
    // For now, just refresh
    fetchFeed();
  };

  const getPostsByUser = async (userId) => {
    const res = await api.get(`/users/${userId}`);
    return res.data.posts || [];
  };

  const getCommentsByPost = (postId) => {
    const post = posts.find(p => p.id === postId);
    return post?.comments || [];
  };

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    deletePost,
    addComment,
    deleteComment,
    getCommentsByPost,
    getPostsByUser,
    refresh: fetchFeed,
  };
}