import React, { useState, useRef, useEffect } from 'react';
import { X, User, Briefcase, GraduationCap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { auth, database } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState<'aday' | 'egitmen' | 'kurum' | null>(null);
  const [tcKimlik, setTcKimlik] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<{ [key: string]: { name: string, password: string } }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setIsLoading(true);
        const instructorsRef = ref(database, 'egitmenler');
        const snapshot = await get(instructorsRef);
        if (snapshot.exists()) {
          setInstructors(snapshot.val());
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
        setError('Eğitmen bilgileri alınamadı. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && loginMethod === 'egitmen') {
      fetchInstructors();
    }
  }, [isOpen, loginMethod]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && isLoginDisabled) {
      setIsLoginDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isLoginDisabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginDisabled) return;
    
    setError(null);
    setIsLoading(true);

    try {
      switch (loginMethod) {
        case 'aday':
          await handleAdayLogin();
          break;
        case 'egitmen':
          await handleEgitmenLogin();
          break;
        case 'kurum':
          await handleKurumLogin();
          break;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdayLogin = async () => {
    const adayRef = ref(database, `adaylar/${tcKimlik}`);
    const snapshot = await get(adayRef);
    if (snapshot.exists()) {
      onLoginSuccess('aday');
    } else {
      setError('Geçersiz TC Kimlik Numarası');
    }
  };

  const handleEgitmenLogin = async () => {
    const instructor = instructors[selectedInstructor];
    if (instructor && instructor.password === password) {
      onLoginSuccess('egitmen');
    } else {
      setError('Geçersiz şifre');
    }
  };

  const handleKurumLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, 'hasimdoganisik@gmail.com', password);
      onLoginSuccess('kurum');
    } catch (error: any) {
      console.error('Kurum login error:', error);
      if (error.code === 'auth/wrong-password') {
        setError('Geçersiz şifre');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Çok fazla başarısız giriş denemesi yapıldı. Lütfen bir süre bekleyin ve tekrar deneyin.');
        setIsLoginDisabled(true);
        setCountdown(60); // 60 saniye bekletme süresi
      } else {
        setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 md:p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>

        {loginMethod === null ? (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Lütfen Giriş Yönteminizi Seçin</h2>
            <div className="space-y-4">
              <button
                onClick={() => setLoginMethod('aday')}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              >
                <GraduationCap className="mr-2" /> Aday Girişi
              </button>
              <button
                onClick={() => setLoginMethod('egitmen')}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center"
              >
                <User className="mr-2" /> Eğitmen Girişi
              </button>
              <button
                onClick={() => setLoginMethod('kurum')}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300 flex items-center justify-center"
              >
                <Briefcase className="mr-2" /> Kurum Girişi
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              onClick={() => setLoginMethod(null)}
              className="mb-4 text-blue-500 hover:text-blue-600 flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Geri Dön
            </button>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              {loginMethod === 'aday' && 'Aday Girişi'}
              {loginMethod === 'egitmen' && 'Eğitmen Girişi'}
              {loginMethod === 'kurum' && 'Kurum Girişi'}
            </h2>

            {loginMethod === 'aday' && (
              <div>
                <label htmlFor="tcKimlik" className="block text-sm font-medium text-gray-700 mb-1">
                  TC Kimlik Numarası
                </label>
                <input
                  type="text"
                  id="tcKimlik"
                  value={tcKimlik}
                  onChange={(e) => setTcKimlik(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-purple-600"
                  required
                />
              </div>
            )}

            {loginMethod === 'egitmen' && (
              <>
                <div>
                  <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                    Lütfen Listeden Adınızı Seçin
                  </label>
                  <select
                    id="instructor"
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-purple-600"
                    required
                  >
                    <option value="">Seçiniz</option>
                    {Object.entries(instructors).map(([key, instructor]) => (
                      <option key={key} value={key}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Şifre
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-purple-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </>
            )}

            {loginMethod === 'kurum' && (
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-purple-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {isLoginDisabled && (
              <p className="text-yellow-500 text-sm">
                Lütfen {countdown} saniye bekleyin ve tekrar deneyin.
              </p>
            )}

            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ${isLoginDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoginDisabled}
            >
              Giriş Yap
            </button>
          </form>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;