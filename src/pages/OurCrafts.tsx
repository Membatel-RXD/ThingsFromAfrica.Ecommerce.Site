import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { CraftType } from '@/models/members';
import { apiService, IAPIResponse } from '@/lib/api';

const fetchCraftTypes = async (): Promise<CraftType[]> => {
  try {
      const response = await apiService.get<IAPIResponse<CraftType[]>>('CraftTypes/GetAll');
      return response.payload || [];
  } catch (error) {
    throw new Error('Failed to fetch craft types');
  }
};

const OurCrafts: React.FC = () => {
  const { data: craftTypes = [], isLoading, error } = useQuery({
    queryKey: ['craftTypes'],
    queryFn: fetchCraftTypes
  });

  return (
    <AppLayout>
      <div className="bg-white min-h-screen">
        <div className="bg-black text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Our Crafts</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-lg text-black">Loading crafts...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <p className="text-lg text-red-600">API Failed - Showing mock data below</p>
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {craftTypes.filter(craft => craft.isActive).map((craft) => (
                <div key={craft.craftTypeId} className="border border-black p-4 rounded">
                  <h3 className="text-xl font-bold text-black mb-2">{craft.craftTypeName}</h3>
                  <p className="text-black">{craft.craftTypeDescription}</p>
                  <p className="text-sm text-gray-600 mt-2">ID: {craft.craftTypeId}</p>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && error && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-black mb-4">Mock Data (API Failed):</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-black p-4 rounded">
                  <h3 className="text-xl font-bold text-black mb-2">Wood Carvings</h3>
                  <p className="text-black">Traditional wood carvings from local artisans</p>
                  <p className="text-sm text-gray-600 mt-2">ID: 1</p>
                </div>
                <div className="border border-black p-4 rounded">
                  <h3 className="text-xl font-bold text-black mb-2">Pottery</h3>
                  <p className="text-black">Handmade pottery using traditional techniques</p>
                  <p className="text-sm text-gray-600 mt-2">ID: 2</p>
                </div>
                <div className="border border-black p-4 rounded">
                  <h3 className="text-xl font-bold text-black mb-2">Textiles</h3>
                  <p className="text-black">Beautiful woven textiles with traditional patterns</p>
                  <p className="text-sm text-gray-600 mt-2">ID: 3</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default OurCrafts;