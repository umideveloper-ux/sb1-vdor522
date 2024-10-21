import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GraduationCap, Car, Users, LogIn, Clipboard, Calendar, Menu, CheckCircle, Brain, Star, Shield } from 'lucide-react';
import LoginModal from './components/LoginModal';
import KurumSahibiPage from './pages/KurumSahibiPage';
import initializeFirebaseData from './initializeFirebaseData';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initFirebase = async () => {
      try {
        await initializeFirebaseData();
        console.log('Firebase verileri başarıyla yüklendi');
      } catch (error: any) {
        console.error('Firebase verilerini yüklerken hata oluştu:', error.message);
        setInitError(error.message);
      }
    };

    initFirebase();
  }, []);

  const handleLoginSuccess = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 text-white">
        <header className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Car className="w-8 h-8" />
            <h1 className="text-xl md:text-2xl font-bold">Özel Biga Işıklar Sürücü Kursu</h1>
          </div>
          <div className="flex items-center">
            {!isLoggedIn && (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-white text-purple-600 px-3 py-1 md:px-4 md:py-2 rounded-full flex items-center space-x-2 hover:bg-opacity-90 transition duration-300 text-sm md:text-base"
              >
                <LogIn className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">Giriş Yap</span>
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-4 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {isMenuOpen && (
          <nav className="bg-white bg-opacity-20 backdrop-blur-lg p-4 md:hidden">
            <ul className="space-y-2">
              <li><a href="#" className="block py-2">Ana Sayfa</a></li>
              <li><a href="#" className="block py-2">Hakkımızda</a></li>
              <li><a href="#" className="block py-2">Hizmetler</a></li>
              <li><a href="#" className="block py-2">İletişim</a></li>
            </ul>
          </nav>
        )}

        {initError && (
          <div className="bg-red-500 text-white p-4 text-center">
            Hata: {initError}
          </div>
        )}

        <Routes>
          <Route path="/" element={
            isLoggedIn && userRole === 'kurum' ? (
              <Navigate to="/kurum-sahibi" />
            ) : (
              <main className="container mx-auto px-4 py-8 md:py-12">
                <section className="text-center mb-8 md:mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">Özel Biga Işıklar Sürücü Kursu Aday Takip Sistemi</h2>
                  <p className="text-lg md:text-xl">Biga'nın en yenilikçi ve teknolojik sürücü kursu</p>
                </section>

                <section className="grid gap-6 md:grid-cols-3 md:gap-8 mb-12">
                  <div className="bg-white bg-opacity-20 p-4 md:p-6 rounded-lg backdrop-blur-lg">
                    <Brain className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4" />
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">Yapay Zeka Destekli Eğitim</h3>
                    <p className="text-sm md:text-base">Türkiye'de bir ilk! Yapay zeka algoritmaları ile kişiselleştirilmiş eğitim deneyimi sunuyoruz.</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-4 md:p-6 rounded-lg backdrop-blur-lg">
                    <Star className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4" />
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">Üstün Başarı Oranı</h3>
                    <p className="text-sm md:text-base">Biga'nın en yüksek sınav başarı oranına sahip kursu olarak, geleceğinizi güvence altına alıyoruz.</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-4 md:p-6 rounded-lg backdrop-blur-lg">
                    <Shield className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4" />
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">Güvenli Sürüş Garantisi</h3>
                    <p className="text-sm md:text-base">En son teknolojiye sahip simülatörlerimiz ve uzman kadromuzla, güvenli sürüş becerilerinizi mükemmelleştiriyoruz.</p>
                  </div>
                </section>

                <section className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-lg mb-12">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center">Neden Özel Biga Işıklar Sürücü Kursu'nu Tercih Etmelisiniz?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-6 h-6 mr-2 flex-shrink-0 text-green-400" />
                      <span>Türkiye'de benzeri bulunmayan, yapay zeka destekli eğitim modellerimizle geleceğin sürücülerini yetiştiriyoruz.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-6 h-6 mr-2 flex-shrink-0 text-green-400" />
                      <span>Biga'nın en köklü ve güvenilir sürücü kursu olarak, 30 yılı aşkın tecrübemizle sizlere hizmet veriyoruz.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-6 h-6 mr-2 flex-shrink-0 text-green-400" />
                      <span>Sektörde öncü, yenilikçi eğitim yöntemlerimizle sürücü adaylarımızın başarısını garanti altına alıyoruz.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-6 h-6 mr-2 flex-shrink-0 text-green-400" />
                      <span>Kişiye özel oluşturulan ders programlarımızla, sizin için en uygun zamanı ve öğrenme hızını belirliyoruz.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-6 h-6 mr-2 flex-shrink-0 text-green-400" />
                      <span>Zengin online eğitim içeriklerimiz ve interaktif öğrenme platformumuzla, evinizin konforunda bile eğitiminize devam edebilirsiniz.</span>
                    </li>
                  </ul>
                </section>

                <section className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Geleceğin Yolunda, Güvenle İlerleyin</h3>
                  <p className="text-lg md:text-xl">
                    Özel Biga Işıklar Sürücü Kursu olarak, sadece ehliyet almanızı değil, hayat boyu güvenli ve bilinçli bir sürücü olmanızı hedefliyoruz. 
                    Bizimle başlayan yolculuğunuzda, trafikte güvenle ve özgüvenle ilerleyeceksiniz.
                  </p>
                </section>
              </main>
            )
          } />
          <Route 
            path="/kurum-sahibi" 
            element={
              isLoggedIn && userRole === 'kurum' ? (
                <KurumSahibiPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
        </Routes>

        <footer className="text-center py-4 mt-8 md:mt-12 text-sm md:text-base">
          <p>&copy; 2024 Özel Biga Işıklar Sürücü Kursu Aday Takip Sistemi. Tüm hakları saklıdır.</p>
        </footer>

        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </Router>
  );
}

export default App;