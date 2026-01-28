import React ,{useState} from 'react';
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
  comments,
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
          <Image source={{ uri: author?.profilePicture }} style={styles.avatar} />
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
          {/* Add Comment */}
          <View style={styles.commentInputRow}>
            <Image source={{ uri: currentUser.profilePicture }} style={styles.smallAvatar} />
            <TextInput
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              style={styles.commentInput}
            />
            <TouchableOpacity onPress={handleAddComment} disabled={!commentText.trim()}>
              <Ionicons
                name="send"
                size={22}
                color={commentText.trim() ? '#4F46E5' : '#9CA3AF'}
              />
            </TouchableOpacity>
          </View>

          {/* Comment List */}
          {comments.map((comment) => {
            const commenter = getUser(comment.userId);
            const canDeleteComment = currentUser?.id === comment.userId;

            return (
              <View key={comment.id} style={styles.comment}>
                <Image source={{ uri: commenter?.profilePicture }} style={styles.smallAvatar} />
                <View style={styles.commentBubble}>
                  <Text style={styles.commentName}>{commenter?.name}</Text>
                  <Text style={styles.commentText}>{comment.content}</Text>
                  <Text style={styles.commentTime}>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </Text>
                </View>
                {canDeleteComment && (
                  <TouchableOpacity onPress={() => onDeleteComment(comment.id)}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
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
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  timestamp: { fontSize: 13, color: '#6B7280' },
  content: { fontSize: 16, color: '#111827', marginVertical: 12, lineHeight: 22 },
  postImage: { width: '100%', height: 320, borderRadius: 12, marginVertical: 12 },
  actions: { flexDirection: 'row', gap: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionText: { fontSize: 15, color: '#6B7280' },
  commentsSection: { marginTop: 16 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  smallAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
  },
  comment: { flexDirection: 'row', gap: 10, marginBottom: 12, alignItems: 'flex-start' },
  commentBubble: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 18,
    borderTopLeftRadius: 4,
  },
  commentName: { fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  commentText: { color: '#374151', fontSize: 15 },
  commentTime: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },
});