export type Locale = 'fr' | 'ar';

export interface Translations {
  appName: string;
  appSubtitle: string;
  regionBadge: string;
  lastUpdate: string;
  
  // Navigation
  navOverview: string;
  navHistorical: string;
  navTerritories: string;
  navUrbanRural: string;
  navGender: string;
  navAgeEducation: string;
  navSectors: string;
  navJobCreation: string;
  navWorkConditions: string;
  navExplorer: string;
  navComparison: string;
  navSources: string;
  
  // Global Filters
  filtersLabel: string;
  filterYear: string;
  filterMilieu: string;
  filterSex: string;
  filterProvince: string;
  allMilieus: string;
  urban: string;
  rural: string;
  allSexes: string;
  men: string;
  women: string;
  allProvinces: string;
  resetFilters: string;
  
  // Key Indicators
  activePop: string;
  employedPop: string;
  unemployedPop: string;
  activityRate: string;
  employmentRate: string;
  unemploymentRate: string;
  underemploymentRate: string;
  netJobsCreated: string;
  
  // Micro-Insights & Headings
  keyInsightsTitle: string;
  regionalPulseTitle: string;
  regionalPulseSubtitle: string;
  territorialMatrixTitle: string;
  benchmarkMaroc: string;
  benchmarkRegion: string;
  deviation: string;
  
  // Common terms
  source: string;
  unit: string;
  reference: string;
  scope: string;
  provincesCount: string;
  exportData: string;
  tableView: string;
  chartView: string;
  searchPlaceholder: string;
  noData: string;
  points: string;
  rank: string;
}

export const translations: Record<Locale, Translations> = {
  fr: {
    appName: 'SM-LENS',
    appSubtitle: 'Observatoire Économique & Marché du Travail de Souss-Massa',
    regionBadge: 'Région Souss-Massa #09',
    lastUpdate: 'Données ENE / HCP consolidées 2019–2025',
    
    navOverview: 'Vue d’ensemble',
    navHistorical: 'Trajectoire 2019–2025',
    navTerritories: 'Territoires & Provinces',
    navUrbanRural: 'Fractures Urbain / Rural',
    navGender: 'Parité & Genre',
    navAgeEducation: 'Âges & Diplômes',
    navSectors: 'Secteurs d’Activité',
    navJobCreation: 'Création d’Emplois',
    navWorkConditions: 'Conditions & Sous-emploi',
    navExplorer: 'Explorateur de Données',
    navComparison: 'Comparateur Analytique',
    navSources: 'Sources & Méthodologie',
    
    filtersLabel: 'Filtres Globaux',
    filterYear: 'Année',
    filterMilieu: 'Milieu',
    filterSex: 'Sexe',
    filterProvince: 'Territoire',
    allMilieus: 'Ensemble des milieux',
    urban: 'Urbain',
    rural: 'Rural',
    allSexes: 'Hommes et Femmes',
    men: 'Hommes',
    women: 'Femmes',
    allProvinces: 'Toute la région (6 provinces)',
    resetFilters: 'Réinitialiser',
    
    activePop: 'Population Active',
    employedPop: 'Population Active Occupée',
    unemployedPop: 'Population au Chômage',
    activityRate: 'Taux d’Activité',
    employmentRate: 'Taux d’Emploi',
    unemploymentRate: 'Taux de Chômage',
    underemploymentRate: 'Taux de Sous-emploi',
    netJobsCreated: 'Créations Nettes d’Emplois',
    
    keyInsightsTitle: 'Faits Marquants & Insights Statistique',
    regionalPulseTitle: 'Pulsar Territorial Souss-Massa',
    regionalPulseSubtitle: 'Matrice de performance et dynamique des 6 provinces de la région',
    territorialMatrixTitle: 'Profils Provinciaux Comparés',
    benchmarkMaroc: 'Moyenne Nationale (Maroc)',
    benchmarkRegion: 'Moyenne Régionale (Souss-Massa)',
    deviation: 'Écart à la moyenne',
    
    source: 'Source',
    unit: 'Unité',
    reference: 'Référence',
    scope: 'Champ',
    provincesCount: '6 Provinces & Préfectures',
    exportData: 'Exporter (CSV)',
    tableView: 'Vue Tableau',
    chartView: 'Vue Graphique',
    searchPlaceholder: 'Rechercher un indicateur, catégorie ou territoire...',
    noData: 'Aucune donnée disponible pour cette combinaison de critères.',
    points: 'pts',
    rank: 'Rang'
  },
  ar: {
    appName: 'SM-LENS',
    appSubtitle: 'مرصد سوق الشغل والذكاء الاقتصادي لجهة سوس ماسة',
    regionBadge: 'جهة سوس ماسة #09',
    lastUpdate: 'بيانات البحث الوطني حول التشغيل (HCP) 2019-2025',
    
    navOverview: 'نظرة عامة',
    navHistorical: 'المسار التاريخي 2019-2025',
    navTerritories: 'الأقاليم والعمالات',
    navUrbanRural: 'المجال الحضري والقروي',
    navGender: 'النوع الاجتماعي والمناصفة',
    navAgeEducation: 'الفئات العمرية والشهادات',
    navSectors: 'قطاعات النشاط الاقتصادي',
    navJobCreation: 'إحداث مناصب الشغل',
    navWorkConditions: 'ظروف العمل والشغل الناقص',
    navExplorer: 'مستكشف البيانات',
    navComparison: 'المقارن التحليلي',
    navSources: 'المصادر والمنهجية',
    
    filtersLabel: 'المحددات العامة',
    filterYear: 'السنة',
    filterMilieu: 'وسط الإقامة',
    filterSex: 'الجنس',
    filterProvince: 'الإقليم / العمالة',
    allMilieus: 'مجموع الأوساط',
    urban: 'حضري',
    rural: 'قروي',
    allSexes: 'رجال ونساء',
    men: 'رجال',
    women: 'نساء',
    allProvinces: 'مجموع الجهة (6 أقاليم)',
    resetFilters: 'إعادة الضبط',
    
    activePop: 'الساكنة النشيطة',
    employedPop: 'الساكنة النشيطة المشتغلة',
    unemployedPop: 'الساكنة في حالة بطالة',
    activityRate: 'معدل النشاط',
    employmentRate: 'معدل التشغيل',
    unemploymentRate: 'معدل البطالة',
    underemploymentRate: 'معدل الشغل الناقص',
    netJobsCreated: 'صافي مناصب الشغل المحدثة',
    
    keyInsightsTitle: 'أبرز المؤشرات والاستنتاجات الإحصائية',
    regionalPulseTitle: 'مصفوفة النبض الترابي لسوس ماسة',
    regionalPulseSubtitle: 'الأداء الديناميكي لأقاليم وعمالات الجهة الست',
    territorialMatrixTitle: 'مقارنة الملامح الترابية للأقاليم',
    benchmarkMaroc: 'المعدل الوطني (المغرب)',
    benchmarkRegion: 'المعدل الجهوي (سوس ماسة)',
    deviation: 'الفارق عن المعدل الجهوي',
    
    source: 'المصدر',
    unit: 'الوحدة',
    reference: 'المرجع',
    scope: 'المجال',
    provincesCount: '6 أقاليم وعمالات',
    exportData: 'تصدير البيانات (CSV)',
    tableView: 'جدول البيانات',
    chartView: 'رسم بياني',
    searchPlaceholder: 'بحث في المؤشرات أو الفئات أو الأقاليم...',
    noData: 'لا تتوفر بيانات لهذه التوليفة المحددة.',
    points: 'نقطة',
    rank: 'الرتبة'
  }
};
