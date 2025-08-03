import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'it' | 'sw';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.crafts': 'Our Crafts',
    'nav.stories': 'Stories',
    'nav.gifts': 'Gift Ideas',
    'nav.sustainability': 'Sustainability',
    'nav.csr': 'CSR',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.signin': 'Sign in / Register',
    'nav.account': 'Account',
    'nav.welcome': 'Welcome',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.tryAgain': 'Try Again',
    'common.readMore': 'Read More',
    'common.learnMore': 'Learn More',
    'common.viewAll': 'View All',
    'common.shopNow': 'Shop Now',
    'common.addToCart': 'Add to Cart',
    'common.buyNow': 'Buy Now',
    'common.contactUs': 'Contact Us',
    
    // Pages
    'page.stories.title': 'Artisan Stories',
    'page.stories.subtitle': 'Meet the talented craftspeople preserving African traditions through their art',
    'page.stories.noStories': 'No Stories Available',
    'page.stories.checkBack': 'Check back later for inspiring artisan stories.',
    'page.stories.shareStory': 'Share Your Story',
    'page.stories.shareDescription': 'Are you a skilled artisan with a story to tell? We\'d love to feature your craft and share your journey with our community of art enthusiasts.',
    'page.stories.browseCrafts': 'Browse Crafts',
    'page.stories.readFullStory': 'Read Full Story',
    
    'page.contact.title': 'Contact Us',
    'page.contact.subtitle': 'Get in touch with us for questions about our crafts, custom orders, or artisan collaborations',
    'page.contact.sendMessage': 'Send us a Message',
    'page.contact.getInTouch': 'Get in Touch',
    'page.contact.fullName': 'Full Name',
    'page.contact.emailAddress': 'Email Address',
    'page.contact.subject': 'Subject',
    'page.contact.message': 'Message',
    'page.contact.sendButton': 'Send Message',
    'page.contact.location': 'Our Location',
    'page.contact.phone': 'Phone Number',
    'page.contact.email': 'Email Address',
    'page.contact.hours': 'Business Hours',
    'page.contact.visitWorkshop': 'Visit Our Workshop',
    'page.contact.scheduleVisit': 'Schedule a Visit',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.shop': 'Tienda',
    'nav.crafts': 'Nuestras Artesanías',
    'nav.stories': 'Historias',
    'nav.gifts': 'Ideas de Regalos',
    'nav.sustainability': 'Sostenibilidad',
    'nav.csr': 'RSC',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.cart': 'Carrito',
    'nav.signin': 'Iniciar sesión / Registrarse',
    'nav.account': 'Cuenta',
    'nav.welcome': 'Bienvenido',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.tryAgain': 'Intentar de nuevo',
    'common.readMore': 'Leer más',
    'common.learnMore': 'Aprender más',
    'common.viewAll': 'Ver todo',
    'common.shopNow': 'Comprar ahora',
    'common.addToCart': 'Añadir al carrito',
    'common.buyNow': 'Comprar ahora',
    'common.contactUs': 'Contáctanos',
    
    // Pages
    'page.stories.title': 'Historias de Artesanos',
    'page.stories.subtitle': 'Conoce a los talentosos artesanos que preservan las tradiciones africanas a través de su arte',
    'page.stories.noStories': 'No hay historias disponibles',
    'page.stories.checkBack': 'Vuelve más tarde para historias inspiradoras de artesanos.',
    'page.stories.shareStory': 'Comparte tu historia',
    'page.stories.shareDescription': '¿Eres un artesano hábil con una historia que contar? Nos encantaría presentar tu arte y compartir tu viaje con nuestra comunidad de entusiastas del arte.',
    'page.stories.browseCrafts': 'Explorar artesanías',
    'page.stories.readFullStory': 'Leer historia completa',
    
    'page.contact.title': 'Contáctanos',
    'page.contact.subtitle': 'Ponte en contacto con nosotros para preguntas sobre nuestras artesanías, pedidos personalizados o colaboraciones con artesanos',
    'page.contact.sendMessage': 'Envíanos un mensaje',
    'page.contact.getInTouch': 'Ponte en contacto',
    'page.contact.fullName': 'Nombre completo',
    'page.contact.emailAddress': 'Dirección de correo',
    'page.contact.subject': 'Asunto',
    'page.contact.message': 'Mensaje',
    'page.contact.sendButton': 'Enviar mensaje',
    'page.contact.location': 'Nuestra ubicación',
    'page.contact.phone': 'Número de teléfono',
    'page.contact.email': 'Dirección de correo',
    'page.contact.hours': 'Horario comercial',
    'page.contact.visitWorkshop': 'Visita nuestro taller',
    'page.contact.scheduleVisit': 'Programar una visita',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.shop': 'Boutique',
    'nav.crafts': 'Nos Artisanats',
    'nav.stories': 'Histoires',
    'nav.gifts': 'Idées Cadeaux',
    'nav.sustainability': 'Durabilité',
    'nav.csr': 'RSE',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.cart': 'Panier',
    'nav.signin': 'Se connecter / S\'inscrire',
    'nav.account': 'Compte',
    'nav.welcome': 'Bienvenue',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.tryAgain': 'Réessayer',
    'common.readMore': 'Lire plus',
    'common.learnMore': 'En savoir plus',
    'common.viewAll': 'Voir tout',
    'common.shopNow': 'Acheter maintenant',
    'common.addToCart': 'Ajouter au panier',
    'common.buyNow': 'Acheter maintenant',
    'common.contactUs': 'Nous contacter',
    
    // Pages
    'page.stories.title': 'Histoires d\'Artisans',
    'page.stories.subtitle': 'Rencontrez les artisans talentueux qui préservent les traditions africaines à travers leur art',
    'page.stories.noStories': 'Aucune histoire disponible',
    'page.stories.checkBack': 'Revenez plus tard pour des histoires inspirantes d\'artisans.',
    'page.stories.shareStory': 'Partagez votre histoire',
    'page.stories.shareDescription': 'Êtes-vous un artisan qualifié avec une histoire à raconter? Nous aimerions présenter votre art et partager votre parcours avec notre communauté d\'amateurs d\'art.',
    'page.stories.browseCrafts': 'Parcourir les artisanats',
    'page.stories.readFullStory': 'Lire l\'histoire complète',
    
    'page.contact.title': 'Nous contacter',
    'page.contact.subtitle': 'Contactez-nous pour des questions sur nos artisanats, commandes personnalisées ou collaborations avec des artisans',
    'page.contact.sendMessage': 'Envoyez-nous un message',
    'page.contact.getInTouch': 'Entrer en contact',
    'page.contact.fullName': 'Nom complet',
    'page.contact.emailAddress': 'Adresse e-mail',
    'page.contact.subject': 'Sujet',
    'page.contact.message': 'Message',
    'page.contact.sendButton': 'Envoyer le message',
    'page.contact.location': 'Notre emplacement',
    'page.contact.phone': 'Numéro de téléphone',
    'page.contact.email': 'Adresse e-mail',
    'page.contact.hours': 'Heures d\'ouverture',
    'page.contact.visitWorkshop': 'Visitez notre atelier',
    'page.contact.scheduleVisit': 'Planifier une visite',
  },
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Negozio',
    'nav.crafts': 'I Nostri Artigianati',
    'nav.stories': 'Storie',
    'nav.gifts': 'Idee Regalo',
    'nav.sustainability': 'Sostenibilità',
    'nav.csr': 'CSR',
    'nav.about': 'Chi siamo',
    'nav.contact': 'Contatto',
    'nav.cart': 'Carrello',
    'nav.signin': 'Accedi / Registrati',
    'nav.account': 'Account',
    'nav.welcome': 'Benvenuto',
    
    // Common
    'common.loading': 'Caricamento...',
    'common.error': 'Errore',
    'common.tryAgain': 'Riprova',
    'common.readMore': 'Leggi di più',
    'common.learnMore': 'Scopri di più',
    'common.viewAll': 'Vedi tutto',
    'common.shopNow': 'Acquista ora',
    'common.addToCart': 'Aggiungi al carrello',
    'common.buyNow': 'Compra ora',
    'common.contactUs': 'Contattaci',
    
    // Pages
    'page.stories.title': 'Storie di Artigiani',
    'page.stories.subtitle': 'Incontra gli artigiani talentuosi che preservano le tradizioni africane attraverso la loro arte',
    'page.stories.noStories': 'Nessuna storia disponibile',
    'page.stories.checkBack': 'Torna più tardi per storie ispiratrici di artigiani.',
    'page.stories.shareStory': 'Condividi la tua storia',
    'page.stories.shareDescription': 'Sei un artigiano qualificato con una storia da raccontare? Ci piacerebbe presentare il tuo mestiere e condividere il tuo viaggio con la nostra comunità di appassionati d\'arte.',
    'page.stories.browseCrafts': 'Sfoglia artigianati',
    'page.stories.readFullStory': 'Leggi la storia completa',
    
    'page.contact.title': 'Contattaci',
    'page.contact.subtitle': 'Mettiti in contatto con noi per domande sui nostri artigianati, ordini personalizzati o collaborazioni con artigiani',
    'page.contact.sendMessage': 'Inviaci un messaggio',
    'page.contact.getInTouch': 'Mettiti in contatto',
    'page.contact.fullName': 'Nome completo',
    'page.contact.emailAddress': 'Indirizzo email',
    'page.contact.subject': 'Oggetto',
    'page.contact.message': 'Messaggio',
    'page.contact.sendButton': 'Invia messaggio',
    'page.contact.location': 'La nostra posizione',
    'page.contact.phone': 'Numero di telefono',
    'page.contact.email': 'Indirizzo email',
    'page.contact.hours': 'Orari di lavoro',
    'page.contact.visitWorkshop': 'Visita il nostro laboratorio',
    'page.contact.scheduleVisit': 'Programma una visita',
  },
  sw: {
    // Navigation
    'nav.home': 'Nyumbani',
    'nav.shop': 'Duka',
    'nav.crafts': 'Sanaa Zetu',
    'nav.stories': 'Hadithi',
    'nav.gifts': 'Mawazo ya Zawadi',
    'nav.sustainability': 'Uendelevu',
    'nav.csr': 'CSR',
    'nav.about': 'Kuhusu',
    'nav.contact': 'Mawasiliano',
    'nav.cart': 'Kikapu',
    'nav.signin': 'Ingia / Jisajili',
    'nav.account': 'Akaunti',
    'nav.welcome': 'Karibu',
    
    // Common
    'common.loading': 'Inapakia...',
    'common.error': 'Hitilafu',
    'common.tryAgain': 'Jaribu tena',
    'common.readMore': 'Soma zaidi',
    'common.learnMore': 'Jifunze zaidi',
    'common.viewAll': 'Ona yote',
    'common.shopNow': 'Nunua sasa',
    'common.addToCart': 'Ongeza kwenye kikapu',
    'common.buyNow': 'Nunua sasa',
    'common.contactUs': 'Wasiliana nasi',
    
    // Pages
    'page.stories.title': 'Hadithi za Mafundi',
    'page.stories.subtitle': 'Kutana na mafundi wenye talanta wanaohifadhi mila za Kiafrika kupitia sanaa zao',
    'page.stories.noStories': 'Hakuna hadithi zinazopatikana',
    'page.stories.checkBack': 'Rudi baadaye kwa hadithi za kuvutia za mafundi.',
    'page.stories.shareStory': 'Shiriki hadithi yako',
    'page.stories.shareDescription': 'Je, wewe ni fundi mwenye ujuzi na hadithi ya kusimulia? Tungependa kuonyesha sanaa yako na kushiriki safari yako na jumuiya yetu ya wapenda sanaa.',
    'page.stories.browseCrafts': 'Vinjari sanaa',
    'page.stories.readFullStory': 'Soma hadithi kamili',
    
    'page.contact.title': 'Wasiliana nasi',
    'page.contact.subtitle': 'Wasiliana nasi kwa maswali kuhusu sanaa zetu, maagizo maalum au ushirikiano wa mafundi',
    'page.contact.sendMessage': 'Tutumie ujumbe',
    'page.contact.getInTouch': 'Wasiliana',
    'page.contact.fullName': 'Jina kamili',
    'page.contact.emailAddress': 'Anwani ya barua pepe',
    'page.contact.subject': 'Mada',
    'page.contact.message': 'Ujumbe',
    'page.contact.sendButton': 'Tuma ujumbe',
    'page.contact.location': 'Mahali tulipo',
    'page.contact.phone': 'Nambari ya simu',
    'page.contact.email': 'Anwani ya barua pepe',
    'page.contact.hours': 'Masaa ya biashara',
    'page.contact.visitWorkshop': 'Tembelea warsha yetu',
    'page.contact.scheduleVisit': 'Panga ziara',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
    if (savedLanguage && ['en', 'es', 'fr', 'it', 'sw'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  const t = (key: string): string => {
    return translations[currentLanguage][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};