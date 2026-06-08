export default function SearchBar({
  search,
  setSearch,
  status,
  setStatus,
  onCreateClick,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">

      <input
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          flex-1
          p-3
          border
          rounded-xl
          focus:ring-2
          focus:ring-indigo-500
          outline-none
        "
      />

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
        className="
          p-3
          border
          rounded-xl
          bg-white
        "
      >
        <option value="">
          All Statuses
        </option>

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

      <button
        onClick={onCreateClick}
        className="
          bg-indigo-600
          text-white
          px-5
          py-3
          rounded-xl
          hover:bg-indigo-700
        "
      >
        + Create Ticket
      </button>

    </div>
  );
}