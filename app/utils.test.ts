import { convertMsToTime } from "./utils";

test("convertMsToTime", () => {
  expect(convertMsToTime(0)).toBe("00:00:00");
  expect(convertMsToTime(1000)).toBe("00:00:01");
  expect(convertMsToTime(60000)).toBe("00:01:00");
  expect(convertMsToTime(3600000)).toBe("01:00:00");
  expect(convertMsToTime(3661000)).toBe("01:01:01");
});
