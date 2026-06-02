const FAQ = [
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening'],
    reply:
      'Hello! Welcome to Agri-Setu. I can help with products, orders, delivery, farmer signup, and account questions. What would you like to know?'
  },
  {
    keywords: ['product', 'vegetable', 'fruit', 'buy', 'browse', 'shop', 'catalog'],
    reply:
      'Browse fresh produce on the Products page (/products). Add items to your cart, then checkout. You need a customer account to place orders.'
  },
  {
    keywords: ['order', 'checkout', 'cart', 'place order', 'purchase'],
    reply:
      'To order: log in as a customer → add products to cart → go to Checkout → fill delivery details → place order. Orders are sent to the farmer who listed each product.'
  },
  {
    keywords: ['delivery', 'shipping', 'deliver', 'address', 'pincode'],
    reply:
      'We offer home delivery. At checkout, enter your full address, city, 10-digit phone, and 6-digit PIN code. Delivery fee and tax are calculated automatically.'
  },
  {
    keywords: ['farmer', 'sell', 'farm', 'listing', 'list product'],
    reply:
      'Farmers can sign up with the Farmer role, then open the Farmer Dashboard to add and manage products. Customers will see your listings on the Products page.'
  },
  {
    keywords: ['register', 'signup', 'sign up', 'account', 'create account'],
    reply:
      'Click Sign Up on the login page. Choose Customer to buy produce or Farmer to sell. Admin accounts are not available for public registration.'
  },
  {
    keywords: ['login', 'log in', 'password', 'forgot'],
    reply:
      'Use the Login tab on /auth with your email and password. If you forgot your password, use the forgot-password option on the login page when available.'
  },
  {
    keywords: ['organic', 'fresh', 'quality'],
    reply:
      'Many farmers list organic and fresh produce. Check product descriptions and filters on the Products page. Look for organic badges on listings.'
  },
  {
    keywords: ['payment', 'pay', 'cash', 'upi', 'card'],
    reply:
      'Payment status is recorded as pending when you place an order. Payment collection details may be coordinated with the farmer or platform support.'
  },
  {
    keywords: ['price', 'cost', 'cheap', 'expensive', 'rate'],
    reply:
      'Prices are set by each farmer per product. You will see the price and unit (kg, bunch, etc.) on the product card before adding to cart.'
  },
  {
    keywords: ['contact', 'support', 'help', 'phone', 'email'],
    reply:
      'For more help, visit the About page or contact platform support. You can also keep chatting here with short questions about Agri-Setu.'
  },
  {
    keywords: ['thank', 'thanks', 'dhanyavad'],
    reply: 'You are welcome! Happy farming and healthy eating with Agri-Setu.'
  },
  {
    keywords: ['bye', 'goodbye', 'see you'],
    reply: 'Goodbye! Come back anytime to browse fresh produce from local farmers.'
  }
];

const DEFAULT_REPLY =
  'I am the Agri-Setu help bot. Try asking about: products, orders, delivery, farmer signup, or creating an account. Example: "How do I place an order?"';

const getSimpleReply = (userMessage) => {
  const text = userMessage.toLowerCase().trim();

  if (!text) {
    return 'Please type a message so I can help you.';
  }

  for (const item of FAQ) {
    if (item.keywords.some((kw) => text.includes(kw))) {
      return item.reply;
    }
  }

  return DEFAULT_REPLY;
};

module.exports = { getSimpleReply };
