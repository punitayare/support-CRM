import { useEffect, useState } from "react";
import { X, CalendarDays, Plus } from "lucide-react";
import api from "../api/api";

export default function TicketDetailsDrawer({
  ticketId,
  isOpen,
  onClose,
  refreshTickets,
}) {
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [showNoteBox, setShowNoteBox] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const role = (user?.role || "").toLowerCase().trim();
  const canEdit = role === "admin" || role === "agent";

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/api/tickets/${ticketId}`);
      setTicket(response.data);
      setStatus(response.data.status);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (ticketId && isOpen) {
      fetchTicket();
    }
  }, [ticketId, isOpen]);

  const handleSaveStatus = async () => {
    try {
      await api.put(`/api/tickets/${ticketId}`, {
        status,
        note: null,
      });

      await fetchTicket();
      refreshTickets?.();

      alert("Status updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  const handleSaveNote = async () => {
    if (!note.trim()) {
      alert("Please enter a note");
      return;
    }

    try {
      await api.put(`/api/tickets/${ticketId}`, {
        status,
        note,
      });

      setNote("");
      setShowNoteBox(false);

      await fetchTicket();
      refreshTickets?.();

      alert("Note added successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to add note");
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (value) => {
    switch (value) {
      case "Closed":
      case "Resolved":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-end">
      <div className="w-[420px] bg-white h-full shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="p-6 border-b flex justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {ticket?.ticket_id || "Loading..."}
            </h2>

            <div className="flex items-center gap-2 text-slate-500 mt-2">
              <CalendarDays size={16} />

              <span>
                {ticket?.created_at
                  ? new Date(ticket.created_at).toLocaleString()
                  : "-"}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                status
              )}`}
            >
              {status}
            </span>

            <button onClick={onClose}>
              <X size={22} />
            </button>
          </div>
        </div>

        {!ticket ? (
          <div className="p-6">Loading...</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">

            {/* DETAILS */}
            <section className="mb-8">
              <h3 className="font-semibold text-lg mb-4">
                Ticket Details
              </h3>

              <div className="space-y-4">
                <InfoItem
                  label="Customer Name"
                  value={ticket.customer_name}
                />

                <InfoItem
                  label="Email"
                  value={ticket.customer_email}
                />

                <InfoItem
                  label="Subject"
                  value={ticket.subject}
                />

                <InfoItem
                  label="Description"
                  value={ticket.description}
                />

                <div>
                  <label className="text-sm text-slate-500 block mb-2">
                    Status
                  </label>

                  <select
                    value={status}
                    disabled={!canEdit}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded-xl h-12 px-4"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">
                      In Progress
                    </option>
                    <option value="Closed">
                      Closed
                    </option>
                  </select>

                  {canEdit && (
                    <button
                      onClick={handleSaveStatus}
                      className="
                        mt-4
                        w-full
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        py-3
                        rounded-xl
                      "
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* NOTES */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  Notes & Updates
                </h3>

                {canEdit && (
                  <button
                    onClick={() =>
                      setShowNoteBox(!showNoteBox)
                    }
                    className="
                      flex items-center gap-2
                      bg-indigo-600
                      text-white
                      px-4 py-2
                      rounded-lg
                    "
                  >
                    <Plus size={16} />
                    Add Note
                  </button>
                )}
              </div>

              {/* NOTE BOX APPEARS HERE */}
              {showNoteBox && (
                <div className="mb-6 border rounded-xl p-4 bg-slate-50">
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(e) =>
                      setNote(e.target.value)
                    }
                    placeholder="Write note..."
                    className="
                      w-full
                      border
                      rounded-lg
                      p-3
                      resize-none
                    "
                  />

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => {
                        setShowNoteBox(false);
                        setNote("");
                      }}
                      className="
                        flex-1
                        border
                        rounded-lg
                        py-2
                      "
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSaveNote}
                      className="
                        flex-1
                        bg-indigo-600
                        text-white
                        rounded-lg
                        py-2
                      "
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {ticket.notes?.length ? (
                ticket.notes.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-4 border-indigo-500 pl-4 mb-5"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-semibold">
                        Support Agent
                      </h4>

                      <span className="text-xs text-gray-500">
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-2">
                      {item.note_text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">
                  No notes available.
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="font-medium">
        {value || "-"}
      </p>
    </div>
  );
}