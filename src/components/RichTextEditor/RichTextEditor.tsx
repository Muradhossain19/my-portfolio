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
  FaPalette,
  FaFont,
  FaExpand,
  FaTextHeight,
  FaSquare,
  FaRulerVertical,
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
  const [format, setFormat] = useState<string>("p");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showLineHeightPicker, setShowLineHeightPicker] = useState(false);
  const [showCustomGapPicker, setShowCustomGapPicker] = useState(false);
  const [showDivColorPicker, setShowDivColorPicker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageMenu, setImageMenu] = useState<{
    top: number;
    left: number;
    img: HTMLImageElement | null;
  } | null>(null);

  // Add new state for div context menu
  const [divMenu, setDivMenu] = useState<{
    top: number;
    left: number;
    div: HTMLDivElement | null;
    showColorPicker: boolean;
    currentColor?: string; // Add this line
  } | null>(null);

  // Color palettes
  const textColors = [
    "#000000",
    "#FF004F",
    "#1f2937",
    "#374151",
    "#6b7280",
    "#9ca3af",
    "#dc2626",
    "#ea580c",
    "#d97706",
    "#ca8a04",
    "#65a30d",
    "#16a34a",
    "#059669",
    "#0d9488",
    "#0891b2",
    "#0284c7",
    "#2563eb",
    "#4f46e5",
    "#7c3aed",
    "#9333ea",
    "#c026d3",
    "#db2777",
    "#e11d48",
    "#f59e0b",
  ];

  const bgColors = [
    "transparent",
    "#f8fafc",
    "#f1f5f9",
    "#e2e8f0",
    "#cbd5e1",
    "#fef2f2",
    "#fef7f7",
    "#fff7ed",
    "#fffbeb",
    "#fefce8",
    "#f7fee7",
    "#ecfdf5",
    "#f0fdfa",
    "#ecfeff",
    "#f0f9ff",
    "#eff6ff",
    "#eef2ff",
    "#f5f3ff",
    "#faf5ff",
    "#fdf4ff",
    "#fdf2f8",
    "#ffedd5",
    "#fed7aa",
    "#fde68a",
    "#fef3c7",
  ];

  const divColors = [
    "#ffffff",
    "#f8f9fa",
    "#e9ecef",
    "#dee2e6",
    "#ced4da",
    "#fef2f2",
    "#fee2e2",
    "#fecaca",
    "#f87171",
    "#ef4444",
    "#fff7ed",
    "#fed7aa",
    "#fdba74",
    "#fb923c",
    "#f97316",
    "#fefce8",
    "#fef3c7",
    "#fde68a",
    "#facc15",
    "#eab308",
    "#f7fee7",
    "#dcfce7",
    "#bbf7d0",
    "#86efac",
    "#22c55e",
    "#ecfeff",
    "#cffafe",
    "#a5f3fc",
    "#67e8f9",
    "#06b6d4",
    "#eff6ff",
    "#dbeafe",
    "#bfdbfe",
    "#60a5fa",
    "#3b82f6",
    "#f0f9ff",
    "#e0f2fe",
    "#bae6fd",
    "#7dd3fc",
    "#0ea5e9",
    "#eef2ff",
    "#e0e7ff",
    "#c7d2fe",
    "#a78bfa",
    "#8b5cf6",
    "#faf5ff",
    "#f3e8ff",
    "#e9d5ff",
    "#c084fc",
    "#a855f7",
  ];

  const fontSizes = [
    { label: "Small", value: "14px" },
    { label: "Normal", value: "16px" },
    { label: "Medium", value: "18px" },
    { label: "Large", value: "20px" },
    { label: "X-Large", value: "24px" },
    { label: "XX-Large", value: "28px" },
  ];

  const lineHeights = [
    { label: "Tight", value: "1.25" },
    { label: "Normal", value: "1.5" },
    { label: "Relaxed", value: "1.75" },
    { label: "Loose", value: "2" },
  ];

  const customGaps = [
    { label: "5px", value: "5px" },
    { label: "10px", value: "10px" },
    { label: "15px", value: "15px" },
    { label: "20px", value: "20px" },
    { label: "25px", value: "25px" },
    { label: "30px", value: "30px" },
    { label: "40px", value: "40px" },
    { label: "50px", value: "50px" },
    { label: "60px", value: "60px" },
    { label: "80px", value: "80px" },
    { label: "100px", value: "100px" },
    { label: "120px", value: "120px" },
  ];

  // Handle input changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  // Execute command with proper focus and selection preservation
  const executeCommand = useCallback(
    (command: string, value?: string) => {
      const editor = editorRef.current;
      if (!editor) return false;

      editor.focus();

      try {
        const success = document.execCommand(command, false, value);

        // Delay to ensure command is processed
        setTimeout(() => {
          handleInput();
        }, 10);

        return success;
      } catch (error) {
        console.error(`Error executing command ${command}:`, error);
        return false;
      }
    },
    [handleInput]
  );

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".dropdown-container")) {
        setShowColorPicker(false);
        setShowBgColorPicker(false);
        setShowFontSizePicker(false);
        setShowLineHeightPicker(false);
        setShowCustomGapPicker(false);
        setShowDivColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect current block format on selection change
  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editorRef.current) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const node = selection.anchorNode;
      if (!node) return;

      let el =
        node.nodeType === Node.ELEMENT_NODE
          ? (node as HTMLElement)
          : node.parentElement;
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

  // Save and restore selection
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  }, []);

  const restoreSelection = useCallback((range: Range | null) => {
    if (range) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  // Apply text color
  const applyTextColor = useCallback(
    (color: string) => {
      const savedRange = saveSelection();
      executeCommand("foreColor", color);
      restoreSelection(savedRange);
      setShowColorPicker(false);
    },
    [executeCommand, saveSelection, restoreSelection]
  );

  // Apply background color
  const applyBackgroundColor = useCallback(
    (color: string) => {
      const savedRange = saveSelection();
      executeCommand(
        "backColor",
        color === "transparent" ? "transparent" : color
      );
      restoreSelection(savedRange);
      setShowBgColorPicker(false);
    },
    [executeCommand, saveSelection, restoreSelection]
  );

  // Apply font size with proper selection handling
  const applyFontSize = useCallback(
    (size: string) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setShowFontSizePicker(false);
        return;
      }

      const range = selection.getRangeAt(0);
      if (range.collapsed) {
        setShowFontSizePicker(false);
        return;
      }

      try {
        const selectedContent = range.extractContents();
        const span = document.createElement("span");
        span.style.fontSize = size;
        span.appendChild(selectedContent);
        range.insertNode(span);

        // Restore selection to the styled content
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.removeAllRanges();
        selection.addRange(newRange);

        handleInput();
      } catch (error) {
        console.error("Error applying font size:", error);
      }

      setShowFontSizePicker(false);
    },
    [handleInput]
  );

  // Apply line height to current block element
  const applyLineHeight = useCallback(
    (height: string) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        setShowLineHeightPicker(false);
        return;
      }

      const range = selection.getRangeAt(0);
      let element: Node | null = range.commonAncestorContainer;

      // Find the closest block element
      while (element && element !== editorRef.current) {
        if (element.nodeType === Node.ELEMENT_NODE) {
          const tagName = (element as Element).tagName;
          if (
            [
              "P",
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
              "DIV",
              "BLOCKQUOTE",
            ].includes(tagName)
          ) {
            (element as HTMLElement).style.lineHeight = height;
            handleInput();
            break;
          }
        }
        element = element.parentNode;
      }
      setShowLineHeightPicker(false);
    },
    [handleInput]
  );

  // Insert custom gap
  const insertCustomGap = useCallback(
    (gap: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      editor.focus();

      const spacerHTML = `<div class="custom-spacer" style="height: ${gap}; width: 100%; margin: 0; padding: 0; line-height: 1; font-size: 1px; user-select: none;">&nbsp;</div>`;

      executeCommand("insertHTML", spacerHTML);
      setShowCustomGapPicker(false);
    },
    [executeCommand]
  );

  // Insert colored div block
  const insertColoredDiv = useCallback(
    (color: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      editor.focus();

      const divHTML = `<div class="colored-div" style="background-color: ${color}; padding: 16px; margin: 16px 0; border-radius: 8px; min-height: 40px; border: 1px solid ${
        color === "#ffffff" ? "#e2e8f0" : "transparent"
      };" contenteditable="true">Type your content here...</div><p><br></p>`;

      executeCommand("insertHTML", divHTML);

      // Move cursor to the paragraph after the div
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection) {
          const divs = editor.querySelectorAll(".colored-div");
          const lastDiv = divs[divs.length - 1];
          if (lastDiv && lastDiv.nextElementSibling) {
            const range = document.createRange();
            range.setStart(lastDiv.nextElementSibling, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      }, 10);

      setShowDivColorPicker(false);
    },
    [executeCommand]
  );

  // Insert spacing (keeping the old method for S/M/L buttons)
  const insertSpacing = useCallback(
    (type: "small" | "medium" | "large") => {
      const spacing = {
        small: "0.5rem",
        medium: "1rem",
        large: "2rem",
      };

      const spacerHTML = `<div class="spacing-block" style="height: ${spacing[type]}; width: 100%; margin: 0; padding: 0; line-height: 1; font-size: 1px; user-select: none;">&nbsp;</div>`;
      executeCommand("insertHTML", spacerHTML);
    },
    [executeCommand]
  );

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Insert list
  const insertList = useCallback(
    (ordered: boolean = false) => {
      executeCommand(ordered ? "insertOrderedList" : "insertUnorderedList");
    },
    [executeCommand]
  );

  // Insert link
  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (!url) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      executeCommand("createLink", url);
    } else {
      const linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      executeCommand("insertHTML", linkHTML);
    }
  }, [executeCommand]);

  // Insert image
  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (!url) return;

    const altText = prompt("Enter Alt text for SEO (describe the image):");
    const finalAltText = altText || "Image"; // Default fallback

    const imgHTML = `<img src="${url}" alt="${finalAltText}" style="max-width: 100%; height: auto; display: block; margin: 1rem 0; border-radius: 0.5rem;">`;
    executeCommand("insertHTML", imgHTML);
  }, [executeCommand]);

  // Format block (headings, paragraph, etc.)
  const formatBlock = useCallback(
    (tag: string) => {
      if (tag === "blockquote") {
        executeCommand("formatBlock", "blockquote");
      } else if (tag === "pre") {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const selectedText = selection.toString() || "Code block";
          const codeHTML = `<pre style="background: #f8f9fa; padding: 1rem; border-radius: 0.5rem; font-family: monospace; margin: 1rem 0; border: 1px solid #e2e8f0;">${selectedText}</pre>`;
          executeCommand("insertHTML", codeHTML);
        }
      } else {
        executeCommand("formatBlock", `<${tag}>`);
      }
    },
    [executeCommand]
  );

  // Handle paste to maintain formatting
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      if (text) {
        executeCommand("insertText", text);
      }
    },
    [executeCommand]
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

      // Nested list support: Tab/Shift+Tab for indent/outdent
      if (e.key === "Tab") {
        const selection = window.getSelection();
        if (selection && selection.anchorNode) {
          let li = selection.anchorNode as HTMLElement | null;
          while (li && li.nodeType !== 1) li = li.parentElement;
          if (li && li.tagName === "LI") {
            e.preventDefault();
            if (e.shiftKey) {
              // Outdent
              executeCommand("outdent");
            } else {
              // Indent
              executeCommand("indent");
            }
          }
        }
      }

      // Always insert a new <p> on Enter for block elements
      if (e.key === "Enter") {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          let parentElement: Node | null = range.startContainer;

          if (parentElement && parentElement.nodeType === Node.TEXT_NODE) {
            parentElement = parentElement.parentElement;
          }

          if (
            parentElement &&
            parentElement.nodeType === Node.ELEMENT_NODE &&
            [
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
              "P",
              "DIV",
              "BLOCKQUOTE",
            ].includes((parentElement as Element).tagName)
          ) {
            e.preventDefault();
            executeCommand("insertHTML", "<p><br></p>");
          }
        }
      }
    },
    [executeCommand]
  );

  // Update editor content when value changes (without affecting selection)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      const wasEmpty = !editorRef.current.innerHTML.trim();
      const selection = window.getSelection();
      const savedRange =
        selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

      editorRef.current.innerHTML = value;

      // Only restore selection if editor wasn't empty and range is still valid
      if (
        !wasEmpty &&
        savedRange &&
        editorRef.current.contains(savedRange.startContainer)
      ) {
        try {
          selection?.removeAllRanges();
          selection?.addRange(savedRange);
        } catch {
          // Selection restoration failed, place cursor at end
          const range = document.createRange();
          range.selectNodeContents(editorRef.current);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
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

  // Add function to change div color
  const changeDivColor = useCallback(
    (div: HTMLDivElement, color: string) => {
      div.style.backgroundColor = color;
      div.style.border =
        color === "#ffffff" ? "1px solid #e2e8f0" : "1px solid transparent";

      // Update the current color in divMenu state
      setDivMenu((prev) => (prev ? { ...prev, currentColor: color } : null));

      handleInput();
    },
    [handleInput]
  );

  // Update the existing useEffect for image clicks to handle table clicks properly
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Handle image clicks (existing code)
      if (target instanceof HTMLImageElement) {
        const img = target as HTMLImageElement;
        const rect = img.getBoundingClientRect();
        const editorRect = editorRef.current?.getBoundingClientRect();

        if (editorRect) {
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft;

          setImageMenu({
            top: rect.bottom + scrollTop + 8,
            left: rect.left + scrollLeft,
            img,
          });
        }
        setDivMenu(null);

        return;
      }

      // Handle colored div clicks (existing code unchanged)
      if (
        target.classList.contains("colored-div") ||
        target.closest(".colored-div")
      ) {
        const div = target.classList.contains("colored-div")
          ? (target as HTMLDivElement)
          : (target.closest(".colored-div") as HTMLDivElement);

        if (div) {
          const rect = div.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const menuWidth = 200;
          const menuHeight = 250;

          // Better color detection and conversion
          const getCurrentColor = (): string => {
            const computedStyle = window.getComputedStyle(div);
            const bgColor =
              div.style.backgroundColor || computedStyle.backgroundColor;

            const rgbToHex = (rgb: string): string => {
              if (rgb.startsWith("#")) {
                return rgb.toLowerCase();
              }

              const rgbMatch = rgb.match(/\d+/g);
              if (rgbMatch && rgbMatch.length >= 3) {
                const r = parseInt(rgbMatch[0]);
                const g = parseInt(rgbMatch[1]);
                const b = parseInt(rgbMatch[2]);

                const toHex = (n: number) => {
                  const hex = n.toString(16);
                  return hex.length === 1 ? "0" + hex : hex;
                };

                return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
              }

              return rgb.toLowerCase();
            };

            return rgbToHex(bgColor);
          };

          // Calculate optimal position
          let top = rect.top + window.scrollY;
          let left = rect.right + window.scrollX + 10;

          // Check if menu would go off screen horizontally
          if (left + menuWidth > viewportWidth) {
            left = rect.left + window.scrollX - menuWidth - 10;
            if (left < 0) {
              left = Math.max(10, (viewportWidth - menuWidth) / 2);
            }
          }

          // Check if menu would go off screen vertically
          if (top + menuHeight > viewportHeight + window.scrollY) {
            top = rect.top + window.scrollY - menuHeight - 10;
            if (top < window.scrollY + 10) {
              top = window.scrollY + 10;
            }
          }

          setDivMenu({
            top,
            left,
            div,
            showColorPicker: false,
            currentColor: getCurrentColor(),
          });
          setImageMenu(null);
          return;
        }
      }

      // Close all menus if clicking elsewhere
      setImageMenu(null);
      setDivMenu(null);
    };

    const editor = editorRef.current;

    if (editor) {
      editor.addEventListener("click", handler);
    }
    return () => {
      if (editor) {
        editor.removeEventListener("click", handler);
      }
    };
  }, []);

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50 bg-white" : "w-full"
      } border border-[#d1d9e6] rounded-xl overflow-hidden bg-white`}
    >
      {/* Toolbar */}
      <div className="bg-[#ECF0F3] p-3 border-b border-[#d1d9e6]">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Heading Dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                formatBlock(e.target.value);
                setFormat(e.target.value);
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

          {/* Text Color */}
          <div className="relative dropdown-container">
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowBgColorPicker(false);
                setShowFontSizePicker(false);
                setShowLineHeightPicker(false);
                setShowCustomGapPicker(false);
                setShowDivColorPicker(false);
              }}
              className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
              title="Text Color"
            >
              <div className="relative">
                <span className="text-sm font-bold">A</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-current"></div>
              </div>
            </button>

            {showColorPicker && (
              <div className="absolute top-full mt-2 p-3 bg-white border border-[#d1d9e6] rounded-lg shadow-lg z-10 grid grid-cols-6 gap-1 w-48">
                {textColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => applyTextColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Background Color */}
          <div className="relative dropdown-container">
            <button
              type="button"
              onClick={() => {
                setShowBgColorPicker(!showBgColorPicker);
                setShowColorPicker(false);
                setShowFontSizePicker(false);
                setShowLineHeightPicker(false);
                setShowCustomGapPicker(false);
                setShowDivColorPicker(false);
              }}
              className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
              title="Background Color"
            >
              <FaPalette className="w-4 h-4" />
            </button>

            {showBgColorPicker && (
              <div className="absolute top-full mt-2 p-3 bg-white border border-[#d1d9e6] rounded-lg shadow-lg z-10 grid grid-cols-6 gap-1 w-48">
                {bgColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => applyBackgroundColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{
                      backgroundColor:
                        color === "transparent" ? "white" : color,
                      backgroundImage:
                        color === "transparent"
                          ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                          : "none",
                      backgroundSize:
                        color === "transparent" ? "8px 8px" : "auto",
                      backgroundPosition:
                        color === "transparent"
                          ? "0 0, 0 4px, 4px -4px, -4px 0px"
                          : "auto",
                    }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Font Size */}
          <div className="relative dropdown-container">
            <button
              type="button"
              onClick={() => {
                setShowFontSizePicker(!showFontSizePicker);
                setShowColorPicker(false);
                setShowBgColorPicker(false);
                setShowLineHeightPicker(false);
                setShowCustomGapPicker(false);
                setShowDivColorPicker(false);
              }}
              className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
              title="Font Size"
            >
              <FaFont className="w-4 h-4" />
            </button>

            {showFontSizePicker && (
              <div className="absolute top-full mt-2 p-2 bg-white border border-[#d1d9e6] rounded-lg shadow-lg z-10 w-32">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => applyFontSize(size.value)}
                    className="w-full text-left px-3 py-2 hover:bg-[#f8f9fa] rounded text-sm"
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Line Height */}
          <div className="relative dropdown-container">
            <button
              type="button"
              onClick={() => {
                setShowLineHeightPicker(!showLineHeightPicker);
                setShowColorPicker(false);
                setShowBgColorPicker(false);
                setShowFontSizePicker(false);
                setShowCustomGapPicker(false);
                setShowDivColorPicker(false);
              }}
              className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
              title="Line Height"
            >
              <FaTextHeight className="w-4 h-4" />
            </button>

            {showLineHeightPicker && (
              <div className="absolute top-full mt-2 p-2 bg-white border border-[#d1d9e6] rounded-lg shadow-lg z-10 w-32">
                {lineHeights.map((height) => (
                  <button
                    key={height.value}
                    type="button"
                    onClick={() => applyLineHeight(height.value)}
                    className="w-full text-left px-3 py-2 hover:bg-[#f8f9fa] rounded text-sm"
                  >
                    {height.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-[#d1d9e6] mx-1"></div>

          {/* Custom Gap Control */}
          <div className="relative dropdown-container">
            <button
              type="button"
              onClick={() => {
                setShowCustomGapPicker(!showCustomGapPicker);
                setShowColorPicker(false);
                setShowBgColorPicker(false);
                setShowFontSizePicker(false);
                setShowLineHeightPicker(false);
                setShowDivColorPicker(false);
              }}
              className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
              title="Custom Gap"
            >
              <FaRulerVertical className="w-4 h-4" />
            </button>

            {showCustomGapPicker && (
              <div className="absolute top-full mt-2 p-2 bg-white border border-[#d1d9e6] rounded-lg shadow-lg z-10 w-24 max-h-48 overflow-y-auto">
                {customGaps.map((gap) => (
                  <button
                    key={gap.value}
                    type="button"
                    onClick={() => insertCustomGap(gap.value)}
                    className="w-full text-left px-3 py-2 hover:bg-[#f8f9fa] rounded text-sm"
                  >
                    {gap.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colored Div Block */}
          <div className="relative dropdown-container">
            <button
              type="button"
              onClick={() => {
                setShowDivColorPicker(!showDivColorPicker);
                setShowColorPicker(false);
                setShowBgColorPicker(false);
                setShowFontSizePicker(false);
                setShowLineHeightPicker(false);
                setShowCustomGapPicker(false);
              }}
              className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
              title="Colored Block"
            >
              <FaSquare className="w-4 h-4" />
            </button>

            {showDivColorPicker && (
              <div className="absolute top-full right-0 left-auto mt-2 p-3 bg-white border border-[#d1d9e6] rounded-lg shadow-lg z-50 grid grid-cols-6 gap-1 w-48 max-w-[192px] overflow-auto">
                {divColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => insertColoredDiv(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Spacing Controls */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => insertSpacing("small")}
              className="px-2 py-1 text-xs bg-white border border-[#d1d9e6] hover:border-[#FF004F] rounded transition-colors"
              title="Small Space"
            >
              S
            </button>
            <button
              type="button"
              onClick={() => insertSpacing("medium")}
              className="px-2 py-1 text-xs bg-white border border-[#d1d9e6] hover:border-[#FF004F] rounded transition-colors"
              title="Medium Space"
            >
              M
            </button>
            <button
              type="button"
              onClick={() => insertSpacing("large")}
              className="px-2 py-1 text-xs bg-white border border-[#d1d9e6] hover:border-[#FF004F] rounded transition-colors"
              title="Large Space"
            >
              L
            </button>
          </div>

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

          <div className="w-px h-6 bg-[#d1d9e6] mx-1"></div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-lg bg-white border border-[#d1d9e6] hover:border-[#FF004F] hover:bg-[#FF004F] hover:text-white flex items-center justify-center text-[#3c3e41] transition-all duration-200"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <FaExpand className="w-4 h-4" />
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
        className={`${
          isFullscreen ? "min-h-[calc(100vh-100px)]" : "min-h-[150px]"
        } ${
          isFullscreen ? "max-h-none" : "max-h-[350px]"
        } overflow-y-auto p-4 outline-none transition-all duration-200 ${
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

        /* Show alt text when image fails to load */
        [contenteditable] img[alt]:after {
          content: attr(alt);
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #f8f9fa;
          color: #6b7280;
          font-size: 14px;
          text-align: center;
          padding: 20px;
          border: 1px dashed #d1d5db;
          border-radius: 0.5rem;
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

        /* Custom spacer styling */
        [contenteditable] .custom-spacer {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1 !important;
          font-size: 1px !important;
          min-height: 5px !important;
          user-select: none !important;
          pointer-events: none !important;
        }

        [contenteditable] .spacing-block {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 1 !important;
          font-size: 1px !important;
          min-height: 8px !important;
          user-select: none !important;
          pointer-events: none !important;
        }

        /* Colored div styling */
        [contenteditable] .colored-div {
          display: block !important;
          width: 100% !important;
          min-height: 40px !important;
          border-radius: 8px !important;
          margin: 16px 0 !important;
          padding: 16px !important;
          outline: none !important;
          box-sizing: border-box !important;
        }

        [contenteditable] .colored-div:focus {
          outline: 2px solid #ff004f !important;
          outline-offset: 2px !important;
        }

        [contenteditable] .colored-div:empty:before {
          content: "Type your content here...";
          color: rgba(60, 62, 65, 0.6);
          font-style: italic;
          pointer-events: none;
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

      {/* Image Context Menu */}
      {imageMenu && imageMenu.img && (
        <div
          style={{
            position: "fixed", // Changed from absolute to fixed
            top: imageMenu.top + "px",
            left: imageMenu.left + "px",
            zIndex: 9999, // Higher z-index
            background: "#fff",
            border: "1px solid #d1d9e6",
            borderRadius: 8,
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            padding: 8,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            minWidth: "200px",
            maxWidth: "300px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter new image URL:");
              if (url && imageMenu.img) {
                imageMenu.img.src = url;
                setImageMenu(null);
                handleInput();
              }
            }}
            className="px-3 py-2 rounded bg-[#FF004F] text-white text-xs font-medium hover:bg-[#e6003d] transition-colors"
          >
            Replace URL
          </button>

          <button
            type="button"
            onClick={() => {
              const currentAlt = imageMenu.img?.alt || "";
              const newAltText = prompt("Enter Alt text for SEO:", currentAlt);
              if (newAltText !== null && imageMenu.img) {
                imageMenu.img.alt = newAltText;
                setImageMenu(null);
                handleInput();
              }
            }}
            className="px-3 py-2 rounded bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
          >
            Edit Alt Text
          </button>

          <button
            type="button"
            onClick={() => {
              if (imageMenu.img) {
                imageMenu.img.remove();
                setImageMenu(null);
                handleInput();
              }
            }}
            className="px-3 py-2 rounded bg-gray-200 text-[#3c3e41] text-xs font-medium hover:bg-gray-300 transition-colors"
          >
            Remove
          </button>

          <button
            type="button"
            onClick={() => setImageMenu(null)}
            className="px-3 py-2 rounded bg-gray-100 text-[#3c3e41] text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>

          {/* Show current Alt text */}
          {imageMenu.img?.alt && (
            <div className="w-full mt-2 pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-600">
                <strong>Current Alt:</strong> {imageMenu.img.alt}
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Div Context Menu */}
      {divMenu && divMenu.div && (
        <div
          style={{
            position: "absolute",
            top: divMenu.top,
            left: divMenu.left,
            zIndex: 1000,
            background: "#fff",
            border: "1px solid #d1d9e6",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 140,
            maxWidth: 200,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setDivMenu((prev) =>
                prev
                  ? { ...prev, showColorPicker: !prev.showColorPicker }
                  : null
              );
            }}
            className="px-3 py-2 rounded bg-[#FF004F] text-white text-xs font-medium hover:bg-[#e6003d] transition-colors"
          >
            Change Color
          </button>

          <button
            type="button"
            onClick={() => {
              if (divMenu.div) {
                divMenu.div.remove();
                setDivMenu(null);
                handleInput();
              }
            }}
            className="px-3 py-2 rounded bg-gray-200 text-[#3c3e41] text-xs font-medium hover:bg-gray-300 transition-colors"
          >
            Remove Block
          </button>

          <button
            type="button"
            onClick={() => setDivMenu(null)}
            className="px-3 py-2 rounded bg-gray-100 text-[#3c3e41] text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>

          {/* Responsive Color Picker for Div */}
          {divMenu.showColorPicker && (
            <div
              className="p-2 bg-gray-50 rounded border-t"
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                // Ensure it doesn't go beyond screen bounds
                maxWidth:
                  Math.min(200, window.innerWidth - divMenu.left - 20) + "px",
              }}
            >
              <div className="grid grid-cols-5 gap-1">
                {divColors.map((color) => {
                  // Better color matching
                  const normalizeColor = (c: string) =>
                    c.toLowerCase().replace(/\s/g, "");
                  const isCurrentColor =
                    normalizeColor(divMenu.currentColor || "") ===
                    normalizeColor(color);

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => changeDivColor(divMenu.div!, color)}
                      className={`w-6 h-6 rounded border hover:scale-110 transition-all duration-200 flex-shrink-0 relative ${
                        isCurrentColor
                          ? "border-[#FF004F] border-2 ring-2 ring-[#FF004F] ring-opacity-30 shadow-md"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      title={`${color} ${isCurrentColor ? "(Current)" : ""}`}
                    >
                      {/* Enhanced checkmark for current color */}
                      {isCurrentColor && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#FF004F] flex items-center justify-center shadow-sm">
                            <svg
                              className="w-2 h-2 text-white font-bold"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1  0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Show current color info */}
              {divMenu.currentColor && (
                <div className="mt-2 text-xs text-gray-600 text-center">
                  Current: {divMenu.currentColor}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table Context Menu */}
    </div>
  );
};

export default RichTextEditor;
