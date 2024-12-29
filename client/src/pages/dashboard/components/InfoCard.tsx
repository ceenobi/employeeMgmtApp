import { getRandomColor } from "@/utils/constants";

type InfoCardsProps = {
  title: string;
  count: number;
  icon?: React.ReactNode;
  desc?: string;
};

export default function InfoCard({ title, count, icon, desc }: InfoCardsProps) {
  return (
    <div
      className="stats shadow bg-gray-900 text-primary-content min-w-[250px] md:min-w-[220px]  border-l-2 rounded-lg"
      style={{
        borderLeftColor: getRandomColor(title as string),
      }}
    >
      <div className="stat text-gray-200">
        <div className="stat-figure text-primary">{icon}</div>
        <div className="stat-title">{title}</div>
        <div className="stat-value text-primary">{count}</div>
        <div className="stat-desc">{desc}</div>
      </div>
    </div>
  );
}
