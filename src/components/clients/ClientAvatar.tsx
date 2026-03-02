import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getInitials } from '../../utils/formatUtils';
import { getAvatarColor } from '../../utils/colorUtils';

interface ClientAvatarProps {
  firstName: string;
  lastName: string;
  size?: number;
}

export default function ClientAvatar({ firstName, lastName, size = 48 }: ClientAvatarProps) {
  const initials = getInitials(firstName, lastName);
  const color = getAvatarColor(`${firstName}${lastName}`);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.text, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  text: { color: '#FFFFFF', fontWeight: '600' },
});
