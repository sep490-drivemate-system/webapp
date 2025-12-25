"use client";

import { useMemo, useRef, useEffect } from "react";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
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
  $createTextNode,
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

// Plugin to update editor when initialValue changes from empty to non-empty
// This handles the case when content is loaded from API after component mount
function UpdateContentPlugin({ initialValue }: { initialValue: string }) {
  const [editor] = useLexicalComposerContext();
  const lastInitialValueRef = useRef(initialValue);
  const isInitialMountRef = useRef(true);
  const hasContentLoadedRef = useRef(false);

  useEffect(() => {
    // Skip on initial mount - editorState handles that
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      lastInitialValueRef.current = initialValue;
      // Mark as loaded if initial value has content
      if (initialValue?.trim()) {
        hasContentLoadedRef.current = true;
      }
      return;
    }

    // Only update if:
    // 1. initialValue changed from empty to non-empty
    // 2. AND we haven't loaded content yet (to avoid overwriting user input)
    // This indicates content was loaded from API, not user input
    const wasEmpty = !lastInitialValueRef.current?.trim();
    const isNowNotEmpty = !!initialValue?.trim();
    
    if (initialValue !== lastInitialValueRef.current && wasEmpty && isNowNotEmpty && !hasContentLoadedRef.current) {
      hasContentLoadedRef.current = true;
      lastInitialValueRef.current = initialValue;
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const normalizedValue = initialValue?.trim();
        if (normalizedValue) {
          try {
            const parser = new DOMParser();
            // Wrap content in a div if it doesn't have a container element
            // This ensures we always have valid structure
            const wrappedHtml = normalizedValue.startsWith('<') 
              ? normalizedValue 
              : `<div>${normalizedValue}</div>`;
            const dom = parser.parseFromString(wrappedHtml, "text/html");
            // Parse from body element to get only the content nodes
            const bodyElement = dom.body;
            const lexicalNodes = $generateNodesFromDOM(editor, bodyElement);
            // Filter to only include element nodes (not text nodes)
            lexicalNodes.forEach((node) => {
              // Only append element nodes to root (check if it's not a text node)
              const nodeType = node.getType();
              if (nodeType !== 'text' && nodeType !== 'linebreak') {
                root.append(node);
              }
            });
            // If no valid nodes were added, add a paragraph
            if (root.getChildrenSize() === 0) {
              root.append($createParagraphNode());
            }
          } catch (error) {
            console.error('Error parsing HTML content:', error);
            // Fallback: create a paragraph with the text content
            const paragraph = $createParagraphNode();
            const textNode = $createTextNode(normalizedValue);
            paragraph.append(textNode);
            root.append(paragraph);
          }
        } else {
          root.append($createParagraphNode());
        }
      });
    } else if (initialValue !== lastInitialValueRef.current) {
      // Update ref to track changes
      lastInitialValueRef.current = initialValue;
    }
  }, [initialValue, editor]);

  return null;
}

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
          try {
            const parser = new DOMParser();
            // Wrap content in a div if it doesn't have a container element
            // This ensures we always have valid structure
            const wrappedHtml = normalizedValue.startsWith('<') 
              ? normalizedValue 
              : `<div>${normalizedValue}</div>`;
            const dom = parser.parseFromString(wrappedHtml, "text/html");
            // Parse from body element to get only the content nodes
            const bodyElement = dom.body;
            const lexicalNodes = $generateNodesFromDOM(editor, bodyElement);
            // Filter to only include element nodes (not text nodes)
            lexicalNodes.forEach((node) => {
              // Only append element nodes to root (check if it's not a text node)
              const nodeType = node.getType();
              if (nodeType !== 'text' && nodeType !== 'linebreak') {
                root.append(node);
              }
            });
            // If no valid nodes were added, add a paragraph
            if (root.getChildrenSize() === 0) {
              root.append($createParagraphNode());
            }
          } catch (error) {
            console.error('Error parsing HTML content:', error);
            // Fallback: create a paragraph with the text content
            const paragraph = $createParagraphNode();
            const textNode = $createTextNode(normalizedValue);
            paragraph.append(textNode);
            root.append(paragraph);
          }
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
            <UpdateContentPlugin initialValue={initialValue} />
          </div>
        </div>
      </TooltipProvider>
    </LexicalComposer>
  );
}
