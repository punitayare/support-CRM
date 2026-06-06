import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import SearchBar from "../components/SearchBar";
import TicketTable from "../components/TicketTable";
import CreateTicketModal from "../components/CreateTicketModal";
import TicketDetailsDrawer from "../components/TicketsDetailDrawer";

import api from "../api/api";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedTicket, setSelectedTicket] =
  useState(null);
const [search, setSearch] = useState("");
const [status, setStatus] = useState("");
const [isDrawerOpen, setIsDrawerOpen] =
  useState(false);
  

  const fetchTickets = async (
  searchValue = search,
  statusValue = status
) => {
  try {
    const response = await api.get("/api/tickets/", {
      params: {
        search: searchValue || undefined,
        status: statusValue || undefined,
      },
    });

    setTickets(response.data);
    console.log("API Response:", response.data);

  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  fetchTickets(search, status);
}, [search, status]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <Header />

        <StatsCards tickets={tickets} />

        <SearchBar
  search={search}
  setSearch={setSearch}
  status={status}
  setStatus={setStatus}
  onCreateClick={() => setIsModalOpen(true)}
/>
       <TicketTable
  tickets={tickets}
  refreshTickets={fetchTickets}
  selectedTicket={selectedTicket}
  onSelectTicket={(id) => {
    setSelectedTicket(id);
    setIsDrawerOpen(true);
  }}
/>

<TicketDetailsDrawer
  ticketId={selectedTicket}
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  refreshTickets={fetchTickets}
/>
        <CreateTicketModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refreshTickets={fetchTickets}
        />
      </main>
    </div>
  );
}