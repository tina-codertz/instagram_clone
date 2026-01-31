import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({
  post,
  author,
  currentUser,
  comments = [],
  onToggleLike,
  onDeletePost,
  onAddComment,
  onDeleteComment,
  getUser,
}) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = currentUser ? (post.likes || []).includes(currentUser.id) : false;
  const canDelete = currentUser?.id === post.userId;

  const handleAddComment = () => {
    if (!commentText.trim() || !currentUser) return;
    onAddComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: author?.profilePicture || 'https://via.placeholder.com/150' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.name}>{author?.name || 'Unknown'}</Text>
            <Text style={styles.timestamp}>
              {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'just now'}
            </Text>
          </View>
        </View>
        {canDelete && (
          <TouchableOpacity onPress={() => onDeletePost(post.id)}>
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Image */}
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onToggleLike(post.id)}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={26}
            color={isLiked ? '#EF4444' : '#6B7280'}
          />
          <Text style={[styles.actionText, isLiked && { color: '#EF4444' }]}>
            {post.likes ? post.likes.length : 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <Ionicons name="chatbubble-outline" size={26} color="#6B7280" />
          <Text style={styles.actionText}>{comments.length}</Text>
        </TouchableOpacity>
      </View>

      {/* Comments */}
      {showComments && (
        <View style={styles.commentsSection}>
          {/* Comments List */}
          {comments.length > 0 ? (
            comments.map((comment, index) => {
              const commentAuthor = getUser ? getUser(comment.userId) : null;
              return (
                <View key={index} style={styles.comment}>
                  <Image 
                    source={{ uri: commentAuthor?.profilePicture || 'https://via.placeholder.com/150' }} 
                    style={styles.commentAvatar} 
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>
                      {commentAuthor?.name || 'Unknown'}
                    </Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                  {currentUser?.id === comment.userId && (
                    <TouchableOpacity 
                      onPress={() => onDeleteComment(post.id, comment.id)}
                      style={styles.deleteCommentButton}
                    >
                      <Ionicons name="close" size={16} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          ) : (
            <Text style={styles.noCommentsText}>No comments yet</Text>
          )}

          {/* Add Comment */}
          <View style={styles.commentInputRow}>
            <Image 
              source={{ uri: currentUser?.profile_pic || 'https://via.placeholder.com/150' }} 
              style={styles.smallAvatar} 
            />
            <TextInput
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              style={styles.commentInput}
              onSubmitEditing={handleAddComment}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={handleAddComment}>
              <Ionicons name="send" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
  },
  timestamp: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    color: '#6B7280',
    fontWeight: '500',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 12,
  },
  commentAuthor: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
  },
  noCommentsText: {
    color: '#6B7280',
    textAlign: 'center',
    padding: 8,
    fontSize: 14,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
  },
  deleteCommentButton: {
    padding: 4,
    marginLeft: 4,
  },
});