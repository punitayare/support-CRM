import { LayoutDashboard, Ticket } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">
          SupportCRM
        </h1>
      </div>

      <nav className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-100 text-indigo-700">
          <LayoutDashboard size={20} />
          Dashboard
        </div>

        <div className="flex items-center gap-3 p-3 mt-2 text-slate-600">
          <Ticket size={20} />
          Tickets
        </div>
      </nav>
    </div>
  );
}