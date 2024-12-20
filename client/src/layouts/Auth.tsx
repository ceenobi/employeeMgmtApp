import { Fence } from "lucide-react";
import { Link, Outlet } from "react-router";

export default function Auth() {
  return (
    <div className="flex justify-center items-center min-h-dvh bg-base-100">
      <div>
        <Link to="/" className="p-3">
          <Fence className="mx-auto text-secondary" size={28} />
        </Link>
        <div className="card glass w-96">
          <div className="card-body">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
