window.FOREVER_STORE_URL = "";

window.SITE_CONFIG = {
  siteName: "Nomhle Zongo",
  title: "Independent Forever Business Owner | Health & Wellness Entrepreneur",
  phoneDisplay: "083 379 4532",
  phoneLocalDigits: "0833794532",
  whatsappInternationalDigits: "27833794532",
  email: "nomhlezongo@yahoo.com",
  location: "East London, South Africa",
  foreverStoreUrl: window.FOREVER_STORE_URL,
  socialLinks: {
    facebook: "",
    tiktok: ""
  },
  lzSolutionsUrl: "https://lzsolutions.co.za",
  integration: {
    n8nWebhookUrl: "",
    googleSheetsEndpoint: "",
    notifyEmail: ""
  },
  whatsappMessages: {
    products: "Hi Nomhle, I came across your website and I'd like some information about Forever products.",
    opportunity: "Hi Nomhle, I came across your website and I'd like to learn more about the Forever business opportunity.",
    general: "Hi Nomhle, I came across your website and I would like to connect."
  },
  placeholderLinks: {
    facebookLabel: "Facebook URL placeholder - update in js/config.js",
    tiktokLabel: "TikTok URL placeholder - update in js/config.js"
  },
  canonicalBaseUrl: "https://your-domain.example"
};

window.getWhatsAppLink = function getWhatsAppLink(message) {
  return "https://wa.me/" + window.SITE_CONFIG.whatsappInternationalDigits + "?text=" + encodeURIComponent(message);
};
