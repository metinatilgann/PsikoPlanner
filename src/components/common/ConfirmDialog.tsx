import React from 'react';
import { Dialog, Portal, Button, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  visible, title, message, confirmLabel, cancelLabel, destructive, onConfirm, onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>{cancelLabel || t('cancel')}</Button>
          <Button
            onPress={onConfirm}
            textColor={destructive ? theme.colors.error : undefined}
          >
            {confirmLabel || t('confirm')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
