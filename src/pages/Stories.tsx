import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Phone, Mail } from 'lucide-react';
import { Artisan } from '@/models/members';
import { apiService, IAPIResponse } from '@/lib/api';

const Stories: React.FC = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtisans = async (): Promise<Artisan[]> => {
    try {
      const response = await apiService.get<IAPIResponse<Artisan[]>>('Artisans/GetAll');
      return response.payload || [];
    } catch (error) {
      throw new Error('Failed to fetch artisans');
    }
  };

  useEffect(() => {
    const loadArtisans = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedArtisans = await fetchArtisans();
        const activeArtisans = fetchedArtisans.filter(artisan => artisan.isActive);
        setArtisans(activeArtisans);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadArtisans();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateExcerpt = (biography: string, maxLength: number = 100): string => {
    if (biography.length <= maxLength) return biography;
    return biography.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="bg-gray-50 min-h-screen">
          <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Artisan Stories</h1>
              <p className="text-xl max-w-3xl mx-auto text-gray-300">Discover the people, traditions, and heritage behind every handcrafted piece</p>
            </div>
          </section>
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="bg-gray-50 min-h-screen">
          <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Artisan Stories</h1>
              <p className="text-xl max-w-3xl mx-auto text-gray-300">Discover the people, traditions, and heritage behind every handcrafted piece</p>
            </div>
          </section>
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-lg text-gray-600">Unable to load stories at the moment</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-gray-50 min-h-screen">
        <section className="bg-gradient-to-r from-gray-900 to-black text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-30"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Artisan Stories
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Meet the talented craftspeople preserving African traditions through their art
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                  Master Craftspeople
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                  Cultural Heritage
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Authentic Stories
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            {artisans.length === 0 ? (
              <div className="text-center py-16">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Stories Available</h3>
                <p className="text-lg text-gray-600">Check back later for inspiring artisan stories.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artisans.map((artisan) => (
                  <Card key={artisan.artisanId} className="group h-full bg-white border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden">
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img 
                        src={artisan.profileImageUrl || '/placeholder.svg'} 
                        alt={artisan.artisanName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        <Badge className="bg-black/80 text-white border-none backdrop-blur-sm">
                          {artisan.specialization}
                        </Badge>
                        <Badge variant="outline" className="bg-white/90 text-gray-900 border-white/50 backdrop-blur-sm text-xs">
                          {artisan.yearsOfExperience} years
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
                          {artisan.artisanName}
                        </h3>
                        
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{artisan.village}, {artisan.region}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>Master Artisan</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(artisan.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {generateExcerpt(artisan.biography, 120)}
                      </p>
                      
                      <div className="space-y-2 pt-4 border-t border-gray-100">
                        {artisan.contactPhone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{artisan.contactPhone}</span>
                          </div>
                        )}
                        {artisan.contactEmail && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{artisan.contactEmail}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black transition-colors duration-300 text-sm font-medium">
                          Read Full Story
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-gradient-to-r from-gray-100 to-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Share Your Story</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Are you a skilled artisan with a story to tell? We'd love to feature your craft and share your journey with our community of art enthusiasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Share Your Story
                </a>
                <a 
                  href="/shop" 
                  className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-900 hover:text-white transition-colors font-medium"
                >
                  Browse Crafts
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Stories;