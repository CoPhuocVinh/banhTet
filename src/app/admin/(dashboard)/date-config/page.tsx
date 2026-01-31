"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DayPicker } from "react-day-picker";
import { vi } from "react-day-picker/locale";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type PriceTier = {
  id: string;
  name: string;
  color: string;
};

type DateAssignment = {
  date: string;
  tier_id: string;
  tier_name: string;
  tier_color: string;
};

export default function DateConfigPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tiers, setTiers] = useState<PriceTier[]>([]);
  const [assignments, setAssignments] = useState<Record<string, DateAssignment>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTiers();
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [currentMonth]);

  async function fetchTiers() {
    const supabase = createClient();
    const { data } = await supabase
      .from("price_tiers")
      .select("id, name, color")
      .order("created_at");
    setTiers((data as PriceTier[]) || []);
  }

  async function fetchAssignments() {
    setLoading(true);
    const supabase = createClient();

    const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");

    const { data } = await supabase
      .from("date_tier_assignments")
      .select(
        `
        date,
        tier_id,
        price_tiers (
          name,
          color
        )
      `
      )
      .gte("date", monthStart)
      .lte("date", monthEnd);

    const assignmentMap: Record<string, DateAssignment> = {};
    (
      data as {
        date: string;
        tier_id: string;
        price_tiers: { name: string; color: string } | null;
      }[]
    )?.forEach((item) => {
      if (item.price_tiers) {
        assignmentMap[item.date] = {
          date: item.date,
          tier_id: item.tier_id,
          tier_name: item.price_tiers.name,
          tier_color: item.price_tiers.color,
        };
      }
    });

    setAssignments(assignmentMap);
    setLoading(false);
  }

  function handleDayClick(date: Date) {
    const dateStr = format(date, "yyyy-MM-dd");
    const assignment = assignments[dateStr];
    setSelectedDate(date);
    setSelectedTier(assignment?.tier_id || "");
  }

  function closeModal() {
    setSelectedDate(null);
    setSelectedTier("");
  }

  async function handleSave() {
    if (!selectedDate) return;

    setSaving(true);
    const supabase = createClient();
    const dateStr = format(selectedDate, "yyyy-MM-dd");

    if (!selectedTier) {
      // Remove assignment
      const { error } = await supabase
        .from("date_tier_assignments")
        .delete()
        .eq("date", dateStr);

      if (error) {
        toast.error("Không thể xóa gán tier");
      } else {
        toast.success("Đã xóa gán tier cho ngày này");
        fetchAssignments();
        closeModal();
      }
    } else {
      // Upsert assignment - delete then insert
      await supabase.from("date_tier_assignments").delete().eq("date", dateStr);

      const { error } = await supabase.from("date_tier_assignments").insert({
        date: dateStr,
        tier_id: selectedTier,
      } as never);

      if (error) {
        toast.error("Không thể gán tier cho ngày này");
      } else {
        toast.success("Đã gán tier thành công");
        fetchAssignments();
        closeModal();
      }
    }

    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Cấu hình ngày</h1>
          <p className="text-muted-foreground">
            Gán giai đoạn giá cho từng ngày
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium min-w-[150px] text-center">
            {format(currentMonth, "MMMM yyyy", { locale: vi })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted border border-border" />
          <span>Chưa gán</span>
        </div>
        {tiers.map((tier) => (
          <div key={tier.id} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: tier.color }}
            />
            <span>{tier.name}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="bg-card rounded-xl border border-border p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <DayPicker
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={vi}
            showOutsideDays={false}
            classNames={{
              root: "w-full",
              months: "w-full",
              month: "w-full",
              month_caption: "hidden",
              nav: "hidden",
              month_grid: "w-full border-collapse",
              weekdays: "flex w-full",
              weekday:
                "flex-1 text-center text-sm font-medium text-muted-foreground py-2",
              week: "flex w-full",
              day: "flex-1 aspect-square p-1",
              day_button:
                "w-full h-full rounded-lg hover:ring-2 hover:ring-primary transition-all relative flex flex-col items-center justify-center",
              selected: "ring-2 ring-primary",
              today: "ring-2 ring-primary ring-offset-2",
              outside: "text-muted-foreground opacity-50",
              disabled: "text-muted-foreground opacity-50",
            }}
            components={{
              DayButton: ({ day, ...props }) => {
                const dateStr = format(day.date, "yyyy-MM-dd");
                const assignment = assignments[dateStr];

                return (
                  <button
                    {...props}
                    onClick={() => handleDayClick(day.date)}
                    className="w-full h-full rounded-lg hover:ring-2 hover:ring-primary transition-all relative flex flex-col items-center justify-center cursor-pointer"
                    style={{
                      backgroundColor: assignment
                        ? `${assignment.tier_color}30`
                        : undefined,
                      borderLeft: assignment
                        ? `4px solid ${assignment.tier_color}`
                        : undefined,
                    }}
                  >
                    <span className="text-sm font-medium">
                      {format(day.date, "d")}
                    </span>
                    {assignment && (
                      <span
                        className="text-[10px] px-1 rounded mt-1"
                        style={{
                          backgroundColor: `${assignment.tier_color}40`,
                          color: assignment.tier_color,
                        }}
                      >
                        {assignment.tier_name}
                      </span>
                    )}
                  </button>
                );
              },
            }}
          />
        )}
      </div>

      {/* Selected Day Modal */}
      {selectedDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            className="bg-card rounded-xl border border-border p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-secondary">
                Ngày {format(selectedDate, "dd/MM/yyyy")}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Chọn giai đoạn giá</Label>
                <div className="space-y-2">
                  {/* No tier option */}
                  <button
                    onClick={() => setSelectedTier("")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      selectedTier === ""
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-muted border border-border flex items-center justify-center">
                      {selectedTier === "" && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <span className="text-muted-foreground">
                      Không gán (xóa)
                    </span>
                  </button>

                  {/* Tier options */}
                  {tiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        selectedTier === tier.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ backgroundColor: tier.color }}
                      >
                        {selectedTier === tier.id && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span>{tier.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={closeModal}>
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
