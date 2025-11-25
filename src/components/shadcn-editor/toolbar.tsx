"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  TOGGLE_LINK_COMMAND,
  $isLinkNode,
} from "@lexical/link";
import { $setBlocksType, mergeRegister } from "@lexical/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List as ListIcon,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";

const BLOCK_OPTIONS = [
  { value: "paragraph", label: "Đoạn văn" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "quote", label: "Trích dẫn" },
];

export function EditorToolbar() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<string>("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikeThrough, setIsStrikeThrough] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const activeBlock = useMemo(() => {
    const option = BLOCK_OPTIONS.find((option) => option.value === blockType);
    return option ? option.value : "paragraph";
  }, [blockType]);

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikeThrough(selection.hasFormat("strikethrough"));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if (element) {
        const elementType = element.getType();
        if (elementType === "heading") {
          // @ts-expect-error - tag exists on heading nodes
          setBlockType(element.getTag?.() ?? "paragraph");
        } else {
          setBlockType(elementType);
        }
      }

      const parent = anchorNode.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(anchorNode));
    });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerUpdateListener(() => {
        updateToolbar();
      })
    );
  }, [editor, updateToolbar]);

  const formatBlock = (type: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }
      if (type === "paragraph") {
        $setBlocksType(selection, () => $createParagraphNode());
        return;
      }
      if (type === "quote") {
        $setBlocksType(selection, () => $createQuoteNode());
        return;
      }
      $setBlocksType(selection, () => $createHeadingNode(type as "h1" | "h2" | "h3"));
    });
  };

  const toggleLink = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      return;
    }
    const url = window.prompt("Nhập đường dẫn liên kết:");
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b bg-background/80 px-3 py-2">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        >
          <Undo2 className="size-4" />
          <span className="sr-only">Hoàn tác</span>
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        >
          <Redo2 className="size-4" />
          <span className="sr-only">Làm lại</span>
        </Button>
      </div>
      <Select value={activeBlock} onValueChange={(value) => formatBlock(value)}>
        <SelectTrigger className="h-9 w-32">
          <SelectValue placeholder="Kiểu chữ" />
        </SelectTrigger>
        <SelectContent>
          {BLOCK_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={isBold}
          onPressedChange={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
          }
        >
          <Bold className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={isItalic}
          onPressedChange={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
          }
        >
          <Italic className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={isUnderline}
          onPressedChange={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
          }
        >
          <Underline className="size-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={isStrikeThrough}
          onPressedChange={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
          }
        >
          <Strikethrough className="size-4" />
        </Toggle>
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() =>
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          }
        >
          <ListIcon className="size-4" />
          <span className="sr-only">Danh sách bullet</span>
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() =>
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          }
        >
          <ListOrdered className="size-4" />
          <span className="sr-only">Danh sách số</span>
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => formatBlock("quote")}
        >
          <Quote className="size-4" />
          <span className="sr-only">Trích dẫn</span>
        </Button>
        <Button
          type="button"
          size="icon"
          variant={isLink ? "default" : "ghost"}
          onClick={toggleLink}
        >
          <LinkIcon className="size-4" />
          <span className="sr-only">Liên kết</span>
        </Button>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
        {activeBlock === "h1" && <Heading1 className="size-4" />}
        {activeBlock === "h2" && <Heading2 className="size-4" />}
        {activeBlock === "h3" && <Heading3 className="size-4" />}
      </div>
    </div>
  );
}

