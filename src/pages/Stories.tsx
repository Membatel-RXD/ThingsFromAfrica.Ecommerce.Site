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

  // API fetch function
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
        // Filter only active artisans
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

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to generate excerpt from biography
  const generateExcerpt = (biography: string, maxLength: number = 100): string => {
    if (biography.length <= maxLength) return biography;
    return biography.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="bg-linen min-h-screen">
          <section className="bg-gradient-to-r from-burnt-sienna to-indigo-accent text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Stories</h1>
              <p className="text-xl max-w-3xl mx-auto">Discover the people, traditions, and heritage behind every talented artisan</p>
            </div>
          </section>
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-lg text-charcoal">Loading artisan stories...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="bg-linen min-h-screen">
          <section className="bg-gradient-to-r from-burnt-sienna to-indigo-accent text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Stories</h1>
              <p className="text-xl max-w-3xl mx-auto">Discover the people, traditions, and heritage behind every handcrafted piece</p>
            </div>
          </section>
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <p className="text-lg text-red-600">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-burnt-sienna text-white px-6 py-2 rounded-lg hover:bg-burnt-sienna/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="bg-linen min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-burnt-sienna to-indigo-accent text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Stories</h1>
            <p className="text-xl max-w-3xl mx-auto">Discover the people, traditions, and heritage behind every handcrafted piece</p>
          </div>
        </section>

        {/* Artisan Stories Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {artisans.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-charcoal/80">No artisan stories available at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artisans.map((artisan) => (
                  <Card key={artisan.artisanId} className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-video bg-olive-green/10 rounded-t-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={artisan.profileImageUrl || '/placeholder.svg'} 
                        alt={artisan.artisanName}
                        className="w-full h-full object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-burnt-sienna/10 text-burnt-sienna">
                          {artisan.specialization}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {artisan.yearsOfExperience} years
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-charcoal line-clamp-2">
                        {artisan.artisanName}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-charcoal/60">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Artisan</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(artisan.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-olive-green">
                        <MapPin className="h-3 w-3" />
                        <span>{artisan.village}, {artisan.region}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-charcoal/80 mb-4">
                        {generateExcerpt(artisan.biography, 120)}
                      </p>
                      <div className="space-y-2">
                        {artisan.contactPhone && (
                          <div className="flex items-center space-x-2 text-sm text-charcoal/70">
                            <Phone className="h-3 w-3" />
                            <span>{artisan.contactPhone}</span>
                          </div>
                        )}
                        {artisan.contactEmail && (
                          <div className="flex items-center space-x-2 text-sm text-charcoal/70">
                            <Mail className="h-3 w-3" />
                            <span>{artisan.contactEmail}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-6">Share Your Story</h2>
            <p className="text-lg text-charcoal/80 max-w-2xl mx-auto mb-8">
              Are you a skilled artisan? We'd love to hear from you and share your craft with our community.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-burnt-sienna text-white px-8 py-3 rounded-lg hover:bg-burnt-sienna/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Stories;