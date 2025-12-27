import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Logout', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111' : '#f9fafb' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#111' }]}>Settings</Text>

        <View style={[styles.card, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color="#444" />
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#111' }]}>
              Account
            </Text>
          </View>
          <Text>Name: {user?.username}</Text>
          <Text>Email: {user?.email}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}>
          <View style={styles.themeRow}>
            <Text style={{ color: isDark ? '#fff' : '#111' }}>Dark Mode</Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  card: { borderRadius: 16, padding: 20, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  themeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: { color: '#fff', fontWeight: '600' },
});