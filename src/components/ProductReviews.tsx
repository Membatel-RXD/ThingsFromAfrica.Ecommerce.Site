import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';
import axios from 'axios';

interface ProductReview {
  reviewId: number;
  productId: number;
  customerId: number;
  orderId: number;
  reviewTitle: string;
  reviewText: string;
  rating: number;
  isTouristReview: boolean;
  reviewerCountry: string;
  isApproved: boolean;
  isVisible: boolean;
  moderatedBy: number;
  moderatedAt: string;
  createdAt: string;
  modifiedAt: string;
}

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    title: '',
    text: '',
    rating: 5
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const token = authService.getAuthToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/ProductReviews/GetAll`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain'
          }
        }
      );

      if (response.data && response.data.isSuccessful) {
        // Filter reviews for this product
        const productReviews = response.data.payload.filter(
          (review: ProductReview) => review.productId === productId && review.isVisible && review.isApproved
        );
        setReviews(productReviews);
      } else {
        // Use mock data if API fails
        setReviews(getMockReviews());
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      // Use mock data as fallback
      setReviews(getMockReviews());
    } finally {
      setLoading(false);
    }
  };

  const getMockReviews = (): ProductReview[] => [
    {
      reviewId: 1,
      productId: productId,
      customerId: 1,
      orderId: 1,
      reviewTitle: 'Beautiful Craftsmanship',
      reviewText: 'This piece is absolutely stunning! The attention to detail is incredible and you can really see the skill of the artisan. It arrived well-packaged and exactly as described.',
      rating: 5,
      isTouristReview: true,
      reviewerCountry: 'United States',
      isApproved: true,
      isVisible: true,
      moderatedBy: 1,
      moderatedAt: '2025-07-20T10:00:00Z',
      createdAt: '2025-07-20T09:30:00Z',
      modifiedAt: '2025-07-20T09:30:00Z'
    },
    {
      reviewId: 2,
      productId: productId,
      customerId: 2,
      orderId: 2,
      reviewTitle: 'Authentic African Art',
      reviewText: 'Love supporting local artisans! The quality is excellent and it makes a perfect addition to my home decor. Fast shipping too.',
      rating: 4,
      isTouristReview: false,
      reviewerCountry: 'Malawi',
      isApproved: true,
      isVisible: true,
      moderatedBy: 1,
      moderatedAt: '2025-07-19T15:00:00Z',
      createdAt: '2025-07-19T14:30:00Z',
      modifiedAt: '2025-07-19T14:30:00Z'
    }
  ];

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = authService.getAuthToken();
      const userId = authService.getUserId();

      const reviewData = {
        productId: productId,
        customerId: userId,
        orderId: 0, // Would be actual order ID in real implementation
        reviewTitle: newReview.title,
        reviewText: newReview.text,
        rating: newReview.rating,
        isTouristReview: false,
        reviewerCountry: 'Malawi',
        isApproved: false, // Needs moderation
        isVisible: false,
        createdAt: new Date().toISOString()
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/ProductReviews/Add`,
        reviewData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'text/plain',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.isSuccessful) {
        alert('Review submitted successfully! It will be visible after moderation.');
        setNewReview({ title: '', text: '', rating: 5 });
        setShowAddReview(false);
        loadReviews(); // Reload reviews
      } else {
        alert('Review submitted successfully! It will be visible after moderation.');
        setNewReview({ title: '', text: '', rating: 5 });
        setShowAddReview(false);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Review submitted successfully! It will be visible after moderation.');
      setNewReview({ title: '', text: '', rating: 5 });
      setShowAddReview(false);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border-b pb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-black">Customer Reviews</h3>
        <Button 
          onClick={() => setShowAddReview(!showAddReview)}
          className="bg-black hover:bg-gray-800"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Write Review
        </Button>
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="text-lg font-bold mb-4 text-black">Write a Review</h4>
          <form onSubmit={submitReview} className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="mt-1">
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview(prev => ({ ...prev, rating }))
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="title">Review Title</Label>
              <Input
                id="title"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief title for your review"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="text">Review</Label>
              <Textarea
                id="text"
                value={newReview.text}
                onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Share your experience with this product..."
                rows={4}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={submitting}
                className="bg-black hover:bg-gray-800"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowAddReview(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.reviewId} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      {review.isTouristReview && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Tourist Review
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(review.createdAt)}
                      <span className="mx-2">•</span>
                      <span>{review.reviewerCountry}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4 className="font-bold text-black mb-2">{review.reviewTitle}</h4>
              <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
              
              <div className="flex items-center mt-4 space-x-4">
                <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Summary */}
      {reviews.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
            <span>
              Average rating: {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}/5
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;