import { Target, Users, Lightbulb, Award } from "lucide-react";

const AboutValues = () => {
  const values = [
    {
      icon: Target,
      title: "Quality First",
      description: "We maintain the highest standards for all properties on our platform."
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Building connections between travelers and property owners worldwide."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously improving our platform with cutting-edge technology."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing exceptional experiences for all our users."
    }
  ];

  return (
    <section className="py-20 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            Our Values
          </h2>
          <p className="text-xl text-amber-700">
            The principles that guide everything we do
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-lg text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">
                {value.title}
              </h3>
              <p className="text-amber-700 text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
