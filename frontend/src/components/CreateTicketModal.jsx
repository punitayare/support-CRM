import { useState } from "react";
import api from "../api/api";

export default function CreateTicketModal({
  isOpen,
  onClose,
  refreshTickets,
}) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/tickets", formData);

      refreshTickets();
      onClose();

      setFormData({
        customer_name: "",
        customer_email: "",
        subject: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create ticket");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-4">
          Create Ticket
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            value={formData.customer_name}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="email"
            name="customer_email"
            placeholder="Customer Email"
            value={formData.customer_email}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <textarea
            rows="4"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl"
            >
              Create Ticket
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}