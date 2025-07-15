import { useCreateProductStore } from "./create-product-store";

export enum Tabs {
  BASIC_INFORMATION = "BASIC_INFORMATION",
  CATEGORIES = "CATEGORIES",
  MEDIA = "MEDIA",
  INVENTORY = "INVENTORY",
  PRICING = "PRICING",
  ADDITIONAL = "ADDITIONAL",
  SUMMARY = "SUMMARY"
}

// Map enum values to display names
export const TAB_NAMES: Record<Tabs, string> = {
  [Tabs.BASIC_INFORMATION]: "Basic Information",
  [Tabs.CATEGORIES]: "Categories",
  [Tabs.MEDIA]: "Media",
  [Tabs.INVENTORY]: "Inventory",
  [Tabs.PRICING]: "Pricing",
  [Tabs.ADDITIONAL]: "Additional",
  [Tabs.SUMMARY]: "Summary"
};

// Map enum values to indices for store usage
export const TAB_INDICES: Record<Tabs, number> = {
  [Tabs.BASIC_INFORMATION]: 0,
  [Tabs.CATEGORIES]: 1,
  [Tabs.MEDIA]: 2,
  [Tabs.INVENTORY]: 3,
  [Tabs.PRICING]: 4,
  [Tabs.ADDITIONAL]: 5,
  [Tabs.SUMMARY]: 6
};

// Map indices back to enum values
export const INDICES_TO_TAB: Record<number, Tabs> = {
  0: Tabs.BASIC_INFORMATION,
  1: Tabs.CATEGORIES,
  2: Tabs.MEDIA,
  3: Tabs.INVENTORY,
  4: Tabs.PRICING,
  5: Tabs.ADDITIONAL,
  6: Tabs.SUMMARY
};

// Get tab indices by tab name
export const getTabIndexByName = (tab: Tabs): number => {
  return TAB_INDICES[tab];
};

export const getTabByIndex = (index: number): Tabs => {
  return INDICES_TO_TAB[index] || Tabs.BASIC_INFORMATION;
};

// Get display name for a tab
export const getTabName = (tab: Tabs): string => {
  return TAB_NAMES[tab];
};

// Get the current active tab as an enum value
export const getActiveTab = (): Tabs => {
  const { activeTab } = useCreateProductStore.getState();
  return INDICES_TO_TAB[activeTab] || Tabs.BASIC_INFORMATION;
};

// Set the active tab using an enum value
export const setActiveTab = (tab: Tabs): void => {
  const { setActiveTab } = useCreateProductStore.getState();
  setActiveTab(TAB_INDICES[tab]);
};

// Get all tabs as an array for iteration
export const getAllTabs = (): Tabs[] => {
  return Object.values(Tabs);
};

// Use active tab hook for client components that can get immediate updates for active tab
export const useActiveTab = (): Tabs => {
  const { activeTab } = useCreateProductStore();
  return getTabByIndex(activeTab);
};

export const switchToNextTab = (): void => {
  const { activeTab } = useCreateProductStore.getState();
  const nextTab = getTabByIndex(activeTab + 1);
  setActiveTab(nextTab);
};

export const getTabStatus = (tab: Tabs): "valid" | "pending" | "invalid" => {
  const { basicInformation, media, inventory, pricing, additional } =
    useCreateProductStore.getState();

  switch (tab) {
    case Tabs.BASIC_INFORMATION:
      return basicInformation.status;
    case Tabs.MEDIA:
      return media.status;
    case Tabs.INVENTORY:
      return inventory.status;
    case Tabs.PRICING:
      return pricing.status;
    case Tabs.ADDITIONAL:
      return additional.status;
    default:
      return "pending";
  }
};

/*
  - Generate SKU from product name
  - A Product have two types of SKUs:
    - Main SKU: The main SKU for the product
    - Variant SKUs: SKUs for each variant of the product

  - SKU Example:
    Product Name: "Apple iPhone 14 Pro Max"
    Main SKU: "IPHONE-14-PRO-MAX"
    Variant SKUs:
    - Color: "IPHONE-14-PRO-MAX-C-BLACK", "IPHONE-14-PRO-MAX-C-WHITE"

  * Always should be in uppercase
  * For variants, append the variant type's first letter and value to the end of main SKU
*/
export const generateSku = (
  productName: string,
  variantType?: string,
  variantValue?: string
): string => {
  // Normalize product name to uppercase and replace spaces with dashes
  const baseSku = productName.toUpperCase().replace(/\s+/g, "-");

  if (variantType && variantValue) {
    // Append variant type and value to the SKU
    return `${baseSku}-${variantType.charAt(0).toUpperCase()}-${variantValue.toUpperCase()}`;
  }

  return baseSku;
};
