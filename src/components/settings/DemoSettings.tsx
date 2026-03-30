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
import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ContactCard } from "@/components/dashboard/ContactCard";
import { useDemoConfig, SECTION_ORDER_EVENT } from "@/hooks/useDemoConfig";
import type { SectionId } from "@/types/contact";
import type { ContactData } from "@/types/contact";

const SECTION_LABELS: Record<SectionId, string> = {
  properties: "Properties",
  quotes: "Quotes",
  cases: "Support cases",
  workOrders: "Work orders",
  contracts: "Contracts",
  invoices: "Invoices",
  timeline: "Timeline",
  attachments: "Attachments",
};

const ICON_OPTIONS = [
  "UserCheck",
  "Phone",
  "Star",
  "MapPin",
  "Calendar",
  "Briefcase",
  "Building2",
];

const PREVIEW_CONTACT: ContactData = {
  email: "preview@example.com",
  name: "Preview Contact",
  company: "Example Co",
  role: "Tenant",
  segment: "Standard",
  tags: ["Demo"],
  properties: [],
  quotes: [],
  inquiries: [],
  cases: [],
  workOrders: [],
  contracts: [],
  timeline: [],
  attachments: [],
  invoices: [],
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

export function DemoSettings() {
  const cfg = useDemoConfig();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [draftField, setDraftField] = useState({
    label: "",
    value: "",
    icon: "UserCheck",
  });

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

  const onFieldDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const fields = cfg.customContactFields;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    cfg.setCustomContactFields(arrayMove(fields, oldIndex, newIndex));
  };

  const addField = () => {
    if (!draftField.label.trim()) return;
    cfg.setCustomContactFields([
      ...cfg.customContactFields,
      {
        id: `field-${Date.now()}`,
        label: draftField.label.trim(),
        value: draftField.value.trim() || "—",
        icon: draftField.icon,
      },
    ]);
    setDraftField({ label: "", value: "", icon: "UserCheck" });
  };

  const removeField = (id: string) => {
    cfg.setCustomContactFields(
      cfg.customContactFields.filter((f) => f.id !== id),
    );
  };

  return (
    <div className="space-y-3 p-2.5 pb-10">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-zinc-900">
          Demo settings
        </h2>
        <Link
          href="/"
          className="text-[12px] font-medium text-[var(--secondary-color)]"
        >
          Back
        </Link>
      </div>

      <Card className="space-y-3 p-3">
        <h3 className="text-[13px] font-semibold text-zinc-800">Branding</h3>
        <label className="block text-[11px] font-medium text-zinc-500">
          App title
          <input
            className="mt-0.5 w-full rounded border border-zinc-200 px-2 py-1.5 text-[13px]"
            value={cfg.appTitle}
            onChange={(e) => cfg.setAppTitle(e.target.value)}
          />
        </label>
        <label className="block text-[11px] font-medium text-zinc-500">
          Client company name (emails)
          <input
            className="mt-0.5 w-full rounded border border-zinc-200 px-2 py-1.5 text-[13px]"
            value={cfg.companyName}
            onChange={(e) => cfg.setCompanyName(e.target.value)}
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-[11px] font-medium text-zinc-500">
            Brand color
            <input
              type="color"
              className="mt-0.5 h-9 w-full rounded border border-zinc-200"
              value={cfg.brandColor}
              onChange={(e) => cfg.setBrandColor(e.target.value)}
            />
          </label>
          <label className="block text-[11px] font-medium text-zinc-500">
            Secondary
            <input
              type="color"
              className="mt-0.5 h-9 w-full rounded border border-zinc-200"
              value={cfg.secondaryColor}
              onChange={(e) => cfg.setSecondaryColor(e.target.value)}
            />
          </label>
        </div>
        <label className="block text-[11px] font-medium text-zinc-500">
          Logo (URL or base64 data URL)
          <textarea
            className="mt-0.5 w-full rounded border border-zinc-200 px-2 py-1.5 text-[11px]"
            rows={2}
            placeholder="https://… or data:image/png;base64,…"
            value={cfg.logoUrl ?? ""}
            onChange={(e) =>
              cfg.setLogoUrl(e.target.value.trim() || null)
            }
          />
        </label>
      </Card>

      <Card className="space-y-3 p-3">
        <h3 className="text-[13px] font-semibold text-zinc-800">
          Contact card fields
        </h3>
        <ContactCard
          contact={PREVIEW_CONTACT}
          customFields={cfg.customContactFields}
        />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onFieldDragEnd}
        >
          <SortableContext
            items={cfg.customContactFields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1.5">
              {cfg.customContactFields.map((f) => (
                <SortableRow key={f.id} id={f.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[12px]">
                      <strong>{f.label}</strong>: {f.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeField(f.id)}
                      className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove field"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </SortableRow>
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="space-y-2 rounded-md border border-dashed border-zinc-200 p-2">
          <div className="grid gap-2">
            <input
              className="rounded border border-zinc-200 px-2 py-1 text-[12px]"
              placeholder="Label"
              value={draftField.label}
              onChange={(e) =>
                setDraftField((d) => ({ ...d, label: e.target.value }))
              }
            />
            <input
              className="rounded border border-zinc-200 px-2 py-1 text-[12px]"
              placeholder="Value"
              value={draftField.value}
              onChange={(e) =>
                setDraftField((d) => ({ ...d, value: e.target.value }))
              }
            />
            <select
              className="rounded border border-zinc-200 px-2 py-1 text-[12px]"
              value={draftField.icon}
              onChange={(e) =>
                setDraftField((d) => ({ ...d, icon: e.target.value }))
              }
            >
              {ICON_OPTIONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addField}
            className="flex w-full items-center justify-center gap-1 rounded-md border border-zinc-200 py-1.5 text-[12px] font-medium hover:bg-zinc-50"
          >
            <Plus className="h-4 w-4" />
            Add field
          </button>
        </div>
      </Card>

      <Card className="space-y-3 p-3">
        <h3 className="text-[13px] font-semibold text-zinc-800">
          Dashboard sections
        </h3>
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
                    <span className="text-[12px] font-medium">
                      {SECTION_LABELS[id]}
                    </span>
                    <label className="flex items-center gap-1.5 text-[11px] text-zinc-600">
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
                      Show
                    </label>
                  </div>
                </SortableRow>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Card>

      <Card className="space-y-2 p-3">
        <h3 className="text-[13px] font-semibold text-zinc-800">
          Support case banner
        </h3>
        <p className="text-[11px] text-zinc-500">
          Optional JSON, e.g.{" "}
          <code className="rounded bg-zinc-100 px-1">
            {`{"note":"Escalated to ops"}`}
          </code>
        </p>
        <textarea
          className="w-full rounded border border-zinc-200 px-2 py-1.5 font-mono text-[11px]"
          rows={3}
          value={cfg.caseOverridesRaw}
          onChange={(e) => cfg.setCaseOverridesRaw(e.target.value)}
        />
      </Card>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => cfg.saveToStorage()}
          className="flex-1 rounded-md py-2 text-[13px] font-semibold text-white"
          style={{ background: "var(--brand-color)" }}
        >
          Save settings
        </button>
        <button
          type="button"
          onClick={() => cfg.hydrate()}
          className="rounded-md border border-zinc-200 px-3 py-2 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancel
        </button>
      </div>

      <Link
        href="/settings/data"
        className="block text-center text-[12px] text-[var(--secondary-color)]"
      >
        Records & API admin →
      </Link>
    </div>
  );
}
