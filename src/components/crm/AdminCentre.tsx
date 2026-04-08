"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useDemoConfig, SECTION_ORDER_EVENT } from "@/hooks/useDemoConfig";
import { cssColorToHexForPicker } from "@/lib/theme";
import type { CustomObjectDefinition, SectionId } from "@/types/contact";

const SECTION_LABELS: Record<SectionId, string> = {
  properties: "Properties",
  quotes: "Quotes",
  opportunities: "Opportunities",
  orders: "Orders",
  cases: "Support cases",
  workOrders: "Work orders",
  contracts: "Contracts",
  invoices: "Invoices",
  timeline: "Timeline",
  attachments: "Attachments",
  pets: "Pets",
  policies: "Policies",
  policyholder: "Policyholder",
  cover: "Cover",
  claimsHistory: "Claims",
};

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded-md border border-zinc-100 bg-zinc-50/80 px-2 py-1.5"
    >
      <button
        type="button"
        className="touch-manipulation text-zinc-400 hover:text-zinc-600"
        aria-label="Reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function AdminCentre({
  onToast,
}: {
  /** CRM shell toast; without it, short messages show inside this panel. */
  onToast?: (message: string) => void;
}) {
  const cfg = useDemoConfig();
  const [localNotice, setLocalNotice] = useState<string | null>(null);
  const notify = useCallback(
    (message: string) => {
      onToast?.(message);
      if (!onToast) {
        setLocalNotice(message);
        window.setTimeout(() => setLocalNotice(null), 3800);
      }
    },
    [onToast],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [newObjectTitle, setNewObjectTitle] = useState("");
  const [newObjectShowOnPlugin, setNewObjectShowOnPlugin] = useState(true);
  const [draftFieldKey, setDraftFieldKey] = useState<Record<string, string>>(
    {},
  );

  const onSectionDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = cfg.sectionOrder.indexOf(active.id as SectionId);
    const newIndex = cfg.sectionOrder.indexOf(over.id as SectionId);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(cfg.sectionOrder, oldIndex, newIndex);
    cfg.setSectionOrder(next);
    window.dispatchEvent(
      new CustomEvent(SECTION_ORDER_EVENT, { detail: { order: next } }),
    );
  };

  const onCustomObjectDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const order = cfg.customObjectOrder;
    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    cfg.setCustomObjectOrder(arrayMove(order, oldIndex, newIndex));
  };

  const saveNewCustomObject = () => {
    const title = newObjectTitle.trim();
    if (!title) return;
    const id = `obj-${Date.now()}`;
    const nextDefs: CustomObjectDefinition[] = [
      ...cfg.customObjectDefinitions,
      { id, title, fieldKeys: ["name", "status"] },
    ];
    const nextOrder = [...cfg.customObjectOrder, id];
    const nextVis = {
      ...cfg.visibleCustomObjects,
      [id]: newObjectShowOnPlugin,
    };
    cfg.setCustomObjectDefinitions(nextDefs);
    cfg.setCustomObjectOrder(nextOrder);
    cfg.setVisibleCustomObjects(nextVis);
    const ok = cfg.saveToStorage({
      customObjectDefinitions: nextDefs,
      customObjectOrder: nextOrder,
      visibleCustomObjects: nextVis,
    });
    setNewObjectTitle("");
    notify(
      ok
        ? "Object saved. It appears under Plugin dashboard lists and Custom objects."
        : "Could not save (browser storage blocked, private mode, or full).",
    );
  };

  const removeCustomObject = (id: string) => {
    cfg.setCustomObjectDefinitions(
      cfg.customObjectDefinitions.filter((d) => d.id !== id),
    );
    cfg.setCustomObjectOrder(cfg.customObjectOrder.filter((x) => x !== id));
    cfg.setVisibleCustomObjects((v) => {
      const n = { ...v };
      delete n[id];
      return n;
    });
  };

  const updateDef = (id: string, patch: Partial<CustomObjectDefinition>) => {
    cfg.setCustomObjectDefinitions(
      cfg.customObjectDefinitions.map((d) =>
        d.id === id ? { ...d, ...patch } : d,
      ),
    );
  };

  const addFieldKey = (defId: string) => {
    const key = (draftFieldKey[defId] ?? "").trim();
    if (!key) return;
    const def = cfg.customObjectDefinitions.find((d) => d.id === defId);
    if (!def || def.fieldKeys.includes(key)) return;
    updateDef(defId, { fieldKeys: [...def.fieldKeys, key] });
    setDraftFieldKey((d) => ({ ...d, [defId]: "" }));
  };

  const removeFieldKey = (defId: string, key: string) => {
    const def = cfg.customObjectDefinitions.find((d) => d.id === defId);
    if (!def) return;
    updateDef(defId, {
      fieldKeys: def.fieldKeys.filter((k) => k !== key),
    });
  };

  const onLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = () => {
      if (typeof r.result === "string") cfg.setLogoUrl(r.result);
    };
    r.readAsDataURL(f);
    e.target.value = "";
  };

  const orderedCustomDefs = cfg.customObjectOrder
    .map((id) => cfg.customObjectDefinitions.find((d) => d.id === id))
    .filter((d): d is CustomObjectDefinition => Boolean(d));

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 lg:px-0">
      {localNotice ? (
        <div
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-900"
          role="status"
        >
          {localNotice}
        </div>
      ) : null}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
          Admin centre
        </h2>
        <p className="mt-1 text-[13px] text-zinc-600">
          Branding, which standard lists appear on the plugin dashboard, and
          custom object types (field schemas). Save to persist in this browser;
          custom list row data is edited per account under CRM → Custom lists.
        </p>
      </div>

      <Card className="space-y-4 p-5">
        <h3 className="text-sm font-semibold text-zinc-900">Branding</h3>
        <label className="block text-[11px] font-medium text-zinc-500">
          App title
          <input
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-[13px]"
            value={cfg.appTitle}
            onChange={(e) => cfg.setAppTitle(e.target.value)}
          />
        </label>
        <label className="block text-[11px] font-medium text-zinc-500">
          Client company name (emails)
          <input
            className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-[13px]"
            value={cfg.companyName}
            onChange={(e) => cfg.setCompanyName(e.target.value)}
          />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <span className="text-[11px] font-medium text-zinc-500">
              Brand color
            </span>
            <div className="flex gap-2">
              <input
                type="color"
                aria-label="Brand color swatch"
                className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-zinc-200"
                value={cssColorToHexForPicker(cfg.brandColor)}
                onChange={(e) => cfg.setBrandColor(e.target.value)}
              />
              <input
                className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2 font-mono text-[13px]"
                placeholder="#003366 or rgba(0,51,102,0.95)"
                value={cfg.brandColor}
                onChange={(e) => cfg.setBrandColor(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-medium text-zinc-500">
              Secondary
            </span>
            <div className="flex gap-2">
              <input
                type="color"
                aria-label="Secondary color swatch"
                className="h-10 w-14 shrink-0 cursor-pointer rounded-lg border border-zinc-200"
                value={cssColorToHexForPicker(cfg.secondaryColor)}
                onChange={(e) => cfg.setSecondaryColor(e.target.value)}
              />
              <input
                className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2 font-mono text-[13px]"
                placeholder="#5bb5b0 or rgb(91,181,176)"
                value={cfg.secondaryColor}
                onChange={(e) => cfg.setSecondaryColor(e.target.value)}
              />
            </div>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed text-zinc-500">
          Use the swatch for a quick hex pick, or type{" "}
          <span className="font-mono text-zinc-600">#RRGGBB</span>,{" "}
          <span className="font-mono text-zinc-600">rgb()</span>, or{" "}
          <span className="font-mono text-zinc-600">rgba()</span>. Space syntax{" "}
          <span className="font-mono text-zinc-600">rgb(r g b / a)</span> is
          supported.
        </p>
        <div className="space-y-2">
          <span className="text-[11px] font-medium text-zinc-500">Logo</span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onLogoFile}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[12px] font-medium hover:bg-zinc-50"
            >
              Upload image
            </button>
            <span className="text-[11px] text-zinc-400">or</span>
          </div>
          <label className="block text-[11px] font-medium text-zinc-500">
            Image URL (https://…)
            <input
              className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-[13px]"
              placeholder="https://…"
              value={
                cfg.logoUrl?.startsWith("data:") ? "" : (cfg.logoUrl ?? "")
              }
              onChange={(e) =>
                cfg.setLogoUrl(e.target.value.trim() || null)
              }
            />
          </label>
          {cfg.logoUrl ? (
            <div className="flex items-center gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cfg.logoUrl}
                alt=""
                className="h-12 w-12 rounded-md border border-zinc-200 object-contain"
              />
              <button
                type="button"
                className="text-[12px] font-medium text-red-600 hover:underline"
                onClick={() => cfg.setLogoUrl(null)}
              >
                Remove logo
              </button>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="space-y-3 p-5">
        <h3 className="text-sm font-semibold text-zinc-900">
          Plugin dashboard lists
        </h3>
        <p className="text-[12px] text-zinc-500">
          Drag to reorder and choose what appears on the Front plugin contact
          dashboard. Standard lists and custom object sections use the same
          pattern: when <span className="font-medium text-zinc-600">Show</span>{" "}
          is on, that section appears in the plugin; custom types are always
          available under CRM → Custom lists for editing rows.
        </p>
        <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          Standard lists
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onSectionDragEnd}
        >
          <SortableContext
            items={[...cfg.sectionOrder]}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1.5">
              {cfg.sectionOrder.map((id) => (
                <SortableRow key={id} id={id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-zinc-800">
                      {SECTION_LABELS[id]}
                    </span>
                    <label className="flex items-center gap-2 text-[12px] text-zinc-600">
                      <input
                        type="checkbox"
                        checked={cfg.visibleSections[id]}
                        onChange={(e) =>
                          cfg.setVisibleSections({
                            ...cfg.visibleSections,
                            [id]: e.target.checked,
                          })
                        }
                      />
                      Show on plugin
                    </label>
                  </div>
                </SortableRow>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {orderedCustomDefs.length > 0 ? (
          <>
            <div className="border-t border-zinc-100 pt-3" />
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Custom object sections
            </p>
            <p className="text-[11px] text-zinc-500">
              Order matches the plugin (after standard lists). Toggle to show or
              hide each custom table on the contact dashboard only.
            </p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onCustomObjectDragEnd}
            >
              <SortableContext
                items={cfg.customObjectOrder}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5">
                  {orderedCustomDefs.map((def) => (
                    <SortableRow key={def.id} id={def.id}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-medium text-zinc-800">
                          {def.title}
                        </span>
                        <label className="flex items-center gap-2 text-[12px] text-zinc-600">
                          <input
                            type="checkbox"
                            checked={cfg.visibleCustomObjects[def.id] !== false}
                            onChange={(e) =>
                              cfg.setVisibleCustomObjects({
                                ...cfg.visibleCustomObjects,
                                [def.id]: e.target.checked,
                              })
                            }
                          />
                          Show on plugin
                        </label>
                      </div>
                    </SortableRow>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        ) : null}
      </Card>

      <Card className="space-y-4 p-5">
        <h3 className="text-sm font-semibold text-zinc-900">
          Custom objects
        </h3>
        <p className="text-[12px] text-zinc-500">
          Define field schemas for extra list types. Plugin visibility and order
          are controlled in <span className="font-medium">Plugin dashboard lists</span>{" "}
          above. Edit row data per account under CRM → Custom lists (all types
          always appear there).
        </p>
        <div className="space-y-3">
          {orderedCustomDefs.map((def) => (
            <div
              key={def.id}
              className="space-y-2 rounded-lg border border-zinc-100 bg-white p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <input
                  className="min-w-[12rem] flex-1 rounded border border-zinc-200 px-2 py-1 text-[13px] font-semibold"
                  value={def.title}
                  onChange={(e) =>
                    updateDef(def.id, { title: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => removeCustomObject(def.id)}
                  className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove object"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="font-mono text-[10px] text-zinc-400">
                id: {def.id}
              </p>
              <div className="space-y-1">
                <span className="text-[11px] font-medium text-zinc-500">
                  Fields (column keys)
                </span>
                <ul className="flex flex-wrap gap-1">
                  {def.fieldKeys.map((k) => (
                    <li
                      key={k}
                      className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px]"
                    >
                      {k}
                      <button
                        type="button"
                        className="text-zinc-500 hover:text-red-600"
                        aria-label={`Remove ${k}`}
                        onClick={() => removeFieldKey(def.id, k)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 pt-1">
                  <input
                    className="flex-1 rounded border border-zinc-200 px-2 py-1 text-[12px]"
                    placeholder="field_key"
                    value={draftFieldKey[def.id] ?? ""}
                    onChange={(e) =>
                      setDraftFieldKey((d) => ({
                        ...d,
                        [def.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => addFieldKey(def.id)}
                    className="rounded-lg border border-zinc-200 px-2 py-1 text-[12px] font-medium hover:bg-zinc-50"
                  >
                    Add field
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3 rounded-lg border border-dashed border-zinc-200 p-3">
          <p className="text-[11px] font-medium text-zinc-600">
            New object
          </p>
          <input
            className="w-full rounded border border-zinc-200 px-2 py-1.5 text-[13px]"
            placeholder='Object title (e.g. "Vehicles")'
            value={newObjectTitle}
            onChange={(e) => setNewObjectTitle(e.target.value)}
          />
          <label className="flex cursor-pointer items-center gap-2 text-[12px] text-zinc-600">
            <input
              type="checkbox"
              checked={newObjectShowOnPlugin}
              onChange={(e) => setNewObjectShowOnPlugin(e.target.checked)}
            />
            Show on plugin dashboard (you can change this anytime in Plugin
            dashboard lists)
          </label>
          <button
            type="button"
            onClick={() => {
              if (!newObjectTitle.trim()) {
                notify("Enter an object title, then tap Save object.");
                return;
              }
              saveNewCustomObject();
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand-color)] px-3 py-2 text-[12px] font-semibold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Save object
          </button>
          <p className="text-[11px] text-zinc-500">
            Saves immediately to this browser and adds the object to the lists
            above.
          </p>
        </div>
      </Card>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const ok = cfg.saveToStorage();
              notify(
                ok
                  ? "Admin settings saved to this browser."
                  : "Could not save (storage blocked, private mode, or full).",
              );
            }}
            className="rounded-lg bg-[var(--brand-color)] px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm"
          >
            Save admin settings
          </button>
          <button
            type="button"
            onClick={() => {
              const ok = cfg.hydrate();
              notify(
                ok
                  ? "Reverted to last saved settings in this browser."
                  : "Could not read saved settings from this browser.",
              );
            }}
            className="rounded-lg border border-zinc-200 px-4 py-2.5 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Revert unsaved
          </button>
        </div>
        <p className="text-[11px] text-zinc-500">
          Edits update the page right away; these buttons write or reload from
          local storage so they survive refresh. You should see a confirmation
          message when they succeed.
        </p>
      </div>
    </div>
  );
}
