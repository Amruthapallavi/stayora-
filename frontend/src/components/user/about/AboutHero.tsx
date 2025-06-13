
const AboutHero = () => {
  return (
    <section className="bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-yellow-600">
            Welcome to StayOra
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-800">
            Book stylish rental properties in any location worldwide. Discover unique stays that make every trip memorable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button size="lg" className="bg-amber-700 text-white hover:bg-amber-800 shadow-lg">
              <Search className="w-5 h-5 mr-2" />
              Find Your Perfect Stay
            </Button>
            <Button size="lg" variant="outline" className="border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white shadow-lg">
              <PlusCircle className="w-5 h-5 mr-2" />
              Grow Your Business
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;