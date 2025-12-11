import { Star } from 'lucide-react';

interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
}

interface GoogleReviewsWidgetProps {
  reviews: GoogleReview[];
  averageRating: number;
  totalReviews: number;
  businessName: string;
}

export function GoogleReviewsWidget({
  reviews,
  averageRating,
  totalReviews,
  businessName,
}: GoogleReviewsWidgetProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      {/* Header with Google logo style */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-2xl font-bold text-dark-gray">{businessName}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-dark-gray">{averageRating}</span>
            {renderStars(Math.round(averageRating))}
            <span className="text-sm text-gray-600">({totalReviews} reviews)</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Google Reviews
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white font-semibold">
                {review.author.charAt(0)}
              </div>

              <div className="flex-1">
                {/* Author and Date */}
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-dark-gray">{review.author}</div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 border-t border-gray-200 pt-4 text-center">
        <a
          href="https://www.google.com/maps"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          See all reviews on Google
        </a>
      </div>
    </div>
  );
}

export default GoogleReviewsWidget;
