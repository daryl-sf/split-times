import { FC } from "react";

export type ButtonProps = {
  variant?: "neutral" | "success" | "warn";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const getBgColor = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "neutral":
      return "bg-blue-500";
    case "success":
      return "bg-green-500";
    case "warn":
      return "bg-red-500";
  }
};

export const Button: FC<ButtonProps> = ({
  variant = "neutral",
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`${getBgColor(
        variant,
      )} cursor-pointer text-white p-4 text-center inline-block rounded-sm disabled:bg-gray-500 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
