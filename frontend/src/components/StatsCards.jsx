export default function StatsCards({ tickets }) {
  const open = tickets.filter((t) => t.status === "Open").length;
  const progress = tickets.filter((t) => t.status === "In Progress").length;
  const closed = tickets.filter((t) => t.status === "Closed").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card title="Open" value={open} color="from-blue-500 to-indigo-600" />
      <Card title="In Progress" value={progress} color="from-orange-500 to-yellow-500" />
      <Card title="Closed" value={closed} color="from-green-500 to-emerald-600" />
      <Card title="Total" value={tickets.length} color="from-purple-500 to-violet-600" />
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-6 text-white
        bg-gradient-to-r ${color}
        shadow-lg hover:shadow-2xl
        transform hover:-translate-y-1 transition-all duration-300
        border border-white/10
      `}
    >
      {/* soft glow effect */}
      <div className="absolute inset-0 opacity-20 bg-white blur-2xl"></div>

      <div className="relative">
        <p className="text-sm font-medium opacity-90">{title}</p>

        <h2 className="text-4xl font-extrabold mt-2 tracking-tight">
          {value}
        </h2>

        <div className="mt-3 h-1 w-12 bg-white/40 rounded-full"></div>
      </div>
    </div>
  );
}