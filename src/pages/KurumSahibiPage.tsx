import React, { useState, useEffect } from 'react';
import { Briefcase, User, GraduationCap, Plus, List, Settings, UserPlus, Car, Calendar } from 'lucide-react';
import { database } from '../firebase';
import { ref, set, onValue, remove, update } from 'firebase/database';

interface KurumSahibiPageProps {
  onLogout: () => void;
}

interface Egitmen {
  name: string;
  password: string;
  adaylar?: { [key: string]: boolean };
}

interface Aday {
  name: string;
  egitmen?: string;
}

const KurumSahibiPage: React.FC<KurumSahibiPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newEgitmen, setNewEgitmen] = useState({ name: '', password: '' });
  const [newAday, setNewAday] = useState({ tcKimlik: '', name: '' });
  const [egitmenler, setEgitmenler] = useState<{ [key: string]: Egitmen }>({});
  const [adaylar, setAdaylar] = useState<{ [key: string]: Aday }>({});
  const [selectedEgitmen, setSelectedEgitmen] = useState('');
  const [selectedAday, setSelectedAday] = useState('');

  useEffect(() => {
    const egitmenlerRef = ref(database, 'egitmenler');
    const adaylarRef = ref(database, 'adaylar');

    onValue(egitmenlerRef, (snapshot) => {
      if (snapshot.exists()) {
        setEgitmenler(snapshot.val());
      }
    });

    onValue(adaylarRef, (snapshot) => {
      if (snapshot.exists()) {
        setAdaylar(snapshot.val());
      }
    });
  }, []);

  const handleAddEgitmen = () => {
    const egitmenKey = newEgitmen.name.replace(/\s+/g, '');
    const egitmenRef = ref(database, `egitmenler/${egitmenKey}`);
    set(egitmenRef, { name: newEgitmen.name, password: newEgitmen.password });
    setNewEgitmen({ name: '', password: '' });
  };

  const handleAddAday = () => {
    const adayRef = ref(database, `adaylar/${newAday.tcKimlik}`);
    set(adayRef, { name: newAday.name });
    setNewAday({ tcKimlik: '', name: '' });
  };

  const handleRemoveEgitmen = (egitmenKey: string) => {
    const egitmenRef = ref(database, `egitmenler/${egitmenKey}`);
    remove(egitmenRef);
  };

  const handleRemoveAday = (adayKey: string) => {
    const adayRef = ref(database, `adaylar/${adayKey}`);
    remove(adayRef);
  };

  const handleAssignAday = () => {
    if (selectedEgitmen && selectedAday) {
      const egitmenRef = ref(database, `egitmenler/${selectedEgitmen}/adaylar/${selectedAday}`);
      const adayRef = ref(database, `adaylar/${selectedAday}/egitmen`);

      set(egitmenRef, true);
      set(adayRef, selectedEgitmen);

      setSelectedEgitmen('');
      setSelectedAday('');
    }
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg">
        <h3 className="text-xl font-semibold mb-4">Hızlı İstatistikler</h3>
        <p>Toplam Eğitmen Sayısı: {Object.keys(egitmenler).length}</p>
        <p>Toplam Aday Sayısı: {Object.keys(adaylar).length}</p>
      </div>
      <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg">
        <h3 className="text-xl font-semibold mb-4">Son Aktiviteler</h3>
        <p>Bu kısım geliştirilecek...</p>
      </div>
    </div>
  );

  const renderAddEgitmen = () => (
    <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg">
      <h2 className="text-2xl font-semibold mb-4">Yeni Usta Öğretici Ekle</h2>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Eğitmen Adı"
          value={newEgitmen.name}
          onChange={(e) => setNewEgitmen({ ...newEgitmen, name: e.target.value })}
          className="px-3 py-2 rounded-md text-purple-600"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={newEgitmen.password}
          onChange={(e) => setNewEgitmen({ ...newEgitmen, password: e.target.value })}
          className="px-3 py-2 rounded-md text-purple-600"
        />
        <button onClick={handleAddEgitmen} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Ekle
        </button>
      </div>
    </div>
  );

  const renderAddAday = () => (
    <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg">
      <h2 className="text-2xl font-semibold mb-4">Yeni Öğrenci Ekle</h2>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="TC Kimlik No"
          value={newAday.tcKimlik}
          onChange={(e) => setNewAday({ ...newAday, tcKimlik: e.target.value })}
          className="px-3 py-2 rounded-md text-purple-600"
        />
        <input
          type="text"
          placeholder="Aday Adı"
          value={newAday.name}
          onChange={(e) => setNewAday({ ...newAday, name: e.target.value })}
          className="px-3 py-2 rounded-md text-purple-600"
        />
        <button onClick={handleAddAday} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Ekle
        </button>
      </div>
    </div>
  );

  const renderEgitmenList = () => (
    <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg">
      <h2 className="text-2xl font-semibold mb-4">Usta Öğretici Listesi</h2>
      <ul className="space-y-2">
        {Object.entries(egitmenler).map(([key, egitmen]) => (
          <li key={key} className="flex items-center justify-between bg-white bg-opacity-10 p-2 rounded-md">
            <span><User className="inline-block mr-2" />{egitmen.name}</span>
            <button onClick={() => handleRemoveEgitmen(key)} className="text-red-500 hover:text-red-600">
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderAdayList = () => (
    <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg">
      <h2 className="text-2xl font-semibold mb-4">Öğrenci Listesi</h2>
      <ul className="space-y-2">
        {Object.entries(adaylar).map(([key, aday]) => (
          <li key={key} className="flex items-center justify-between bg-white bg-opacity-10 p-2 rounded-md">
            <span><GraduationCap className="inline-block mr-2" />{aday.name} (TC: {key})</span>
            <button onClick={() => handleRemoveAday(key)} className="text-red-500 hover:text-red-600">
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderAssignAday = () => (
    <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg">
      <h2 className="text-2xl font-semibold mb-4">Öğrenci Ata</h2>
      <div className="flex flex-col space-y-4">
        <select
          value={selectedEgitmen}
          onChange={(e) => setSelectedEgitmen(e.target.value)}
          className="px-3 py-2 rounded-md text-purple-600"
        >
          <option value="">Eğitmen Seçin</option>
          {Object.entries(egitmenler).map(([key, egitmen]) => (
            <option key={key} value={key}>{egitmen.name}</option>
          ))}
        </select>
        <select
          value={selectedAday}
          onChange={(e) => setSelectedAday(e.target.value)}
          className="px-3 py-2 rounded-md text-purple-600"
        >
          <option value="">Öğrenci Seçin</option>
          {Object.entries(adaylar).map(([key, aday]) => (
            <option key={key} value={key}>{aday.name} (TC: {key})</option>
          ))}
        </select>
        <button onClick={handleAssignAday} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Ata
        </button>
      </div>
    </div>
  );

  const renderDireksiyonDersleri = () => (
    <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg">
      <h2 className="text-2xl font-semibold mb-4">Direksiyon Dersleri</h2>
      {Object.entries(egitmenler).map(([egitmenKey, egitmen]) => (
        <div key={egitmenKey} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{egitmen.name}</h3>
          <ul className="space-y-2">
            {egitmen.adaylar && Object.keys(egitmen.adaylar).map((adayKey) => (
              <li key={adayKey} className="bg-white bg-opacity-10 p-2 rounded-md">
                {adaylar[adayKey]?.name} (TC: {adayKey})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Briefcase className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Kurum Sahibi Paneli</h1>
          </div>
          <button onClick={onLogout} className="bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
            Çıkış Yap
          </button>
        </header>
        
        <nav className="mb-8">
          <ul className="flex flex-wrap space-x-4 space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'}`}
              >
                <Settings className="inline-block mr-2" />
                Gösterge Paneli
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('addEgitmen')}
                className={`px-4 py-2 rounded-md ${activeTab === 'addEgitmen' ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'}`}
              >
                <Plus className="inline-block mr-2" />
                Yeni Usta Öğretici Ekle
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('addAday')}
                className={`px-4 py-2 rounded-md ${activeTab === 'addAday' ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'}`}
              >
                <Plus className="inline-block mr-2" />
                Yeni Öğrenci Ekle
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('egitmenList')}
                className={`px-4 py-2 rounded-md ${activeTab === 'egitmenList' ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'}`}
              >
                <List className="inline-block mr-2" />
                Usta Öğretici Listesi
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('adayList')}
                className={`px-4 py-2 rounded-md ${activeTab === 'adayList' ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'}`}
              >
                <List className="inline-block mr-2" />
                Öğrenci Listesi
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('assignAday')}
                className={`px-4 py-2 rounded-md ${activeTab === 'assignAday' ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'}`}
              >
                <UserPlus className="inline-block mr-2" />
                Öğrenci Ata
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('direksiyonDersleri')}
                className={`px-4 py-2 rounded-md ${activeTab === 'direksiyonDersleri' ? 'bg-white text-purple-600' : 'bg-purple-600 text-white'}`}
              >
                <Car className="inline-block mr-2" />
                Direksiyon Dersleri
              </button>
            </li>
          </ul>
        </nav>
        
        <main>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'addEgitmen' && renderAddEgitmen()}
          {activeTab === 'addAday' && renderAddAday()}
          {activeTab === 'egitmenList' && renderEgitmenList()}
          {activeTab === 'adayList' && renderAdayList()}
          {activeTab === 'assignAday' && renderAssignAday()}
          {activeTab === 'direksiyonDersleri' && renderDireksiyonDersleri()}
        </main>
      </div>
    </div>
  );
};

export default KurumSahibiPage;