export function Icon({ name, className = "icon" }: { name: string; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}

export function IconSprite() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="svg-sprite" aria-hidden="true">
      <defs>
        <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" /></symbol>
        <symbol id="i-search" viewBox="0 0 64 64"><circle cx="26" cy="25" r="17" strokeWidth="4" /><path d="m39 38 17 17" strokeWidth="7" /></symbol>
        <symbol id="i-engine" viewBox="0 0 64 64"><path d="M20 16h21l6 8h8v24H44l-7 6H20l-9-11V23h9z" fill="currentColor" stroke="none" /><path d="M4 23v22M4 33h9M26 8h17M34 8v8M58 26v19" strokeWidth="6" /></symbol>
        <symbol id="i-car" viewBox="0 0 64 64"><path d="M10 24 16 10h32l6 14 5 7v22h-8v-8H13v8H5V31z" fill="currentColor" stroke="none" /><path d="m15 25 5-11h24l5 11z" fill="#fff" stroke="none" /><path d="M21 39h22" stroke="#fff" strokeWidth="3" /><circle cx="14" cy="33" r="3.5" fill="#fff" stroke="none" /><circle cx="50" cy="33" r="3.5" fill="#fff" stroke="none" /></symbol>
        <symbol id="i-suspension" viewBox="0 0 64 64"><g transform="rotate(19 32 32)"><path d="M32 4v11M27 5h10M32 37v10" strokeWidth="5" /><path d="m22 13 20 5-20 3 20 5-20 3 20 5-20 3" strokeWidth="4.5" /><circle cx="32" cy="53" r="7" strokeWidth="5" /></g></symbol>
        <symbol id="i-headset" viewBox="0 0 64 64"><path d="M11 34v-6a21 21 0 0 1 42 0v17c0 10-8 14-17 14" strokeWidth="4" /><rect x="5" y="27" width="12" height="23" rx="6" fill="currentColor" stroke="none" /><rect x="47" y="27" width="12" height="23" rx="6" fill="currentColor" stroke="none" /><rect x="28" y="54" width="13" height="7" rx="3.5" fill="currentColor" stroke="none" /></symbol>
        <symbol id="i-truck" viewBox="0 0 64 64"><path d="M11 12h30v34H12V36h15v-5H6v-6h21v-5H11zM43 23h10l10 12v11H43z" fill="currentColor" stroke="none" /><path d="M47 26h5l7 9H47z" fill="#fff" stroke="none" /><circle cx="21" cy="48" r="6" fill="currentColor" stroke="none" /><circle cx="52" cy="48" r="6" fill="currentColor" stroke="none" /><circle cx="21" cy="48" r="2" fill="#fff" stroke="none" /><circle cx="52" cy="48" r="2" fill="#fff" stroke="none" /><path d="M3 17h16M3 39h9" strokeWidth="4" /></symbol>
        <symbol id="i-phone" viewBox="0 0 24 24"><path d="M7.1 2.4c-.6-.6-1.6-.5-2.2 0L2.5 4.8c-.7.7-.8 1.9-.5 3.1 1.7 6.6 7 11.9 13.6 13.6 1.2.3 2.4.2 3.1-.5l2.4-2.4c.6-.6.6-1.6 0-2.2l-3.4-3.3c-.5-.5-1.4-.6-2-.2l-2.2 1.6a15 15 0 0 1-5.8-5.8l1.6-2.2c.4-.6.3-1.5-.2-2z" /></symbol>
        <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 2c-2.5 2.2-6 3-9 3v6c0 5.1 3.6 8.7 9 11 5.4-2.3 9-5.9 9-11V5c-3 0-6.5-.8-9-3Z" /><path d="m8 12 2.5 2.5L16 9" /></symbol>
        <symbol id="i-users" viewBox="0 0 24 24"><circle cx="12" cy="6" r="3" /><path d="M6 21v-4a6 6 0 0 1 12 0v4zM4 10a3 3 0 1 1 2-5M20 10a3 3 0 1 0-2-5M4 13a5 5 0 0 0-3 4v4h3m16-8a5 5 0 0 1 3 4v4h-3" /></symbol>
        <symbol id="i-gear" viewBox="0 0 24 24"><path d="m9.7 2-.6 3-2 .9-2.7-1.4-2 3.4L4.7 10v2.3L2.4 14l2 3.4 2.7-1.1 2 .9.6 3h4l.6-3 2-.9 2.7 1.1 2-3.4-2.3-1.7V10L21 7.9l-2-3.4-2.7 1.4-2-.9-.6-3z" /><circle cx="11.7" cy="11.2" r="3.6" /></symbol>
        <symbol id="i-diamond" viewBox="0 0 24 24"><path d="M4 3h16l4 6-12 14L0 9zM0 9h24M8 3 5 9l7 14L19 9l-3-6M5 9l7-6 7 6" /></symbol>
        <symbol id="i-award" viewBox="0 0 24 24"><path d="m12 1.5 3.1 2.3 3.8.3 1.2 3.6 2.4 3-.9 3.7.1 3.8-3.3 1.9-2.2 3.1-3.8-.4-3.7.4-2.3-3.1-3.2-1.9.1-3.8-.9-3.7 2.4-3 1.2-3.6 3.8-.3z" transform="translate(1 0) scale(.9)" /><path d="m12 6 1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" transform="translate(2 1.5) scale(.84)" /></symbol>
        <symbol id="i-package" viewBox="0 0 24 24"><path d="m12 2 9 5v11l-9 5-9-5V7zM3 7l9 5 9-5M12 12v11" /></symbol>
        <symbol id="i-tools" viewBox="0 0 24 24"><path d="m14.8 6.3 2.5 2.5M3 21l7.5-7.5m4-3L21 4l-1-2-4 3-2-1 1-3a6 6 0 0 0-7 7L1 16a3 3 0 0 0 4 4l8-8a6 6 0 0 0 7-7M3 2l3 1 2 3-2 2-3-2zM8 8l13 13a2 2 0 0 0 2-2L10 6" /></symbol>
        <symbol id="i-file" viewBox="0 0 24 24"><path d="M14 2H5a2 2 0 0 0-2 2v17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9zM14 2v7h7M7 12h10M7 16h10M7 20h7" /></symbol>
        <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="1" /><path d="m3 5 9 8 9-8M3 19l6-6m6 0 6 6" /></symbol>
        <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="2.5" /></symbol>
        <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 5v7l4 2" /></symbol>
        <symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></symbol>
        <symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></symbol>
        <symbol id="i-up" viewBox="0 0 24 24"><path d="m6 14 6-6 6 6" /></symbol>
        <symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" /></symbol>
        <symbol id="i-facebook" viewBox="0 0 24 24"><path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" /></symbol>
        <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="currentColor" strokeWidth="2.2" /><circle cx="12" cy="12" r="4.6" fill="none" stroke="currentColor" strokeWidth="2.2" /><circle cx="17.6" cy="6.4" r="1.4" /></symbol>
        <symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M12 1a11 11 0 0 0-9.5 16.5L1 23l5.6-1.5A11 11 0 1 0 12 1Zm0 20a9 9 0 0 1-4.6-1.3l-.3-.2-3.3.9.9-3.2-.2-.3A9 9 0 1 1 12 21Zm5-6.7c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1l-.9 1.1c-.2.2-.3.2-.6.1a7.4 7.4 0 0 1-3.6-3.2c-.3-.5.3-.4.8-1.4.1-.2 0-.3 0-.4l-.9-2.1c-.2-.5-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.200c0 1.300.9 2.500 1.100 2.700.1.2 1.800 2.800 4.400 3.900 1.700.7 2.300.8 3.100.6.500-.1 1.600-.6 1.800-1.300.2-.6.2-1.200.2-1.300-.1-.1-.3-.2-.6-.3Z" /></symbol>
      </defs>
    </svg>
  );
}
