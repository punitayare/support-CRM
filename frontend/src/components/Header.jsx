export default function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="mb-6 sm:mb-8">

      {/* TITLE */}
      <h1 className="text-xl sm:text-3xl font-bold leading-tight">
        Welcome Back 👋
        {user?.name && (
          <span className="block sm:inline text-indigo-600 sm:ml-2">
            {user.name}
          </span>
        )}
      </h1>

      {/* SUBTITLE */}
      <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">
        Manage support tickets efficiently.
      </p>
    </div>
  );
}