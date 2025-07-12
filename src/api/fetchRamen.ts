export const fetchRamenShops = async (lat: number, lng: number) => {
    const apiKey = 'AIzaSyAcpyH-D-WroARVMBCh_sWQUdEiF7hzRUk'; // 自分のAPIキーに差し替えてね！
    const radius = 1500; // 1.5km
    const keyword = 'ラーメン';
    const type = 'restaurant';
  
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&keyword=${keyword}&key=${apiKey}`;
  
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const res = await fetch(proxy + url);
  
    if (!res.ok) throw new Error('API取得に失敗');
  
    const data = await res.json();
    return data.results.slice(0, 5); // 上位5件のみ
  };