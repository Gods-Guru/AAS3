import api from './index';

export async function fetchFeaturedWebsiteReviews() {
  const res = await api.get('/website-reviews/featured');
  if (!res.data) throw new Error('No featured reviews found');
  return res.data;
}
