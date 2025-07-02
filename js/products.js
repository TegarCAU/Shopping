// Product Data
const products = [
  {
    id: "1",
    name: "Cashmere Blend Sweater",
    price: 89,
    originalPrice: 129,
    image:
      "https://data.glamood.com/imgprodotto/emporio-icon-turtleneck-cashmere-blend-sweater_1528630_zoom.jpg",
    images: [
      "https://data.glamood.com/imgprodotto/emporio-icon-turtleneck-cashmere-blend-sweater_1528630_zoom.jpg",
      "https://data.glamood.com/imgprodotto/emporio-icon-turtleneck-cashmere-blend-sweater_1528630_zoom.jpg",
    ],
    category: "women",
    description:
      "Luxuriously soft cashmere blend sweater perfect for any season.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Brown", "Cream", "Black"],
    inStock: true,
    featured: true,
    sale: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "2",
    name: "Leather Crossbody Bag",
    price: 145,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop",
    category: "accessories",
    description: "Premium leather crossbody bag with adjustable strap.",
    colors: ["Brown", "Black", "Tan"],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "3",
    name: "Silk Blend Dress",
    price: 165,
    image:
      "https://data.glamood.com/imgprodotto/v-neck-ribbed-silk-blend-dress_1335896_zoom.jpg",
    category: "women",
    description: "Elegant silk blend dress with floral pattern.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral", "Solid"],
    inStock: true,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "4",
    name: "Classic Cotton Shirt",
    price: 79,
    image:
      "https://www.stamely.com/cdn/shop/files/StamelyShibuyaClassicCottonShirt1.jpg?v=1715760609",
    category: "men",
    description: "Timeless cotton shirt perfect for any occasion.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Navy"],
    inStock: true,
    rating: 4.6,
    reviews: 203,
  },
  {
    id: "5",
    name: "Wool Blazer",
    price: 245,
    originalPrice: 295,
    image:
      "https://www.oxfordshop.com.au/cdn/shop/files/PR03388.0202_6_1200x.jpg?v=1707981669",
    category: "men",
    description: "Sophisticated wool blazer for professional settings.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Charcoal", "Brown"],
    inStock: true,
    sale: true,
    rating: 4.8,
    reviews: 98,
  },
  {
    id: "6",
    name: "Designer Sunglasses",
    price: 225,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop",
    category: "accessories",
    description: "Luxury designer sunglasses with UV protection.",
    colors: ["Black", "Tortoise", "Gold"],
    inStock: true,
    rating: 4.9,
    reviews: 67,
  },
  {
    id: "7",
    name: "Knit Cardigan",
    price: 98,
    image:
      "https://image.uniqlo.com/UQ/ST3/id/imagesgoods/472074/item/idgoods_33_472074_3x4.jpg?width=494",
    category: "women",
    description: "Cozy knit cardigan perfect for layering.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Brown", "Black"],
    inStock: true,
    rating: 4.5,
    reviews: 178,
  },
  {
    id: "8",
    name: "Leather Belt",
    price: 65,
    image:
      "https://www.berluti.com/on/demandware.static/-/Sites-masterCatalog_Berluti/default/dw71c9aea1/images/classic-leather-belt-35-mm-tobacco-bis-berluti_01.jpg",
    category: "accessories",
    description: "Premium leather belt with classic buckle.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black"],
    inStock: true,
    rating: 4.7,
    reviews: 145,
  },
  {
    id: "9",
    name: "Vintage Denim Jacket",
    price: 120,
    originalPrice: 150,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkJO7LKcSDhaAWWr5cpqm7BrMbBdNbONFwgg&s",
    category: "women",
    description: "Classic vintage-style denim jacket with distressed details.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Light Blue", "Dark Blue", "Black"],
    inStock: true,
    sale: true,
    featured: true,
    rating: 4.6,
    reviews: 92,
  },
  {
    id: "10",
    name: "Merino Wool Scarf",
    price: 85,
    image:
      "https://gagliardi.eu/cdn/shop/files/GSC0754-GRY.jpg?v=1726828195",
    category: "accessories",
    description: "Soft merino wool scarf perfect for cool weather.",
    colors: ["Cream", "Gray", "Navy", "Burgundy"],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 156,
  },
];

// Helper functions
function getFeaturedProducts() {
  return products.filter((product) => product.featured);
}

function getSaleProducts() {
  return products.filter((product) => product.sale);
}

function getProductsByCategory(category) {
  return products.filter((product) => product.category === category);
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function searchProducts(query) {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery),
  );
}

function filterProducts(filters) {
  let filteredProducts = [...products];

  // Filter by category
  if (filters.category && filters.category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.category === filters.category ||
        (filters.category === "sale" && product.sale),
    );
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= filters.minPrice,
    );
  }

  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= filters.maxPrice,
    );
  }

  // Filter by sizes
  if (filters.sizes && filters.sizes.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.sizes &&
        product.sizes.some((size) => filters.sizes.includes(size)),
    );
  }

  // Filter by colors
  if (filters.colors && filters.colors.length > 0) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.colors &&
        product.colors.some((color) => filters.colors.includes(color)),
    );
  }

  return filteredProducts;
}

function sortProducts(products, sortBy) {
  const sortedProducts = [...products];

  switch (sortBy) {
    case "price-low":
      return sortedProducts.sort((a, b) => a.price - b.price);
    case "price-high":
      return sortedProducts.sort((a, b) => b.price - a.price);
    case "name":
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
      return sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "newest":
      return sortedProducts.reverse(); // Assuming newer products are at the end
    default:
      return sortedProducts; // Keep original order for featured
  }
}

function calculateDiscount(product) {
  if (!product.originalPrice) return 0;
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  let stars = "";
  for (let i = 0; i < fullStars; i++) {
    stars += "★";
  }
  if (halfStar) {
    stars += "☆";
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += "☆";
  }

  return stars;
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    products,
    getFeaturedProducts,
    getSaleProducts,
    getProductsByCategory,
    getProductById,
    searchProducts,
    filterProducts,
    sortProducts,
    calculateDiscount,
    formatPrice,
    generateStars,
  };
}
