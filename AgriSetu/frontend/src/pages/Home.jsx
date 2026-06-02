import { useState } from 'react';
import { Search, Leaf } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Fresh Tomatoes', price: 40, image: 'https://images.unsplash.com/photo-1546470427-227c0f2eeca2?w=400', unit: 'kg', category: 'Vegetables' },
  { id: '2', name: 'Organic Carrots', price: 60, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', unit: 'kg', category: 'Vegetables' },
  { id: '3', name: 'Green Spinach', price: 30, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', unit: 'bunch', category: 'Leafy Greens' },
  { id: '4', name: 'Fresh Potatoes', price: 25, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', unit: 'kg', category: 'Vegetables' },
  { id: '5', name: 'Bell Peppers', price: 80, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', unit: 'kg', category: 'Vegetables' },
  { id: '6', name: 'Fresh Broccoli', price: 70, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', unit: 'kg', category: 'Vegetables' },
  { id: '7', name: 'Organic Lettuce', price: 45, image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400', unit: 'head', category: 'Leafy Greens' },
  { id: '8', name: 'Fresh Cauliflower', price: 50, image: 'https://images.unsplash.com/photo-1568584711271-78d77c3f3a56?w=400', unit: 'kg', category: 'Vegetables' },
];

const CATEGORIES = ['All', 'Vegetables', 'Leafy Greens', 'Fruits', 'Herbs'];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Fresh Farm Vegetables
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 animate-fade-in">
              Directly from local farms to your doorstep. 100% organic and fresh produce.
            </p>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 animate-fade-in">
              <Leaf className="h-5 w-5 text-white/80" />
              <span className="text-sm text-white/90">Free delivery on orders above ₹500</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search vegetables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                {CATEGORIES.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Our Fresh Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="animate-fade-in">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
