import { useReducer, useCallback } from 'react';
import type { ClientFormData, Client } from '../types/client';

export type FormAction =
  | { type: 'SET_FIELD'; key: string; value: any }
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'LOAD_CLIENT'; client: Client }
  | { type: 'RESET' };

interface FormState {
  data: Partial<ClientFormData>;
  errors: Record<string, string>;
  currentStep: number;
  isDirty: boolean;
}

const initialState: FormState = {
  data: {
    sessionFee: 0,
  },
  errors: {},
  currentStep: 0,
  isDirty: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.key]: action.value },
        errors: { ...state.errors, [action.key]: '' },
        isDirty: true,
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    case 'LOAD_CLIENT': {
      const { id, createdAt, updatedAt, status, ...formData } = action.client;
      return {
        ...state,
        data: formData,
        errors: {},
        isDirty: false,
      };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useClientForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setField = useCallback((key: string, value: any) => {
    dispatch({ type: 'SET_FIELD', key, value });
  }, []);

  const setStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', errors });
  }, []);

  const loadFromClient = useCallback((client: Client) => {
    dispatch({ type: 'LOAD_CLIENT', client });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const validate = useCallback(
    (step: number): boolean => {
      const errors: Record<string, string> = {};

      if (step === 0) {
        if (!state.data.firstName?.trim()) {
          errors.firstName = 'required';
        }
        if (!state.data.lastName?.trim()) {
          errors.lastName = 'required';
        }
      }
      // Steps 1-4 have no required fields

      if (Object.keys(errors).length > 0) {
        dispatch({ type: 'SET_ERRORS', errors });
        return false;
      }

      return true;
    },
    [state.data],
  );

  return {
    formData: state.data,
    setField,
    errors: state.errors,
    setErrors,
    currentStep: state.currentStep,
    setStep,
    isDirty: state.isDirty,
    loadFromClient,
    reset,
    validate,
  };
}
