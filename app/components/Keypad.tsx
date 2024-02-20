import { FC } from "react";

import { Button } from "./Button";

export interface KeypadProps {
  onChange: (value: number | "del" | "enter") => void;
  disabledDel?: boolean;
  disabledEnter?: boolean;
  numberInput?: number;
}

export const Keypad: FC<KeypadProps> = ({
  onChange,
  disabledDel,
  disabledEnter,
  numberInput,
}) => {
  return (
    <div className="grid grid-cols-3 grid-rows-4 gap-4 sm:w-1/2">
      <div className="col-span-3 text-2xl my-2 mx-auto text-center">
        {numberInput || <>&nbsp;</>}
      </div>
      <Button onClick={() => onChange(1)}>1</Button>
      <Button onClick={() => onChange(2)}>2</Button>
      <Button onClick={() => onChange(3)}>3</Button>
      <Button onClick={() => onChange(4)}>4</Button>
      <Button onClick={() => onChange(5)}>5</Button>
      <Button onClick={() => onChange(6)}>6</Button>
      <Button onClick={() => onChange(7)}>7</Button>
      <Button onClick={() => onChange(8)}>8</Button>
      <Button onClick={() => onChange(9)}>9</Button>
      <Button onClick={() => onChange("del")} disabled={disabledDel}>
        &lt;
      </Button>
      <Button onClick={() => onChange(0)}>0</Button>
      <Button onClick={() => onChange("enter")} disabled={disabledEnter}>
        Enter
      </Button>
    </div>
  );
};
