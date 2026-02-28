"use client";

interface GoalThermometerProps {
  raisedCents: number;
  goalCents: number;
  className?: string;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function GoalThermometer({
  raisedCents,
  goalCents,
  className = "",
}: GoalThermometerProps) {
  const percentage = goalCents > 0 ? Math.min((raisedCents / goalCents) * 100, 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-3xl font-bold text-give-primary">
            {formatCurrency(raisedCents)}
          </span>
          <span className="text-sm text-gray-500 ml-1">raised</span>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">
            {formatCurrency(goalCents)} goal
          </span>
        </div>
      </div>

      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-give-primary to-give-accent transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-1.5 text-sm text-gray-500 text-right">
        {percentage.toFixed(0)}% funded
      </div>
    </div>
  );
}
