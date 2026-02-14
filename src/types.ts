export type ContainerType = 'bottle' | 'pouch' | 'sachet' | 'bucket';
export type ProductType = 'liquid' | 'viscous' | 'dry' | 'powder';
export type ClosureType = 'screw' | 'ropp' | 'cork' | 't-cork' | 'press-on' | 'twist-off' | 'dropper' | 'heat-seal' | 'spout-cap' | 'none';
export type AutomationLevel = 'semi' | 'full';
export type Industry = 'food' | 'beverage' | 'wine-spirits' | 'cosmetics' | 'pharma' | 'chemicals' | 'home-care';

export interface Machine {
  id: string;
  name: string;
  manufacturer: string;
  sku: string;
  price: string;
  url: string;
  description: string;
  containerTypes: ContainerType[];
  productTypes: ProductType[];
  handlesChunks: boolean;
  handlesFoamy: boolean; // diving nozzle option
  atexAvailable: boolean;
  heatedAvailable: boolean;
  closureTypes: ClosureType[];
  fillVolumeMin: number; // ml
  fillVolumeMax: number; // ml
  throughputMin: number; // units/hr
  throughputMax: number; // units/hr
  automationLevel: AutomationLevel;
  isAccessory: boolean;
  nitrogenAvailable: boolean;
  rinsingAvailable: boolean;
  labelingAvailable: boolean;
  datePrintingAvailable: boolean;
  keySpecs: string[]; // bullet points for the card
  pouchSubtype?: 'pre-made' | 'form-fill-seal' | 'spouted' | 'any';
}

export interface WizardState {
  // Step 1: Container
  containerType: ContainerType | null;
  // Step 2: Product
  productType: ProductType | null;
  hasChunks: boolean;
  isFoamy: boolean;
  isCombustible: boolean;
  industry: Industry | null;
  // Step 3: Container details
  fillVolumeMin: number | null;
  fillVolumeMax: number | null;
  bottleMaterial: string | null;
  pouchStyle: 'pre-made' | 'form-fill-seal' | null;
  hasSpouted: boolean;
  // Step 4: Closure
  closureType: ClosureType | null;
  needsCapping: boolean;
  // Step 5: Production
  throughputTarget: number | null;
  automationLevel: AutomationLevel | null;
  // Step 6: Extras
  wantsNitrogen: boolean;
  wantsRinsing: boolean;
  wantsLabeling: boolean;
  wantsDatePrinting: boolean;
  wantsHeated: boolean;
  // Step 7: Contact
  contactName: string;
  contactCompany: string;
  contactEmail: string;
  contactPhone: string;
  contactNotes: string;
}

export const INITIAL_STATE: WizardState = {
  containerType: null,
  productType: null,
  hasChunks: false,
  isFoamy: false,
  isCombustible: false,
  industry: null,
  fillVolumeMin: null,
  fillVolumeMax: null,
  bottleMaterial: null,
  pouchStyle: null,
  hasSpouted: false,
  closureType: null,
  needsCapping: true,
  throughputTarget: null,
  automationLevel: null,
  wantsNitrogen: false,
  wantsRinsing: false,
  wantsLabeling: false,
  wantsDatePrinting: false,
  wantsHeated: false,
  contactName: '',
  contactCompany: '',
  contactEmail: '',
  contactPhone: '',
  contactNotes: '',
};
