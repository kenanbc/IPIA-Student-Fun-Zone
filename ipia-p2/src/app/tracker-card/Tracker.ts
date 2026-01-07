interface Tracker {
  name: string;
  description: string;
  icon: string;
  route: string;
  type: 'sleep' | 'water' | 'budget' | 'reading' | 'focus' | 'calendar';
  lastUsed?: string;
}
