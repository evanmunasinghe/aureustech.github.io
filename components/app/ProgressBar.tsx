"use client";

export function ProgressBar({
  value,
  showLabel = false,
  label,
}: {
  value: number;
  showLabel?: boolean;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {showLabel && (
        <div className="progress-label">
          <span>{label ?? "Progress"}</span>
          <b>{clamped}%</b>
        </div>
      )}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
