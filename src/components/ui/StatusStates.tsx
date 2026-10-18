"use client";

import React from "react";
import { AlertCircle, WifiOff, RefreshCw, FolderSearch } from "lucide-react";

// 1. Skeleton Loading State
export function SkeletonBlock({
  className = "h-6 w-full",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonBlock className="h-16 w-full" />
      <div className="flex justify-between pt-2">
        <SkeletonBlock className="h-8 w-24" />
        <SkeletonBlock className="h-8 w-28" />
      </div>
    </div>
  );
}

// 2. Empty State with actionable CTA
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = FolderSearch,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-md mx-auto">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// 3. Error State with actionable retry
export function ErrorState({
  title = "Terjadi Kendala Teknis",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-50/70 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-base font-semibold text-red-900 mb-1">{title}</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 bg-white border border-red-300 text-red-700 hover:bg-red-100/50 text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}

// 4. Offline State Banner
export function OfflineBanner({ isOnline }: { isOnline: boolean }) {
  if (isOnline) return null;

  return (
    <div className="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-2 text-xs md:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all duration-300">
      <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
      <span>Mode Offline Aktif — Perubahan draf disimpan aman di perangkat lokal.</span>
    </div>
  );
}
