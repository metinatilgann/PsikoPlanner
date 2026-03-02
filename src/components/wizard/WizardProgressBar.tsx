import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MD3Theme } from 'react-native-paper';

interface WizardProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  stepIcons: string[];
  onStepPress: (step: number) => void;
}

export default function WizardProgressBar({
  currentStep,
  totalSteps,
  stepLabels,
  stepIcons,
  onStepPress,
}: WizardProgressBarProps) {
  const theme = useTheme<MD3Theme>();

  const getStepState = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'future';
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepState = getStepState(index);
          const isInteractive = stepState === 'completed' || stepState === 'current';

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        index <= currentStep
                          ? theme.colors.primary
                          : theme.colors.outlineVariant,
                    },
                  ]}
                />
              )}
              <TouchableOpacity
                onPress={() => isInteractive && onStepPress(index)}
                disabled={!isInteractive}
                activeOpacity={0.7}
                style={styles.stepContainer}
              >
                <View
                  style={[
                    styles.circle,
                    stepState === 'current' && {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.primary,
                    },
                    stepState === 'completed' && {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.primary,
                    },
                    stepState === 'future' && {
                      backgroundColor: 'transparent',
                      borderColor: theme.colors.outlineVariant,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      stepState === 'completed'
                        ? 'check'
                        : (stepIcons[index] as any)
                    }
                    size={14}
                    color={
                      stepState === 'future'
                        ? theme.colors.onSurfaceVariant
                        : theme.colors.onPrimary
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.label,
                    {
                      color:
                        stepState === 'future'
                          ? theme.colors.onSurfaceVariant
                          : theme.colors.primary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {stepLabels[index]}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    width: 56,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 2,
    flex: 1,
    alignSelf: 'center',
    marginTop: 14,
    marginHorizontal: -4,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});
