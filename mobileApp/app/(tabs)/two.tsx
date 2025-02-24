import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import {Profile} from '../../components/Profile'
import { useUserStore } from '@/stores/userStore';

export default function TabTwoScreen() {
  const user = useUserStore().user;
  const profile = {
    name: user.name,
    phone: user.phone,
    email: user.email,
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  return (
    <Profile edit={true} profile={profile}/>
  );
}