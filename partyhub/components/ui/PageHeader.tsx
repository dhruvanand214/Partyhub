"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  back?: boolean;
}

export default function PageHeader({ title, subtitle, back = true }: Props) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 mb-8">
      {back && (
        <button
          onClick={() => router.back()}
          className="glass w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} className="text-white/80" />
        </button>
      )}
      <div>
        <h1 className="text-2xl font-black leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}