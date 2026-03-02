import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const DEV_BYPASS_AUTH = __DEV__ && false; // Set to true to bypass auth during development

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading && !DEV_BYPASS_AUTH) return <LoadingScreen />;

  return (
    <NavigationContainer>
      {user || DEV_BYPASS_AUTH ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
