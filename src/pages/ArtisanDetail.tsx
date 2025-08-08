import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  ArrowLeft, 
  Award, 
  Heart, 
  Share2,
  Clock,
  Star
} from 'lucide-react';
import { Artisan } from '@/models/members';
import { apiService, IAPIResponse } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

// Fallback translation function
const createFallbackT = () => (key: string) => {
  const translations: Record<string, string> = {
    'page.artisan.backToStories': 'Back to Stories',
    'page.artisan.masterArtisan': 'Master Artisan',
    'page.artisan.yearsExperience': 'Years of Experience',
    'page.artisan.specialization': 'Specialization',
    'page.artisan.location': 'Location',
    'page.artisan.joinedDate': 'Joined',
    'page.artisan.biography': 'Biography',
    'page.artisan.contactInfo': 'Contact Information',
    'page.artisan.phone': 'Phone',
    'page.artisan.email': 'Email',
    'page.artisan.shareStory': 'Share Story',
    'page.artisan.saveToFavorites': 'Save to Favorites',
    'page.artisan.viewProducts': 'View Products',
    'page.artisan.notFound': 'Artisan Not Found',
    'page.artisan.notFoundDescription': 'The artisan you\'re looking for doesn\'t exist or has been removed.',
    'page.artisan.loading': 'Loading artisan details...'
  };
  return translations[key] || key;
};

const ArtisanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Safe language hook usage with fallback
  let t: (key: string) => string;
  try {
    const { t: languageT } = useLanguage();
    t = languageT;
  } catch (error) {
    console.warn('LanguageProvider not found, using fallback translations');
    t = createFallbackT();
  }

  const fetchArtisan = async (artisanId: string): Promise<Artisan | null> => {
    try {
      const response = await apiService.get<IAPIResponse<Artisan>>(`Artisans/GetBySlug/${artisanId}`);
      return response.payload || null;
    } catch (error) {
      throw new Error('Failed to fetch artisan details');
    }
  };

  useEffect(() => {
    const loadArtisan = async () => {
      if (!id) {
        setError('Invalid artisan ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedArtisan = await fetchArtisan(id);
        setArtisan(fetchedArtisan);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadArtisan();
  }, [id]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && artisan) {
      try {
        await navigator.share({
          title: `${artisan.artisanName} - Master Artisan`,
          text: `Check out ${artisan.artisanName}'s inspiring story and beautiful crafts.`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying URL to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSaveToFavorites = () => {
    // Implement save to favorites functionality
    console.log('Save to favorites:', artisan?.artisanId);
  };

  const handleViewProducts = () => {
    // Navigate to products page filtered by this artisan
    navigate(`/shop?artisan=${artisan?.artisanId}`);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
                <div className="h-64 bg-gray-300 rounded mb-8"></div>
                <div className="h-12 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !artisan) {
    return (
      <AppLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <button
                onClick={() => navigate('/stories')}
                className="inline-flex items-center px-4 py-2 mb-8 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('page.artisan.backToStories')}
              </button>
              <User className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {t('page.artisan.notFound')}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {t('page.artisan.notFoundDescription')}
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <button
              onClick={() => navigate('/stories')}
              className="inline-flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('page.artisan.backToStories')}
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Image and Quick Info */}
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="aspect-[4/5] bg-gray-100">
                    <img
                      src={artisan.profileImageUrl || '/placeholder.svg'}
                      alt={artisan.artisanName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </Card>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSaveToFavorites}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {t('page.artisan.saveToFavorites')}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('page.artisan.shareStory')}
                  </button>
                </div>

                {/* Quick Stats */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-xl">{artisan.yearsOfExperience}</div>
                      <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Star className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold text-xl">Master</div>
                      <div className="text-sm text-gray-600">Level</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-8">
                {/* Header Info */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-black text-white px-3 py-1 rounded-full">
                      {artisan.specialization}
                    </Badge>
                    <Badge className="border border-gray-300 text-gray-700 px-3 py-1 rounded-full bg-white">
                      <Award className="h-3 w-3 mr-1" />
                      {t('page.artisan.masterArtisan')}
                    </Badge>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {artisan.artisanName}
                  </h1>
                  
                  <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{artisan.village}, {artisan.region}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>Joined {formatDate(artisan.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Biography */}
                <Card className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t('page.artisan.biography')}
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                      {artisan.biography}
                    </p>
                  </div>
                </Card>

                {/* Contact Information */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('page.artisan.contactInfo')}
                  </h3>
                  <div className="space-y-3">
                    {artisan.contactPhone && (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <div className="text-sm text-gray-600">{t('page.artisan.phone')}</div>
                          <a 
                            href={`tel:${artisan.contactPhone}`}
                            className="font-medium text-gray-900 hover:text-black"
                          >
                            {artisan.contactPhone}
                          </a>
                        </div>
                      </div>
                    )}
                    {artisan.contactEmail && (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-600 mr-3" />
                        <div>
                          <div className="text-sm text-gray-600">{t('page.artisan.email')}</div>
                          <a 
                            href={`mailto:${artisan.contactEmail}`}
                            className="font-medium text-gray-900 hover:text-black"
                          >
                            {artisan.contactEmail}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Call to Action */}
                <Card className="p-6 bg-gradient-to-r from-gray-900 to-black text-white">
                  <h3 className="text-xl font-semibold mb-2">Interested in {artisan.artisanName}'s work?</h3>
                  <p className="text-gray-300 mb-4">
                    Explore their beautiful handcrafted pieces and connect directly with this talented artisan.
                  </p>
                  <button
                    onClick={handleViewProducts}
                    className="w-full bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    {t('page.artisan.viewProducts')}
                  </button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ArtisanDetail;