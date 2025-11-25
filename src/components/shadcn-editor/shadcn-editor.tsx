"use client";

import { useMemo, useRef } from "react";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TRANSFORMERS } from "@lexical/markdown";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  $createParagraphNode,
  $getRoot,
  EditorState,
  LexicalEditor,
} from "lexical";

import { TooltipProvider } from "@/components/ui/tooltip";
import { editorTheme } from "./editor-theme";
import { EditorToolbar } from "./toolbar";

type ShadcnEditorProps = {
  initialValue?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
};

function onError(error: Error) {
  console.error("Lexical editor error", error);
}

const nodes = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
  CodeNode,
  CodeHighlightNode,
];

export function ShadcnEditor({
  initialValue = "",
  onChange,
  placeholder = "Bắt đầu viết…",
}: ShadcnEditorProps) {
  const lastHtmlRef = useRef(initialValue);

  const initialConfig: InitialConfigType = useMemo(
    () => ({
      namespace: "blog-rich-text-editor",
      theme: editorTheme,
      nodes,
      onError,
      editorState: (editor: LexicalEditor) => {
        const root = $getRoot();
        root.clear();
        const normalizedValue = initialValue?.trim();
        if (normalizedValue) {
          const parser = new DOMParser();
          const dom = parser.parseFromString(normalizedValue, "text/html");
          const lexicalNodes = $generateNodesFromDOM(editor, dom);
          lexicalNodes.forEach((node) => {
            root.append(node);
          });
        } else {
          root.append($createParagraphNode());
        }
      },
    }),
    [initialValue]
  );

  const handleChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor, null);
      if (html !== lastHtmlRef.current) {
        lastHtmlRef.current = html;
        onChange?.(html);
      }
    });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <TooltipProvider>
        <div className="flex flex-col overflow-hidden rounded-xl">
          <EditorToolbar />
          <div className="relative bg-background">
            <RichTextPlugin
              contentEditable={
                <div className="relative">
                  <ContentEditable
                    className="min-h-[260px] w-full bg-background px-4 py-3 text-sm leading-relaxed focus:outline-none"
                    aria-placeholder={placeholder}
                    placeholder={
                      <div className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground">
                        {placeholder}
                      </div>
                    }
                  />
                </div>
              }
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <AutoFocusPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <OnChangePlugin ignoreSelectionChange onChange={handleChange} />
          </div>
        </div>
      </TooltipProvider>
    </LexicalComposer>
  );
}
