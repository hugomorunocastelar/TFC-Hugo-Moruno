import React, { useState, useEffect } from 'react';
import "./Ads.css";
import ad1 from "/ads/ad1.png";
import ad2 from "/ads/ad2.png";
import ad3 from "/ads/ad3.png";
import ad4 from "/ads/ad4.png";

const images = [ ad1, ad2, ad3, ad4 ];

function Ads() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  function nextAd() {
    setCurrent((prev) => (prev + 1) % images.length);
  }

  return (
    <div className='Ads-Panel infoPanel' onClick={nextAd}>
      <img src={images[current]} alt={`Anuncio ${current + 1}`} />
    </div>
  );
}

export default Ads;
