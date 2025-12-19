'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { API_URL } from '@/lib/api';

export default function HeaderScripts() {
    const pathname = usePathname();
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                // Public endpoint or internal if needed
                const res = await fetch(`${API_URL}/admin/config/public`);
                if (res.ok) {
                    const data = await res.json();
                    setConfig(data.data.config);
                }
            } catch (error) {
                console.error('Failed to load public config', error);
            }
        };
        loadConfig();
    }, []);

    useEffect(() => {
        if (!config) return;

        // 1. Inject custom header scripts
        if (config.header_scripts) {
            const range = document.createRange();
            const documentFragment = range.createContextualFragment(config.header_scripts);
            document.head.appendChild(documentFragment);
        }

        // 2. Initialize FB Pixel if ID exists
        if (config.fb_pixel_id) {
            const pixelScript = `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${config.fb_pixel_id}');
                fbq('track', 'PageView');
            `;
            const script = document.createElement('script');
            script.innerHTML = pixelScript;
            document.head.appendChild(script);

            // noscript fallback
            const noscript = document.createElement('noscript');
            noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${config.fb_pixel_id}&ev=PageView&noscript=1" />`;
            document.head.appendChild(noscript);
        }
    }, [config]);

    // Track PageView on route change if pixel active
    useEffect(() => {
        if (config?.fb_pixel_id && (window as any).fbq) {
            (window as any).fbq('track', 'PageView');
        }
    }, [pathname, config]);

    return null;
}
