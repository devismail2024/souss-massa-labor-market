import { RegionalMultiYearDataset, JobCreationDataset, Provincial2023Dataset } from '@/types/dataset';

export function calculateYoYChange(current: number | null, previous: number | null): { diff: number | null; pctChange: number | null } {
  if (current === null || previous === null || previous === 0) {
    return { diff: null, pctChange: null };
  }
  const diff = Math.round((current - previous) * 100) / 100;
  const pctChange = Math.round(((current - previous) / previous) * 1000) / 10;
  return { diff, pctChange };
}

export function calculateRatePointGap(valA: number | null, valB: number | null): number | null {
  if (valA === null || valB === null) return null;
  return Math.round((valA - valB) * 10) / 10;
}

export function calculateShare(part: number | null, total: number | null): number | null {
  if (part === null || total === null || total === 0) return null;
  return Math.round((part / total) * 1000) / 10;
}

export interface MicroInsight {
  id: string;
  category: 'employment' | 'gender' | 'territory' | 'sectors' | 'education' | 'creation';
  type: 'positive' | 'warning' | 'neutral' | 'highlight';
  textFr: string;
  textAr: string;
  metric?: string;
  badge?: string;
}

export function generateAutomatedInsights(
  regional: RegionalMultiYearDataset,
  jobs: JobCreationDataset,
  provincial2023: Provincial2023Dataset
): MicroInsight[] {
  const insights: MicroInsight[] = [];
  
  const d2025 = regional.series[2025];
  const d2024 = regional.series[2024];
  const d2019 = regional.series[2019];
  
  // 1. Employment Growth
  if (d2025 && d2024) {
    const empDiff = (d2025.employed_population_k.total - d2024.employed_population_k.total) * 1000;
    const rateDiff = Math.round((d2025.employment_rate.total.total - d2024.employment_rate.total.total) * 10) / 10;
    insights.push({
      id: 'emp-growth-2025',
      category: 'employment',
      type: 'positive',
      textFr: `L'emploi régional a progressé de +${empDiff.toLocaleString('fr-FR')} personnes entre 2024 et 2025, atteignant 848 000 actifs occupés (taux d'emploi à 36,0%, +${rateDiff} pt).`,
      textAr: `ارتفع التشغيل الجهوي بمقدار +${empDiff.toLocaleString('ar-MA')} مشتغل بين 2024 و 2025 ليصل إلى 848.000 مشتغل (معدل التشغيل 36.0%، +${rateDiff} نقطة).`,
      metric: '+31 000 emplois',
      badge: '2024–2025'
    });
  }
  
  // 2. Job Creation Contribution to National Total
  const smJob = jobs.territories.find(t => t.code === 'SM');
  const marocJob = jobs.territories.find(t => t.code === 'MAROC');
  if (smJob && marocJob && marocJob.net_jobs_created.total_2023_2025 > 0) {
    const share = Math.round((smJob.net_jobs_created.total_2023_2025 / marocJob.net_jobs_created.total_2023_2025) * 1000) / 10;
    insights.push({
      id: 'national-contribution-jobs',
      category: 'creation',
      type: 'highlight',
      textFr: `Sur la période 2023–2025, Souss-Massa a créé +41 911 emplois nets, représentant ${share}% de l'ensemble des créations nettes au Maroc (+76 123).`,
      textAr: `خلال الفترة 2023-2025، أحدثت جهة سوس ماسة +41.911 منصب شغل صاف، ما يمثل ${share}% من مجموع صافي مناصب الشغل المحدثة بالمغرب (+76.123).`,
      metric: `${share}% du national`,
      badge: '2023–2025'
    });
  }
  
  // 3. Gender Gap
  if (d2025) {
    const actGap = Math.round((d2025.activity_rate.by_sex.men.total - d2025.activity_rate.by_sex.women.total) * 10) / 10;
    const unempGap = Math.round((d2025.unemployment_rate.by_sex.women.total - d2025.unemployment_rate.by_sex.men.total) * 10) / 10;
    insights.push({
      id: 'gender-gap-2025',
      category: 'gender',
      type: 'warning',
      textFr: `L'écart de participation hommes-femmes atteint ${actGap} points (67,6% contre 14,7%), tandis que le taux de chômage féminin (21,8%) est ${unempGap} pts supérieur à celui des hommes (8,6%).`,
      textAr: `تبلغ فجوة المشاركة بين الرجال والنساء ${actGap} نقطة (67.6% مقابل 14.7%)، في حين أن معدل بطالة الإناث (21.8%) يتجاوز معدل الذكور (8.6%) بـ ${unempGap} نقطة.`,
      metric: `Écart: ${actGap} pts`,
      badge: 'Genre 2025'
    });
  }
  
  // 4. Sector Dominance
  if (d2025) {
    const servicesShare = d2025.sector_shares_pct.services.total;
    const agriShare = d2025.sector_shares_pct.agriculture.total;
    insights.push({
      id: 'sector-structure-2025',
      category: 'sectors',
      type: 'neutral',
      textFr: `Les services concentrent désormais plus de la moitié de l'emploi régional (${servicesShare}%), tandis que l'agriculture représente ${agriShare}% du total et ${d2025.sector_shares_pct.agriculture.rural}% de l'emploi rural.`,
      textAr: `يستقطب قطاع الخدمات أكثر من نصف التشغيل الجهوي (${servicesShare}%)، بينما تمثل الفلاحة ${agriShare}% من الإجمالي و ${d2025.sector_shares_pct.agriculture.rural}% من التشغيل القروي.`,
      metric: `${servicesShare}% Services`,
      badge: 'Structure 2025'
    });
  }
  
  // 5. Provincial Leader in Job Creation
  const provs = jobs.territories.filter(t => t.type === 'province' || t.type === 'prefecture');
  const sortedByJobs = [...provs].sort((a, b) => b.net_jobs_created.total_2023_2025 - a.net_jobs_created.total_2023_2025);
  if (sortedByJobs.length > 0) {
    const leader = sortedByJobs[0];
    const second = sortedByJobs[1];
    insights.push({
      id: 'provincial-leader-jobs',
      category: 'territory',
      type: 'positive',
      textFr: `La province de ${leader.name} est le premier moteur de création d'emplois avec +${leader.net_jobs_created.total_2023_2025.toLocaleString('fr-FR')} postes créés (2023–2025), suivie d'${second.name} (+${second.net_jobs_created.total_2023_2025.toLocaleString('fr-FR')}).`,
      textAr: `تعتبر إقليم ${leader.name_ar} المحرك الأول لإحداث مناصب الشغل بـ +${leader.net_jobs_created.total_2023_2025.toLocaleString('ar-MA')} منصب (2023-2025)، تليها ${second.name_ar} (+${second.net_jobs_created.total_2023_2025.toLocaleString('ar-MA')}).`,
      metric: `#1 ${leader.name}`,
      badge: 'Territoire'
    });
  }
  
  // 6. Youth Unemployment & Diploma Paradox
  if (d2025) {
    const youthUnemp = d2025.unemployment_rate.by_age.age_15_24.total;
    const dipUnemp = d2025.unemployment_rate.by_diploma.with_diploma?.total || 16.8;
    const noDipUnemp = d2025.unemployment_rate.by_diploma.no_diploma.total;
    insights.push({
      id: 'education-paradox-2025',
      category: 'education',
      type: 'warning',
      textFr: `Le chômage touche 35,0% des jeunes de 15–24 ans. Les diplômés enregistrent un taux de chômage de ${dipUnemp}% contre seulement ${noDipUnemp}% pour les non-diplômés.`,
      textAr: `تطال البطالة 35.0% من الشباب (15-24 سنة). ويسجل حاملو الشهادات معدل بطالة يبلغ ${dipUnemp}% مقابل ${noDipUnemp}% فقط لغير حاملي الشهادات.`,
      metric: '35,0% Jeunes (15-24)',
      badge: 'Éducation & Âge'
    });
  }
  
  return insights;
}
