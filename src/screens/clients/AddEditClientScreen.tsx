import React, { useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { ClientStackParamList } from '../../types/navigation';
import { useDatabase } from '../../contexts/DatabaseContext';
import { createClient, updateClient, getClientById } from '../../services/database/clientService';
import { useClientForm } from '../../hooks/useClientForm';
import { WIZARD_STEPS } from '../../config/constants';
import WizardContainer from '../../components/wizard/WizardContainer';
import PersonalInfoStep from './steps/PersonalInfoStep';
import DemographicStep from './steps/DemographicStep';
import HealthSummaryStep from './steps/HealthSummaryStep';
import FamilySummaryStep from './steps/FamilySummaryStep';
import TherapyReferralStep from './steps/TherapyReferralStep';

type Props = {
  navigation: StackNavigationProp<ClientStackParamList, 'AddEditClient'>;
  route: RouteProp<ClientStackParamList, 'AddEditClient'>;
};

const STEP_ICONS = [
  'account',
  'card-account-details-outline',
  'hospital-box-outline',
  'account-group-outline',
  'clipboard-text-outline',
];

export default function AddEditClientScreen({ navigation, route }: Props) {
  const clientId = route.params?.clientId;
  const isEditing = !!clientId;
  const theme = useTheme();
  const { t } = useTranslation('clients');
  const { db, isReady } = useDatabase();

  const {
    formData,
    setField,
    errors,
    currentStep,
    setStep,
    isDirty,
    loadFromClient,
    validate,
  } = useClientForm();

  const totalSteps = WIZARD_STEPS.length;

  const stepLabels = WIZARD_STEPS.map(
    (key) => t(`wizard.steps.${key}`)
  );

  useEffect(() => {
    if (isEditing && db && isReady) {
      getClientById(db, clientId!).then((client) => {
        if (client) loadFromClient(client);
      });
    }
  }, [isEditing, clientId, db, isReady, loadFromClient]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? t('editClient') : t('addClient'),
    });
  }, [navigation, isEditing, t]);

  const handleNext = () => {
    if (!validate(currentStep)) return;
    if (currentStep < totalSteps - 1) {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < totalSteps - 1) {
      setStep(currentStep + 1);
    }
  };

  const handleSave = async () => {
    if (!validate(currentStep) || !db) return;

    try {
      const data = {
        ...formData,
        firstName: formData.firstName?.trim() || '',
        lastName: formData.lastName?.trim() || '',
        phone: formData.phone?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        dateOfBirth: formData.dateOfBirth?.trim() || undefined,
        sessionFee: formData.sessionFee ?? 0,
      } as any;

      if (isEditing) {
        await updateClient(db, clientId!, data);
      } else {
        await createClient(db, data);
      }
      navigation.goBack();
    } catch (err) {
      console.error('Save client error:', err);
    }
  };

  const renderStep = () => {
    const stepProps = { formData, setField, errors };
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep {...stepProps} />;
      case 1:
        return <DemographicStep {...stepProps} />;
      case 2:
        return <HealthSummaryStep {...stepProps} />;
      case 3:
        return <FamilySummaryStep {...stepProps} />;
      case 4:
        return <TherapyReferralStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <WizardContainer
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepLabels={stepLabels}
      stepIcons={STEP_ICONS}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={handleSkip}
      onSave={handleSave}
      canGoBack={currentStep > 0}
      isLastStep={currentStep === totalSteps - 1}
    >
      {renderStep()}
    </WizardContainer>
  );
}
