import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallDisplay } from "../ToolCallDisplay";

afterEach(() => {
  cleanup();
});

describe("ToolCallDisplay", () => {
  describe("str_replace_editor tool", () => {
    it("shows 'Creating X' for create command", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "create", path: "/components/Card.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Creating Card.jsx")).toBeDefined();
    });

    it("shows 'Editing X' for str_replace command", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "str_replace", path: "/components/Button.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Editing Button.jsx")).toBeDefined();
    });

    it("shows 'Editing X' for insert command", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "insert", path: "/utils/helpers.js" }}
          state="result"
        />
      );
      expect(screen.getByText("Editing helpers.js")).toBeDefined();
    });

    it("shows 'Reading X' for view command", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "view", path: "/App.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Reading App.jsx")).toBeDefined();
    });

    it("shows 'Undoing edit to X' for undo_edit command", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "undo_edit", path: "/components/Form.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Undoing edit to Form.jsx")).toBeDefined();
    });
  });

  describe("file_manager tool", () => {
    it("shows 'Moving X → Y' for rename command", () => {
      render(
        <ToolCallDisplay
          toolName="file_manager"
          args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Moving old.jsx → new.jsx")).toBeDefined();
    });

    it("shows 'Deleting X' for delete command", () => {
      render(
        <ToolCallDisplay
          toolName="file_manager"
          args={{ command: "delete", path: "/components/Unused.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Deleting Unused.jsx")).toBeDefined();
    });
  });

  describe("fallback behavior", () => {
    it("falls back to tool name for unknown tools", () => {
      render(
        <ToolCallDisplay
          toolName="unknown_tool"
          args={{ some: "args" }}
          state="result"
        />
      );
      expect(screen.getByText("unknown_tool")).toBeDefined();
    });

    it("falls back to tool name for unknown commands", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "unknown_command", path: "/file.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("str_replace_editor")).toBeDefined();
    });
  });

  describe("status indicators", () => {
    it("shows loading spinner when state is pending", () => {
      const { container } = render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "create", path: "/file.jsx" }}
          state="pending"
        />
      );
      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeDefined();
      expect(spinner).not.toBeNull();
    });

    it("shows green indicator when state is result", () => {
      const { container } = render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "create", path: "/file.jsx" }}
          state="result"
        />
      );
      const indicator = container.querySelector(".bg-emerald-500");
      expect(indicator).toBeDefined();
      expect(indicator).not.toBeNull();
    });
  });

  describe("filename extraction", () => {
    it("extracts filename from nested path", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "create", path: "/src/components/ui/Button.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Creating Button.jsx")).toBeDefined();
    });

    it("handles root-level files", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "create", path: "/App.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Creating App.jsx")).toBeDefined();
    });
  });
});
