import { Heart, DollarSign, Leaf, Clock, Shield, Truck } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Heart,
      title: "Support Local Farmers",
      description: "Your purchase directly helps farming families earn fair wages",
    },
    {
      icon: DollarSign,
      title: "Better Prices",
      description: "No middlemen means lower prices for you and better returns for farmers",
    },
    {
      icon: Leaf,
      title: "100% Fresh & Organic",
      description: "Farm-fresh produce harvested just hours before delivery",
    },
    {
      icon: Clock,
      title: "24-Hour Delivery",
      description: "Quick delivery ensures maximum freshness and quality",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "All produce is inspected and quality-certified before dispatch",
    },
    {
      icon: Truck,
      title: "Doorstep Delivery",
      description: "Convenient delivery at your preferred time slot",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">Agri-Setu</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            More than just fresh vegetables - we're building a sustainable future for farming communities and healthier choices for your family.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-[var(--shadow-soft)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <benefit.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
