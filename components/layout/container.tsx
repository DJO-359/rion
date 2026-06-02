import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 h-full">{children}</div>
  );
}
