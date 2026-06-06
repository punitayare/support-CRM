import { useEffect, useState } from "react";
import {
  X,
  CalendarDays,
  Plus,
} from "lucide-react";

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

  const fetchTicket = async () => {
    try {
      const response = await api.get(
        `/api/tickets/${ticketId}`
      );

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

  const handleSave = async () => {
    try {
      await api.put(
        `/api/tickets/${ticketId}`,
        {
          status,
          note,
        }
      );

      setNote("");

      fetchTicket();

      if (refreshTickets) {
        refreshTickets();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (value) => {
    switch (value) {
      case "Closed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-end">
      <div className="w-[420px] bg-white h-full shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              {ticket?.ticket_id || "Loading..."}
            </h2>

            <div className="flex items-center gap-2 text-slate-500 mt-2">
              <CalendarDays size={16} />
              <span>
                Created on{" "}
                {ticket?.created_at
                  ? new Date(
                      ticket.created_at
                    ).toLocaleString()
                  : "-"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`
                px-4 py-1 rounded-full text-sm font-medium
                ${getStatusColor(status)}
              `}
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
          <>
            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

              {/* Ticket Details */}
              <section>
                <h3 className="font-semibold text-lg border-l-4 border-indigo-600 pl-3 mb-5">
                  Ticket Details
                </h3>

                <div className="space-y-5">

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
                    <label className="text-slate-500 text-sm block mb-2">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value)
                      }
                      className="
                        w-full
                        h-12
                        rounded-xl
                        border
                        border-slate-300
                        px-4
                        outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                      "
                    >
                      <option value="Open">
                        Open
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Closed">
                        Closed
                      </option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section>
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-semibold text-lg border-l-4 border-indigo-600 pl-3">
                    Notes & Updates
                  </h3>

                  <button
                    className="
                      flex
                      items-center
                      gap-2
                      bg-indigo-600
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    <Plus size={16} />
                    Add Note
                  </button>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />

                  {ticket.notes?.map((item) => (
                    <div
                      key={item.id}
                      className="relative mb-8"
                    >
                      <div className="absolute -left-[27px] top-1 h-6 w-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                        N
                      </div>

                      <div>
                        <div className="flex justify-between">
                          <h4 className="font-semibold">
                            Support Agent
                          </h4>

                          <span className="text-sm text-slate-400">
                            {new Date(
                              item.created_at
                            ).toLocaleString()}
                          </span>
                        </div>

                        <p className="mt-2 text-slate-600 leading-relaxed">
                          {item.note_text}
                        </p>
                      </div>
                    </div>
                  ))}

                  {!ticket.notes?.length && (
                    <p className="text-slate-500">
                      No notes available.
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Bottom Note Box */}
            <div className="border-t p-5 bg-white">
              <textarea
                rows={4}
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                placeholder="Add a note..."
                className="
                  w-full
                  border
                  border-slate-300
                  rounded-xl
                  p-4
                  resize-none
                  focus:ring-2
                  focus:ring-indigo-500
                  outline-none
                "
              />

              <button
                onClick={handleSave}
                className="
                  mt-4
                  w-full
                  bg-indigo-600
                  hover:bg-indigo-700
                  text-white
                  h-12
                  rounded-xl
                  font-medium
                "
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">
        {label}
      </p>

      <p className="text-slate-900 font-medium">
        {value || "-"}
      </p>
    </div>
  );
}