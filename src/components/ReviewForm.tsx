import React, { useState } from 'react';
import { Review, UserRole } from '../types';
import Button from './Button';
import { StarIcon } from './icons/Icons';

interface ReviewFormProps {
  contractId: number;
  onReviewSubmitted: (review: Review) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ contractId, onReviewSubmitted }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) {
      alert('Please provide a rating and a comment.');
      return;
    }

    const newReview: Review = {
      id: Date.now(),
      contractId,
      reviewer: {
        id: 0,
        name: 'Current User',
        email: '',
        phoneNumber: '',
        role: UserRole.CLIENT,
        createdAt: new Date().toISOString(),
      },
      reviewerId: 0,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      comment,
      createdAt: new Date().toISOString(),
    };

    onReviewSubmitted(newReview);
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-lightGray p-6 rounded-lg shadow">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-8 h-8 cursor-pointer transition-colors ${ 
                star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              filled={star <= rating}
            />
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary transition-colors"
          placeholder="Share your experience..."
          required
        ></textarea>
      </div>
      <Button type="submit" variant="primary" disabled={!rating || !comment}>
        Submit Review
      </Button>
    </form>
  );
};

export default ReviewForm;