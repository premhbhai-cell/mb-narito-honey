/* Brand details + product data */
window.BRAND = {
  name: "Mb Naturo Pure",
  slogan: "Harvest by Nature, Refined by Purity",
  gst: "19EYXPB4930H1ZY",
  shippingPartner: "Shiprocket",
  phone: "9547244010",
  whatsapp: "919547244010",
  email: "mbnaturopure@gmail.com",
  address: "Basirhat, Lakshman Kati, Kathur, North 24 Parganas, West Bengal",
  fssai: "22826139000539",
  facebook: "https://www.facebook.com/share/1CGWaCuecz/",
  instagram: "https://www.instagram.com/mbnaturopure?srtk=ZTJodGIwbjhyaXZt"
};

window.CATEGORIES = ["Pure Honey", "Honey Comb", "Organic Honey", "Wild Forest Honey", "Gift Pack"];

window.PRODUCTS = [
  { id: "sundarban-forest-honey", name: "Sundarban Forest Honey", category: "Pure Honey", price: 499, mrp: 699, weight: "500 g", image: "assets/p-forest.jpg", rating: 4.8, description: "Raw, unprocessed honey collected from the mangrove forests of Sundarban. Rich in natural enzymes and antioxidants with a deep, earthy flavour." },
  { id: "natural-honey-comb", name: "Natural Honey Comb", category: "Honey Comb", price: 799, mrp: 999, weight: "400 g", image: "assets/p-comb.jpg", rating: 4.8, description: "Fresh, edible honeycomb straight from the hive. Chew it as it is, or enjoy with toast, cheese and fruits." },
  { id: "organic-wild-honey", name: "Organic Wild Honey", category: "Wild Forest Honey", price: 599, mrp: 799, weight: "500 g", image: "assets/p-wild.jpg", rating: 4.8, description: "Wild honey gathered by traditional honey collectors from deep forest hives. No added sugar, no chemicals." },
  { id: "premium-honey-gift-pack", name: "Premium Honey Gift Pack", category: "Gift Pack", price: 1199, mrp: 1499, weight: "3 x 150 g + comb", image: "assets/p-gift.jpg", rating: 4.8, description: "A beautiful gift box with three varieties of pure honey and a fresh honeycomb bar. Perfect for festivals and loved ones." },
  { id: "organic-honey-1kg", name: "Organic Honey 1 kg", category: "Organic Honey", price: 899, mrp: 1199, weight: "1 kg", image: "assets/p-forest.jpg", rating: 4.7, description: "Family pack of our pure organic honey. Ideal for daily use with warm water, lemon, tea and cooking." },
  { id: "pure-honey-250g", name: "Pure Honey 250 g", category: "Pure Honey", price: 279, mrp: 349, weight: "250 g", image: "assets/p-wild.jpg", rating: 4.7, description: "Small pack of 100% pure natural honey. Great to try or to carry while travelling." }
];

window.inr = function (n) { return "\u20B9" + Number(n).toLocaleString("en-IN"); };
window.SHIPPING_FREE_ABOVE = 999;
window.shippingFor = function (subtotal) { return (subtotal === 0 || subtotal >= window.SHIPPING_FREE_ABOVE) ? 0 : 60; };
