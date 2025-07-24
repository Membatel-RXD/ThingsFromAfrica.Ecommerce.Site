import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Package, ArrowLeft } from 'lucide-react';
import { authService } from '@/services/authService';
import axios from 'axios';

interface Product {
  productId: number;
  productName: string;
  productDescription: string;
  mainImageUrl: string;
  localPrice: number;
  touristPrice: number;
}

const ReviewProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    text: '',
    country: 'Malawi'
  });

  useEffect(() => {
    if (!authService.checkSession()) {
      navigate('/login');
      return;
    }
    
    if (productId) {
      loadProduct();
    }
  }, [productId, navigate]);

  const loadProduct = async () => {
    try {
      const token = authService.getAuthToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Products/GetAll`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        }
      );

      if (response.data && response.data.isSuccessful) {
        const foundProduct = response.data.payload.find(
          (p: Product) => p.productId === parseInt(productId!)
        );
        setProduct(foundProduct || getMockProduct());
      } else {
        setProduct(getMockProduct());
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      setProduct(getMockProduct());
    } finally {
      setLoading(false);
    }
  };

  const getMockProduct = (): Product => ({
    productId: parseInt(productId!) || 1,
    productName: 'Handcrafted Wooden Bowl',
    productDescription: 'Beautiful handcrafted wooden bowl made from local sustainable wood',
    mainImageUrl: '/placeholder.svg',
    localPrice: 25,
    touristPrice: 35
  });

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = authService.getAuthToken();
      const userId = authService.getUserId();

      const reviewPayload = {
        productId: parseInt(productId!),
        customerId: userId,
        orderId: 0, // Would be actual order ID
        reviewTitle: reviewData.title,
        reviewText: reviewData.text,
        rating: reviewData.rating,
        isTouristReview: reviewData.country !== 'Malawi',
        reviewerCountry: reviewData.country,
        isApproved: false,
        isVisible: false,
        createdAt: new Date().toISOString()
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/ProductReviews/Add`,
        reviewPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain',
            'Content-Type': 'application/json'
          }
        }
      );

      alert('Thank you for your review! It will be published after moderation.');
      navigate('/profile/user/my-orders');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Thank you for your review! It will be published after moderation.');
      navigate('/profile/user/my-orders');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-8 w-8 cursor-pointer transition-colors ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-200'
            }`}
            onClick={() => onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="bg-white rounded-lg p-6">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
        <FloatingButtons />
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're trying to review could not be found.</p>
          <Button onClick={() => navigate('/profile/user/my-orders')}>
            Back to Orders
          </Button>
        </div>
        <FloatingButtons />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/profile/user/my-orders')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-bold text-black">Write a Review</h1>
          <p className="text-gray-600">Share your experience with this product</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Info */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-start space-x-4">
              <img 
                src={product.mainImageUrl} 
                alt={product.productName}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-xl font-bold text-black mb-2">{product.productName}</h2>
                <p className="text-gray-600 text-sm mb-2">{product.productDescription}</p>
                <p className="text-lg font-bold text-black">${product.touristPrice}</p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <form onSubmit={submitReview} className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Overall Rating</Label>
                {renderStars(reviewData.rating, (rating) => 
                  setReviewData(prev => ({ ...prev, rating }))
                )}
                <p className="text-sm text-gray-500 mt-2">
                  {reviewData.rating === 1 && "Poor"}
                  {reviewData.rating === 2 && "Fair"}
                  {reviewData.rating === 3 && "Good"}
                  {reviewData.rating === 4 && "Very Good"}
                  {reviewData.rating === 5 && "Excellent"}
                </p>
              </div>

              <div>
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  value={reviewData.title}
                  onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summarize your experience"
                  required
                />
              </div>

              <div>
                <Label htmlFor="text">Your Review</Label>
                <Textarea
                  id="text"
                  value={reviewData.text}
                  onChange={(e) => setReviewData(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Tell others about your experience with this product..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="country">Your Country</Label>
                <Input
                  id="country"
                  value={reviewData.country}
                  onChange={(e) => setReviewData(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="e.g., Malawi, United States, etc."
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-black hover:bg-gray-800 flex-1"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/profile/user/my-orders')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-800 mb-2">Review Guidelines</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Be honest and helpful in your review</li>
            <li>• Focus on the product quality and your experience</li>
            <li>• Reviews will be moderated before being published</li>
            <li>• Inappropriate content will not be approved</li>
          </ul>
        </div>
      </main>
      
      <FloatingButtons />
      <Footer />
    </div>
  );
};

export default ReviewProduct;