export const numFormatter = (num: number) => {
  return Intl.NumberFormat('en-US', {
    notation: 'standard',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(num);
};
  
export const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isMobileOrTablet(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || 
    (navigator.maxTouchPoints > 1)
  );
};