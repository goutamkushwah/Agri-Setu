import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Experience <span className="text-primary">Farm-Fresh</span> Goodness?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of happy customers who have switched to healthier, fresher produce while supporting local farmers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="text-base min-w-[200px]" onClick={() => navigate('/products')}>
              Start Shopping Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-base min-w-[200px]" onClick={() => navigate('/about')}>
              Learn More
            </Button>
          </div>

          <div className="mt-8">
            <Button variant="secondary" onClick={() => navigate('/products')}>
              View All Products
            </Button>
          </div>

          <div className="mt-12 pt-12 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              Are you a farmer? Join our platform
            </p>
            <Button variant="secondary" size="lg" onClick={() => navigate('/auth?role=farmer')}>
              Register as Farmer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
