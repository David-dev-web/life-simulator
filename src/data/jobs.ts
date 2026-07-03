import type { Job } from '../types/game';

export const JOBS: Job[] = [
  // 1. Verkäufer (Retail)
  {
    id: 'retail_clerk',
    title: { de: 'Verkäufer / Kassierer', en: 'Retail Clerk' },
    category: 'retail',
    minEducation: 'none',
    minIntelligence: 10,
    minLooks: 10,
    minDiscipline: 10,
    baseSalary: 24000,
    stressLevel: 25,
    promotionJobId: 'retail_manager',
    yearsForPromotion: 5
  },
  {
    id: 'retail_manager',
    title: { de: 'Filialleiter Einzelhandel', en: 'Store Manager' },
    category: 'retail',
    minEducation: 'vocational',
    minIntelligence: 40,
    minLooks: 20,
    minDiscipline: 50,
    baseSalary: 48000,
    stressLevel: 45,
    promotionJobId: 'retail_executive',
    yearsForPromotion: 6
  },
  {
    id: 'retail_executive',
    title: { de: 'Regionaldirektor Handel', en: 'Regional Retail Director' },
    category: 'retail',
    minEducation: 'university',
    minIntelligence: 65,
    minLooks: 40,
    minDiscipline: 70,
    baseSalary: 95000,
    stressLevel: 65
  },

  // 2. Handwerker (Craft)
  {
    id: 'craft_apprentice',
    title: { de: 'Handwerker-Geselle (Elektro/Sanitär)', en: 'Craftsman / Journeyman' },
    category: 'craft',
    minEducation: 'vocational',
    minIntelligence: 30,
    minLooks: 10,
    minDiscipline: 40,
    baseSalary: 36000,
    stressLevel: 35,
    promotionJobId: 'craft_master',
    yearsForPromotion: 5
  },
  {
    id: 'craft_master',
    title: { de: 'Handwerksmeister', en: 'Master Craftsman' },
    category: 'craft',
    minEducation: 'vocational',
    minIntelligence: 50,
    minLooks: 15,
    minDiscipline: 65,
    baseSalary: 62000,
    stressLevel: 45,
    promotionJobId: 'craft_owner',
    yearsForPromotion: 5
  },
  {
    id: 'craft_owner',
    title: { de: 'Inhaber Handwerksbetrieb', en: 'Craft Business Owner' },
    category: 'craft',
    minEducation: 'vocational',
    minIntelligence: 65,
    minLooks: 20,
    minDiscipline: 80,
    baseSalary: 110000,
    stressLevel: 60
  },

  // 3. Polizist (Public)
  {
    id: 'police_officer',
    title: { de: 'Polizeibeamter / Streifenpolizist', en: 'Police Officer' },
    category: 'public',
    minEducation: 'vocational',
    minIntelligence: 45,
    minLooks: 20,
    minDiscipline: 60,
    baseSalary: 42000,
    stressLevel: 55,
    promotionJobId: 'police_detective',
    yearsForPromotion: 5
  },
  {
    id: 'police_detective',
    title: { de: 'Kriminalkommissar / Ermittler', en: 'Police Detective' },
    category: 'public',
    minEducation: 'vocational',
    minIntelligence: 65,
    minLooks: 25,
    minDiscipline: 75,
    baseSalary: 68000,
    stressLevel: 70,
    promotionJobId: 'police_chief',
    yearsForPromotion: 7
  },
  {
    id: 'police_chief',
    title: { de: 'Polizeipräsident / BKA-Direktor', en: 'Police Chief / FBI Director' },
    category: 'public',
    minEducation: 'university',
    minIntelligence: 80,
    minLooks: 40,
    minDiscipline: 90,
    baseSalary: 125000,
    stressLevel: 80
  },

  // 4. Lehrer (Public / Education)
  {
    id: 'teacher',
    title: { de: 'Gymnasiallehrer', en: 'High School Teacher' },
    category: 'public',
    minEducation: 'university',
    requiredField: 'edu',
    minIntelligence: 60,
    minLooks: 20,
    minDiscipline: 55,
    baseSalary: 52000,
    stressLevel: 50,
    promotionJobId: 'school_principal',
    yearsForPromotion: 8
  },
  {
    id: 'school_principal',
    title: { de: 'Schulleiter / Oberstudiendirektor', en: 'School Principal' },
    category: 'public',
    minEducation: 'university',
    requiredField: 'edu',
    minIntelligence: 75,
    minLooks: 30,
    minDiscipline: 80,
    baseSalary: 82000,
    stressLevel: 65
  },

  // 5. Programmierer (Tech)
  {
    id: 'dev_junior',
    title: { de: 'Junior Software-Entwickler', en: 'Junior Software Engineer' },
    category: 'tech',
    minEducation: 'university',
    requiredField: 'cs',
    minIntelligence: 65,
    minLooks: 10,
    minDiscipline: 50,
    baseSalary: 55000,
    stressLevel: 40,
    promotionJobId: 'dev_senior',
    yearsForPromotion: 3
  },
  {
    id: 'dev_senior',
    title: { de: 'Senior Software-Architekt', en: 'Senior Software Architect' },
    category: 'tech',
    minEducation: 'university',
    requiredField: 'cs',
    minIntelligence: 80,
    minLooks: 15,
    minDiscipline: 70,
    baseSalary: 95000,
    stressLevel: 55,
    promotionJobId: 'dev_cto',
    yearsForPromotion: 5
  },
  {
    id: 'dev_cto',
    title: { de: 'Chief Technology Officer (CTO)', en: 'Chief Technology Officer (CTO)' },
    category: 'tech',
    minEducation: 'university',
    requiredField: 'cs',
    minIntelligence: 90,
    minLooks: 30,
    minDiscipline: 85,
    baseSalary: 180000,
    stressLevel: 75
  },

  // 6. Arzt (Medical)
  {
    id: 'doc_resident',
    title: { de: 'Assistenzarzt im Krankenhaus', en: 'Medical Resident' },
    category: 'medical',
    minEducation: 'university',
    requiredField: 'med',
    minIntelligence: 80,
    minLooks: 20,
    minDiscipline: 75,
    baseSalary: 65000,
    stressLevel: 80,
    promotionJobId: 'doc_specialist',
    yearsForPromotion: 5
  },
  {
    id: 'doc_specialist',
    title: { de: 'Facharzt für Chirurgie', en: 'Specialist Surgeon' },
    category: 'medical',
    minEducation: 'university',
    requiredField: 'med',
    minIntelligence: 88,
    minLooks: 25,
    minDiscipline: 85,
    baseSalary: 130000,
    stressLevel: 75,
    promotionJobId: 'doc_chief',
    yearsForPromotion: 6
  },
  {
    id: 'doc_chief',
    title: { de: 'Chefarzt / Klinikleiter', en: 'Chief Medical Officer' },
    category: 'medical',
    minEducation: 'doctorate',
    requiredField: 'med',
    minIntelligence: 95,
    minLooks: 40,
    minDiscipline: 95,
    baseSalary: 260000,
    stressLevel: 85
  },

  // 7. Anwalt (Legal)
  {
    id: 'law_associate',
    title: { de: 'Rechtsanwalt / Associate', en: 'Lawyer / Associate' },
    category: 'legal',
    minEducation: 'university',
    requiredField: 'law',
    minIntelligence: 78,
    minLooks: 40,
    minDiscipline: 75,
    baseSalary: 72000,
    stressLevel: 70,
    promotionJobId: 'law_partner',
    yearsForPromotion: 6
  },
  {
    id: 'law_partner',
    title: { de: 'Kanzlei-Partner / Star-Anwalt', en: 'Law Firm Partner' },
    category: 'legal',
    minEducation: 'university',
    requiredField: 'law',
    minIntelligence: 88,
    minLooks: 50,
    minDiscipline: 90,
    baseSalary: 210000,
    stressLevel: 80,
    promotionJobId: 'judge',
    yearsForPromotion: 8
  },
  {
    id: 'judge',
    title: { de: 'Vorsitzender Bundesrichter', en: 'Supreme Court Judge' },
    category: 'legal',
    minEducation: 'doctorate',
    requiredField: 'law',
    minIntelligence: 92,
    minLooks: 50,
    minDiscipline: 95,
    baseSalary: 165000,
    stressLevel: 60
  },

  // 8. Unternehmer (Business)
  {
    id: 'biz_founder',
    title: { de: 'Start-up Gründer', en: 'Start-up Founder' },
    category: 'business',
    minEducation: 'vocational',
    minIntelligence: 60,
    minLooks: 30,
    minDiscipline: 70,
    baseSalary: 50000,
    stressLevel: 75,
    promotionJobId: 'biz_ceo',
    yearsForPromotion: 5
  },
  {
    id: 'biz_ceo',
    title: { de: 'Geschäftsführer / CEO', en: 'Chief Executive Officer (CEO)' },
    category: 'business',
    minEducation: 'university',
    minIntelligence: 80,
    minLooks: 50,
    minDiscipline: 85,
    baseSalary: 250000,
    stressLevel: 85,
    promotionJobId: 'biz_tycoon',
    yearsForPromotion: 8
  },
  {
    id: 'biz_tycoon',
    title: { de: 'Globaler Wirtschaftsmagnat', en: 'Global Business Tycoon' },
    category: 'business',
    minEducation: 'university',
    minIntelligence: 90,
    minLooks: 60,
    minDiscipline: 95,
    baseSalary: 1200000,
    stressLevel: 90
  },

  // 9. Musiker (Creative)
  {
    id: 'music_street',
    title: { de: 'Straßenmusiker / Club-Künstler', en: 'Street & Club Musician' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 30,
    minLooks: 40,
    minDiscipline: 30,
    baseSalary: 18000,
    stressLevel: 30,
    promotionJobId: 'music_star',
    yearsForPromotion: 4
  },
  {
    id: 'music_star',
    title: { de: 'Aufstrebender Popstar', en: 'Rising Pop Star' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 50,
    minLooks: 75,
    minDiscipline: 60,
    baseSalary: 150000,
    stressLevel: 65,
    promotionJobId: 'music_legend',
    yearsForPromotion: 6
  },
  {
    id: 'music_legend',
    title: { de: 'Internationale Musik-Legende', en: 'Global Music Legend' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 65,
    minLooks: 85,
    minDiscipline: 80,
    baseSalary: 850000,
    stressLevel: 70
  },

  // 10. Influencer (Creative)
  {
    id: 'influencer_micro',
    title: { de: 'Micro-Influencer & Blogger', en: 'Micro-Influencer' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 30,
    minLooks: 60,
    minDiscipline: 40,
    baseSalary: 28000,
    stressLevel: 35,
    promotionJobId: 'influencer_macro',
    yearsForPromotion: 3
  },
  {
    id: 'influencer_macro',
    title: { de: 'Begehrter Social Media Star', en: 'Social Media Star' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 50,
    minLooks: 80,
    minDiscipline: 65,
    baseSalary: 120000,
    stressLevel: 55,
    promotionJobId: 'influencer_icon',
    yearsForPromotion: 5
  },
  {
    id: 'influencer_icon',
    title: { de: 'Globale Digital-Ikone', en: 'Global Digital Icon' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 65,
    minLooks: 95,
    minDiscipline: 80,
    baseSalary: 650000,
    stressLevel: 60
  },

  // 11. Profisportler (Sports)
  {
    id: 'athlete_rookie',
    title: { de: 'Nachwuchs-Profisportler', en: 'Rookie Pro Athlete' },
    category: 'sports',
    minEducation: 'none',
    minIntelligence: 30,
    minLooks: 50,
    minDiscipline: 80,
    baseSalary: 60000,
    stressLevel: 50,
    promotionJobId: 'athlete_star',
    yearsForPromotion: 3
  },
  {
    id: 'athlete_star',
    title: { de: 'Bundesliga / Liga-Star', en: 'League Star Athlete' },
    category: 'sports',
    minEducation: 'none',
    minIntelligence: 45,
    minLooks: 70,
    minDiscipline: 90,
    baseSalary: 450000,
    stressLevel: 65,
    promotionJobId: 'athlete_champion',
    yearsForPromotion: 5
  },
  {
    id: 'athlete_champion',
    title: { de: 'Weltmeister & Hall of Famer', en: 'World Champion & Hall of Famer' },
    category: 'sports',
    minEducation: 'none',
    minIntelligence: 60,
    minLooks: 80,
    minDiscipline: 98,
    baseSalary: 2500000,
    stressLevel: 75
  },

  // 12. Koch (Service / Craft)
  {
    id: 'chef_line',
    title: { de: 'Sous-Chef / Küchenhelfer', en: 'Line Cook / Sous Chef' },
    category: 'service',
    minEducation: 'vocational',
    minIntelligence: 35,
    minLooks: 10,
    minDiscipline: 50,
    baseSalary: 32000,
    stressLevel: 55,
    promotionJobId: 'chef_head',
    yearsForPromotion: 4
  },
  {
    id: 'chef_head',
    title: { de: 'Küchenchef / Head Chef', en: 'Head Chef' },
    category: 'service',
    minEducation: 'vocational',
    minIntelligence: 60,
    minLooks: 20,
    minDiscipline: 75,
    baseSalary: 68000,
    stressLevel: 70,
    promotionJobId: 'chef_michelin',
    yearsForPromotion: 6
  },
  {
    id: 'chef_michelin',
    title: { de: '3-Sterne Michelin Meisterkoch', en: '3-Star Michelin Chef' },
    category: 'service',
    minEducation: 'vocational',
    minIntelligence: 80,
    minLooks: 40,
    minDiscipline: 95,
    baseSalary: 190000,
    stressLevel: 85
  },

  // 13. Pilot (Tech / Public)
  {
    id: 'pilot_copilot',
    title: { de: 'Co-Pilot Linienflugzeug', en: 'Commercial Co-Pilot' },
    category: 'tech',
    minEducation: 'vocational',
    minIntelligence: 75,
    minLooks: 40,
    minDiscipline: 85,
    baseSalary: 75000,
    stressLevel: 60,
    promotionJobId: 'pilot_captain',
    yearsForPromotion: 6
  },
  {
    id: 'pilot_captain',
    title: { de: 'Flugkapitän Langstrecke', en: 'Long-haul Airline Captain' },
    category: 'tech',
    minEducation: 'vocational',
    minIntelligence: 88,
    minLooks: 50,
    minDiscipline: 95,
    baseSalary: 155000,
    stressLevel: 70
  },

  // 14. Schauspieler (Creative)
  {
    id: 'actor_extra',
    title: { de: 'Komparse / Seriendarsteller', en: 'TV Series Actor' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 40,
    minLooks: 65,
    minDiscipline: 50,
    baseSalary: 38000,
    stressLevel: 45,
    promotionJobId: 'actor_star',
    yearsForPromotion: 5
  },
  {
    id: 'actor_star',
    title: { de: 'Hollywood Leinwandstar', en: 'Hollywood Movie Star' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 60,
    minLooks: 85,
    minDiscipline: 75,
    baseSalary: 480000,
    stressLevel: 65,
    promotionJobId: 'actor_oscar',
    yearsForPromotion: 6
  },
  {
    id: 'actor_oscar',
    title: { de: 'Oscar-gefeierte Schauspiel-Legende', en: 'Oscar-Winning Acting Legend' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 75,
    minLooks: 90,
    minDiscipline: 90,
    baseSalary: 3500000,
    stressLevel: 70
  },

  // 15. Wissenschaftler (Tech / Public)
  {
    id: 'sci_researcher',
    title: { de: 'Wissenschaftlicher Mitarbeiter', en: 'Research Scientist' },
    category: 'tech',
    minEducation: 'university',
    requiredField: 'sci',
    minIntelligence: 80,
    minLooks: 10,
    minDiscipline: 70,
    baseSalary: 56000,
    stressLevel: 45,
    promotionJobId: 'sci_professor',
    yearsForPromotion: 5
  },
  {
    id: 'sci_professor',
    title: { de: 'Universitätsprofessor & Institutsleiter', en: 'University Professor & Chair' },
    category: 'tech',
    minEducation: 'doctorate',
    requiredField: 'sci',
    minIntelligence: 90,
    minLooks: 20,
    minDiscipline: 85,
    baseSalary: 98000,
    stressLevel: 55,
    promotionJobId: 'sci_nobel',
    yearsForPromotion: 10
  },
  {
    id: 'sci_nobel',
    title: { de: 'Nobelpreisträger für Physik/Chemie', en: 'Nobel Laureate Scientist' },
    category: 'tech',
    minEducation: 'doctorate',
    requiredField: 'sci',
    minIntelligence: 98,
    minLooks: 30,
    minDiscipline: 95,
    baseSalary: 220000,
    stressLevel: 50
  },

  // 16. Psychologe (Medical)
  {
    id: 'psych_therapist',
    title: { de: 'Psychologischer Psychotherapeut', en: 'Clinical Psychotherapist' },
    category: 'medical',
    minEducation: 'university',
    requiredField: 'psych',
    minIntelligence: 75,
    minLooks: 30,
    minDiscipline: 70,
    baseSalary: 64000,
    stressLevel: 60,
    promotionJobId: 'psych_director',
    yearsForPromotion: 6
  },
  {
    id: 'psych_director',
    title: { de: 'Leiter der Psychiatrischen Klinik', en: 'Director of Psychiatric Clinic' },
    category: 'medical',
    minEducation: 'doctorate',
    requiredField: 'psych',
    minIntelligence: 88,
    minLooks: 40,
    minDiscipline: 85,
    baseSalary: 125000,
    stressLevel: 70
  },

  // 17. Architekt (Creative / Tech)
  {
    id: 'architect_junior',
    title: { de: 'Architekt / Projektplaner', en: 'Architect / Project Designer' },
    category: 'creative',
    minEducation: 'university',
    requiredField: 'eng',
    minIntelligence: 72,
    minLooks: 30,
    minDiscipline: 70,
    baseSalary: 58000,
    stressLevel: 50,
    promotionJobId: 'architect_chief',
    yearsForPromotion: 6
  },
  {
    id: 'architect_chief',
    title: { de: 'Star-Architekt & Büroinhaber', en: 'Chief Star Architect' },
    category: 'creative',
    minEducation: 'university',
    requiredField: 'eng',
    minIntelligence: 88,
    minLooks: 50,
    minDiscipline: 88,
    baseSalary: 160000,
    stressLevel: 65
  },

  // 18. Journalist (Creative)
  {
    id: 'journalist_editor',
    title: { de: 'Redakteur / Journalist', en: 'Journalist / Editor' },
    category: 'creative',
    minEducation: 'university',
    minIntelligence: 68,
    minLooks: 30,
    minDiscipline: 65,
    baseSalary: 46000,
    stressLevel: 55,
    promotionJobId: 'journalist_chief',
    yearsForPromotion: 6
  },
  {
    id: 'journalist_chief',
    title: { de: 'Chefredakteur großer Medienhaus', en: 'Editor-in-Chief' },
    category: 'creative',
    minEducation: 'university',
    minIntelligence: 84,
    minLooks: 45,
    minDiscipline: 85,
    baseSalary: 115000,
    stressLevel: 75
  },

  // 19. Bankier (Business)
  {
    id: 'bank_analyst',
    title: { de: 'Investment-Analyst', en: 'Investment Analyst' },
    category: 'business',
    minEducation: 'university',
    requiredField: 'biz',
    minIntelligence: 76,
    minLooks: 40,
    minDiscipline: 80,
    baseSalary: 75000,
    stressLevel: 75,
    promotionJobId: 'bank_banker',
    yearsForPromotion: 4
  },
  {
    id: 'bank_banker',
    title: { de: 'Senior Investmentbanker', en: 'Senior Investment Banker' },
    category: 'business',
    minEducation: 'university',
    requiredField: 'biz',
    minIntelligence: 88,
    minLooks: 55,
    minDiscipline: 90,
    baseSalary: 230000,
    stressLevel: 88,
    promotionJobId: 'bank_director',
    yearsForPromotion: 6
  },
  {
    id: 'bank_director',
    title: { de: 'Vorstandsmitglied Großbank', en: 'Bank Board Director' },
    category: 'business',
    minEducation: 'university',
    requiredField: 'biz',
    minIntelligence: 94,
    minLooks: 65,
    minDiscipline: 95,
    baseSalary: 680000,
    stressLevel: 85
  },

  // 20. Krankenpfleger (Medical)
  {
    id: 'nurse',
    title: { de: 'Krankenpfleger / Krankenschwester', en: 'Registered Nurse' },
    category: 'medical',
    minEducation: 'vocational',
    minIntelligence: 50,
    minLooks: 20,
    minDiscipline: 70,
    baseSalary: 38000,
    stressLevel: 65,
    promotionJobId: 'nurse_head',
    yearsForPromotion: 5
  },
  {
    id: 'nurse_head',
    title: { de: 'Stationsleitung Pflege', en: 'Head Nurse / Ward Manager' },
    category: 'medical',
    minEducation: 'vocational',
    minIntelligence: 65,
    minLooks: 30,
    minDiscipline: 85,
    baseSalary: 56000,
    stressLevel: 70
  },

  // 21. Müllmann / Entsorger (Service)
  {
    id: 'sanitation_worker',
    title: { de: 'Müllmann / Fachkraft für Kreislaufwirtschaft', en: 'Sanitation Worker' },
    category: 'service',
    minEducation: 'none',
    minIntelligence: 15,
    minLooks: 10,
    minDiscipline: 30,
    baseSalary: 34000,
    stressLevel: 30,
    promotionJobId: 'sanitation_manager',
    yearsForPromotion: 5
  },
  {
    id: 'sanitation_manager',
    title: { de: 'Entsorgungsmeister & Flottenleiter', en: 'Waste Management Supervisor' },
    category: 'service',
    minEducation: 'vocational',
    minIntelligence: 45,
    minLooks: 20,
    minDiscipline: 65,
    baseSalary: 52000,
    stressLevel: 40
  },

  // 22. Feuerwehrmann (Public)
  {
    id: 'firefighter',
    title: { de: 'Berufsfeuerwehrmann / Brandmeister', en: 'Firefighter' },
    category: 'public',
    minEducation: 'vocational',
    minIntelligence: 50,
    minLooks: 30,
    minDiscipline: 80,
    baseSalary: 42000,
    stressLevel: 65,
    promotionJobId: 'fire_chief',
    yearsForPromotion: 6
  },
  {
    id: 'fire_chief',
    title: { de: 'Branddirektor / Leiter Feuerwehr', en: 'Fire Chief' },
    category: 'public',
    minEducation: 'university',
    minIntelligence: 75,
    minLooks: 40,
    minDiscipline: 90,
    baseSalary: 84000,
    stressLevel: 70
  },

  // 23. Tierarzt (Medical)
  {
    id: 'vet',
    title: { de: 'Tierarzt / Veterinärmediziner', en: 'Veterinarian' },
    category: 'medical',
    minEducation: 'university',
    requiredField: 'med',
    minIntelligence: 78,
    minLooks: 25,
    minDiscipline: 75,
    baseSalary: 62000,
    stressLevel: 55,
    promotionJobId: 'vet_clinic_owner',
    yearsForPromotion: 6
  },
  {
    id: 'vet_clinic_owner',
    title: { de: 'Eigentümer der Tierklinik', en: 'Veterinary Clinic Owner' },
    category: 'medical',
    minEducation: 'university',
    requiredField: 'med',
    minIntelligence: 86,
    minLooks: 35,
    minDiscipline: 88,
    baseSalary: 115000,
    stressLevel: 60
  },

  // 24. Modedesigner (Creative)
  {
    id: 'fashion_designer',
    title: { de: 'Modedesigner', en: 'Fashion Designer' },
    category: 'creative',
    minEducation: 'vocational',
    minIntelligence: 55,
    minLooks: 65,
    minDiscipline: 65,
    baseSalary: 48000,
    stressLevel: 50,
    promotionJobId: 'fashion_icon',
    yearsForPromotion: 6
  },
  {
    id: 'fashion_icon',
    title: { de: 'Gründer Haute-Couture Modeimperium', en: 'Haute-Couture Fashion Empire Founder' },
    category: 'creative',
    minEducation: 'university',
    minIntelligence: 78,
    minLooks: 85,
    minDiscipline: 85,
    baseSalary: 380000,
    stressLevel: 70
  },

  // 25. Politiker (Public)
  {
    id: 'politician_local',
    title: { de: 'Stadtrat & Landtagsabgeordneter', en: 'City Council & State Representative' },
    category: 'public',
    minEducation: 'university',
    minIntelligence: 70,
    minLooks: 50,
    minDiscipline: 70,
    baseSalary: 72000,
    stressLevel: 60,
    promotionJobId: 'politician_minister',
    yearsForPromotion: 5
  },
  {
    id: 'politician_minister',
    title: { de: 'Bundesminister', en: 'Federal Cabinet Minister' },
    category: 'public',
    minEducation: 'university',
    minIntelligence: 85,
    minLooks: 65,
    minDiscipline: 88,
    baseSalary: 160000,
    stressLevel: 80,
    promotionJobId: 'politician_president',
    yearsForPromotion: 6
  },
  {
    id: 'politician_president',
    title: { de: 'Bundeskanzler / Staatspräsident', en: 'President / Chancellor' },
    category: 'public',
    minEducation: 'university',
    minIntelligence: 92,
    minLooks: 75,
    minDiscipline: 96,
    baseSalary: 350000,
    stressLevel: 95
  },

  // 26. Soldat (Military)
  {
    id: 'soldier',
    title: { de: 'Soldat / Unteroffizier', en: 'Soldier / Sergeant' },
    category: 'military',
    minEducation: 'none',
    minIntelligence: 40,
    minLooks: 30,
    minDiscipline: 80,
    baseSalary: 36000,
    stressLevel: 60,
    promotionJobId: 'military_officer',
    yearsForPromotion: 5
  },
  {
    id: 'military_officer',
    title: { de: 'Offizier / Major', en: 'Military Officer / Major' },
    category: 'military',
    minEducation: 'university',
    minIntelligence: 72,
    minLooks: 45,
    minDiscipline: 90,
    baseSalary: 76000,
    stressLevel: 70,
    promotionJobId: 'military_general',
    yearsForPromotion: 8
  },
  {
    id: 'military_general',
    title: { de: 'Vier-Sterne General / Oberbefehlshaber', en: 'Four-Star General' },
    category: 'military',
    minEducation: 'university',
    minIntelligence: 88,
    minLooks: 60,
    minDiscipline: 98,
    baseSalary: 175000,
    stressLevel: 85
  },

  // 27. Landwirt (Craft / Business)
  {
    id: 'farmer',
    title: { de: 'Landwirt / Agrarwirt', en: 'Farmer / Agriculturalist' },
    category: 'craft',
    minEducation: 'vocational',
    minIntelligence: 45,
    minLooks: 15,
    minDiscipline: 75,
    baseSalary: 42000,
    stressLevel: 50,
    promotionJobId: 'farmer_tycoon',
    yearsForPromotion: 8
  },
  {
    id: 'farmer_tycoon',
    title: { de: 'Großgrundbesitzer & Bio-Gigant', en: 'Agricultural Tycoon' },
    category: 'business',
    minEducation: 'vocational',
    minIntelligence: 70,
    minLooks: 30,
    minDiscipline: 88,
    baseSalary: 140000,
    stressLevel: 55
  },

  // 28. Fotograf (Creative)
  {
    id: 'photographer',
    title: { de: 'Fotograf / Bildjournalist', en: 'Photographer / Photojournalist' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 45,
    minLooks: 40,
    minDiscipline: 55,
    baseSalary: 36000,
    stressLevel: 35,
    promotionJobId: 'photographer_star',
    yearsForPromotion: 5
  },
  {
    id: 'photographer_star',
    title: { de: 'Internationaler Vogue & Star-Fotograf', en: 'International Celebrity Photographer' },
    category: 'creative',
    minEducation: 'none',
    minIntelligence: 70,
    minLooks: 70,
    minDiscipline: 80,
    baseSalary: 165000,
    stressLevel: 50
  },

  // 29. Bauarbeiter (Craft)
  {
    id: 'construction_worker',
    title: { de: 'Bauarbeiter / Polier', en: 'Construction Worker' },
    category: 'craft',
    minEducation: 'none',
    minIntelligence: 20,
    minLooks: 15,
    minDiscipline: 50,
    baseSalary: 35000,
    stressLevel: 45,
    promotionJobId: 'construction_manager',
    yearsForPromotion: 6
  },
  {
    id: 'construction_manager',
    title: { de: 'Bauleiter Großprojekte', en: 'Construction Site Manager' },
    category: 'craft',
    minEducation: 'vocational',
    minIntelligence: 60,
    minLooks: 25,
    minDiscipline: 80,
    baseSalary: 74000,
    stressLevel: 65
  },

  // 30. Immobilienmakler (Business)
  {
    id: 'realtor',
    title: { de: 'Immobilienmakler', en: 'Real Estate Agent' },
    category: 'business',
    minEducation: 'vocational',
    minIntelligence: 55,
    minLooks: 60,
    minDiscipline: 65,
    baseSalary: 55000,
    stressLevel: 55,
    promotionJobId: 'realtor_tycoon',
    yearsForPromotion: 5
  },
  {
    id: 'realtor_tycoon',
    title: { de: 'Luxus-Immobilien Tycoon', en: 'Luxury Real Estate Tycoon' },
    category: 'business',
    minEducation: 'university',
    minIntelligence: 80,
    minLooks: 80,
    minDiscipline: 88,
    baseSalary: 320000,
    stressLevel: 70
  },

  // 31. Taxifahrer (Service)
  {
    id: 'taxi_driver',
    title: { de: 'Taxifahrer / Chauffeur', en: 'Taxi / Rideshare Driver' },
    category: 'service',
    minEducation: 'none',
    minIntelligence: 20,
    minLooks: 15,
    minDiscipline: 40,
    baseSalary: 30000,
    stressLevel: 35,
    promotionJobId: 'taxi_fleet_owner',
    yearsForPromotion: 6
  },
  {
    id: 'taxi_fleet_owner',
    title: { de: 'Inhaber einer Chauffeur-Flotte', en: 'Limousine Fleet Owner' },
    category: 'service',
    minEducation: 'vocational',
    minIntelligence: 60,
    minLooks: 40,
    minDiscipline: 75,
    baseSalary: 85000,
    stressLevel: 50
  },

  // 32. Buchhalter (Business)
  {
    id: 'accountant',
    title: { de: 'Bilanzbuchhalter / Steuerberater', en: 'Accountant / Tax Advisor' },
    category: 'business',
    minEducation: 'university',
    requiredField: 'biz',
    minIntelligence: 72,
    minLooks: 25,
    minDiscipline: 82,
    baseSalary: 62000,
    stressLevel: 55,
    promotionJobId: 'auditor_partner',
    yearsForPromotion: 6
  },
  {
    id: 'auditor_partner',
    title: { de: 'Partner der Wirtschaftsprüfung', en: 'Auditing Firm Partner' },
    category: 'business',
    minEducation: 'university',
    requiredField: 'biz',
    minIntelligence: 88,
    minLooks: 45,
    minDiscipline: 92,
    baseSalary: 185000,
    stressLevel: 75
  },

  // 33. Detektiv (Legal / Service)
  {
    id: 'private_eye',
    title: { de: 'Privatdetektiv / Ermittler', en: 'Private Investigator' },
    category: 'service',
    minEducation: 'vocational',
    minIntelligence: 68,
    minLooks: 30,
    minDiscipline: 70,
    baseSalary: 48000,
    stressLevel: 55,
    promotionJobId: 'detective_agency_boss',
    yearsForPromotion: 5
  },
  {
    id: 'detective_agency_boss',
    title: { de: 'Leiter Internationaler Sicherheits-Detektei', en: 'Global Security & Detective Agency Boss' },
    category: 'service',
    minEducation: 'university',
    minIntelligence: 84,
    minLooks: 50,
    minDiscipline: 86,
    baseSalary: 135000,
    stressLevel: 65
  },

  // 34. Astronaut (Tech / Military)
  {
    id: 'astronaut',
    title: { de: 'Raumfahrt-Astronaut & ESA/NASA Pilot', en: 'Space Astronaut' },
    category: 'tech',
    minEducation: 'doctorate',
    requiredField: 'sci',
    minIntelligence: 95,
    minLooks: 50,
    minDiscipline: 98,
    baseSalary: 140000,
    stressLevel: 85,
    promotionJobId: 'mars_pioneer',
    yearsForPromotion: 8
  },
  {
    id: 'mars_pioneer',
    title: { de: 'Kommandant der ersten Mars-Kolonie', en: 'Mars Colony Commander' },
    category: 'tech',
    minEducation: 'doctorate',
    requiredField: 'sci',
    minIntelligence: 98,
    minLooks: 60,
    minDiscipline: 99,
    baseSalary: 350000,
    stressLevel: 90
  },

  // 35. Hacker (Tech / Crime)
  {
    id: 'hacker_whitehat',
    title: { de: 'Cyber-Security Spezialist & White-Hat', en: 'Cyber-Security Specialist' },
    category: 'tech',
    minEducation: 'none',
    minIntelligence: 82,
    minLooks: 10,
    minDiscipline: 60,
    baseSalary: 78000,
    stressLevel: 50,
    promotionJobId: 'cyber_defense_chief',
    yearsForPromotion: 4
  },
  {
    id: 'cyber_defense_chief',
    title: { de: 'Direktor für Globale Cyber-Verteidigung', en: 'Global Cyber Defense Director' },
    category: 'tech',
    minEducation: 'university',
    minIntelligence: 94,
    minLooks: 30,
    minDiscipline: 85,
    baseSalary: 210000,
    stressLevel: 70
  }
];

export const getJobById = (id?: string): Job | undefined => {
  if (!id) return undefined;
  return JOBS.find(j => j.id === id);
};
