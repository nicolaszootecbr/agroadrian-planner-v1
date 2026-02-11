
import React from 'react';

export type IconName = 'home' | 'cow' | 'silo' | 'grass' | 'tractor' | 'ruler' | 'calendar' | 'area' | 'fence' | 'money' | 'document' | 'printer' | 'reset' | 'download' | 'trash';

interface IconProps {
  name: IconName;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  const icons: Record<IconName, React.ReactElement> = {
    home: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />,
    cow: <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10.25a4.125 4.125 0 01-8.25 0 4.125 4.125 0 018.25 0zm-4.125-5.625a8.625 8.625 0 11-8.625 8.625A8.63 8.63 0 0110.125 4.625zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM5.25 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />,
    silo: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M3.75 16.5h16.5M3.75 12h16.5m-16.5-4.5h16.5m0 0L12 3.75 3.75 7.5" />,
    grass: <path strokeLinecap="round" strokeLinejoin="round" d="M9.135 4.87a.75.75 0 01.09.995l-1.332 2.22a.75.75 0 00.995 1.09l2.22-1.332a.75.75 0 01.995.09l2.22 1.332a.75.75 0 001.09-.995l-1.332-2.22a.75.75 0 01.09-.995l1.332-2.22a.75.75 0 10-.995-1.09l-2.22 1.332a.75.75 0 01-.995-.09L12.553.342a.75.75 0 00-1.09.995l1.332 2.22a.75.75 0 01-.09.995L10.475 6.77a.75.75 0 00-.995-1.09L11.7 3.462a.75.75 0 01-.09-.995L10.278.247a.75.75 0 00-1.143.995l.1.13z M18 21.75c0-3.314-2.686-6-6-6s-6 2.686-6 6" />,
    tractor: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25H21m-4.5 4.5h4.5m-4.5 4.5h4.5m-15-4.5h4.5m-4.5 4.5h4.5M3 3h4.5v4.5H3V3zm13.5 0h4.5v4.5h-4.5V3zm-9 9h4.5v4.5H7.5v-4.5zm9 0h4.5v4.5h-4.5v-4.5z" />,
    ruler: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3.75v16.5M4.5 3.75h16.5M4.5 20.25H21M8.25 3.75v2.25m4.5-2.25v2.25m4.5-2.25v2.25M8.25 20.25v-2.25m4.5 2.25v-2.25m4.5 2.25v-2.25" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25m10.5-2.25v2.25M3.75 11.25h16.5M3.75 3h16.5a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25H3.75a2.25 2.25 0 01-2.25-2.25V5.25A2.25 2.25 0 013.75 3z" />,
    area: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 3H20.25M3.75 3h16.5v11.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V3z" />,
    fence: <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M3 9h18M3 13.5h18M6 4.5v15M12 4.5v15M18 4.5v15" />,
    money: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-6h6m-9-3.75h12A2.25 2.25 0 0123.25 9v6a2.25 2.25 0 01-2.25 2.25H2.25A2.25 2.25 0 010 15V9A2.25 2.25 0 012.25 6.75h19.5z" />,
    document: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    printer: <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a8.956 8.956 0 01-2.24 2.186c-1.25.96-2.24 1.912-2.24 2.186 0 .273.99 1.224 2.24 2.186a8.956 8.956 0 012.24 2.186m-.72-.096c.24.03.48.062.72.096m0 0c.24.03.48.062.72.096m-1.44 0a8.956 8.956 0 012.24-2.186c1.25-.96 2.24-1.912 2.24-2.186 0-.273-.99-1.224-2.24-2.186a8.956 8.956 0 01-2.24-2.186m1.44 0c-.24-.03-.48-.062-.72-.096m0 0c-.24-.03-.48-.062-.72-.096M3 10.5h18M3 15h18" />,
    reset: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691L7.985 5.356a8.25 8.25 0 00-11.667 0L2.985 9.348z" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.077-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />,
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      {icons[name]}
    </svg>
  );
};