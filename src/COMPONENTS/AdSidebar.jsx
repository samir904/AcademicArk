import React, { useEffect } from 'react';

export default function AdSidebar() {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div className="hidden lg:block sticky top-20">
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '300px',
          height: '600px'
        }}
        data-ad-client="ca-pub-9047304299228199"
        data-ad-slot="0987654321"
        data-ad-format="vertical"
      ></ins>
    </div>
  );
}
