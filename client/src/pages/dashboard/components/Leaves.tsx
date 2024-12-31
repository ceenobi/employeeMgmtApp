import { LeaveFormData } from "@/emply-types";

type LeaveProps = {
  approvedLeaves: LeaveFormData[];
  pendingLeaves: LeaveFormData[];
  rejectedLeaves: LeaveFormData[];
};

export default function Leaves({
  approvedLeaves,
  pendingLeaves,
  rejectedLeaves,
}: LeaveProps) {
  const totalLeaves =
    approvedLeaves?.length + pendingLeaves?.length + rejectedLeaves?.length;
  const approvedPercentage = totalLeaves
    ? (approvedLeaves?.length / totalLeaves) * 100
    : 0;
  const pendingPercentage = totalLeaves
    ? (pendingLeaves?.length / totalLeaves) * 100
    : 0;
  const rejectedPercentage = totalLeaves
    ? (rejectedLeaves?.length / totalLeaves) * 100
    : 0;

  return (
    <div className="bg-base-200 shadow-lg p-4 rounded-lg">
      <p>Recently approved leaves</p>
      {approvedLeaves?.slice(0, 3).map((leave: LeaveFormData) => (
        <div className="my-4 flex items-center gap-2" key={leave?._id}>
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-8 rounded-full">
              {leave?.employee?.photo && (
                <img
                  src={leave?.employee?.photo}
                  alt={leave?.employee?.firstName}
                />
              )}
              {!leave?.employee?.photo && (
                <span>
                  {leave?.employee?.firstName.slice(0, 1) +
                    (leave?.employee?.lastName.slice(0, 1) || "")}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold">
              {leave?.employee?.firstName.concat(
                " ",
                leave?.employee?.lastName
              )}
            </p>
          </div>
        </div>
      ))}
      <div className="divider"></div>
      <p>Leave Stats</p>
      <div className="my-4 flex flex-wrap justify-between">
        <div>
          <div
            className="radial-progress text-success"
            style={
              {
                "--value": Math.max(0, Math.min(100, approvedPercentage)),
              } as React.CSSProperties
            }
            role="progressbar"
          >
            {approvedPercentage.toFixed(2)}%
          </div>
          <p>Approved</p>
        </div>
        <div>
          <div
            className="radial-progress text-warning"
            style={
              {
                "--value": Math.max(0, Math.min(100, pendingPercentage)),
              } as React.CSSProperties
            }
            role="progressbar"
          >
            {pendingPercentage.toFixed(2)}%
          </div>
          <p>Pending</p>
        </div>
        <div>
          <div
            className="radial-progress text-error"
            style={
              {
                "--value": Math.max(0, Math.min(100, rejectedPercentage)),
              } as React.CSSProperties
            }
            role="progressbar"
          >
            {rejectedPercentage.toFixed(2)}%
          </div>
          <p>Rejected</p>
        </div>
      </div>
    </div>
  );
}
