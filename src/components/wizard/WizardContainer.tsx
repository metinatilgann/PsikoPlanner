import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { MD3Theme } from 'react-native-paper';
import WizardProgressBar from './WizardProgressBar';

interface WizardContainerProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  stepIcons: string[];
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onSave: () => void;
  canGoBack: boolean;
  isLastStep: boolean;
  children: React.ReactNode;
}

export default function WizardContainer({
  currentStep,
  totalSteps,
  stepLabels,
  stepIcons,
  onNext,
  onBack,
  onSkip,
  onSave,
  canGoBack,
  isLastStep,
  children,
}: WizardContainerProps) {
  const theme = useTheme<MD3Theme>();
  const { t } = useTranslation('clients');

  return (
    <View style={styles.container}>
      <WizardProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepLabels={stepLabels}
        stepIcons={stepIcons}
        onStepPress={(step) => {
          if (step < currentStep) {
            onBack();
          }
        }}
      />

      <View style={styles.content}>{children}</View>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.leftButton}>
          {canGoBack && (
            <Button mode="text" onPress={onBack}>
              {t('wizard.back')}
            </Button>
          )}
        </View>

        <View style={styles.centerButton}>
          {!isLastStep && currentStep > 0 && (
            <Button mode="text" onPress={onSkip}>
              {t('wizard.skip')}
            </Button>
          )}
        </View>

        <View style={styles.rightButton}>
          {isLastStep ? (
            <Button mode="contained" onPress={onSave}>
              {t('wizard.saveAndFinish')}
            </Button>
          ) : (
            <Button mode="contained" onPress={onNext}>
              {t('wizard.next')}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  leftButton: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerButton: {
    flex: 1,
    alignItems: 'center',
  },
  rightButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
