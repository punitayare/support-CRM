import api from "../api/api";

export default function TicketTable({
  tickets,
  refreshTickets,
    onSelectTicket,
      selectedTicket,
}) {

  const getStatusColor = (status) => {

    if (status === "Open")
      return "bg-blue-100 text-blue-700";

    if (status === "In Progress")
      return "bg-orange-100 text-orange-700";

    return "bg-green-100 text-green-700";
  };

  const handleDelete = async (ticketId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(
        `/api/tickets/${ticketId}`
      );

      alert("Ticket deleted successfully");

      refreshTickets();

    } catch (error) {

      console.error(error);

      alert("Failed to delete ticket");

    }
  };

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Subject</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-left">Actions</th>

          </tr>

        </thead>

        <tbody>

          {tickets.map((ticket) => (

  <tr
  key={ticket.ticket_id}
  onClick={() => onSelectTicket(ticket.ticket_id)}
  className={`
    border-b
    cursor-pointer
    transition-all
    duration-200
    hover:bg-indigo-50
    ${
      selectedTicket === ticket.ticket_id
        ? "bg-indigo-100"
        : ""
    }
  `}
>
              <td className="p-4">
                {ticket.ticket_id}
              </td>

              <td className="p-4">
                {ticket.customer_name}
              </td>

              <td className="p-4">
                {ticket.subject}
              </td>

              <td className="p-4">

                <span
                  className={`
                    px-3 py-1 rounded-full text-sm
                    ${getStatusColor(ticket.status)}
                  `}
                >
                  {ticket.status}
                </span>

              </td>

              <td className="p-4">
                {new Date(
                  ticket.created_at
                ).toLocaleDateString()}
              </td>

              <td className="p-4">

                <button
                
  onClick={(e) => {
    e.stopPropagation();
    handleDelete(ticket.ticket_id);
  }}
                  className="
                    bg-red-500
                    hover:bg-red-600
                    text-white
                    px-3
                    py-1
                    rounded-lg
                    transition
                  "
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}