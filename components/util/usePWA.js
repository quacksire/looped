import { useState, useEffect } from 'react';

export function usePWA() {
    const [inPwa, setInPwa] = useState(false);
    useEffect(() => {
            if (window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: window-controls-overlay)').matches) {
                setInPwa(true);
            } else {
                setInPwa(false);
            }

        window.addEventListener('DOMContentLoaded', () => {
            window.matchMedia('(display-mode: standalone)')
                .addListener(event => {
                    if (event.matches) {
                        // From browser to standalone
                        setInPwa(true);
                    } else {
                        // From standalone to browser
                        setInPwa(false);
                    }
                });

            window.matchMedia('(display-mode: window-controls-overlay)')
                .addListener(event => {
                    if (event.matches) {
                        // From browser to standalone
                        setInPwa(true);
                    } else {
                        // From standalone to browser
                        setInPwa(false);
                    }
                });
        });


    }, [])
    return inPwa;
}

