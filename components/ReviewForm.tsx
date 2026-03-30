import React, { useState } from 'react';
import { Review } from '../types';
import Button from './Button';
import { StarIcon } from './icons/Icons';

interface ReviewFormProps {
  serviceId: string;
  onReviewSubmitted: (review: Review) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ serviceId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment) {
      alert('Please provide a rating and a comment.');
      return;
    }

    // In a real app, the user ID would come from the auth context
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      serviceId,
      userId: 'user-1', // Placeholder user ID
      userName: 'Current User', // Placeholder user name
      userAvatar: 'https://picsum.photos/seed/user1/100/100',
      rating,
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
