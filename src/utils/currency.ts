export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined) {
    return 'N/A';
  }

  // Using French locale for formatting, common in CFA regions
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF', // XAF is the ISO code for CFA Franc
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // The formatter might add 'FCFA' or a symbol. We'll standardize it.
  // e.g., '1.000 XAF' -> '1,000 FCFA'
  return formatter.format(amount).replace('XAF', 'FCFA').replace(/\s/g, ' ');
};
