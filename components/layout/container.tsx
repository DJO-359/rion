import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function Container({ children }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">{children}</div>
  );
}
