"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface DeliveryDateChangerProps {
  orderId: string;
  currentDate: string;
}

export function DeliveryDateChanger({
  orderId,
  currentDate,
}: DeliveryDateChangerProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newDate, setNewDate] = useState(currentDate);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (newDate === currentDate) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ delivery_date: newDate } as never)
        .eq("id", orderId);

      if (error) throw error;

      toast.success("Đã cập nhật ngày giao hàng");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Không thể cập nhật ngày giao hàng");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewDate(currentDate);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" />
        Chuyển ngày giao
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
        className="w-[160px]"
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={handleSave}
        disabled={loading}
        className="h-9 w-9 text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleCancel}
        disabled={loading}
        className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
