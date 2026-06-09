import { User } from "@/interfaces/auth/user";

interface Props {
  user: User | null;
}

const ToolTip = ({ user }: Props) => {
  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  if (!user) return <></>;
  return (
    <div
      className="
          absolute left-1/2 -translate-x-1/2 mt-2
          hidden group-hover:flex
          flex-col gap-2
          w-56
          bg-white dark:bg-zinc-900
          border border-gray-200 dark:border-zinc-700
          shadow-lg rounded-lg
          p-3
          z-50
        "
    >
      {/* Avatar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
          {initials}
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-sm">{user.name}</span>
          <span className="text-xs text-gray-500">{user.role}</span>
        </div>
      </div>

      {/* Email */}
      <div className="text-xs text-gray-600 dark:text-gray-300">
        {user.email}
      </div>
    </div>
  );
};

export default ToolTip;
