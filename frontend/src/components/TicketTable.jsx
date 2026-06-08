import api from "../api/api";

export default function TicketTable({
  tickets,
  refreshTickets,
  onSelectTicket,
  selectedTicket,
  user,
}) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case "In Progress":
        return "bg-gradient-to-r from-orange-400 to-yellow-500 text-white";
      case "Closed":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const handleDelete = async (ticketId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/api/tickets/${ticketId}`);
      refreshTickets();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      
      {/* HEADER ROW */}
      <div className="grid grid-cols-6 bg-gradient-to-r from-indigo-50 to-blue-50 text-gray-700 font-semibold text-sm">
        <div className="p-4">ID</div>
        <div className="p-4">Customer</div>
        <div className="p-4">Subject</div>
        <div className="p-4">Status</div>
        <div className="p-4">Date</div>
        {user?.role === "admin" && <div className="p-4">Actions</div>}
      </div>

      {/* ROWS */}
      <div className="divide-y divide-gray-100">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            onClick={() => onSelectTicket(ticket.ticket_id)}
            className={`
              grid grid-cols-6 items-center cursor-pointer px-2 py-3
              transition-all duration-200
              hover:bg-indigo-50 hover:shadow-sm
              ${
                selectedTicket === ticket.ticket_id
                  ? "bg-indigo-100"
                  : ""
              }
            `}
          >
            {/* ID */}
            <div className="p-2 font-medium text-gray-700">
              #{ticket.ticket_id}
            </div>

            {/* CUSTOMER */}
            <div className="p-2 text-gray-700">
              {ticket.customer_name}
            </div>

            {/* SUBJECT */}
            <div className="p-2 font-medium text-gray-800">
              {ticket.subject}
            </div>

            {/* STATUS */}
            <div className="p-2">
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${getStatusStyle(
                  ticket.status
                )}`}
              >
                {ticket.status.toUpperCase()}
              </span>
            </div>

            {/* DATE */}
            <div className="p-2 text-sm text-gray-500">
              {new Date(ticket.created_at).toLocaleDateString()}
            </div>

            {/* ACTIONS */}
            {user?.role === "admin" && (
              <div className="p-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(ticket.ticket_id);
                  }}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}