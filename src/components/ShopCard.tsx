// src/components/ShopCard.tsx
import React from 'react';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // 自分のAPIキーに差し替えてね！

type Shop = {
  name: string;
  photos?: { photo_reference: string }[];
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
  distance?: number;
};

type Props = {
  shop: Shop;
  position: { latitude: number; longitude: number } | null;
};

export const ShopCard: React.FC<Props> = ({ shop, position }) => {
  const shopLat = shop.geometry?.location?.lat;
  const shopLng = shop.geometry?.location?.lng;
  const distanceKm = shop.distance?.toFixed(2) ?? '距離不明';

  const directionsUrl =
    position && shopLat && shopLng
      ? `https://www.google.com/maps/dir/?api=1&origin=${position.latitude},${position.longitude}&destination=${shopLat},${shopLng}`
      : null;

  return (
    <div className="shop-card">
      {shop.photos && shop.photos.length > 0 && (
        <img
          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${shop.photos[0].photo_reference}&key=${apiKey}`}
          alt="ラーメンの写真"
          className="shop-photo"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/default-ramen-image.png';
          }}
        />
      )}
      <h3>{shop.name}</h3>
      <p>距離：{distanceKm} km</p>
      {directionsUrl && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="directions-link"
        >
          現在地からの道順
        </a>
      )}
    </div>
  );
};
