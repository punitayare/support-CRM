export default function SearchBar({
  search,
  setSearch,
  status,
  setStatus,
  onCreateClick,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">

      {/* SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          w-full
          sm:flex-1
          h-11
          px-4
          border
          rounded-xl
          focus:ring-2
          focus:ring-indigo-500
          outline-none
          text-sm
        "
      />

      {/* STATUS FILTER */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="
          w-full
          sm:w-auto
          h-11
          px-3
          border
          rounded-xl
          bg-white
          text-sm
          focus:ring-2
          focus:ring-indigo-500
          outline-none
        "
      >
        <option value="">All Statuses</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>

      {/* CREATE BUTTON */}
      <button
        onClick={onCreateClick}
        className="
          w-full
          sm:w-auto
          h-11
          px-5
          bg-indigo-600
          text-white
          rounded-xl
          hover:bg-indigo-700
          transition
          text-sm
          font-medium
        "
      >
        + Create Ticket
      </button>

    </div>
  );
}