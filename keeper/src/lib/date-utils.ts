export function calculateStatus(expirationDate: Date): 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' {
  const now = new Date();
  const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiration < 0) return 'EXPIRED';
  if (daysUntilExpiration <= 30) return 'EXPIRING_SOON';
  return 'ACTIVE';
}

export function getUrgencyColor(status: string): 'red' | 'yellow' | 'green' {
  if (status === 'EXPIRED') return 'red';
  if (status === 'EXPIRING_SOON') return 'yellow';
  return 'green';
}

export function calculateNextDueDate(lastCompleted: Date, frequency: string, customInterval?: number): Date {
  const next = new Date(lastCompleted);
  
  switch (frequency) {
    case 'MONTHLY':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'QUARTERLY':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'SEMI_ANNUAL':
      next.setMonth(next.getMonth() + 6);
      break;
    case 'ANNUAL':
      next.setFullYear(next.getFullYear() + 1);
      break;
    case 'CUSTOM':
      if (customInterval) {
        next.setDate(next.getDate() + customInterval);
      }
      break;
  }
  
  return next;
}

export function getDaysUntilDue(dueDate: Date): number {
  const now = new Date();
  return Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isDueSoon(dueDate: Date, daysThreshold: number = 30): boolean {
  return getDaysUntilDue(dueDate) <= daysThreshold;
}


