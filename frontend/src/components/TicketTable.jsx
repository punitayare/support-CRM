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
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await api.delete(`/api/tickets/${ticketId}`);
      refreshTickets();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

      {/* DESKTOP TABLE HEADER */}
      <div className="hidden md:grid grid-cols-6 bg-gradient-to-r from-indigo-50 to-blue-50 text-gray-700 font-semibold text-sm">
        <div className="p-4">ID</div>
        <div className="p-4">Customer</div>
        <div className="p-4">Subject</div>
        <div className="p-4">Status</div>
        <div className="p-4">Date</div>
        {user?.role === "admin" && <div className="p-4">Actions</div>}
      </div>

      {/* DESKTOP ROWS */}
      <div className="hidden md:block divide-y divide-gray-100">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            onClick={() => onSelectTicket(ticket.ticket_id)}
            className={`
              grid grid-cols-6 items-center cursor-pointer px-2 py-3
              hover:bg-indigo-50 transition
              ${selectedTicket === ticket.ticket_id ? "bg-indigo-100" : ""}
            `}
          >
            <div className="p-2 font-medium">#{ticket.ticket_id}</div>
            <div className="p-2">{ticket.customer_name}</div>
            <div className="p-2 font-medium">{ticket.subject}</div>
            <div className="p-2">
              <span className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(ticket.status)}`}>
                {ticket.status.toUpperCase()}
              </span>
            </div>
            <div className="p-2 text-sm text-gray-500">
              {new Date(ticket.created_at).toLocaleDateString()}
            </div>

            {user?.role === "admin" && (
              <div className="p-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(ticket.ticket_id);
                  }}
                  className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden divide-y divide-gray-100">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            onClick={() => onSelectTicket(ticket.ticket_id)}
            className={`
              p-4 cursor-pointer hover:bg-gray-50 transition
              ${selectedTicket === ticket.ticket_id ? "bg-indigo-50" : ""}
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">
                  #{ticket.ticket_id}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {ticket.customer_name}
                </p>
              </div>

              <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>

            <p className="mt-2 font-medium text-gray-800">
              {ticket.subject}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              {new Date(ticket.created_at).toLocaleDateString()}
            </p>

            {user?.role === "admin" && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(ticket.ticket_id);
                  }}
                  className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600"
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