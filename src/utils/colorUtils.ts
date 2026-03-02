const AVATAR_COLORS = [
  '#2563EB', '#059669', '#7C3AED', '#DC2626',
  '#D97706', '#0891B2', '#4F46E5', '#BE185D',
  '#15803D', '#B45309', '#6D28D9', '#0E7490',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const STATUS_COLORS: Record<string, string> = {
  planned: '#2563EB',
  completed: '#059669',
  cancelled: '#DC2626',
  no_show: '#6B7280',
};

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || '#6B7280';
}
