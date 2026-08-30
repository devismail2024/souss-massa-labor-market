# SM-LENS | Observatoire Économique & Marché du Travail de Souss-Massa

> **Plateforme d'Intelligence Territoriale & d'Analyse du Marché du Travail (Région #09)**  
> Basée sur les données officielles du **Haut-Commissariat au Plan (HCP)** — Enquête Nationale sur l'Emploi (ENE 2019–2025) & Recensement Général de la Population et de l'Habitat (RGPH 2024).

---

## 🌟 Aperçu & Identité

**SM-LENS** est une plateforme web-native d'observation et de veille économique territoriale conçue sur mesure pour explorer, analyser et valoriser les dynamiques du marché du travail dans la région de **Souss-Massa** (Maroc).

L'interface adopte une direction artistique inspirée du **data-journalisme éditorial suisse** et des **terminaux d'analyse financière**, combinée à un système d'information géographique interactif.

---

## 📊 Principaux Chiffres Clés Consolidés (2025)

* **Actifs Occupés (Emploi Total)** : **848 000** personnes (+31 000 vs 2024).
* **Taux d'Emploi** : **36,0%** (+0,6 point vs 2024).
* **Taux d'Activité** : **40,4%** (Hommes : **67,6%**, Femmes : **14,7%**).
* **Taux de Chômage** : **11,1%** (Urbain : **13,1%**, Rural : **6,6%**).
* **Créations Nettes d'Emplois (2023–2025)** : **+41 911 postes créés**, soit **55,1%** de l'ensemble des créations nettes au Maroc (+76 123).
* **Premier Moteur Provincial** : **Taroudannt** (+17 298 postes), suivi d'**Agadir-Ida-Ou-Tanane** (+16 398) et d'**Inezgane-Aït Melloul** (+14 245).

---

## 🚀 Fonctionnalités Majeures

1. **Le Pulsar Territorial de Souss-Massa (Signature Visuelle)** :
   * Matrice interactive en temps réel affichant les 6 provinces avec volume d'emploi, taux de participation, dynamiques urbain/rural et jauges proportionnelles de contribution.
2. **Cartographie Spatiale Vectorielle & Choroplèthe** :
   * Carte interactive vectorielle des 6 territoires avec bascule de 4 métriques au choix (créations nettes, taux d'emploi 2025, démographie RGPH 2024, chômage provincial 2023).
3. **Trajectoire Historique Consolidée (2019–2025)** :
   * Séries temporelles interactives multi-indicateurs avec décomposition instantanée Milieu Urbain / Milieu Rural.
4. **Analyse des Fractures Spatiales & de Genre** :
   * Mesure rigoureuse des écarts directs en points de pourcentage (`pts`) via barres divergentes.
5. **Banquette OLAP & Data Explorer** :
   * Requêtage multidimensionnel avec sélection automatique de graphiques (ECharts) et **export direct au format CSV**.
6. **Studio Comparatif Double** :
   * Comparaison en vis-à-vis entre 2 territoires ou 2 années repères (ex: 2019 pré-pandémie vs 2025).
7. **Bilinguisme Intégral (Français / العربية)** :
   * Bascule linguistique instantanée avec support complet RTL et terminologie officielle du HCP.
8. **Dark & Light Mode** :
   * Thèmes contrastés et adaptés aux normes WCAG, typographie à espacement tabulaire (`tnum`).

---

## 🛠️ Stack Technique

* **Framework** : [Next.js](https://nextjs.org/) (App Router, Turbopack)
* **Langage** : [TypeScript](https://www.typescriptlang.org/)
* **Styles** : [Tailwind CSS v4](https://tailwindcss.com/) & PostCSS
* **Visualisation de Données** : [Apache ECharts](https://echarts.apache.org/) & `echarts-for-react`
* **Iconographie** : [Lucide React](https://lucide.dev/)
* **Traitement & Normalisation des Données** : [SheetJS / xlsx](https://sheetjs.com/)

---

## 📂 Structure du Répertoire

```
├── app/                        # Pages et Layout Next.js (App Router)
│   ├── globals.css             # Styles globaux, tokens et typographie tabulaire
│   ├── layout.tsx              # Root layout et Provider d'état global
│   └── page.tsx                # Page principale et gestionnaire de vues
├── components/
│   ├── charts/                 # Visualisations (Pulsar, Cartographie, TimeSeries, Secteurs, etc.)
│   ├── layout/                 # Shell applicatif (Header, Sidebar, FilterBar, Footer)
│   ├── ui/                     # Composants UI (StatCard, DataTable, Badge, SegmentControl)
│   └── views/                  # 12 Vues analytiques modulaires
├── data/
│   └── normalized/             # Datasets typés JSON validés (séries 2019-2025, provinces, etc.)
├── lib/
│   ├── app-context.tsx         # Gestion d'état global (filtres, vue active, thème, langue)
│   ├── calculations.ts         # Moteur de calcul statistique et micro-insights
│   ├── data-service.ts         # Couche d'accès aux données
│   ├── formatters.ts           # Formatage numérique, pourcentages et badges de fiabilité
│   └── i18n.ts                 # Dictionnaire bilingue Français / العربية (RTL)
├── scripts/
│   ├── generate-full-normalized-data.js # Pipeline de parsing et normalisation Excel
│   └── validate-normalized-data.js      # Script d'audit et de validation d'intégrité
├── types/
│   └── dataset.ts              # Types et interfaces TypeScript stricts
├── package.json
└── tsconfig.json
```

---

## 💻 Installation & Démarrage

### 1. Cloner le dépôt
```bash
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### 4. Compiler pour la production
```bash
npm run build
npm run start
```

### 5. Audit & Validation des Données
```bash
npm run test
# ou: npm run prepare-data
```

---

## 📑 Provenance des Données

Toutes les données intégrées dans cette plateforme proviennent des classeurs statistiques officiels du **Haut-Commissariat au Plan (HCP)** :
1. `ENE-Indicateurs désagrégés 2019-2024- Région #09`
2. `2025 - Chiffres clés détaillés - Région Souss-Massa`
3. `2023 - Indicateurs clés par province - SOUS MILIEU`
4. `emploi créés par provinces 23-24-25 (RGPH 2024 & ENE)`
5. `2024 - Indicateurs désagrégés détaillés - Région Souss-Massa`

---

## 📄 Licence
Projet réalisé sous licence MIT.
