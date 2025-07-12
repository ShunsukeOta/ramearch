import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);

  const updatePosition = () => {
    if (!navigator.geolocation) {
      alert('位置情報が取得できません');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition(pos.coords),
      (err: GeolocationPositionError) => {
        console.error('位置情報取得失敗:', err.message);
        alert('位置情報の取得に失敗しました:' + err.message);
      }
    );
  };

  useEffect(() => {
    updatePosition();
  }, []);

  useEffect(() => {
    console.log('位置情報取得:', position);
  }, [position]);

  return { position, updatePosition };
};