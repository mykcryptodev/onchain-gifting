export const round = (value: number) => {
  // if the amount is in the quadrillions, show "xQ"
  if (value >= 1000000000000000) {
    return `${(value / 1000000000000000).toFixed(1)}Q`;
  }
  // if the amount is in the trillions, show "xT" 
  if (value >= 1000000000000) {
    return `${(value / 1000000000000).toFixed(1)}T`;
  }
  // if the amount is in the billions, show "xB"
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  // if the amount is in the millions, show "xM"
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  // if the amount is more than 1000, show "xK"
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(2);
};
