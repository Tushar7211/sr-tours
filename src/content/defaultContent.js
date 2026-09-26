// Everything shown on the landing page lives here, and everything in here can be
// edited from /admin. This is also the fallback if nothing has been published yet.

export const DEFAULT_CONTENT = {
  brand: {
    mark: 'SR',
    name: 'SR Tour & Travel',
    tagline: 'Odisha To All India',
    slogan: 'Explore • Discover • Create Memories',
    motto: 'Travel More, Worry Less',
  },

  hero: {
    title: 'Cars and tour packages from Odisha to all India',
    subtitle:
      'Comfortable cars, experienced drivers and tour plans for temples, beaches, hills and the Himalayas, with clear pricing and support any time of day.',
    cta: 'Plan my trip',
    caption: "From Odisha's soul to India's beauty",
  },

  contact: {
    phone: '6371768659',
    whatsapp: '', // leave empty to use the phone number
    email: '',
    address: 'Odisha, India',
    hours: 'Available 24/7',
    instagram: '',
    facebook: '',
    youtube: '',
  },

  announcement: { enabled: false, text: '' },

  sections: {
    vehicles: true,
    packages: true,
    features: true,
    services: true,
    reviews: true,
    showcase: true,
    enquiry: true,
  },

  titles: {
    packages: {
      title: 'Popular destinations',
      sub: 'Temples, beaches and hills in Odisha, plus tour packages across India.',
    },
    features: { title: 'Why choose {brand}?', sub: '' },
    services: { title: 'Book now', sub: 'Flights, hotels, cars and tours. One call sorts it all.' },
    reviews: { title: 'What our travellers say', sub: '' },
    enquiry: {
      title: 'Your next destination is just a call away!',
      sub: "Tell us where you want to go and we'll get back to you with the best price.",
    },
    showcase: {
    title: 'Our Satisfied {brand} Customers',
    sub: 'A few happy moments with travellers we have had the pleasure of serving.',
  },
  },

  vehicles: [
    { id: 'v1', name: 'Swift Dzire', tagline: 'Comfort for every journey', seats: '4 Seater', ac: true, price: '', color: '#ffffff', image: '', visible: true },
    { id: 'v2', name: 'Innova Crysta', tagline: 'Premium travel experience', seats: '7 Seater', ac: true, price: '', color: '#22252e', image: '', visible: true },
    { id: 'v3', name: 'Ertiga', tagline: 'Spacious. Safe. Comfortable.', seats: '7 Seater', ac: true, price: '', color: '#f4f4f4', image: '', visible: true },
    { id: 'v4', name: 'XL6', tagline: 'More space. More adventures.', seats: '6 Seater', ac: true, price: '', color: '#2358d6', image: '', visible: true },
  ],

  packages: [
    { id: 'p1', name: 'Puri', subtitle: 'Jagannath Temple', region: 'odisha', tags: 'Temples, Beaches', emoji: '🛕', image: '', duration: '', price: '', visible: true,
      description: 'Visit the 12th-century Jagannath Temple and walk the golden beach.' },
    { id: 'p2', name: 'Konark', subtitle: 'Sun Temple', region: 'odisha', tags: 'Temples, Culture', emoji: '☀️', image: '', duration: '', price: '', visible: true,
      description: 'The UNESCO World Heritage Sun Temple, built as a giant stone chariot.' },
    { id: 'p3', name: 'Bhubaneswar', subtitle: 'Temples & Heritage', region: 'odisha', tags: 'Temples, Culture', emoji: '🏛️', image: '', duration: '', price: '', visible: true,
      description: 'The temple city: Lingaraj, Mukteshwar and the Udayagiri caves nearby.' },
    { id: 'p4', name: 'Chilika', subtitle: 'Lake & Island', region: 'odisha', tags: 'Nature', emoji: '🦩', image: '', duration: '', price: '', visible: true,
      description: "India's largest coastal lagoon, home to dolphins and migratory birds." },
    { id: 'p5', name: 'Daringbadi', subtitle: '"Kashmir of Odisha"', region: 'odisha', tags: 'Nature', emoji: '⛰️', image: '', duration: '', price: '', visible: true,
      description: 'Misty hills, waterfalls and coffee plantations in Kandhamal.' },
    { id: 'p6', name: 'Gopalpur', subtitle: 'Beach', region: 'odisha', tags: 'Beaches', emoji: '🏖️', image: '', duration: '', price: '', visible: true,
      description: 'A calm, uncrowded beach town on the Bay of Bengal.' },

    { id: 'p7', name: 'Goa', subtitle: 'Beach Paradise', region: 'india', tags: 'Beaches', emoji: '🌴', image: '', duration: '', price: '', visible: true,
      description: 'Sun, sand, seafood and nightlife on the western coast.' },
    { id: 'p8', name: 'Shimla', subtitle: 'Hill Station', region: 'india', tags: 'Hill Stations, Himalayas', emoji: '🏔️', image: '', duration: '', price: '', visible: true,
      description: 'Colonial charm, pine forests and Mall Road in Himachal Pradesh.' },
    { id: 'p9', name: 'Manali', subtitle: 'Adventure & Nature', region: 'india', tags: 'Himalayas, Hill Stations', emoji: '❄️', image: '', duration: '', price: '', visible: true,
      description: 'Snow peaks, Solang Valley and adventure sports in the Himalayas.' },
    { id: 'p10', name: 'Kerala', subtitle: "God's Own Country", region: 'india', tags: 'Beaches, Wildlife', emoji: '🛶', image: '', duration: '', price: '', visible: true,
      description: 'Backwaters, houseboats, tea hills and rainforest wildlife.' },
    { id: 'p11', name: 'Rajasthan', subtitle: 'History & Culture', region: 'india', tags: 'Heritage, Wildlife', emoji: '🏰', image: '', duration: '', price: '', visible: true,
      description: 'Forts, palaces and desert safaris across Jaipur, Udaipur and Jaisalmer.' },
    { id: 'p12', name: 'Darjeeling', subtitle: 'Tea Garden & Mountains', region: 'india', tags: 'Hill Stations, Himalayas', emoji: '🚂', image: '', duration: '', price: '', visible: true,
      description: 'Tea estates, the toy train and Kanchenjunga views in West Bengal.' },
  ],

  features: [
    { id: 'f1', icon: '🚗', title: 'Well maintained vehicles', desc: 'AC and non-AC cars to suit your budget.' },
    { id: 'f2', icon: '🧑‍✈️', title: 'Experienced & professional drivers', desc: 'Polite drivers who know the routes.' },
    { id: 'f3', icon: '₹', title: 'Affordable & transparent pricing', desc: 'Clear quotes, agreed before you travel.' },
    { id: 'f4', icon: '📞', title: '24/7 customer support', desc: 'Reach us any time, before and during your trip.' },
    { id: 'f5', icon: '🧭', title: 'Customized tour packages', desc: 'Plans built around your time, budget and interests.' },
    { id: 'f6', icon: '👨‍👩‍👧‍👦', title: 'Group, family & corporate bookings', desc: 'Vehicles and packages for every group size.' },
    { id: 'f7', icon: '🛡️', title: 'Safe & comfortable journey', desc: 'Your safety and comfort come first on every trip.' },
  ],

  services: [
    { id: 's1', icon: '✈️', title: 'Flight booking', desc: 'Domestic and international tickets.' },
    { id: 's2', icon: '🏨', title: 'Hotel booking', desc: 'Stays to match your budget.' },
    { id: 's3', icon: '🚗', title: 'Car rental', desc: 'Cars with drivers for any distance.' },
    { id: 's4', icon: '🗺️', title: 'Tour packages', desc: 'Ready-made and customised trips.' },
    { id: 's5', icon: '🛂', title: 'Visa assistance', desc: 'Guidance with your visa paperwork.' },
  ],

  offer: {
    enabled: true,
    title: 'Special group & family discounts',
    text: 'Travelling with family, friends or colleagues? Call us for a special group price.',
    cta: 'Ask for a group quote',
  },

  // Add real reviews from the admin page. The section stays hidden while this is empty.
  testimonials: [],
  showcase: [],
};
