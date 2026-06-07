export default function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">
        Welcome Back 👋 {user?.name ? `, ${user.name}` : ""}
      </h1>

      <p className="text-slate-500 mt-1">
        Manage support tickets efficiently.
      </p>
    </div>
  );
}