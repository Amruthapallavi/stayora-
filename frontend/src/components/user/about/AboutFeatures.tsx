import { Shield, Clock, Globe, Heart } from "lucide-react";

const AboutFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Safe and secure payment processing with full protection for your transactions."
    },
    {
      icon: Clock,
      title: "Instant Confirmation",
      description: "Get immediate booking confirmation and start planning your perfect stay."
    },
    {
      icon: Globe,
      title: "Global Properties",
      description: "Access to stylish rental properties in destinations worldwide."
    },
    {
      icon: Heart,
      title: "Curated Selection",
      description: "Hand-picked properties that meet our high standards for quality and style."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#b68451] mb-4">
            Why Choose StayOra?
          </h2>
          <p className="text-xl text-amber-700">
            Experience the difference with our premium features
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-[#b68451] to-[#fef3c7] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#b38e5d] mb-2">
                {feature.title}
              </h3>
              <p className="text-black">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutFeatures;
