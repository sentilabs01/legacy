import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Volume2, VolumeX, MessageSquare, X } from 'lucide-react';

const BackgroundVideo = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error("Video playback failed:", error));
    }
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover"
        muted={isMuted}
        loop
        autoPlay
        playsInline
      >
        <source src="https://s3.amazonaws.com/sentilabs.org/podcast+circuit+-+Made+with+Clipchamp.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button
        onClick={toggleMute}
        className="absolute bottom-4 left-4 bg-white p-2 rounded-full shadow-md z-10"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
    </div>
  );
};

const ScrollingText = ({ text }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = 1 - Math.min(scrollPosition / 500, 1);
  const blur = Math.min(scrollPosition / 50, 15);
  const translateY = scrollPosition * 0.5;

  return (
    <div className="py-20 bg-gray-900 bg-opacity-50 text-white overflow-hidden">
      <div
        className="text-4xl font-bold text-center transition-all duration-300 ease-out"
        style={{
          opacity,
          filter: `blur(${blur}px)`,
          transform: `translateY(${translateY}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const VideoSection = ({ videoUrl, title }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="py-10 relative">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <video
        ref={videoRef}
        className="w-full rounded-lg shadow-lg"
        muted={isMuted}
        loop
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <button
        onClick={toggleMute}
        className="absolute bottom-4 left-4 bg-white p-2 rounded-full shadow-md"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
    </div>
  );
};

const ZapierChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000); // Open after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-2 bg-gray-100">
            <span className="font-bold">Chatbot</span>
            <button onClick={toggleChatbot} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <zapier-interfaces-chatbot-embed
            chatbot-id="cm07j688f003uicovl9hr9yhf"
            height="500px"
            width="350px"
          />
        </div>
      ) : (
        <button
          onClick={toggleChatbot}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

const SurveyForm = () => (
  <div className="py-10">
    <h2 className="text-2xl font-bold mb-4 text-white"></h2>
    <iframe
      width="100%"
      height="600px"
      src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__nOWVP5UNTYzMlM5MjVQT0NUMzJPMExTM0w5UFhVSS4u&embed=true"
      frameBorder="0"
      style={{ border: 'none', maxWidth: '100%', maxHeight: '100vh' }}
      allowFullScreen
    />
  </div>
);

const Modal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="prose">{content}</div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const logoSize = 150;

  const openModal = (modal) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const aboutContent = (
    <div>
      <p>Magnetar Sentient, LLC is a cutting-edge technology company specializing in AI-driven solutions and data analytics. Founded in 2022, our mission is to revolutionize how small businesses interact with data and make decisions.</p>
      <p>Our business strategists leverage modern technologies such as data-trained agents, assistants, and bots to empower your small business, keeping you ahead of the AI curve. We tirelessly deliver innovative solutions that drive growth and efficiency for our clients across various industries.</p>
    </div>
  );

  const servicesContent = (
    <div>
      <h3></h3>
      <ul>
        <li>AI-Powered Business Intelligence</li>
        <li>AI-Powered Analytics</li>
        <li>Machine Learning Model Development</li>
        <li>Data Visualization and Reporting</li>
        <li>Custom Software Solutions</li>
      </ul>
      <p>We tailor our services to meet the unique needs of each client, ensuring maximum impact and ROI.</p>
    </div>
  );

  const contactContent = (
    <div>
      <p></p>
      <ul>
        
      
   </ul>
      <p></p>
      <iframe
        width="100%"
        height="600px"
        src="https://forms.office.com/r/jrD2CrY4SH"
        frameBorder="0"
        style={{ border: 'none', maxWidth: '100%', maxHeight: '100vh' }}
        allowFullScreen
      />
      
      <a href="https://forms.office.com/r/jrD2CrY4SH" target="_blank" rel="noopener noreferrer">
        <img
          src="https://s3.amazonaws.com/sentilabs.org/QRCode+for+Market+Survey.png"
          alt="QR Code for Market Survey"
          className="w-32 h-32 mx-auto mt-4"
        />
      </a>
      <button
        onClick={() => setShowSurvey(false)}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md"
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <BackgroundVideo />
      <div className="relative z-10">
      <header className="bg-white bg-opacity-80 shadow-md">
  <div className="container mx-auto px-8 py-10 flex justify-between items-center">
    <img
      src="https://s3.amazonaws.com/sentilabs.org/Magnetar+Sentient+LLC_white_logo.png"
      alt="Magnetar Sentient LLC Logo"
      style={{ width: `${200}px`, height: 'auto' }}
    />
    <nav>
      <ul className="flex space-x-4">
        <li><button onClick={() => openModal('about')} className="text-gray-600 hover:text-gray-900">About</button></li>
        <li><button onClick={() => openModal('services')} className="text-gray-600 hover:text-gray-900">Services</button></li>
        <li><button onClick={() => openModal('contact')} className="text-gray-600 hover:text-gray-900">Contact</button></li>
      </ul>
    </nav>
  </div>
</header>

        <main>
          <ScrollingText text="Magnetar Sentient, LLC empowers business with modern AI tools that optimize workflows and customer interactions." />
          <div className="container mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold mb-8 text-white"></h1>
            













            
            <VideoSection
              videoUrl="https://magnetar-sentient.s3.amazonaws.com/AI+_Driven+Solutions_480.mp4"
              title=""
            />
            
            <VideoSection
              videoUrl="https://magnetar-sentient.s3.amazonaws.com/Data-Driven+Insights+-+Made+with+Clipchamp.mp4"
              title=""
            />
            
            <VideoSection
              videoUrl="https://magnetar-sentient.s3.amazonaws.com/Enhanced+Customer+Engagement_480.mp4"
              title=""
            />
            
            <SurveyForm />
          </div>
        </main>

        <footer className="bg-gray-800 bg-opacity-80 text-white py-8">
          <div className="container mx-auto px-4">
            <p>&copy; 2024 Magnetar Sentient, LLC. All rights reserved.</p>
          </div>
        </footer>

        <ZapierChatbot />

        <div className="fixed bottom-4 left-4 animate-bounce">
          <ChevronDown size={32} className="text-white" />
        </div>

        <Modal
          isOpen={activeModal === 'about'}
          onClose={closeModal}
          title="About Us"
          content={aboutContent}
        />
        <Modal
          isOpen={activeModal === 'services'}
          onClose={closeModal}
          title="Our Services"
          content={servicesContent}
        />
        <Modal
          isOpen={activeModal === 'contact'}
          onClose={closeModal}
          title="Contact Us"
          content={contactContent}
        />
      </div>
    </div>
  );
};

export default App;