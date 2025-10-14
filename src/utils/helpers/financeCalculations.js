// utils/helpers/financeCalculations.js

/**
 * Calculate total expenses from AP record
 * Sums up all expense fields from accounts payable
 */
export const calculateTotalExpenses = (apRecord) => {
  if (!apRecord) return 0;

  let total = 0;

  // Freight
  total += parseFloat(apRecord.freight_amount || 0);

  // Trucking
  total += parseFloat(apRecord.trucking_origin_amount || 0);
  total += parseFloat(apRecord.trucking_dest_amount || 0);

  // Port charges
  total += parseFloat(apRecord.crainage_amount || 0);
  total += parseFloat(apRecord.arrastre_origin_amount || 0);
  total += parseFloat(apRecord.arrastre_dest_amount || 0);
  total += parseFloat(apRecord.wharfage_origin_amount || 0);
  total += parseFloat(apRecord.wharfage_dest_amount || 0);
  total += parseFloat(apRecord.labor_origin_amount || 0);
  total += parseFloat(apRecord.labor_dest_amount || 0);

  // Misc charges
  total += parseFloat(apRecord.rebates_amount || 0);
  total += parseFloat(apRecord.storage_amount || 0);
  total += parseFloat(apRecord.facilitation_amount || 0);
  total += parseFloat(apRecord.denr_amount || 0);

  return total;
};

/**
 * Calculate BIR (12% tax on total expenses)
 */
export const calculateBIR = (apRecord) => {
  const totalExpenses = calculateTotalExpenses(apRecord);
  return totalExpenses * 0.12;
};

/**
 * Calculate total expenses including BIR
 */
export const calculateTotalWithBIR = (apRecord) => {
  return calculateTotalExpenses(apRecord) + calculateBIR(apRecord);
};

/**
 * Calculate net revenue
 * Formula: Amount Paid - Total Expenses (with BIR)
 */
export const calculateNetRevenue = (arRecord, apRecord) => {
  const amountPaid = parseFloat(arRecord?.amount_paid || 0);
  const totalExpenses = calculateTotalWithBIR(apRecord);
  return amountPaid - totalExpenses;
};

/**
 * Calculate net revenue percentage
 * Formula: (Net Revenue / Amount Paid) * 100
 */
export const calculateNetRevenuePercent = (arRecord, apRecord) => {
  const amountPaid = parseFloat(arRecord?.amount_paid || 0);
  if (amountPaid === 0) return 0;

  const netRevenue = calculateNetRevenue(arRecord, apRecord);
  return (netRevenue / amountPaid) * 100;
};