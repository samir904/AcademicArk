import React, { useEffect } from 'react';

export default function AdBanner() {
  useEffect(() => {
    // Push ads
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div className="my-8 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', maxWidth: '728px' }}
        data-ad-client="ca-pub-9047304299228199"
        data-ad-slot="1234567890"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
