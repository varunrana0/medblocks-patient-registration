import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPatients from "./RegisterPatients";

jest.mock("@/actions/actions", () => ({
  registerPatient: jest.fn(),
  refreshPatients: jest.fn(),
}));

describe("RegisterPatients", () => {
  beforeEach(() => {
    global.BroadcastChannel = class {
      constructor() {}
      postMessage = jest.fn();
      close = jest.fn();
      onmessage: ((event: MessageEvent) => void) | null = null;
    } as unknown as typeof BroadcastChannel;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dialog when button is clicked", () => {
    render(<RegisterPatients />);
    fireEvent.click(screen.getByRole("button", { name: /add new patient/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows validation errors if required fields are empty", async () => {
    render(<RegisterPatients />);
    fireEvent.click(screen.getByRole("button", { name: /add new patient/i }));
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
    });
  });
});
