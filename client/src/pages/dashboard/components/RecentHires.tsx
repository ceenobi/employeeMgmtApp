import { Userinfo } from "@/emply-types";

export default function RecentHires({
  recentEmployees,
}: {
  recentEmployees: Userinfo[];
}) {
  return (
    <div className="bg-base-200 shadow-lg p-4 rounded-lg">
      <p>Most recent hires</p>
      {recentEmployees?.map((user: Userinfo) => (
        <div className="my-6 flex items-center gap-2" key={user?._id}>
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-8 rounded-full">
              {user?.photo && <img src={user?.photo} alt={user?.firstName} />}
              {!user?.photo && (
                <span>
                  {user?.firstName.slice(0, 1) +
                    (user?.lastName.slice(0, 1) || "")}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold">
              {user?.firstName.concat(" ", user?.lastName)}
            </p>
            <p className="text-sm">{user?.jobTitle || user?.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
