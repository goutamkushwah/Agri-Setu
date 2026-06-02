import { Sprout, TruckIcon, Home } from "lucide-react";
import farmerImage from "@/assets/farmer-happy.jpg";
import deliveryImage from "@/assets/customer-delivery.jpg";

const HowItWorks = () => {
  const steps = [
    {
      icon: Sprout,
      title: "Farmers List Products",
      description: "Local farmers register and list their fresh produce with fair prices, eliminating middlemen.",
      image: farmerImage,
    },
    {
      icon: TruckIcon,
      title: "We Handle Logistics",
      description: "Our platform manages orders, payments, and coordinates efficient delivery routes.",
      gradient: true,
    },
    {
      icon: Home,
      title: "Fresh at Your Door",
      description: "Customers receive farm-fresh vegetables within 24 hours, supporting local agriculture.",
      image: deliveryImage,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple three-step process that connects farmers directly with consumers, ensuring fair prices and fresh produce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all duration-300"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg">
                {index + 1}
              </div>

              {/* Icon or Image */}
              <div className="mb-6 mt-4">
                {step.gradient ? (
                  <div className="w-full h-48 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center">
                    <step.icon className="w-20 h-20 text-primary-foreground" />
                  </div>
                ) : (
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex items-start gap-3 mb-3">
                <step.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <h3 className="text-xl font-bold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Connection Line - Hidden on mobile */}
        <div className="hidden md:block relative -mt-[350px] mb-[350px] pointer-events-none">
          <svg className="w-full h-2" viewBox="0 0 100 2" preserveAspectRatio="none">
            <path
              d="M 0,1 L 100,1"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              strokeDasharray="5,5"
              fill="none"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
