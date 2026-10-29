import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BackgroundVideo } from './components/BackgroundVideo';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeatureStrip } from './components/FeatureStrip';
import { FeaturesSection } from './components/FeaturesSection';
import { GSTSupportSection } from './components/GSTSupportSection';
import { CustomizationSection } from './components/CustomizationSection';
import { WorkflowSection } from './components/WorkflowSection';
import { PrivacySection } from './components/PrivacySection';
import { SocialProofSection } from './components/SocialProofSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { EditorLayout } from './components/editor/EditorLayout';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <>
        <BackgroundVideo fallbackImage="/background.mp4" />
        
        <div className="app">
          <Header />
          
          <Routes>
            <Route path="/" element={
              <>
                <main id="main-content" role="main">
                  <HeroSection />
                  <FeatureStrip />
                  <FeaturesSection />
                  <GSTSupportSection />
                  <CustomizationSection />
                  <WorkflowSection />
                  <PrivacySection />
                  <SocialProofSection />
                  <FAQSection />
                  <FinalCTA />
                </main>
                <Footer />
              </>
            } />
            <Route path="/editor" element={<EditorLayout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </>
    </BrowserRouter>
  );
}

export default App;