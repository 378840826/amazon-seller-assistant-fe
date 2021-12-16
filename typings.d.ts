declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module 'braft-utils';
declare module 'react-lazy-load';
declare module '*.json' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
 }
