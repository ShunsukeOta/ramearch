import { useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { fetchRamenShops } from './api/fetchRamen';
import { getDistanceFromLatLonInKm } from './utils/distance';
import './styles/App.css';

import { ShopCard } from './components/ShopCard';



const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // 自分のAPIキーに差し替えてね！
console.log(apiKey)

function App() {
  const { position, updatePosition } = useGeolocation();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updatePosition();
      if (position) {
        const data = await fetchRamenShops(position.latitude, position.longitude);
        const sorted = data.map((shop: any) => {
          const shopLat = shop.geometry?.location?.lat;
          const shopLng = shop.geometry?.location?.lng;
          const distance = (shopLat && shopLng)
            ? getDistanceFromLatLonInKm(position.latitude, position.longitude, shopLat,shopLng)
            : Infinity;
            return { ...shop, distance };
          })
          .sort((a:any, b: any) => a.distance - b.distance)
          .slice(0, 5);
        setShops(sorted);
      } else {
        console.warn('位置情報がまだありません');
      }
    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">近ラーメン検索 ver0.1</header>
      <div className="shops-container">
        {!loading && shops.length === 0 && (
          <p className="shops-startText">下のボタンを押して<br />近くのラーメン屋を検索できます。</p>
        )}
        {!loading && shops.length > 0 && shops.map((shop, index) => (
          <ShopCard key={index} shop={shop} position={position} />
        ))}
      </div>
      <button   
        onClick={handleUpdate}
        className={`update-button ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {loading ? '更新中...' : '近くのラーメン屋を検索'}
      </button>
    </div>
  );
}
export default App;
