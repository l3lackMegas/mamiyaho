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