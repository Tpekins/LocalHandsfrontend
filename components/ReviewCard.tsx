
import React from 'react';
import { Review } from '../types';
import Card from './Card';
import { StarIcon } from './icons/Icons';
import { DEFAULT_AVATAR } from '../constants';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <StarIcon key={index} className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} filled={index < rating} />
    ));
  };

  return (
    <Card className="p-6">
      <div className="flex items-start mb-3">
        <img 
          src={`https://picsum.photos/seed/${review.reviewerId}/50/50`} // Placeholder avatar
          alt={review.reviewerName} 
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <div>
          <h4 className="text-md font-semibold text-gray-800">{review.reviewerName}</h4>
          <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex mb-2">
        {renderStars(review.rating)}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
    </Card>
  );
};

export default ReviewCard;
    