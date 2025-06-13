import AboutHero from "../../components/user/about/AboutHero";
import AboutMission from "../../components/user/about/AboutMission";
import AboutStats from "../../components/user/about/AboutStats";
import AboutFeatures from "../../components/user/about/AboutFeatures";
import AboutHowItWorks from "../../components/user/about/AboutHowItWork";
import AboutValues from "../../components/user/about/AboutValues";
import AboutCTA from "../../components/user/about/AboutCTA";
import UserLayout from "../../components/user/UserLayout";

const About = () => {
  return (
    <UserLayout>
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <AboutHero />
      <AboutMission />
      <AboutStats />
      <AboutFeatures />
      <AboutHowItWorks />
      <AboutValues />
      <AboutCTA />
    </div>
    </UserLayout>
  );
};

export default About;