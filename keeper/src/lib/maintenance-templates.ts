export const MAINTENANCE_TEMPLATES = [
  {
    id: 'hvac-filter',
    name: 'HVAC Filter Replacement',
    description: 'Replace air filter for heating/cooling system',
    category: 'HVAC',
    frequency: 'MONTHLY',
  },
  {
    id: 'smoke-detector',
    name: 'Smoke Detector Battery Check',
    description: 'Test and replace batteries in smoke detectors',
    category: 'GENERAL',
    frequency: 'ANNUAL',
  },
  {
    id: 'water-heater',
    name: 'Water Heater Flush',
    description: 'Drain and flush water heater to remove sediment',
    category: 'PLUMBING',
    frequency: 'ANNUAL',
  },
  {
    id: 'gutter-cleaning',
    name: 'Gutter Cleaning',
    description: 'Clean gutters and downspouts',
    category: 'YARD',
    frequency: 'SEMI_ANNUAL',
  },
  {
    id: 'furnace-inspection',
    name: 'Furnace Inspection',
    description: 'Professional furnace inspection and tuneup',
    category: 'HVAC',
    frequency: 'ANNUAL',
  },
];

export const ITEM_CATEGORIES = [
  { value: 'APPLIANCE', label: 'Appliances' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'HOME_GOODS', label: 'Home Goods' },
  { value: 'TOOLS', label: 'Tools' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'OTHER', label: 'Other' },
];

export const TASK_CATEGORIES = [
  { value: 'HVAC', label: 'HVAC' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'YARD', label: 'Yard' },
  { value: 'GENERAL', label: 'General' },
  { value: 'CUSTOM', label: 'Custom' },
];

export const DOCUMENT_TYPES = [
  { value: 'DRIVERS_LICENSE', label: 'Driver\'s License' },
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'CAR_REGISTRATION', label: 'Car Registration' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'PROFESSIONAL_LICENSE', label: 'Professional License' },
  { value: 'SUBSCRIPTION', label: 'Subscription' },
  { value: 'OTHER', label: 'Other' },
];

export const FREQUENCY_OPTIONS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'SEMI_ANNUAL', label: 'Semi-Annual' },
  { value: 'ANNUAL', label: 'Annual' },
  { value: 'CUSTOM', label: 'Custom' },
];


