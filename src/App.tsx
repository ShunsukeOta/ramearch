import { useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { fetchRamenShops } from './api/fetchRamen';
import { getDistanceFromLatLonInKm } from './utils/distance';
import './styles/App.css';  // ← 追加：CSS読み込み

function App() {
  const { position, updatePosition } = useGeolocation();
  const [shops, setShops] = useState<any[]>([]);
const [loading, setLoading] = useState(false);


  const handleUpdate = async () => {
    setLoading(true);
    updatePosition();
  
    setTimeout(async () => {
      try {
        if (position) {
          const data = await fetchRamenShops(position.latitude, position.longitude);
          setShops(data);
        } else {
          console.warn('まだ位置情報が取得できていません');
        }
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setLoading(false); // ← tryでもcatchでも確実に止める
      }
    }, 1000);
  };

  return (
    <div className="app-container">
      <header className="header">近ラーメン検索</header>

      <div className="shops-container">
      {/* {loading && (
  <div className="loading-indicator">
    <div className="spinner" />
    <p>近くのラーメン屋を探索中...</p>
  </div>
)} */}
  {shops.length === 0 ? (
    <p className="shops-startText" >
      下のボタンを押して近くのラーメン屋を検索！
    </p>
  ) : (
    shops.map((shop, index) => {
      // 位置情報と店舗情報から距離計算
      const distanceKm =
        position && shop.geometry && shop.geometry.location
          ? getDistanceFromLatLonInKm(
              position.latitude,
              position.longitude,
              shop.geometry.location.lat,
              shop.geometry.location.lng
            ).toFixed(2)
          : '距離不明';

      return (
        <div key={index} className="shop-card">
          {shop.photos && shop.photos.length > 0 && (
            <img
              src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${shop.photos[0].photo_reference}&key=AIzaSyAcpyH-D-WroARVMBCh_sWQUdEiF7hzRUk`}
              alt="ラーメンの写真"
              className="shop-photo"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-ramen-image.png';
              }}
            />
          )}
          <h3>{shop.name}</h3>
          <p>距離：{distanceKm} km</p>
        </div>
      );
    })
  )}
</div>


<button
  onClick={() => {
    updatePosition();
    handleUpdate();
  }}
  className={`update-button ${loading ? 'loading' : ''}`}
  disabled={loading} // ← 連打防止にもなる！
>
  {loading ? '更新中...' : '近くのラーメン屋を検索'}
</button>
    </div>
  );
}

export default App;
