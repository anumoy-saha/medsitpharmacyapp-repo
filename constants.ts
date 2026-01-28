
import { Category, Medicine, Doctor, Hospital } from './types';

export const CATEGORIES: Category[] = [
  { id: 'fever', name: 'FEVER & PAIN', icon: '🌡️' },
  { id: 'digestive', name: 'DIGESTIVE', icon: '💊' },
  { id: 'cold', name: 'COLD & FLU', icon: '🤧' },
  { id: 'skin', name: 'SKIN CARE', icon: '🧴' },
  { id: 'diabetes', name: 'DIABETES', icon: '💉' },
  { id: 'vitamins', name: 'VITAMINS', icon: '🍊' },
  { id: 'heart', name: 'HEART HEALTH', icon: '❤️' },
];

export const MEDICINES: Medicine[] = [
  // FEVER & PAIN (1-10)
  { id: 1, name: 'Paracetamol 500mg', price: 25, category: 'fever', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80', popular: true, description: 'Standard pain reliever.', dosage: '1-2 tablets every 4 hours.' },
  { id: 2, name: 'Crocin Advance', price: 35, category: 'fever', image: 'https://images.unsplash.com/photo-1603398938378-e54eabc4463e?w=500&q=80', popular: true, description: 'Fast-acting paracetamol.', dosage: '1 tablet as needed.' },
  { id: 4, name: 'Dolo 650', price: 28, category: 'fever', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=500&q=80', popular: true, description: 'Prescribed for high fever.', dosage: '1 tablet 3 times a day.' },
  { id: 5, name: 'Combiflam', price: 42, category: 'fever', image: 'https://images.unsplash.com/photo-1471864190281-ad5f9f33d70e?w=500&q=80', popular: false, description: 'Ibuprofen + Paracetamol.', dosage: '1 tablet after meals.' },
  { id: 6, name: 'Calpol 650', price: 30, category: 'fever', image: 'https://images.unsplash.com/photo-1550572017-ed200159d231?w=500&q=80', popular: false, description: 'Mild pain relief.', dosage: '1 tablet thrice daily.' },
  { id: 7, name: 'Sumo L 650', price: 32, category: 'fever', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80', popular: false, description: 'For body ache and fever.', dosage: '1 tablet twice a day.' },
  { id: 8, name: 'Dart Pain Reliever', price: 22, category: 'fever', image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=500&q=80', popular: false, description: 'Tension headache relief.', dosage: '1 tablet when needed.' },
  { id: 9, name: 'Meftal Forte', price: 45, category: 'fever', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&q=80', popular: false, description: 'Mefenamic Acid combo.', dosage: '1 tablet for pain.' },
  { id: 10, name: 'Nimesulide 100mg', price: 18, category: 'fever', image: 'https://images.unsplash.com/photo-1626963014102-99c3f73ee34a?w=500&q=80', popular: false, description: 'Acute pain relief.', dosage: 'As directed by doctor.' },

  // DIGESTIVE (11-20)
  { id: 3, name: 'Digene Gel Mint', price: 45, category: 'digestive', image: 'https://images.unsplash.com/photo-1576091160550-2173bdd9962a?w=500&q=80', popular: true, description: 'Quick acidity relief.' },
  { id: 11, name: 'Zinetac 150mg', price: 12, category: 'digestive', image: 'https://images.unsplash.com/photo-1550572017-ed200159d231?w=500&q=80', popular: false, description: 'Ranitidine for acidity.' },
  { id: 12, name: 'Pantocid 40mg', price: 110, category: 'digestive', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80', popular: true, description: 'Proton pump inhibitor.' },
  { id: 13, name: 'Pudina Hara', price: 25, category: 'digestive', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=500&q=80', popular: true, description: 'Natural mint pearls.' },
  { id: 14, name: 'Gelusil MPS', price: 48, category: 'digestive', image: 'https://images.unsplash.com/photo-1584017945516-70750af13fdc?w=500&q=80', popular: false, description: 'Antacid liquid syrup.' },
  { id: 15, name: 'Omez 20mg', price: 65, category: 'digestive', image: 'https://images.unsplash.com/photo-1626963014102-99c3f73ee34a?w=500&q=80', popular: true, description: 'Omeprazole capsules.' },
  { id: 16, name: 'Cremaffin Plus', price: 210, category: 'digestive', image: 'https://images.unsplash.com/photo-1555633425-45163098e986?w=500&q=80', popular: false, description: 'Stool softener syrup.' },
  { id: 17, name: 'Isabgol Natural', price: 140, category: 'digestive', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&q=80', popular: true, description: 'Natural fiber supplement.' },
  { id: 18, name: 'Eno Sachet Lemon', price: 8, category: 'digestive', image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80', popular: true, description: 'Fruit salt antacid.' },
  { id: 21, name: 'Pan 40', price: 95, category: 'digestive', image: 'https://images.unsplash.com/photo-1471864190281-ad5f9f33d70e?w=500&q=80', popular: false, description: 'Long lasting gas relief.' },
  { id: 61, name: 'Sompraz 40mg', price: 120, category: 'digestive', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80', popular: false, description: 'Proton pump inhibitor.', dosage: '1 capsule daily before food.' },

  // COLD & FLU (22-31)
  { id: 22, name: 'Cetzine 10mg', price: 18, category: 'cold', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80', popular: true, description: 'Anti-allergy tablets.' },
  { id: 23, name: 'Alex Cough Syrup', price: 125, category: 'cold', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=500&q=80', popular: false, description: 'Dry cough relief.' },
  { id: 24, name: 'Vicks Vaporub', price: 55, category: 'cold', image: 'https://images.unsplash.com/photo-1584017945516-70750af13fdc?w=500&q=80', popular: true, description: 'Steam rub for congestion.' },
  { id: 25, name: 'Allegra 120mg', price: 195, category: 'cold', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80', popular: false, description: 'Non-drowsy allergy relief.' },
  { id: 26, name: 'Ascoril LS Syrup', price: 115, category: 'cold', image: 'https://images.unsplash.com/photo-1555633425-45163098e986?w=500&q=80', popular: false, description: 'Expels thick mucus.' },
  { id: 27, name: 'Solvin Cold', price: 42, category: 'cold', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&q=80', popular: true, description: 'Fever and cold combo.' },
  { id: 28, name: 'Honitus Syrup', price: 95, category: 'cold', image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80', popular: true, description: 'Ayurvedic cough syrup.' },
  { id: 29, name: 'Levocetirizine 5mg', price: 20, category: 'cold', image: 'https://images.unsplash.com/photo-1626963014102-99c3f73ee34a?w=500&q=80', popular: false, description: 'Anti-histamine relief.' },
  { id: 30, name: 'Sinarest', price: 55, category: 'cold', image: 'https://images.unsplash.com/photo-1471864190281-ad5f9f33d70e?w=500&q=80', popular: true, description: 'For common cold symptoms.' },
  { id: 31, name: 'Benadryl DR', price: 105, category: 'cold', image: 'https://images.unsplash.com/photo-1550572017-ed200159d231?w=500&q=80', popular: false, description: 'Cough suppressant.' },

  // SKIN CARE (32-41)
  { id: 19, name: 'Evion 400mg Vit-E', price: 75, category: 'skin', image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=500&q=80', popular: true, description: 'Skin & hair health.' },
  { id: 32, name: 'Bebanthen Cream', price: 340, category: 'skin', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80', popular: false, description: 'Skin repair ointment.' },
  { id: 33, name: 'Betnovate N', price: 45, category: 'skin', image: 'https://images.unsplash.com/photo-1584017945516-70750af13fdc?w=500&q=80', popular: true, description: 'Skin infection cream.' },
  { id: 34, name: 'Moiz Cream', price: 420, category: 'skin', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80', popular: false, description: 'Intensive moisturizer.' },
  { id: 35, name: 'Itch-Guard', price: 95, category: 'skin', image: 'https://images.unsplash.com/photo-1555633425-45163098e986?w=500&q=80', popular: true, description: 'Anti-fungal cream.' },
  { id: 36, name: 'Lulifin Cream', price: 280, category: 'skin', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&q=80', popular: false, description: 'Strong anti-fungal.' },
  { id: 37, name: 'Calamine Lotion', price: 110, category: 'skin', image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80', popular: true, description: 'Sunburn/itch relief.' },
  { id: 38, name: 'Sebamed Face Wash', price: 580, category: 'skin', image: 'https://images.unsplash.com/photo-1626963014102-99c3f73ee34a?w=500&q=80', popular: false, description: 'pH 5.5 face care.' },
  { id: 39, name: 'Volini Gel', price: 135, category: 'skin', image: 'https://images.unsplash.com/photo-1471864190281-ad5f9f33d70e?w=500&q=80', popular: true, description: 'Muscle pain relief gel.' },
  { id: 40, name: 'Soframycin Cream', price: 48, category: 'skin', image: 'https://images.unsplash.com/photo-1550572017-ed200159d231?w=500&q=80', popular: true, description: 'Minor wound treatment.' },

  // DIABETES (42-51)
  { id: 42, name: 'Glycomet 500mg', price: 45, category: 'diabetes', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80', popular: true, description: 'Metformin for sugar control.' },
  { id: 43, name: 'Jalra M 50/500', price: 340, category: 'diabetes', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=500&q=80', popular: false, description: 'Combo diabetes care.' },
  { id: 44, name: 'Glucostrip 50s', price: 850, category: 'diabetes', image: 'https://images.unsplash.com/photo-1584017945516-70750af13fdc?w=500&q=80', popular: true, description: 'Glucose test strips.' },
  { id: 45, name: 'Insulin Pen 100u', price: 1200, category: 'diabetes', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80', popular: true, description: 'Pre-filled insulin.' },
  { id: 46, name: 'Galvus 50mg', price: 480, category: 'diabetes', image: 'https://images.unsplash.com/photo-1555633425-45163098e986?w=500&q=80', popular: false, description: 'DPP-4 inhibitor.' },
  { id: 47, name: 'Glimisave M1', price: 120, category: 'diabetes', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&q=80', popular: true, description: 'Glimepiride combo.' },
  { id: 48, name: 'Zoryl M2', price: 165, category: 'diabetes', image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80', popular: false, description: 'Type 2 diabetes care.' },
  { id: 49, name: 'Voglibose 0.3', price: 85, category: 'diabetes', image: 'https://images.unsplash.com/photo-1626963014102-99c3f73ee34a?w=500&q=80', popular: false, description: 'Alpha-glucosidase inhibitor.' },
  { id: 50, name: 'Obimet 1000SR', price: 75, category: 'diabetes', image: 'https://images.unsplash.com/photo-1471864190281-ad5f9f33d70e?w=500&q=80', popular: false, description: 'Sustained release Metformin.' },
  { id: 51, name: 'Dr. Morepen Gluco', price: 650, category: 'diabetes', image: 'https://images.unsplash.com/photo-1550572017-ed200159d231?w=500&q=80', popular: true, description: 'Testing monitor kit.' },

  // VITAMINS & HEART (52-60)
  { id: 20, name: 'Revital H Daily', price: 290, category: 'vitamins', image: 'https://images.unsplash.com/photo-1616671285434-60195537599c?w=500&q=80', popular: true, description: 'Daily energy booster.' },
  { id: 52, name: 'Neurobion Forte', price: 35, category: 'vitamins', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80', popular: true, description: 'B-Complex vitamins.' },
  { id: 53, name: 'Becosules Z', price: 42, category: 'vitamins', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=500&q=80', popular: true, description: 'Zinc + B-Complex.' },
  { id: 54, name: 'Telma 40mg', price: 185, category: 'heart', image: 'https://images.unsplash.com/photo-1584017945516-70750af13fdc?w=500&q=80', popular: true, description: 'BP control medication.' },
  { id: 55, name: 'Atorva 10mg', price: 145, category: 'heart', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=80', popular: false, description: 'Cholesterol control.' },
  { id: 56, name: 'Ecosprin 75', price: 15, category: 'heart', image: 'https://images.unsplash.com/photo-1555633425-45163098e986?w=500&q=80', popular: true, description: 'Blood thinner.' },
  { id: 57, name: 'Amlokind 5', price: 28, category: 'heart', image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=500&q=80', popular: false, description: 'Amlodipine for heart.' },
  { id: 58, name: 'Fish Oil 1000mg', price: 650, category: 'heart', image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80', popular: true, description: 'Omega-3 supplement.' },
  { id: 59, name: 'Concor 5mg', price: 160, category: 'heart', image: 'https://images.unsplash.com/photo-1626963014102-99c3f73ee34a?w=500&q=80', popular: false, description: 'Beta blocker.' },
  { id: 60, name: 'Seven Seas Cod', price: 340, category: 'vitamins', image: 'https://images.unsplash.com/photo-1471864190281-ad5f9f33d70e?w=500&q=80', popular: true, description: 'Liver oil capsules.' },
];

export const DOCTORS: Doctor[] = [
  // Cardiology (1-10)
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'Cardiologist', fee: 800, rating: 4.9, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 3, name: 'Dr. Amit Bansal', specialty: 'Cardiologist', fee: 1000, rating: 4.7, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 4, name: 'Dr. Sameer Khan', specialty: 'Cardiologist', fee: 900, rating: 4.8, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 5, name: 'Dr. Lisa Ray', specialty: 'Cardiologist', fee: 1200, rating: 4.9, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 6, name: 'Dr. Vikram Seth', specialty: 'Cardiologist', fee: 750, rating: 4.6, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 7, name: 'Dr. Neha Kakkar', specialty: 'Cardiologist', fee: 850, rating: 4.8, image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500&q=80' },
  { id: 8, name: 'Dr. Rahul Bose', specialty: 'Cardiologist', fee: 950, rating: 4.7, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80' },
  { id: 9, name: 'Dr. Shweta Singh', specialty: 'Cardiologist', fee: 1100, rating: 5.0, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 10, name: 'Dr. Kabir Das', specialty: 'Cardiologist', fee: 600, rating: 4.5, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 11, name: 'Dr. Anaya Iyer', specialty: 'Cardiologist', fee: 1300, rating: 4.9, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },

  // General Physician (12-22)
  { id: 2, name: 'Dr. Rajesh Kumar', specialty: 'General Physician', fee: 500, rating: 4.8, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 12, name: 'Dr. Meera Jain', specialty: 'General Physician', fee: 400, rating: 4.6, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 13, name: 'Dr. Sunil Shetty', specialty: 'General Physician', fee: 550, rating: 4.7, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 14, name: 'Dr. Deepa Nair', specialty: 'General Physician', fee: 450, rating: 4.5, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 15, name: 'Dr. Arjun Rampal', specialty: 'General Physician', fee: 600, rating: 4.8, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 16, name: 'Dr. Pooja Hegde', specialty: 'General Physician', fee: 350, rating: 4.4, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 17, name: 'Dr. Vijay K', specialty: 'General Physician', fee: 700, rating: 4.9, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 18, name: 'Dr. Sima G', specialty: 'General Physician', fee: 500, rating: 4.7, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 19, name: 'Dr. Mohan L', specialty: 'General Physician', fee: 400, rating: 4.6, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 20, name: 'Dr. Aditi R', specialty: 'General Physician', fee: 550, rating: 4.8, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 21, name: 'Dr. Ravi S', specialty: 'General Physician', fee: 300, rating: 4.3, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },

  // Dermatology (23-32)
  { id: 23, name: 'Dr. Shruti H', specialty: 'Dermatologist', fee: 900, rating: 4.9, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 24, name: 'Dr. Karan J', specialty: 'Dermatologist', fee: 1200, rating: 4.8, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 25, name: 'Dr. Maya A', specialty: 'Dermatologist', fee: 800, rating: 4.7, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 26, name: 'Dr. Rishi C', specialty: 'Dermatologist', fee: 1000, rating: 4.9, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 27, name: 'Dr. Tania P', specialty: 'Dermatologist', fee: 750, rating: 4.6, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 28, name: 'Dr. Om S', specialty: 'Dermatologist', fee: 1100, rating: 4.8, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 29, name: 'Dr. Preeti M', specialty: 'Dermatologist', fee: 950, rating: 4.7, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 30, name: 'Dr. Yash G', specialty: 'Dermatologist', fee: 1300, rating: 5.0, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 31, name: 'Dr. Nidhi S', specialty: 'Dermatologist', fee: 850, rating: 4.5, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 32, name: 'Dr. Kunal K', specialty: 'Dermatologist', fee: 900, rating: 4.9, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },

  // Pediatrics (33-42)
  { id: 33, name: 'Dr. Baby S', specialty: 'Pediatrician', fee: 600, rating: 4.8, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 34, name: 'Dr. Child W', specialty: 'Pediatrician', fee: 500, rating: 4.7, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 35, name: 'Dr. Kids L', specialty: 'Pediatrician', fee: 700, rating: 4.9, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 36, name: 'Dr. Tiny T', specialty: 'Pediatrician', fee: 400, rating: 4.6, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 37, name: 'Dr. Little M', specialty: 'Pediatrician', fee: 550, rating: 4.8, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 38, name: 'Dr. Junior J', specialty: 'Pediatrician', fee: 650, rating: 4.7, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 39, name: 'Dr. Tot D', specialty: 'Pediatrician', fee: 800, rating: 5.0, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 40, name: 'Dr. Young Y', specialty: 'Pediatrician', fee: 450, rating: 4.5, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 41, name: 'Dr. Small S', specialty: 'Pediatrician', fee: 300, rating: 4.3, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 42, name: 'Dr. Newbie N', specialty: 'Pediatrician', fee: 750, rating: 4.9, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },

  // Neurology & Others (43-55)
  { id: 43, name: 'Dr. Brain B', specialty: 'Neurologist', fee: 1500, rating: 4.9, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 44, name: 'Dr. Nerve N', specialty: 'Neurologist', fee: 1200, rating: 4.8, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 45, name: 'Dr. Mind M', specialty: 'Psychiatrist', fee: 1100, rating: 4.7, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 46, name: 'Dr. Soul S', specialty: 'Psychiatrist', fee: 1300, rating: 4.9, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 47, name: 'Dr. Eye E', specialty: 'Ophthalmologist', fee: 800, rating: 4.8, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 48, name: 'Dr. Vision V', specialty: 'Ophthalmologist', fee: 700, rating: 4.7, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 49, name: 'Dr. Bone B', specialty: 'Orthopedist', fee: 900, rating: 4.8, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 50, name: 'Dr. Joint J', specialty: 'Orthopedist', fee: 1000, rating: 4.9, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 51, name: 'Dr. Heart H', specialty: 'Cardiologist', fee: 1400, rating: 5.0, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
  { id: 52, name: 'Dr. Lung L', specialty: 'Pulmonologist', fee: 850, rating: 4.6, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&q=80' },
  { id: 53, name: 'Dr. Skin S', specialty: 'Dermatologist', fee: 1200, rating: 4.9, image: 'https://images.unsplash.com/photo-1559839734-2b71f1e3c7e3?w=500&q=80' },
  { id: 54, name: 'Dr. Med M', specialty: 'General Physician', fee: 400, rating: 4.5, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&q=80' },
  { id: 55, name: 'Dr. Pro P', specialty: 'Surgeon', fee: 2000, rating: 5.0, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&q=80' },
];

export const SUGGESTED_HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'City General Hospital', distance: '1.2 km', address: 'Health Lane, Sector 4', type: 'Hospital' },
  { id: 'h2', name: 'Mercy Heart Institute', distance: '2.5 km', address: 'Wellness Blvd, Cross Road', type: 'Hospital' },
  { id: 'h3', name: 'St. Mary Nursing Home', distance: '0.8 km', address: 'Old Town Square', type: 'Nursing Home' },
  { id: 'h4', name: 'Apollo Speciality', distance: '3.1 km', address: 'Main Highway, South Wing', type: 'Hospital' },
  { id: 'h5', name: 'Fortis Health Center', distance: '1.9 km', address: 'Greens Park, North Road', type: 'Hospital' },
  { id: 'h6', name: 'Max Super Speciality', distance: '4.5 km', address: 'Okhla Phase III', type: 'Hospital' },
  { id: 'h7', name: 'Wellness Nursing Home', distance: '0.5 km', address: 'Market Block A', type: 'Nursing Home' },
  { id: 'h8', name: 'Lifeline Clinic', distance: '1.1 km', address: 'Station Road', type: 'Nursing Home' },
  { id: 'h9', name: 'Green Valley Hospital', distance: '5.2 km', address: 'Eco Park Area', type: 'Hospital' },
  { id: 'h10', name: 'Sunshine Medical Center', distance: '2.8 km', address: 'Sunrise Ave', type: 'Hospital' },
  { id: 'h11', name: 'Mother & Child Care', distance: '1.4 km', address: 'Family Circle', type: 'Nursing Home' },
  { id: 'h12', name: 'Elderly Care Home', distance: '0.9 km', address: 'Quiet Lane, West Side', type: 'Nursing Home' },
];
