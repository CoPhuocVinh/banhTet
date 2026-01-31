"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CopyAddressButtonProps {
  address: string;
}

export function CopyAddressButton({ address }: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors w-full text-left"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-5 w-5 text-green-600" />
      ) : (
        <Copy className="h-5 w-5 text-blue-600" />
      )}
      <span>{copied ? "Đã sao chép!" : "Sao chép địa chỉ"}</span>
    </button>
  );
}
