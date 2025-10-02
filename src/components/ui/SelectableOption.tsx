import { PropsWithChildren } from "react";

type SelectableOptionProps = {
  selected: boolean;
  onChange: (selected: boolean) => void;
  className?: string;
};

export default function SelectableOption(
  { selected, onChange, className, children }: PropsWithChildren<SelectableOptionProps>,
) {
  return (
    <button
      type="button"
      onClick={() => onChange(!selected)}
      className={
        "flex items-center justify-center gap-3 h-12 px-3 rounded-md border-2 text-base font-semibold transition-colors bg-white dark:bg-gray-800 " +
        (className ? className + " " : "") +
        (selected
          ? "border-blue-600 dark:!border-white text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/30 "
          : "border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 ")
      }
    >
      <span className="text-sm sm:text-base text-left text-gray-900 dark:text-gray-100">{children}</span>
    </button>
  );
}


