// Helper functions for the application

// Import social media icons
import facebookIcon from '../assets/smIcons/facebook.png';
import instagramIcon from '../assets/smIcons/instagram.png';
import linkedinIcon from '../assets/smIcons/linkedin.png';
import tiktokIcon from '../assets/smIcons/tik-tok.png';
import twitterIcon from '../assets/smIcons/twitter.png';
import youtubeIcon from '../assets/smIcons/youtube.png';

/**
 * Returns the appropriate social media icon based on the type
 * @param {string} type - The social media type (instagram, facebook, etc.)
 * @returns {string} - The path to the icon image
 */
export const getSocialMediaImage = (type) => {
  switch (type?.toLowerCase()) {
    case 'facebook':
      return facebookIcon;
    case 'instagram':
      return instagramIcon;
    case 'linkedin':
      return linkedinIcon;
    case 'tiktok':
      return tiktokIcon;
    case 'twitter':
      return twitterIcon;
    case 'youtube':
      return youtubeIcon;
    default:
      return instagramIcon;
  }
};
