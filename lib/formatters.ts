export function formatNumber(val: number | null | undefined, locale: 'fr' | 'ar' = 'fr', decimals: number = 0): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : 'fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(val);
  
  return formatted;
}

export function formatPercent(val: number | null | undefined, locale: 'fr' | 'ar' = 'fr', decimals: number = 1): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `${formatNumber(val, locale, decimals)}%`;
}

export function formatPoints(val: number | null | undefined, locale: 'fr' | 'ar' = 'fr', decimals: number = 1): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const prefix = val > 0 ? '+' : '';
  const suffix = locale === 'ar' ? ' نقطة' : ' pts';
  return `${prefix}${formatNumber(val, locale, decimals)}${suffix}`;
}

export function formatThousands(valK: number | null | undefined, locale: 'fr' | 'ar' = 'fr'): string {
  if (valK === null || valK === undefined || isNaN(valK)) return '—';
  const fullVal = valK * 1000;
  return formatNumber(fullVal, locale, 0);
}

export function formatCount(val: number | null | undefined, locale: 'fr' | 'ar' = 'fr'): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return formatNumber(val, locale, 0);
}

export function formatDelta(val: number | null | undefined, isRate: boolean = false, locale: 'fr' | 'ar' = 'fr'): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const prefix = val > 0 ? '+' : '';
  if (isRate) {
    const suffix = locale === 'ar' ? ' نقطة' : ' pts';
    return `${prefix}${formatNumber(val, locale, 1)}${suffix}`;
  }
  return `${prefix}${formatNumber(val, locale, 0)}`;
}

export function getSignBadgeInfo(sign: string | undefined): { label: string; tooltip: string; badgeClass: string } | null {
  if (!sign || sign.trim() === '') return null;
  const s = sign.trim().toLowerCase();
  if (s === 'ps') {
    return {
      label: 'ps',
      tooltip: 'Résultat trop peu significatif (échantillon réduit ou phénomène rare)',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
    };
  }
  if (s === 'ms') {
    return {
      label: 'ms',
      tooltip: 'Résultat moyennement significatif, à utiliser avec prudence',
      badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800'
    };
  }
  return null;
}
