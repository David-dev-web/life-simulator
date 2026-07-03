import type { Vehicle } from '../types/game';

export const VEHICLES: Omit<Vehicle, 'isOwned' | 'condition'>[] = [
  {
    id: 'bike_used',
    title: { de: 'Gebrauchtes City-Fahrrad', en: 'Used City Bicycle' },
    category: 'bike',
    price: 150,
    yearlyMaintenance: 20
  },
  {
    id: 'bike_ebike',
    title: { de: 'Premium E-Bike Mountain', en: 'Premium Mountain E-Bike' },
    category: 'bike',
    price: 3200,
    yearlyMaintenance: 150
  },
  {
    id: 'scooter_vespa',
    title: { de: 'Klassischer Motorroller (Vespa-Stil)', en: 'Classic Italian Scooter' },
    category: 'scooter',
    price: 4500,
    yearlyMaintenance: 300
  },
  {
    id: 'car_compact',
    title: { de: 'Zuverlässiger Kleinwagen', en: 'Reliable Compact Car' },
    category: 'car',
    price: 18000,
    yearlyMaintenance: 1200
  },
  {
    id: 'car_sedan',
    title: { de: 'Komfortable Mittelklasse-Limousine', en: 'Comfortable Executive Sedan' },
    category: 'car',
    price: 45000,
    yearlyMaintenance: 2500
  },
  {
    id: 'car_ev',
    title: { de: 'Modernes Elektro-SUV mit Autopilot', en: 'Modern Electric SUV with Autopilot' },
    category: 'car',
    price: 78000,
    yearlyMaintenance: 3200
  },
  {
    id: 'sports_porsche',
    title: { de: 'Deutscher Sportwagen 911er Stil', en: 'German 911-Style Sports Car' },
    category: 'sports',
    price: 145000,
    yearlyMaintenance: 6500
  },
  {
    id: 'sports_lambo',
    title: { de: 'Italienischer V12 Super-Sportwagen', en: 'Italian V12 Supercar' },
    category: 'sports',
    price: 380000,
    yearlyMaintenance: 18000
  },
  {
    id: 'luxury_yacht',
    title: { de: '30-Meter Luxus-Motor-Yacht', en: '30-Meter Luxury Motor Yacht' },
    category: 'luxury',
    price: 3500000,
    yearlyMaintenance: 220000
  },
  {
    id: 'luxury_jet',
    title: { de: 'G500 Interkontinentaler Privatjet', en: 'G500 Intercontinental Private Jet' },
    category: 'luxury',
    price: 28000000,
    yearlyMaintenance: 1200000
  }
];
