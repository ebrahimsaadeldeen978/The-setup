import { RacketNode } from '../types/dashboard';

/**
 * Determines whether a given map pin / location represents an active client or contracted entity.
 * (عميل حالي أو متعاقد)
 * 
 * Rules:
 * - Returns true ONLY if the pin represents a current client ("عميل حالي")
 *   or contracted party ("متعاقد" / "عقد صفقة / بناء الاتفاق").
 * - Returns false for:
 *   - null / undefined (no pin selected)
 *   - lead ("عميل محتمل")
 *   - meeting ("اجتماع عمل وتخطيط")
 *   - event ("فعاليات ومؤتمرات")
 *   - bussiness food ("مقابلة مع عميل او اماكن تواجد العميل")
 *   - relationship ("بناء علاقة")
 */
export const isClientOrContractedPin = (node: RacketNode | null | undefined): boolean => {
  if (!node) return false;

  const pinType = (node.pinType || '').toLowerCase().trim();
  const locationCategory = (node.locationCategory || '').toLowerCase().trim();
  const controllingSyndicate = (node.controllingSyndicate || '').toLowerCase().trim();
  const ringCategory = (node.ringCategory || '').toLowerCase().trim();
  const name = (node.name || '').toLowerCase().trim();
  const customIcon = (node.customIcon || '').toLowerCase().trim();

  // 1. Check for Active / Current Client (عميل حالي)
  const isCurrentClient =
    pinType === 'client' ||
    locationCategory === 'current-client' ||
    controllingSyndicate.includes('عميل حالي') ||
    ringCategory.includes('عميل حالي') ||
    name.includes('عميل حالي') ||
    customIcon === 'usercheck';

  // 2. Check for Contracted / Agreement (متعاقد / عقد صفقة / بناء الاتفاق)
  const isContracted =
    pinType === 'build the agreement' ||
    pinType === 'contract' ||
    pinType === 'contractor' ||
    pinType === 'contracted' ||
    locationCategory.includes('contract') ||
    controllingSyndicate.includes('متعاقد') ||
    controllingSyndicate.includes('عقد صفقة') ||
    controllingSyndicate.includes('بناء الاتفاق') ||
    ringCategory.includes('متعاقد') ||
    ringCategory.includes('عقد صفقة') ||
    name.includes('متعاقد') ||
    customIcon === 'handshake';

  return isCurrentClient || isContracted;
};

/**
 * Returns a human-friendly Arabic label for the selected activity type
 */
export const getPinActivityLabel = (node: RacketNode | null | undefined): string => {
  if (!node) return 'لم يتم تحديد موقع';
  
  if (isClientOrContractedPin(node)) {
    const pinType = (node.pinType || '').toLowerCase();
    if (pinType === 'build the agreement' || (node.controllingSyndicate || '').includes('متعاقد')) {
      return 'متعاقد (عقد صفقة / اتفاق ساري)';
    }
    return 'عميل حالي (نشاط تشغيلي متفاعل)';
  }

  const pinType = (node.pinType || '').toLowerCase();
  switch (pinType) {
    case 'lead':
      return 'عميل محتمل (فرصة قيد الاستكشاف)';
    case 'meeting':
      return 'اجتماع عمل وتخطيط';
    case 'event':
      return 'فعاليات ومؤتمرات';
    case 'bussiness food':
      return 'مقابلة / تواجد العميل';
    case 'relationship':
      return 'بناء علاقة مهنية';
    default:
      return node.controllingSyndicate || 'نشاط غير متفاعل';
  }
};
