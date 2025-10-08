"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaCode,
  FaQuoteLeft,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaStrikethrough,
  FaRedo,
  FaUndo,
} from "react-icons/fa";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [format, setFormat] = useState<string>("p"); // <-- add this

  // Detect current block format on selection change
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editorRef.current) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const node = selection.anchorNode;
      if (!node) return;
      let el = node.nodeType === 1 ? (node as HTMLElement) : node.parentElement;
      while (el && el !== editorRef.current) {
        if (
          ["H1", "H2", "H3", "H4", "P", "BLOCKQUOTE", "PRE"].includes(
            el.tagName
          )
        ) {
          setFormat(el.tagName.toLowerCase());
          return;
        }
        el = el.parentElement;
      }
      setFormat("p");
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  // Execute command with proper focus
  const executeCommand = useCallback(
    (command: string, value?: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      // Focus the editor first
      editor.focus();

      try {
        // Use document.execCommand
        const success = document.execCommand(command, false, value);

        if (!success) {
          console.warn(`Command ${command} failed`);
        }

        // Force update
        setTimeout(() => {
          handleInput();
        }, 10);
      } catch (error) {
        console.error(`Error executing command ${command}:`, error);
      }
    },
    [handleInput]
  );

  // Insert list with proper HTML
  const insertList = useCallback(
    (ordered: boolean = false) => {
      const editor = editorRef.current;
      if (!editor) return;

      editor.focus();

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const listTag = ordered ? "ol" : "ul";

      // Create list HTML
      const listHTML = `<${listTag}><li>List item</li></${listTag}>`;

      // Insert the list
      if (range.collapsed) {
        // No text selected, insert at cursor
        const listElement = document.createElement("div");
        listElement.innerHTML = listHTML;
        const listNode = listElement.firstChild;

        if (listNode) {
          range.insertNode(listNode);

          // Position cursor inside the list item
          const listItem = listNode.querySelector("li");
          if (listItem) {
            range.selectNodeContents(listItem);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      } else {
        // Text is selected, wrap it in list
        const selectedText = range.toString();
        range.deleteContents();

        const listElement = document.createElement("div");
        listElement.innerHTML = `<${listTag}><li>${selectedText}</li></${listTag}>`;
        const listNode = listElement.firstChild;

        if (listNode) {
          range.insertNode(listNode);
        }
      }

      handleInput();
    },
    [handleInput]
  );

  // Insert link
  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (!url) return;

    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      // const range = selection.getRangeAt(0);
      const selectedText = selection.toString();

      if (selectedText) {
        // Wrap selected text
        executeCommand("createLink", url);
      } else {
        // Insert new link
        const linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        document.execCommand("insertHTML", false, linkHTML);
      }
    }

    handleInput();
  }, [executeCommand, handleInput]);

  // Insert image
  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (!url) return;

    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    const imgHTML = `<img src="${url}" alt="Inserted image" style="max-width: 100%; height: auto; display: block; margin: 1rem 0; border-radius: 0.5rem;">`;
    document.execCommand("insertHTML", false, imgHTML);

    handleInput();
  }, [handleInput]);

  // Format block (headings, paragraph, etc.)
  const formatBlock = useCallback(
    (tag: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      editor.focus();

      if (tag === "blockquote") {
        executeCommand("formatBlock", "blockquote");
      } else if (tag === "pre") {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const selectedText = selection.toString() || "Code block";
          const codeHTML = `<pre style="background: #f8f9fa; padding: 1rem; border-radius: 0.5rem; font-family: monospace; margin: 1rem 0; border: 1px solid #e2e8f0;">${selectedText}</pre>`;
          document.execCommand("insertHTML", false, codeHTML);
        }
      } else {
        executeCommand("formatBlock", `<${tag}>`);
      }

      handleInput();
    },
    [executeCommand, handleInput]
  );

  // Handle paste to maintain formatting
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();

      const text = e.clipboardData.getData("text/plain");
      if (text) {
        document.execCommand("insertText", false, text);
        handleInput();
      }
    },
    [handleInput]
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            executeCommand("bold");
            break;
          case "i":
            e.preventDefault();
            executeCommand("italic");
            break;
          case "u":
            e.preventDefault();
            executeCommand("underline");
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              executeCommand("redo");
            } else {
              executeCommand("undo");
            }
            break;
        }
      }

      // Handle Enter in headings
      if (e.key === "Enter") {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const parentElement = range.startContainer.parentElement;

          if (
            parentElement &&
            ["H1", "H2", "H3", "H4", "H5", "H6"].includes(parentElement.tagName)
          ) {
            e.preventDefault();

            // Insert a new paragraph after the heading
            const pHTML = "<p><br></p>";
            document.execCommand("insertHTML", false, pHTML);
            handleInput();
          }
        }
      }
    },
    [executeCommand, handleInput]
  );

  // Update editor content when value changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

      editorRef.current.innerHTML = value;

      // Restore cursor position if possible
      if (range && editorRef.current.contains(range.startContainer)) {
        try {
          selection?.removeAllRanges();
          selection?.addRange(range);
        } catch (error) {
          console.error("Error restoring selection:", error);
        }
      }
    }
  }, [value]);

  // Toolbar buttons configuration
  const toolbarButtons = [
    {
      command: () => executeCommand("bold"),
      icon: FaBold,
      title: "Bold (Ctrl+B)",
    },
    {
      command: () => executeCommand("italic"),
      icon: FaItalic,
      title: "Italic (Ctrl+I)",
    },
    {
      command: () => executeCommand("underline"),
      icon: FaUnderline,
      title: "Underline (Ctrl+U)",
    },
    {
      command: () => executeCommand("strikeThrough"),
      icon: FaStrikethrough,
      title: "Strikethrough",
    },
    { command: () => insertList(false), icon: FaListUl, title: "Bullet List" },
    { command: () => insertList(true), icon: FaListOl, title: "Numbered List" },
    {
      command: () => formatBlock("blockquote"),
      icon: FaQuoteLeft,
      title: "Quote",
    },
    { command: () => formatBlock("pre"), icon: FaCode, title: "Code Block" },
    {
      command: () => executeCommand("justifyLeft"),
      icon: FaAlignLeft,
      title: "Align Left",
    },
    {
      command: () => executeCommand("justifyCenter"),
      icon: FaAlignCenter,
      title: "Align Center",
    },
    {
      command: () => executeCommand("justifyRight"),
      icon: FaAlignRight,
      title: "Align Right",
    },
  ];

  return (
    <div className="w-full border border-[#d1d9e6] rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-[#ECF0F3] p-3 border-b border-[#d1d9e6]">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Heading Dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                formatBlock(e.target.value);
                setFormat(e.target.value); // update state
              }
            }}
            className="px-3 py-2 rounded-lg bg-white border border-[#d1d9e6] outline-none text-sm font-medium text-[#3c3e41] focus:border-[#FF004F] transition-colors duration-200"
            value={format}
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>

          <div className="w-px h-6 bg-[#d1d9e6] mx-1"></div>

          {/* Format Buttons */}
          {toolbarButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.command}
                className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
                title={button.title}
              >
                <IconComponent className="w-4 h-4" />
              </button>
            );
          })}

          <div className="w-px h-6 bg-[#d1d9e6] mx-1"></div>

          {/* Link & Image Buttons */}
          <button
            type="button"
            onClick={insertLink}
            className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
            title="Insert Link"
          >
            <FaLink className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={insertImage}
            className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
            title="Insert Image"
          >
            <FaImage className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-[#d1d9e6] mx-1"></div>

          {/* Undo/Redo */}
          <button
            type="button"
            onClick={() => executeCommand("undo")}
            className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
            title="Undo (Ctrl+Z)"
          >
            <FaUndo className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand("redo")}
            className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
            title="Redo (Ctrl+Shift+Z)"
          >
            <FaRedo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[350px] max-h-[500px] overflow-y-auto p-4 outline-none transition-all duration-200 ${
          isFocused ? "ring-2 ring-[#FF004F] ring-opacity-20" : ""
        }`}
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#3c3e41",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Global Styles for Editor Content */}
      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
          pointer-events: none;
          position: absolute;
        }

        [contenteditable] h1 {
          font-size: 2.25rem !important;
          font-weight: 700 !important;
          margin: 1.5rem 0 1rem 0 !important;
          color: #1f2125 !important;
          line-height: 1.2 !important;
          display: block !important;
        }

        [contenteditable] h2 {
          font-size: 1.875rem !important;
          font-weight: 600 !important;
          margin: 1.25rem 0 0.75rem 0 !important;
          color: #1f2125 !important;
          line-height: 1.3 !important;
          display: block !important;
        }

        [contenteditable] h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          color: #1f2125 !important;
          line-height: 1.4 !important;
          display: block !important;
        }

        [contenteditable] h4 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin: 0.75rem 0 0.5rem 0 !important;
          color: #1f2125 !important;
          line-height: 1.4 !important;
          display: block !important;
        }

        [contenteditable] h5 {
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          margin: 0.75rem 0 0.5rem 0 !important;
          color: #1f2125 !important;
          line-height: 1.4 !important;
          display: block !important;
        }

        [contenteditable] h6 {
          font-size: 1rem !important;
          font-weight: 600 !important;
          margin: 0.75rem 0 0.5rem 0 !important;
          color: #1f2125 !important;
          line-height: 1.4 !important;
          display: block !important;
        }

        [contenteditable] p {
          margin: 0.75rem 0 !important;
          color: #3c3e41 !important;
          line-height: 1.6 !important;
          display: block !important;
        }

        [contenteditable] ul {
          margin: 1rem 0 !important;
          padding-left: 2rem !important;
          color: #3c3e41 !important;
          list-style-type: disc !important;
          display: block !important;
        }

        [contenteditable] ol {
          margin: 1rem 0 !important;
          padding-left: 2rem !important;
          color: #3c3e41 !important;
          list-style-type: decimal !important;
          display: block !important;
        }

        [contenteditable] li {
          margin: 0.25rem 0 !important;
          line-height: 1.6 !important;
          display: list-item !important;
        }

        [contenteditable] blockquote {
          border-left: 4px solid #ff004f !important;
          padding: 0.75rem 1rem !important;
          margin: 1rem 0 !important;
          background: #f8f9fa !important;
          color: #3c3e41 !important;
          font-style: italic !important;
          border-radius: 0 0.5rem 0.5rem 0 !important;
          display: block !important;
        }

        [contenteditable] pre {
          background: #f8f9fa !important;
          padding: 1rem !important;
          border-radius: 0.5rem !important;
          overflow-x: auto !important;
          margin: 1rem 0 !important;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
          color: #2d3748 !important;
          border: 1px solid #e2e8f0 !important;
          display: block !important;
          white-space: pre !important;
        }

        [contenteditable] img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          margin: 1rem 0 !important;
          display: block !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }

        [contenteditable] a {
          color: #ff004f !important;
          text-decoration: underline !important;
          font-weight: 500 !important;
        }

        [contenteditable] a:hover {
          color: #e6003d !important;
        }

        [contenteditable] strong {
          font-weight: 700 !important;
          color: #1f2125 !important;
        }

        [contenteditable] em {
          font-style: italic !important;
          color: #3c3e41 !important;
        }

        [contenteditable] u {
          text-decoration: underline !important;
        }

        [contenteditable] s {
          text-decoration: line-through !important;
          color: #6b7280 !important;
        }

        /* Focus styles */
        [contenteditable]:focus {
          outline: none !important;
        }

        /* Selection styles */
        [contenteditable]::selection {
          background: rgba(255, 0, 79, 0.2) !important;
        }

        /* Text alignment */
        [contenteditable] [style*="text-align: center"] {
          text-align: center !important;
        }

        [contenteditable] [style*="text-align: right"] {
          text-align: right !important;
        }

        [contenteditable] [style*="text-align: left"] {
          text-align: left !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
