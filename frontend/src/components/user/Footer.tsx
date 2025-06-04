import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, ChevronUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-white relative">
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={scrollToTop}
          className="rounded-full p-3 bg-[#b68451] text-white shadow-lg hover:bg-[#96683A] transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      </div>

      <div className="text-[#b68451]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="currentColor" fillOpacity="0.1" d="M0,96L60,112C120,128,240,160,360,154.7C480,149,600,107,720,106.7C840,107,960,149,1080,149.3C1200,149,1320,107,1380,85.3L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#b68451]">Luxury Homes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Providing exceptional luxury properties since 2010. Your dream home is just a click away.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#b68451] hover:text-[#96683A] transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-[#b68451] hover:text-[#96683A] transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[#b68451] hover:text-[#96683A] transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-[#b68451] hover:text-[#96683A] transition-colors duration-300">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#b68451]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-[#b68451] transition-colors flex items-center">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#b68451] mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-600 hover:text-[#b68451] transition-colors flex items-center">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#b68451] mr-2"></span>
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-[#b68451] transition-colors flex items-center">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#b68451] mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-[#b68451] transition-colors flex items-center">
                  <span className="inline-block w-1 h-1 rounded-full bg-[#b68451] mr-2"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#b68451]">Services</h3>
            <ul className="space-y-3">
              <li className="text-gray-600 hover:text-[#b68451] transition-colors flex items-center cursor-pointer">
                <span className="inline-block w-1 h-1 rounded-full bg-[#b68451] mr-2"></span>
                Property Management
              </li>
              <li className="text-gray-600 hover:text-[#b68451] transition-colors flex items-center cursor-pointer">
                <span className="inline-block w-1 h-1 rounded-full bg-[#b68451] mr-2"></span>
                Consulting
              </li>
              <li className="text-gray-600 hover:text-[#b68451] transition-colors flex items-center cursor-pointer">
                <span className="inline-block w-1 h-1 rounded-full bg-[#b68451] mr-2"></span>
                Valuation
              </li>
              <li className="text-gray-600 hover:text-[#b68451] transition-colors flex items-center cursor-pointer">
                <span className="inline-block w-1 h-1 rounded-full bg-[#b68451] mr-2"></span>
                Investment
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#b68451]">Stay Updated</h3>
            <p className="text-sm text-gray-600 mb-3">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md text-gray-800 text-sm outline-none border border-gray-300 focus:border-[#b68451] flex-1"
              />
              <button className="bg-[#b68451] hover:bg-[#96683A] transition-colors duration-300 px-4 py-2 rounded-md text-white text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} stayOra. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-[#b68451] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#b68451] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#b68451] transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
