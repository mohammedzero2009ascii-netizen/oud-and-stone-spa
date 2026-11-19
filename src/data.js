// Prices in AED, durations in minutes. Photos: Unsplash (Unsplash License).
export const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'massage', name: 'Massage' },
  { id: 'facial', name: 'Facials' },
  { id: 'hammam', name: 'Hammam & Body' },
  { id: 'hands', name: 'Hands & Feet' },
];

export const SERVICES = [
  { id: 'oud-massage', cat: 'massage', name: 'Signature Oud Massage', mins: 90, price: 750, img: 'oud-massage', tag: 'Signature',
    desc: 'Long, flowing strokes with our warm oud and amber oil blend. Slow, deep and quiet from start to finish.' },
  { id: 'hot-stone', cat: 'massage', name: 'Hot Stone Ritual', mins: 75, price: 650, img: 'hot-stone',
    desc: 'Smooth basalt stones, heated and placed along the spine to loosen tight shoulders and lower back.' },
  { id: 'deep-tissue', cat: 'massage', name: 'Deep Tissue Massage', mins: 60, price: 520, img: 'deep-tissue',
    desc: 'Firm, focused pressure for training recovery and long days at the desk. Tell us where it hurts.' },
  { id: 'herbal', cat: 'massage', name: 'Desert Herbal Compress', mins: 90, price: 690, img: 'herbal',
    desc: 'Warm linen poultices of chamomile, ginger and lemongrass pressed along the body, then a full massage.' },

  { id: 'hydra-facial', cat: 'facial', name: 'Deep Hydration Facial', mins: 60, price: 580, img: 'hydra-facial',
    desc: 'Double cleanse, gentle exfoliation and a hydrating mask for skin that feels the Dubai sun and air-con.' },
  { id: 'clay-facial', cat: 'facial', name: 'Rose Clay Facial', mins: 75, price: 640, img: 'clay-facial',
    desc: 'Purifying rose clay with a face, neck and scalp massage. A calm reset for congested skin.' },
  { id: 'glow-facial', cat: 'facial', name: 'Sculpting Facial Massage', mins: 45, price: 420, img: 'glow-facial',
    desc: 'Hands-only lifting and drainage techniques around the jaw, cheeks and brow. No products to sit in.' },

  { id: 'hammam', cat: 'hammam', name: 'Traditional Hammam', mins: 60, price: 480, img: 'hammam', tag: 'Most booked',
    desc: 'Steam, black olive soap and a full kessa scrub on the warm marble, finished with a rhassoul wrap.' },
  { id: 'royal-hammam', cat: 'hammam', name: 'Royal Hammam Journey', mins: 120, price: 980, img: 'sauna',
    desc: 'The full hammam, followed by a 60-minute oud massage and mint tea in the quiet lounge.' },
  { id: 'body-polish', cat: 'hammam', name: 'Salt & Oil Body Polish', mins: 45, price: 390, img: 'body-polish',
    desc: 'Sea salt and cold-pressed oils buffed over the body, rinsed, then sealed with a light body butter.' },

  { id: 'manicure', cat: 'hands', name: 'Classic Manicure', mins: 45, price: 180, img: 'manicure',
    desc: 'Shape, cuticle care, hand massage and polish in a neutral or classic shade of your choice.' },
  { id: 'pedicure', cat: 'hands', name: 'Spa Pedicure', mins: 60, price: 240, img: 'pedicure',
    desc: 'Warm soak, scrub, callus care and a 15-minute foot and calf massage, then polish.' },
];

export const TEAM = [
  { name: 'Layla Haddad', role: 'Spa Director', img: 'team-layla',
    bio: 'Fifteen years in hotel spas across Beirut and Dubai. Layla designed every ritual on our menu.' },
  { name: 'Mira Santos', role: 'Skin Therapist', img: 'team-mira',
    bio: 'Facials and skin consultations. Mira keeps every treatment simple and suited to your skin.' },
  { name: 'Daniel Reyes', role: 'Massage Therapist', img: 'team-daniel',
    bio: 'Deep tissue and sports recovery. Daniel is the therapist our regulars ask for by name.' },
  { name: 'Amal Rahman', role: 'Hammam Lead', img: 'team-amal',
    bio: 'Trained in traditional hammam care. Amal leads our steam rooms and the Royal Journey.' },
];

export const OPEN_HOUR = 10; // 10:00
export const CLOSE_HOUR = 22; // last treatment must end by 22:00
