"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { applyBrandCssVars } from "@/lib/theme";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import type { CustomContactField, SectionId } from "@/types/contact";
import { DEFAULT_SECTION_ORDER, SECTION_IDS } from "@/types/contact";

const DEFAULT_BRAND = "#003366";
const DEFAULT_SECONDARY = "#5bb5b0";

export const SECTION_ORDER_EVENT = "section-order-changed";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function migrateStaleSectionOrder() {
  if (typeof window === "undefined") return;
  const ts = localStorage.getItem(STORAGE_KEYS.stateTimestamp);
  const now = Date.now();
  if (ts && now - parseInt(ts, 10) > 24 * 60 * 60 * 1000) {
    localStorage.removeItem(STORAGE_KEYS.sectionOrder);
  }
}

function useDemoConfigState() {
  const [appTitle, setAppTitle] = useState("Reapit Property Management");
  const [companyName, setCompanyName] = useState("Your Company");
  const [brandColor, setBrandColor] = useState(DEFAULT_BRAND);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_SECONDARY);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [sectionOrder, setSectionOrder] =
    useState<SectionId[]>(DEFAULT_SECTION_ORDER);
  const [visibleSections, setVisibleSections] = useState<
    Record<SectionId, boolean>
  >(() =>
    Object.fromEntries(SECTION_IDS.map((id) => [id, true])) as Record<
      SectionId,
      boolean
    >,
  );
  const [customContactFields, setCustomContactFields] = useState<
    CustomContactField[]
  >([]);
  const [caseOverridesRaw, setCaseOverridesRaw] = useState("");

  const hydrate = useCallback(() => {
    migrateStaleSectionOrder();
    setAppTitle(
      localStorage.getItem(STORAGE_KEYS.appTitle) ??
      "Reapit Property Management",
    );
    setCompanyName(
      localStorage.getItem(STORAGE_KEYS.companyName) ?? "Your Company",
    );
    setBrandColor(
      localStorage.getItem(STORAGE_KEYS.brandColor) ?? DEFAULT_BRAND,
    );
    setSecondaryColor(
      localStorage.getItem(STORAGE_KEYS.secondaryColor) ?? DEFAULT_SECONDARY,
    );
    setLogoUrl(localStorage.getItem(STORAGE_KEYS.logoUrl));
    const order = readJson<SectionId[] | null>(
      STORAGE_KEYS.sectionOrder,
      null,
    );
    setSectionOrder(
      order?.length
        ? order.filter((id) => SECTION_IDS.includes(id))
        : DEFAULT_SECTION_ORDER,
    );
    const vis = readJson<Partial<Record<SectionId, boolean>> | null>(
      STORAGE_KEYS.visibleSections,
      null,
    );
    if (vis) {
      setVisibleSections({
        ...Object.fromEntries(SECTION_IDS.map((id) => [id, true])),
        ...vis,
      } as Record<SectionId, boolean>);
    }
    setCustomContactFields(
      readJson<CustomContactField[]>(STORAGE_KEYS.customContactFields, []),
    );
    setCaseOverridesRaw(
      localStorage.getItem(STORAGE_KEYS.caseOverrides) ?? "",
    );
  }, []);

  useEffect(() => {
    queueMicrotask(() => hydrate());
  }, [hydrate]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    applyBrandCssVars(
      document.documentElement,
      brandColor,
      secondaryColor,
    );
  }, [brandColor, secondaryColor]);

  useEffect(() => {
    const onOrder = (e: Event) => {
      const ce = e as CustomEvent<{ order: SectionId[] }>;
      if (ce.detail?.order) setSectionOrder(ce.detail.order);
    };
    window.addEventListener(SECTION_ORDER_EVENT, onOrder);
    return () => window.removeEventListener(SECTION_ORDER_EVENT, onOrder);
  }, []);

  const saveToStorage = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.appTitle, appTitle);
    localStorage.setItem(STORAGE_KEYS.companyName, companyName);
    localStorage.setItem(STORAGE_KEYS.brandColor, brandColor);
    localStorage.setItem(STORAGE_KEYS.secondaryColor, secondaryColor);
    if (logoUrl) localStorage.setItem(STORAGE_KEYS.logoUrl, logoUrl);
    else localStorage.removeItem(STORAGE_KEYS.logoUrl);
    localStorage.setItem(
      STORAGE_KEYS.sectionOrder,
      JSON.stringify(sectionOrder),
    );
    localStorage.setItem(
      STORAGE_KEYS.visibleSections,
      JSON.stringify(visibleSections),
    );
    localStorage.setItem(
      STORAGE_KEYS.customContactFields,
      JSON.stringify(customContactFields),
    );
    localStorage.setItem(STORAGE_KEYS.caseOverrides, caseOverridesRaw);
    localStorage.setItem(STORAGE_KEYS.stateTimestamp, String(Date.now()));
    window.dispatchEvent(
      new CustomEvent(SECTION_ORDER_EVENT, { detail: { order: sectionOrder } }),
    );
  }, [
    appTitle,
    brandColor,
    caseOverridesRaw,
    companyName,
    customContactFields,
    logoUrl,
    secondaryColor,
    sectionOrder,
    visibleSections,
  ]);

  return {
    appTitle,
    setAppTitle,
    companyName,
    setCompanyName,
    brandColor,
    setBrandColor,
    secondaryColor,
    setSecondaryColor,
    logoUrl,
    setLogoUrl,
    sectionOrder,
    setSectionOrder,
    visibleSections,
    setVisibleSections,
    customContactFields,
    setCustomContactFields,
    caseOverridesRaw,
    setCaseOverridesRaw,
    saveToStorage,
    hydrate,
  };
}

export type DemoConfigState = ReturnType<typeof useDemoConfigState>;

const DemoConfigContext = createContext<DemoConfigState | null>(null);

export function DemoConfigProvider({ children }: { children: ReactNode }) {
  const value = useDemoConfigState();
  return (
    <DemoConfigContext.Provider value={value}>
      {children}
    </DemoConfigContext.Provider>
  );
}

export function useDemoConfig(): DemoConfigState {
  const ctx = useContext(DemoConfigContext);
  if (!ctx) {
    throw new Error("useDemoConfig must be used within DemoConfigProvider");
  }
  return ctx;
}
