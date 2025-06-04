import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.2,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="max-w-md w-full overflow-hidden border-none shadow-xl">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-[#A98E60] to-[#8E7141] p-6 text-white">
            <motion.h1 
              className="text-7xl md:text-9xl font-bold mb-2" 
              variants={itemVariants}
            >
              404
            </motion.h1>
            <motion.div 
              className="h-1 w-16 bg-white rounded mb-6"
              variants={itemVariants}
            />
            <motion.h2 
              className="text-2xl md:text-3xl font-semibold"
              variants={itemVariants}
            >
              Page Not Found
            </motion.h2>
          </div>
          
          <motion.div 
            className="p-6 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()} 
                className="flex items-center gap-2 transition-all hover:gap-3"
              >
                <ArrowLeft size={16} />
                Go Back
              </Button>
              
              <Link to="/">
                <Button 
                  className="bg-[#A98E60] hover:bg-[#8E7141] flex items-center gap-2 transition-all hover:gap-3"
                >
                  <Home size={16} />
                  Return Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <motion.div 
        className="mt-8 text-sm text-gray-500"
        variants={itemVariants}
      >
        &copy; {new Date().getFullYear()} | All rights reserved
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
