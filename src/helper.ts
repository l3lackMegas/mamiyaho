export const numFormatter = (num: number) => {
    return Intl.NumberFormat('en-US', {
      notation: 'standard',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(num);
  };
  