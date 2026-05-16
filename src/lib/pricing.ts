export function calculateFinalPrice(regularPrice: number, discount: number): number {
  return Math.max(0, regularPrice - Math.max(0, discount));
}

export function calculateBalance(finalPrice: number, downPayment: number): number {
  return Math.max(0, finalPrice - Math.max(0, downPayment));
}
