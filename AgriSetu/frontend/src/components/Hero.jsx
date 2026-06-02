import { Button } from "@/components/ui/button";
import { Leaf, ShoppingBag } from "lucide-react";
import heroImage from "@/assets/hero-farm-veggies.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Fresh organic vegetables and fruits" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Farm to Your Door</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Fresh <span className="text-primary">Vegetables</span> Directly from Farmers
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Skip the middlemen. Get farm-fresh produce delivered to your doorstep while supporting local farmers with fair prices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg"
              className="text-base"
              onClick={() => navigate('/products')}
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-base"
              onClick={() => navigate('/auth?role=farmer')}
            >
              <Leaf className="w-5 h-5" />
              Join as Farmer
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-border">
            <div>
              <div className="text-3xl font-bold text-primary">2000+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Local Farmers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Fresh & Organic</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
