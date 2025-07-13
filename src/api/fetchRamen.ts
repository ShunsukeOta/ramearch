export const fetchRamenShops = async (lat: number, lng: number) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // 自分のAPIキーに差し替えてね！
    const radius = 1500; // 1.5km
    const keyword = 'ラーメン';
    const type = 'restaurant';
  
    // const proxy = 'https://cors-anywhere.herokuapp.com/';
    const proxy = 'https://ramearch.ootsnsk.workers.dev/?url=';

    const targetUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&keyword=${keyword}&key=${apiKey}`;

    const res = await fetch(proxy + encodeURIComponent(targetUrl));
  
    if (!res.ok) throw new Error('API取得に失敗');
  
    const data = await res.json();
    return data.results.slice(0, 5); // 上位5件のみ
  };