import { FC } from "react";

interface UndoToastProps {
  runner: number;
  stageId: number;
  onRedo: () => void;
  onDismiss: () => void;
}

export const UndoToast: FC<UndoToastProps> = ({
  runner,
  stageId,
  onRedo,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-[340px] left-4 right-4 z-10 pointer-events-none flex justify-center">
      <div className="pointer-events-auto bg-gray-800 text-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-3 text-sm">
        <span>
          Undid runner #{runner} S{stageId}
        </span>
        <button
          type="button"
          onClick={onRedo}
          className="font-bold text-blue-300 hover:text-blue-100 active:scale-95"
        >
          Redo
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="text-gray-400 hover:text-white ml-1"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
