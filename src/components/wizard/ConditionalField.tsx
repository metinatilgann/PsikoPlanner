import React from 'react';

interface ConditionalFieldProps {
  visible: boolean;
  children: React.ReactNode;
}

export default function ConditionalField({ visible, children }: ConditionalFieldProps) {
  if (!visible) return null;
  return <>{children}</>;
}
