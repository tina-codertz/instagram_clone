import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const AuthContext = createContext();

function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useContext(AuthContext);

  const onSignUp = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password required.');
      return;
    }
    signUp(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Sign Up" onPress={onSignUp} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  const onLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password required.');
      return;
    }
    signIn(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Log In" onPress={onLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

function FeedScreen({ navigation }) {
  const { posts, toggleLike } = useContext(AuthContext);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item.id })} style={styles.postCard}>
        <Text style={styles.postAuthor}>{item.author}</Text>
        <Text style={styles.postText}>{item.text}</Text>
        <View style={styles.postFooter}>
          <TouchableOpacity onPress={() => toggleLike(item.id)}>
            <Text style={{ color: item.liked ? 'blue' : 'gray' }}>Like ({item.likes})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Comments', { postId: item.id })}>
            <Text>Comments ({item.comments.length})</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

function NewPostScreen({ navigation }) {
  const [text, setText] = useState('');
  const { addPost, currentUser } = useContext(AuthContext);

  const onPost = () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Post cannot be empty.');
      return;
    }
    addPost(text.trim(), currentUser.email);
    setText('');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="What's on your mind?"
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        multiline
        value={text}
        onChangeText={setText}
      />
      <Button title="Post" onPress={onPost} />
    </View>
  );
}

function CommentsScreen({ route }) {
  const { postId } = route.params;
  const { posts, addComment, currentUser } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');

  const post = posts.find(p => p.id === postId);
  if (!post) return <View><Text>Post not found</Text></View>;

  const onAddComment = () => {
    if (!commentText.trim()) return;
    addComment(postId, {
      id: Date.now().toString(),
      text: commentText.trim(),
      author: currentUser.email,
    });
    setCommentText('');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{post.text}</Text>
      <FlatList
        data={post.comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={{ fontWeight: '600' }}>{item.author}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No comments yet</Text>}
      />
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        <TextInput
          placeholder="Add comment"
          style={[styles.input, { flex: 1, height: 40 }]}
          value={commentText}
          onChangeText={setCommentText}
        />
        <Button title="Send" onPress={onAddComment} />
      </View>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Posts stored locally in state for demonstration
  const [posts, setPosts] = useState([
    {
      id: '1',
      author: 'demo@user.com',
      text: 'Welcome to the Mini Social Feed!',
      likes: 0,
      liked: false,
      comments: [],
    },
  ]);

  // Auth functions simulate sign in/up with local state
  const signUp = (email, password) => {
    setCurrentUser({ email });
  };

  const signIn = (email, password) => {
    setCurrentUser({ email });
  };

  const signOut = () => {
    setCurrentUser(null);
  };

  const addPost = (text, author) => {
    const newPost = {
      id: Date.now().toString(),
      author,
      text,
      likes: 0,
      liked: false,
      comments: [],
    };
    setPosts([newPost, ...posts]);
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const liked = !post.liked;
        return { ...post, liked, likes: liked ? post.likes + 1 : post.likes - 1 };
      }
      return post;
    }));
  };

  const addComment = (postId, comment) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    }));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      signUp,
      signIn,
      signOut,
      posts,
      addPost,
      toggleLike,
      addComment,
    }}>
      <NavigationContainer>
        <Stack.Navigator>
          {currentUser ? (
            <>
              <Stack.Screen name="Feed" component={FeedScreen} options={({ navigation }) => ({
                headerRight: () => (
                  <Button title="New Post" onPress={() => navigation.navigate('NewPost')} />
                ),
                headerLeft: () => (
                  <Button title="Logout" onPress={() => signOut()} />
                ),
              })} />
              <Stack.Screen name="NewPost" component={NewPostScreen} options={{ title: 'New Post' }} />
              <Stack.Screen name="Comments" component={CommentsScreen} options={{ title: 'Comments' }} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log In' }} />
              <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 12 },
  link: { color: 'blue', marginTop: 12, textAlign: 'center' },
  postCard: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 6, marginBottom: 12 },
  postAuthor: { fontWeight: 'bold', marginBottom: 4 },
  postText: { marginBottom: 8 },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  commentItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
});