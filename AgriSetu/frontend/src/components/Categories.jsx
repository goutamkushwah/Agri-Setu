import { Carrot, Apple, Wheat, Milk } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      icon: Carrot,
      name: "Fresh Vegetables",
      count: "200+ items",
      color: "hsl(142 76% 36%)",
    },
    {
      icon: Apple,
      name: "Fresh Fruits",
      count: "150+ items",
      color: "hsl(0 80% 60%)",
    },
    {
      icon: Wheat,
      name: "Organic Grains",
      count: "80+ items",
      color: "hsl(38 92% 50%)",
    },
    {
      icon: Milk,
      name: "Dairy Products",
      count: "50+ items",
      color: "hsl(210 40% 96%)",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Browse by <span className="text-primary">Category</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of farm-fresh products across multiple categories
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => navigate('/products')}
              className="group p-8 rounded-2xl bg-card border-2 border-border hover:border-primary hover:shadow-[var(--shadow-medium)] transition-all duration-300 text-left"
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <category.icon 
                  className="w-8 h-8" 
                  style={{ color: category.color }}
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.count}</p>
            </button>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="lg" onClick={() => navigate('/products')}>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
