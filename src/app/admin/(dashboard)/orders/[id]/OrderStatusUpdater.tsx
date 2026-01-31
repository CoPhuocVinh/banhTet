"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatusId: string;
  statuses: { id: string; name: string; color: string }[];
}

export function OrderStatusUpdater({
  orderId,
  currentStatusId,
  statuses,
}: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(currentStatusId);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    if (selectedStatus === currentStatusId) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status_id: selectedStatus } as never)
        .eq("id", orderId);

      if (error) throw error;

      toast.success("Đã cập nhật trạng thái đơn hàng");
      router.refresh();
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
      >
        {statuses.map((status) => (
          <option key={status.id} value={status.id}>
            {status.name}
          </option>
        ))}
      </select>
      <Button
        onClick={handleUpdateStatus}
        disabled={loading || selectedStatus === currentStatusId}
        size="sm"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="h-4 w-4 mr-1" />
            Cập nhật
          </>
        )}
      </Button>
    </div>
  );
}
