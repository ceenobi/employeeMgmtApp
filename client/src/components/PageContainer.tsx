import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  [key: string]: unknown;
}

export default function PageContainer({ children, classname }: PageProps) {
  return (
    <div className="py-2 px-4">
      <div className={`my-4 ${classname}`}>{children}</div>
    </div>
  );
}
