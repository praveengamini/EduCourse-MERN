import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/landingPage/Header";
import Hero from "../../components/landingPage/Hero";
import StatsSection from "../../components/landingPage/StatsSection";
import CoursesSection from "../../components/landingPage/CoursesSection";
import CTASection from "../../components/landingPage/CTASection";
import StatsCards from "../../components/landingPage/StatsCards";
import FAQSection from "../../components/landingPage/FAQSection";
import Footer from "../../components/landingPage/Footer";

const LandingPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black">
      <Header
        rightButton={
          !isAuthenticated && (
            <button
              onClick={() => navigate('/auth/login')}
              className="text-white bg-indigo-600 px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Login
            </button>
          )
        }
      />
      <main>
        <Hero/>
        <StatsSection />
        <CoursesSection />
        <CTASection/>
        <StatsCards />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
