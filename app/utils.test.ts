import { convertMsToTime } from "./utils";

test("convertMsToTime", () => {
  expect(convertMsToTime(0)).toBe("00:00:00.0");
  expect(convertMsToTime(1000)).toBe("00:00:01.0");
  expect(convertMsToTime(1100)).toBe("00:00:01.1");
  expect(convertMsToTime(1550)).toBe("00:00:01.5");
  expect(convertMsToTime(60000)).toBe("00:01:00.0");
  expect(convertMsToTime(3600000)).toBe("01:00:00.0");
  expect(convertMsToTime(3661000)).toBe("01:01:01.0");
  expect(convertMsToTime(3661300)).toBe("01:01:01.3");
});
