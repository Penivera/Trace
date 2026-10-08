import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";

import { investigators } from "../data";
import { InvestigatorPicker } from "./investigator-picker";

it("submits the chosen investigator and the case to the action", async () => {
  const user = userEvent.setup();
  const action = vi.fn<(formData: FormData) => Promise<void>>().mockResolvedValue();
  render(<InvestigatorPicker investigators={investigators} action={action} caseId="case-001" />);

  const buttons = screen.getAllByRole("button", { name: /^select /i });
  expect(buttons).toHaveLength(4);

  await user.click(buttons[1]!);

  expect(action).toHaveBeenCalledOnce();
  const formData = action.mock.calls[0]![0];
  expect(formData.get("investigatorId")).toBe("officer-2");
  expect(formData.get("caseId")).toBe("case-001");
});
