import { useState, useEffect } from 'react';
import { Menu, X, Home, Inbox, Settings, Users, BarChart2, ShoppingBag } from 'lucide-react';

const OwnerHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); 

  // Animation on mount
  useEffect(() => {
    setVisible(true);
  }, []);

  const handleSubscription = () => {
    alert("Redirecting to subscription page...");
  };
  useEffect(() => {
    const handleKeyDown = (e:any) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sidebarOpen]);

  // Prevent body scrolling when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Inbox, label: 'Messages', notification: 5 },
    { icon: Users, label: 'Customers' },
    { icon: ShoppingBag, label: 'Products' },
    { icon: BarChart2, label: 'Analytics' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Ocean Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          opacity: 0.9
        }}
      />
      
      {/* Overlay to darken the image for better text contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 to-black/40" />

      {/* Header */}
      <header className="relative z-10 p-5">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-white text-2xl font-medium">STAYORA</a>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-white hover:bg-white/10 rounded-md transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4">
          <div 
            className={`max-w-3xl mx-auto text-center transition-opacity duration-1000 ${
              visible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6 leading-tight"
              style={{ lineHeight: '1.3', textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
            >
              Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
            </h1>
            <button 
              className="inline-block py-3 px-6 bg-[#FF8A00] text-white rounded-full hover:bg-opacity-90 transition-colors"
              style={{ minWidth: '180px' }}
            >
              Let's get started
            </button>
          </div>
        </section>

        {/* Product Section */}
        <section className="mt-auto">
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-md ml-auto">
          {/* Subscription Status Card */}
          <div 
            className="overflow-hidden rounded-lg bg-white" 
            style={{ 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            }}
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" 
                alt="Subscription" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5" style={{ backgroundColor: '#1A1A1A', color: 'white' }}>
              <div className="text-xs uppercase tracking-wider text-[#767676] mb-2">OWNER SUBSCRIPTION</div>
              <h3 className="text-lg font-serif font-medium mb-2">
                {isSubscribed ? "Subscription Active" : "Subscription Required"}
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                {isSubscribed 
                  ? "You can now list your properties for rent."
                  : "You need an active subscription to add your house for rental."}
              </p>
              
              {/* Subscribe or Manage Subscription Button */}
              <button 
                onClick={handleSubscription}
                className={`w-full px-4 py-2 rounded-md font-medium transition ${
                  isSubscribed 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isSubscribed ? "Manage Subscription" : "Subscribe Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-gray-900 text-white py-12">
  <div className="container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">Become a Verified Owner</h2>
      <p className="text-gray-300 text-lg">
        Here, you can rent out your properties to potential tenants. Get started with our **free trial** and list **one house** for free.  
        To add more properties, you will need a subscription.
      </p>
    </div>

    <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
      {/* Free Trial Card */}
      <div className="bg-white text-gray-900 rounded-lg p-6 shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-2">Free Trial</h3>
        <p className="text-gray-700 text-sm">
          As a new owner, you can add **one property** for free to explore our platform.
        </p>
      </div>

      {/* Subscription Card */}
      <div className="bg-white text-gray-900 rounded-lg p-6 shadow-lg max-w-sm w-full">
        <h3 className="text-xl font-semibold mb-2">Upgrade Anytime</h3>
        <p className="text-gray-700 text-sm">
          To add more properties, subscribe and unlock **unlimited listings** with premium support.
        </p>
      </div>
    </div>

    <div className="mt-8 text-center">
      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md text-lg font-medium transition">
        Get Started as an Owner
      </button>
    </div>
  </div>
</section>


      </main>

      {/* Sidebar */}
      <>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Sidebar */}
        <aside 
          className={`fixed top-0 right-0 z-50 h-screen w-[320px] bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'transform-none' : 'translate-x-full'
          }`}
          style={{ 
            boxShadow: '0 0 25px rgba(0, 0, 0, 0.15)',
            borderLeft: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#FF8A00] flex items-center justify-center">
                  <span className="text-white font-medium">G</span>
                </div>
                <h2 className="text-xl font-medium">STAYORA</h2>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <nav className="flex-1 overflow-auto py-6 px-3">
              <ul className="space-y-1.5">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        item.active 
                          ? 'bg-[#FF8A00]/10 text-[#FF8A00]' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <item.icon size={20} className={item.active ? 'text-[#FF8A00]' : 'text-gray-500'} />
                      <span className="font-medium">{item.label}</span>
                      {item.notification && (
                        <span className="ml-auto bg-[#FF8A00] text-white text-xs font-medium min-w-5 h-5 rounded-full flex items-center justify-center px-1.5">
                          {item.notification}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-xs font-semibold text-gray-500 px-4 mb-3">CATEGORIES</h3>
                <ul className="space-y-1">
                  {['Technology', 'Design', 'Business', 'Marketing', 'Development'].map((category) => (
                    <li key={category}>
                      <a 
                        href="#" 
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="size-1.5 rounded-full bg-[#FF8A00] opacity-70"></span>
                        <span>{category}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
            
            {/* Footer */}
            <div className="p-5 border-t border-gray-100 dark:border-gray-800">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Upgrade to Pro for advanced features</p>
                <button 
                  className="w-full py-2.5 px-4 bg-[#FF8A00] text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </aside>
      </>
    </div>
  );
};

export default OwnerHome;
