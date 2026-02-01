"use client";

import { Loader2 } from "lucide-react";

interface ToolCallDisplayProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "pending" | "result";
}

function getFilename(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

function getDisplayMessage(toolName: string, args: Record<string, unknown>): string {
  if (toolName === "str_replace_editor") {
    const command = args.command as string;
    const path = args.path as string;
    const filename = path ? getFilename(path) : "file";

    switch (command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
        return `Editing ${filename}`;
      case "insert":
        return `Editing ${filename}`;
      case "view":
        return `Reading ${filename}`;
      case "undo_edit":
        return `Undoing edit to ${filename}`;
      default:
        return toolName;
    }
  }

  if (toolName === "file_manager") {
    const command = args.command as string;
    const path = args.path as string;
    const filename = path ? getFilename(path) : "file";

    switch (command) {
      case "rename":
        const newPath = args.new_path as string;
        const newFilename = newPath ? getFilename(newPath) : "file";
        return `Moving ${filename} → ${newFilename}`;
      case "delete":
        return `Deleting ${filename}`;
      default:
        return toolName;
    }
  }

  return toolName;
}

export function ToolCallDisplay({ toolName, args, state }: ToolCallDisplayProps) {
  const message = getDisplayMessage(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {state === "result" ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
