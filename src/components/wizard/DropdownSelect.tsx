import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Menu, TextInput, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

interface DropdownSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
  style?: ViewStyle;
}

export default function DropdownSelect({
  label,
  value,
  options,
  onSelect,
  style,
}: DropdownSelectProps) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme<MD3Theme>();

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  return (
    <View style={[styles.container, style]}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.7}>
            <TextInput
              label={label}
              value={selectedLabel}
              mode="outlined"
              editable={false}
              right={
                <TextInput.Icon
                  icon="menu-down"
                  onPress={() => setVisible(true)}
                />
              }
              pointerEvents="none"
              style={styles.input}
            />
          </TouchableOpacity>
        }
        contentStyle={{ backgroundColor: theme.colors.surface }}
      >
        <ScrollView style={styles.menuScroll}>
          {options.map((opt) => (
            <Menu.Item
              key={opt.value}
              title={opt.label}
              onPress={() => {
                onSelect(opt.value);
                setVisible(false);
              }}
              titleStyle={
                opt.value === value
                  ? { color: theme.colors.primary, fontWeight: '600' }
                  : undefined
              }
            />
          ))}
        </ScrollView>
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  menuScroll: {
    maxHeight: 260,
  },
});
