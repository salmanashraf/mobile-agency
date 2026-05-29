// Paired with: agents/react-native/performance-optimizer/agent.md
// This file contains intentional performance issues for the agent to find.
// Do not use this as production code.

import React, { useState, useEffect, useContext } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Post {
  id: string;
  title: string;
  body: string;
  liked: boolean;
}

const ThemeContext = React.createContext({ colors: { background: '#ffffff' } });

const PostCard = ({ post, onLike, style }: {
  post: Post;
  onLike: () => void;
  style: object;
}) => (
  <View style={[styles.card, style]}>
    <Text style={styles.title}>{post.title}</Text>
    <Text style={styles.body}>{post.body}</Text>
    <TouchableOpacity onPress={onLike}>
      <Text>{post.liked ? '❤️' : '🤍'} Like</Text>
    </TouchableOpacity>
  </View>
);

const fetchPosts = async (): Promise<Post[]> => {
  return [
    { id: '1', title: 'Hello World', body: 'First post content', liked: false },
    { id: '2', title: 'Second Post', body: 'Second post content', liked: false },
  ];
};

const handleLike = (id: string) => {
  console.log('Liked post:', id);
};

// FeedScreen with intentional performance problems:
// 1. renderItem recreated every render (no useCallback)
// 2. Inline style object created every renderItem call
// 3. onLike closure captures item.id per cell
// 4. FlatList missing getItemLayout
const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, []);

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={() => handleLike(item.id)}
      style={{ backgroundColor: theme.colors.background }}
    />
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  body: { fontSize: 14, color: '#666' },
});

export default FeedScreen;
