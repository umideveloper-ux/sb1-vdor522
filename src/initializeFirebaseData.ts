import { database, auth } from './firebase';
import { ref, set, get } from 'firebase/database';
import { signInWithEmailAndPassword } from 'firebase/auth';

const initializeFirebaseData = async () => {
  try {
    // Firebase Authentication ile oturum aç
    await signInWithEmailAndPassword(auth, 'hasimdoganisik@gmail.com', '3161285');

    // Check if data already exists
    const dataRef = ref(database, '/');
    const snapshot = await get(dataRef);
    
    if (snapshot.exists()) {
      console.log('Data already initialized');
      return;
    }

    // Eğitmenler için örnek veriler
    const egitmenler = {
      'AliKaya': {
        name: 'Ali Kaya',
        password: 'alipass123'
      },
      'ElifGocmenOzdogan': {
        name: 'Elif Göçmen Özdoğan',
        password: 'elifpass123'
      },
      'KazimBerkup': {
        name: 'Kazim Berkup',
        password: 'kazimpass123'
      }
    };

    // Adaylar için örnek veriler
    const adaylar = {
      '12345678901': {
        name: 'Ahmet Yılmaz'
      },
      '23456789012': {
        name: 'Ayşe Demir'
      },
      '34567890123': {
        name: 'Mehmet Kaya'
      }
    };

    // Verileri Firebase'e yazma
    await set(ref(database, 'egitmenler'), egitmenler);
    await set(ref(database, 'adaylar'), adaylar);

    console.log('Veriler başarıyla Firebase\'e eklendi.');
  } catch (error: any) {
    console.error('Veri eklenirken hata oluştu:', error.message);
    if (error.code === 'PERMISSION_DENIED') {
      throw new Error('Veritabanına erişim izni reddedildi. Lütfen yöneticinize başvurun.');
    } else {
      throw error;
    }
  }
};

export default initializeFirebaseData;