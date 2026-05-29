# Example Input — RN Performance Optimizer

The `FeedScreen` below contains four intentional performance issues.

---

```
RN_VERSION: 0.76
ARCH: new
FILE_PATH: src/screens/FeedScreen.tsx
CODE:
import React, { useState, useEffect, useContext } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Post { id: string; title: string; body: string; liked: boolean; }
const ThemeContext = React.createContext({ colors: { background: '#ffffff' } });

const PostCard = ({ post, onLike, style }: { post: Post; onLike: () => void; style: object }) => (
  <View style={[styles.card, style]}>
    <Text style={styles.title}>{post.title}</Text>
    <Text style={styles.body}>{post.body}</Text>
    <TouchableOpacity onPress={onLike}>
      <Text>{post.liked ? '❤️' : '🤍'} Like</Text>
    </TouchableOpacity>
  </View>
);

const fetchPosts = async (): Promise<Post[]> => [
  { id: '1', title: 'Hello', body: 'First post', liked: false },
  { id: '2', title: 'Second', body: 'Second post', liked: false },
];
const handleLike = (id: string) => console.log('Liked:', id);

const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const theme = useContext(ThemeContext);

  useEffect(() => { fetchPosts().then(setPosts); }, []);

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
  card: { padding: 16, marginVertical: 8, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: 'bold' },
  body:  { fontSize: 14, color: '#666' },
});
export default FeedScreen;
```

---

## Issue Map

1. `renderItem` is an inline function — recreated every `FeedScreen` re-render (HIGH)
2. `{ backgroundColor: theme.colors.background }` is a new object every `renderItem` call (HIGH)
3. `onLike={() => handleLike(item.id)}` inline per cell — breaks `PostCard` memoization (MEDIUM)
4. `FlatList` missing `getItemLayout` — extra layout pass on every scroll (LOW)

---

## Variations

### With Profiler Data
```
RN_VERSION: 0.74
ARCH: old
FILE_PATH: src/screens/ProductListScreen.tsx
PROFILER_DATA:
Component "ProductListScreen" rendered 24 times in 3 seconds.
Component "ProductCard" rendered 480 times — 20 per ProductListScreen render.
Longest render: 18ms (exceeded 16.6ms frame budget).
CODE:
[paste component]
```

### FlatList with Pagination
```
RN_VERSION: 0.76
ARCH: new
FILE_PATH: src/screens/OrderHistoryScreen.tsx
CODE:
<FlatList
  data={orders}
  renderItem={({ item }) => <OrderCard key={item.id} order={item} onPress={() => navigate(item.id)} />}
  onEndReached={() => loadMore()}
  onEndReachedThreshold={0.5}
/>
```
Issues: `renderItem` inline, `onPress` inline per card, missing `keyExtractor`, missing `getItemLayout`, `onEndReached` threshold too aggressive for a paginated list.
