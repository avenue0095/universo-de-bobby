/* ===== O Universo de Bobby — aplicativo ===== */
const $=s=>document.querySelector(s);
const CHAVE='trilha-matematica-v1';
const IC={
 certo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.6 9.4 17.5 19.5 7"/></svg>',
 fogo:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 3.2-1.3 4.6-2.7 6C7.7 9.6 6 11.2 6 14a6 6 0 0 0 12 0c0-2.4-1.2-4-2.3-5.4-.7 1-1.5 1.5-2.2 1.5.8-2.6.4-5.6-1.5-8Z"/></svg>',
 moeda:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="6.6" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1.6"/><path d="M13.4 8.2h-3.2v2.6h2.8v1.9h-2.8v3.1H8.3V6.3h5.1Z" fill="rgba(0,0,0,.35)"/></svg>',
 coracao:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.6 3.9 12.8A5 5 0 0 1 12 7.1a5 5 0 0 1 8.1 5.7L12 20.6Z"/></svg>',
 estrela:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.6 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9L12 2.6Z"/></svg>',
 cadeado:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10V8a5 5 0 0 0-10 0v2H5v11h14V10h-2ZM9 8a3 3 0 0 1 6 0v2H9V8Z"/></svg>',
 lampada:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2ZM9 19h6v1.5a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 20.5V19Z"/></svg>',
 falar:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.5-1.3a1 1 0 0 0-1.4 1.4 4 4 0 0 1 0 5.8 1 1 0 1 0 1.4 1.4 6 6 0 0 0 0-8.6Z"/></svg>',
 somOff:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4Zm17 .9-1.4-1.4L17 11.1l-2.6-2.6L13 9.9l2.6 2.6L13 15.1l1.4 1.4 2.6-2.6 2.6 2.6 1.4-1.4-2.6-2.6L21 9.9Z"/></svg>',
 bandeira:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v20h2v-8h11l-3-4 3-4H8V2Z"/></svg>',
 quadro:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="m5.5 17 4-5 3 3.5L16 10.5l2.6 6.5"/><circle cx="8.6" cy="9" r="1.6" fill="currentColor" stroke="none"/></svg>',
 apagar:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 4 2 12l7 8h13V4Zm10.6 10.2-1.4 1.4L15.5 13l-2.7 2.6-1.4-1.4L14 11.5l-2.6-2.7 1.4-1.4L15.5 10l2.7-2.6 1.4 1.4L17 11.5Z"/></svg>',
 lapis:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 17.2V20h2.8L17 9.8 14.2 7 4 17.2ZM19.7 7.3a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0L15.3 5.7 18.3 8.7l1.4-1.4Z"/></svg>',
 impressora:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7" rx="1"/></svg>',
 baixar:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.2l3.6-3.6 1.4 1.4-6 6-6-6 1.4-1.4L10 13.2V3ZM4 19h16v2H4Z"/></svg>',
 lixo:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 21h10l1-14H6ZM9 3h6l1 2h4v2H4V5h4Z"/></svg>',
 volta:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/></svg>',
 medalha:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 2 6 8h4l1.2-6Zm7 0L18 8h-4l-1.2-6Z" opacity=".65"/><circle cx="12" cy="15" r="7.2"/><path d="m12 10.6 1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5Z" fill="rgba(0,0,0,.3)"/></svg>'
};

