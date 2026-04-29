import type { DemoAdminConfigPayload } from "@/lib/api/demoAdminConfigPayloadSchema";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import type { CustomObjectDefinition, SectionId } from "@/types/contact";
import { DEFAULT_SECTION_ORDER, SECTION_IDS } from "@/types/contact";

export function mirrorDemoAdminPayloadToLocalStorage(
  p: DemoAdminConfigPayload,
): void {
  localStorage.setItem(STORAGE_KEYS.appTitle, p.appTitle);
  localStorage.setItem(STORAGE_KEYS.companyName, p.companyName);
  localStorage.setItem(STORAGE_KEYS.brandColor, p.brandColor);
  localStorage.setItem(STORAGE_KEYS.secondaryColor, p.secondaryColor);
  if (p.logoUrl) localStorage.setItem(STORAGE_KEYS.logoUrl, p.logoUrl);
  else localStorage.removeItem(STORAGE_KEYS.logoUrl);
  localStorage.setItem(
    STORAGE_KEYS.sectionOrder,
    JSON.stringify(p.sectionOrder),
  );
  localStorage.setItem(
    STORAGE_KEYS.visibleSections,
    JSON.stringify(p.visibleSections),
  );
  localStorage.setItem(
    STORAGE_KEYS.customObjectDefinitions,
    JSON.stringify(p.customObjectDefinitions),
  );
  localStorage.setItem(
    STORAGE_KEYS.customObjectOrder,
    JSON.stringify(p.customObjectOrder),
  );
  localStorage.setItem(
    STORAGE_KEYS.visibleCustomObjects,
    JSON.stringify(p.visibleCustomObjects),
  );
  localStorage.setItem(STORAGE_KEYS.stateTimestamp, String(Date.now()));
}

export type DemoAdminConfigSetters = {
  setAppTitle: (v: string) => void;
  setCompanyName: (v: string) => void;
  setBrandColor: (v: string) => void;
  setSecondaryColor: (v: string) => void;
  setLogoUrl: (v: string | null) => void;
  setSectionOrder: (v: SectionId[]) => void;
  setVisibleSections: (v: Record<SectionId, boolean>) => void;
  setCustomObjectDefinitions: (v: CustomObjectDefinition[]) => void;
  setCustomObjectOrder: (v: string[]) => void;
  setVisibleCustomObjects: (v: Record<string, boolean>) => void;
};

/** Apply validated payload to React state (same merge rules as local hydrate). Returns merged section order. */
export function applyDemoAdminPayloadToState(
  p: DemoAdminConfigPayload,
  s: DemoAdminConfigSetters,
): SectionId[] {
  s.setAppTitle(p.appTitle);
  s.setCompanyName(p.companyName);
  s.setBrandColor(p.brandColor);
  s.setSecondaryColor(p.secondaryColor);
  s.setLogoUrl(p.logoUrl);

  const filtered = p.sectionOrder.filter((id): id is SectionId =>
    (SECTION_IDS as readonly string[]).includes(id),
  );
  const mergedSectionOrder: SectionId[] =
    filtered.length ? [...filtered] : [...DEFAULT_SECTION_ORDER];
  for (const id of SECTION_IDS) {
    if (!mergedSectionOrder.includes(id)) mergedSectionOrder.push(id);
  }
  s.setSectionOrder(mergedSectionOrder);

  s.setVisibleSections({
    ...Object.fromEntries(SECTION_IDS.map((id) => [id, true])),
    ...p.visibleSections,
  } as Record<SectionId, boolean>);

  const safeDefs = Array.isArray(p.customObjectDefinitions) ?
      p.customObjectDefinitions
    : [];
  s.setCustomObjectDefinitions(safeDefs);
  const idSet = new Set(safeDefs.map((d) => d.id));
  const mergedOrder = (Array.isArray(p.customObjectOrder) ?
      p.customObjectOrder
    : []
  ).filter((id) => idSet.has(id));
  for (const d of safeDefs) {
    if (!mergedOrder.includes(d.id)) mergedOrder.push(d.id);
  }
  s.setCustomObjectOrder(mergedOrder);

  const coVisibleMap: Record<string, boolean> = {
    ...(p.visibleCustomObjects && typeof p.visibleCustomObjects === "object" ?
      p.visibleCustomObjects
    : {}),
  };
  for (const d of safeDefs) {
    if (coVisibleMap[d.id] === undefined) coVisibleMap[d.id] = true;
  }
  for (const k of Object.keys(coVisibleMap)) {
    if (!idSet.has(k)) delete coVisibleMap[k];
  }
  s.setVisibleCustomObjects(coVisibleMap);
  return mergedSectionOrder;
}
