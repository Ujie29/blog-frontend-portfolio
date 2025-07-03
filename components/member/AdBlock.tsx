'use client'

import { useEffect } from 'react'

const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

export default function AdBlock() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsense Error', e);
    }
  }, []);

  return (
    <div className="my-6 text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseId}
        data-ad-slot="8321367165"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}