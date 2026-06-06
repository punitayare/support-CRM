export default function StatsCards({ tickets }) {

  const open = tickets.filter(
    (t) => t.status === "Open"
  ).length;

  const progress = tickets.filter(
    (t) => t.status === "In Progress"
  ).length;

  const closed = tickets.filter(
    (t) => t.status === "Closed"
  ).length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">

      <Card
        title="Open"
        value={open}
        color="from-blue-500 to-indigo-600"
      />

      <Card
        title="In Progress"
        value={progress}
        color="from-orange-500 to-yellow-500"
      />

      <Card
        title="Closed"
        value={closed}
        color="from-green-500 to-emerald-600"
      />

      <Card
        title="Total"
        value={tickets.length}
        color="from-purple-500 to-violet-600"
      />

    </div>
  );
}

function Card({ title, value, color }) {

  return (
    <div
      className={`bg-gradient-to-r ${color}
      text-white p-5 rounded-2xl`}
    >
      <p>{title}</p>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>
    </div>
  );
}