import {
  Underline
} from "./chunk-7ZVXWBPQ.js";
import {
  Link
} from "./chunk-6JF62Q3R.js";
import {
  Dropcursor,
  Gapcursor,
  TrailingNode,
  UndoRedo
} from "./chunk-IJQYMJJT.js";
import {
  BulletList,
  ListItem,
  ListKeymap,
  OrderedList
} from "./chunk-Y7AE3GFA.js";
import {
  Extension,
  Mark,
  Node,
  NodeSelection,
  Plugin,
  PluginKey,
  Selection,
  Slice,
  TextSelection,
  canInsertNode,
  isNodeSelection,
  markInputRule,
  markPasteRule,
  mergeAttributes,
  nodeInputRule,
  textblockTypeInputRule,
  wrappingInputRule
} from "./chunk-VHRQP5DQ.js";
import "./chunk-DC5AMYBS.js";

// node_modules/@tiptap/core/dist/jsx-runtime/jsx-runtime.js
var jsxElements = /* @__PURE__ */ new WeakSet();
var jsxFragments = /* @__PURE__ */ new WeakSet();
function createJSXElement(spec) {
  const element = spec;
  jsxElements.add(element);
  return element;
}
function isJSXElement(value) {
  return Array.isArray(value) && jsxElements.has(value);
}
function flattenFragmentChildren(children) {
  return children.flatMap((child) => {
    if (child == null) return [];
    if (Array.isArray(child) && jsxFragments.has(child) && !isJSXElement(child)) return flattenFragmentChildren(child);
    return [child];
  });
}
function render(tag, attributes) {
  if (tag === "slot") return 0;
  if (tag instanceof Function) {
    const result = tag(attributes);
    if (Array.isArray(result) && !isJSXElement(result) && !jsxFragments.has(result)) return createJSXElement(result);
    return result;
  }
  const { children, ...rest } = attributes !== null && attributes !== void 0 ? attributes : {};
  if (tag === "svg") throw new Error("SVG elements are not supported in the JSX syntax, use the array syntax instead");
  if (Array.isArray(children)) {
    if (isJSXElement(children)) return createJSXElement([
      tag,
      rest,
      children
    ]);
    if (children.length === 0) return createJSXElement([tag, rest]);
    const flattenedChildren = flattenFragmentChildren(children);
    if (flattenedChildren.length === 0) return createJSXElement([tag, rest]);
    return createJSXElement([
      tag,
      rest,
      ...flattenedChildren
    ]);
  }
  if (children !== void 0 && children !== null) return createJSXElement([
    tag,
    rest,
    children
  ]);
  return createJSXElement([tag, rest]);
}
var h = (tag, attributes) => render(tag, attributes);

// node_modules/@tiptap/extension-blockquote/dist/index.js
var handleBackspace = (editor, type) => {
  var _previous$lastChild;
  const { state } = editor;
  const { selection } = state;
  if (!selection.empty) return false;
  const { $from } = selection;
  if ($from.parentOffset !== 0) return false;
  const parentDepth = $from.depth - 1;
  if (parentDepth < 0) return false;
  const parent = $from.node(parentDepth);
  const index = $from.index(parentDepth);
  if (index === 0) return false;
  if (parent.type === type) return editor.commands.lift(type.name);
  const previous = parent.child(index - 1);
  if (previous.type !== type || !((_previous$lastChild = previous.lastChild) === null || _previous$lastChild === void 0 ? void 0 : _previous$lastChild.isTextblock)) return false;
  const targetPos = $from.before() - 1 - 1;
  return editor.commands.command(({ tr, dispatch }) => {
    if (!dispatch) return true;
    const content = $from.parent.content;
    const slice = new Slice(content, 0, 0);
    tr.replace(targetPos, $from.after(), slice);
    tr.setSelection(TextSelection.create(tr.doc, targetPos + content.size));
    tr.scrollIntoView();
    dispatch(tr);
    return true;
  });
};
var inputRegex = /^\s*>\s$/;
var Blockquote = Node.create({
  name: "blockquote",
  addOptions() {
    return { HTMLAttributes: {} };
  },
  content: "block+",
  group: "block",
  defining: true,
  parseHTML() {
    return [{ tag: "blockquote" }];
  },
  renderHTML({ HTMLAttributes }) {
    return h("blockquote", {
      ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      children: h("slot", {})
    });
  },
  parseMarkdown: (token, helpers) => {
    var _helpers$parseBlockCh;
    const parseBlockChildren = (_helpers$parseBlockCh = helpers.parseBlockChildren) !== null && _helpers$parseBlockCh !== void 0 ? _helpers$parseBlockCh : helpers.parseChildren;
    return helpers.createNode("blockquote", void 0, parseBlockChildren(token.tokens || []));
  },
  renderMarkdown: (node, h2) => {
    if (!node.content) return "";
    const prefix = ">";
    const result = [];
    node.content.forEach((child, index) => {
      var _h$renderChild, _h$renderChild2;
      const linesWithPrefix = ((_h$renderChild = (_h$renderChild2 = h2.renderChild) === null || _h$renderChild2 === void 0 ? void 0 : _h$renderChild2.call(h2, child, index)) !== null && _h$renderChild !== void 0 ? _h$renderChild : h2.renderChildren([child])).split("\n").map((line) => {
        if (line.trim() === "") return prefix;
        return `${prefix} ${line}`;
      });
      result.push(linesWithPrefix.join("\n"));
    });
    return result.join(`
${prefix}
`);
  },
  addCommands() {
    return {
      setBlockquote: () => ({ commands }) => {
        return commands.wrapIn(this.name);
      },
      toggleBlockquote: () => ({ commands }) => {
        return commands.toggleWrap(this.name);
      },
      unsetBlockquote: () => ({ commands }) => {
        return commands.lift(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-b": () => this.editor.commands.toggleBlockquote(),
      Backspace: () => handleBackspace(this.editor, this.type)
    };
  },
  addInputRules() {
    return [wrappingInputRule({
      find: inputRegex,
      type: this.type
    })];
  }
});

// node_modules/@tiptap/extension-bold/dist/index.js
var starInputRegex = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/;
var starPasteRegex = /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g;
var underscoreInputRegex = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/;
var underscorePasteRegex = /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g;
var Bold = Mark.create({
  name: "bold",
  addOptions() {
    return { HTMLAttributes: {} };
  },
  parseHTML() {
    return [
      { tag: "strong" },
      {
        tag: "b",
        getAttrs: (node) => node.style.fontWeight !== "normal" && null
      },
      {
        style: "font-weight=400",
        clearMark: (mark) => mark.type.name === this.name
      },
      {
        style: "font-weight",
        getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return h("strong", {
      ...mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      children: h("slot", {})
    });
  },
  markdownTokenName: "strong",
  parseMarkdown: (token, helpers) => {
    return helpers.applyMark("bold", helpers.parseInline(token.tokens || []));
  },
  markdownOptions: { htmlReopen: {
    open: "<strong>",
    close: "</strong>"
  } },
  renderMarkdown: (node, h2) => {
    return `**${h2.renderChildren(node)}**`;
  },
  addCommands() {
    return {
      setBold: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleBold: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetBold: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-B": () => this.editor.commands.toggleBold()
    };
  },
  addInputRules() {
    return [markInputRule({
      find: starInputRegex,
      type: this.type
    }), markInputRule({
      find: underscoreInputRegex,
      type: this.type
    })];
  },
  addPasteRules() {
    return [markPasteRule({
      find: starPasteRegex,
      type: this.type
    }), markPasteRule({
      find: underscorePasteRegex,
      type: this.type
    })];
  }
});

// node_modules/@tiptap/extension-code/dist/index.js
var inputRegexMatch = (text) => {
  const match = /`([^`]+)`(?!`)$/.exec(text);
  if (!match) return null;
  if (match.index > 0 && text[match.index - 1] === "`") return null;
  return {
    index: match.index,
    text: match[0],
    replaceWith: match[1]
  };
};
var pasteRegexMatch = (text) => {
  const regex = /`([^`]+)`(?!`)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > 0 && text[match.index - 1] === "`") continue;
    matches.push({
      index: match.index,
      text: match[0],
      replaceWith: match[1]
    });
  }
  return matches;
};
var Code = Mark.create({
  name: "code",
  addOptions() {
    return { HTMLAttributes: {} };
  },
  excludes: "_",
  code: true,
  exitable: true,
  parseHTML() {
    return [{ tag: "code" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "code",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  },
  markdownTokenName: "codespan",
  parseMarkdown: (token, helpers) => {
    return helpers.applyMark("code", [{
      type: "text",
      text: token.text || ""
    }]);
  },
  renderMarkdown: (node, h2) => {
    if (!node.content) return "";
    return `\`${h2.renderChildren(node.content)}\``;
  },
  addCommands() {
    return {
      setCode: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleCode: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetCode: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return { "Mod-e": () => this.editor.commands.toggleCode() };
  },
  addInputRules() {
    return [markInputRule({
      find: inputRegexMatch,
      type: this.type
    })];
  },
  addPasteRules() {
    return [markPasteRule({
      find: pasteRegexMatch,
      type: this.type
    })];
  }
});

// node_modules/@tiptap/extension-code-block/dist/index.js
var DEFAULT_TAB_SIZE = 4;
var backtickInputRegex = /^```([a-z]+)?[\s\n]$/;
var tildeInputRegex = /^~~~([a-z]+)?[\s\n]$/;
var CodeBlock = Node.create({
  name: "codeBlock",
  addOptions() {
    return {
      languageClassPrefix: "language-",
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      exitOnArrowUp: true,
      defaultLanguage: null,
      enableTabIndentation: false,
      tabSize: DEFAULT_TAB_SIZE,
      HTMLAttributes: {}
    };
  },
  content: "text*",
  marks: "",
  group: "block",
  code: true,
  defining: true,
  addAttributes() {
    return { language: {
      default: this.options.defaultLanguage,
      parseHTML: (element) => {
        var _element$firstElement;
        const { languageClassPrefix } = this.options;
        if (!languageClassPrefix) return null;
        const language = [...((_element$firstElement = element.firstElementChild) === null || _element$firstElement === void 0 ? void 0 : _element$firstElement.classList) || []].filter((className) => className.startsWith(languageClassPrefix)).map((className) => className.replace(languageClassPrefix, ""))[0];
        if (!language) return null;
        return language;
      },
      rendered: false
    } };
  },
  parseHTML() {
    return [{
      tag: "pre",
      preserveWhitespace: "full"
    }];
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "pre",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        "code",
        { class: node.attrs.language ? this.options.languageClassPrefix + node.attrs.language : null },
        0
      ]
    ];
  },
  markdownTokenName: "code",
  parseMarkdown: (token, helpers) => {
    var _token$raw, _token$raw2;
    if (((_token$raw = token.raw) === null || _token$raw === void 0 ? void 0 : _token$raw.startsWith("```")) === false && ((_token$raw2 = token.raw) === null || _token$raw2 === void 0 ? void 0 : _token$raw2.startsWith("~~~")) === false && token.codeBlockStyle !== "indented") return [];
    return helpers.createNode("codeBlock", { language: token.lang || null }, token.text ? [helpers.createTextNode(token.text)] : []);
  },
  renderMarkdown: (node, h2) => {
    var _node$attrs;
    let output = "";
    const language = ((_node$attrs = node.attrs) === null || _node$attrs === void 0 ? void 0 : _node$attrs.language) || "";
    if (!node.content) output = `\`\`\`${language}

\`\`\``;
    else output = [
      `\`\`\`${language}`,
      h2.renderChildren(node.content),
      "```"
    ].join("\n");
    return output;
  },
  addCommands() {
    return {
      setCodeBlock: (attributes) => ({ commands }) => {
        return commands.setNode(this.name, attributes);
      },
      toggleCodeBlock: (attributes) => ({ commands }) => {
        return commands.toggleNode(this.name, "paragraph", attributes);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
      Backspace: () => {
        const { empty, $anchor } = this.editor.state.selection;
        const isAtStart = $anchor.pos === 1;
        if (!empty || $anchor.parent.type.name !== this.name) return false;
        if (isAtStart || !$anchor.parent.textContent.length) return this.editor.commands.clearNodes();
        return false;
      },
      Tab: ({ editor }) => {
        var _this$options$tabSize;
        if (!this.options.enableTabIndentation) return false;
        const tabSize = (_this$options$tabSize = this.options.tabSize) !== null && _this$options$tabSize !== void 0 ? _this$options$tabSize : DEFAULT_TAB_SIZE;
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;
        if ($from.parent.type !== this.type) return false;
        const indent = " ".repeat(tabSize);
        if (empty) return editor.commands.insertContent(indent);
        return editor.commands.command(({ tr }) => {
          const { from, to } = selection;
          const indentedText = state.doc.textBetween(from, to, "\n", "\n").split("\n").map((line) => indent + line).join("\n");
          tr.replaceWith(from, to, state.schema.text(indentedText));
          return true;
        });
      },
      "Shift-Tab": ({ editor }) => {
        var _this$options$tabSize2;
        if (!this.options.enableTabIndentation) return false;
        const tabSize = (_this$options$tabSize2 = this.options.tabSize) !== null && _this$options$tabSize2 !== void 0 ? _this$options$tabSize2 : DEFAULT_TAB_SIZE;
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;
        if ($from.parent.type !== this.type) return false;
        if (empty) return editor.commands.command(({ tr }) => {
          var _currentLine$match;
          const { pos } = $from;
          const codeBlockStart = $from.start();
          const codeBlockEnd = $from.end();
          const lines = state.doc.textBetween(codeBlockStart, codeBlockEnd, "\n", "\n").split("\n");
          let currentLineIndex = 0;
          let charCount = 0;
          const relativeCursorPos = pos - codeBlockStart;
          for (let i = 0; i < lines.length; i += 1) {
            if (charCount + lines[i].length >= relativeCursorPos) {
              currentLineIndex = i;
              break;
            }
            charCount += lines[i].length + 1;
          }
          const leadingSpaces = ((_currentLine$match = lines[currentLineIndex].match(/^ */)) === null || _currentLine$match === void 0 ? void 0 : _currentLine$match[0]) || "";
          const spacesToRemove = Math.min(leadingSpaces.length, tabSize);
          if (spacesToRemove === 0) return true;
          let lineStartPos = codeBlockStart;
          for (let i = 0; i < currentLineIndex; i += 1) lineStartPos += lines[i].length + 1;
          tr.delete(lineStartPos, lineStartPos + spacesToRemove);
          if (pos - lineStartPos <= spacesToRemove) tr.setSelection(TextSelection.create(tr.doc, lineStartPos));
          return true;
        });
        return editor.commands.command(({ tr }) => {
          const { from, to } = selection;
          const reverseIndentText = state.doc.textBetween(from, to, "\n", "\n").split("\n").map((line) => {
            var _line$match;
            const leadingSpaces = ((_line$match = line.match(/^ */)) === null || _line$match === void 0 ? void 0 : _line$match[0]) || "";
            const spacesToRemove = Math.min(leadingSpaces.length, tabSize);
            return line.slice(spacesToRemove);
          }).join("\n");
          tr.replaceWith(from, to, state.schema.text(reverseIndentText));
          return true;
        });
      },
      Enter: ({ editor }) => {
        if (!this.options.exitOnTripleEnter) return false;
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;
        if (!empty || $from.parent.type !== this.type) return false;
        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2;
        const endsWithDoubleNewline = $from.parent.textContent.endsWith("\n\n");
        if (!isAtEnd || !endsWithDoubleNewline) return false;
        return editor.chain().command(({ tr }) => {
          tr.delete($from.pos - 2, $from.pos);
          return true;
        }).exitCode().run();
      },
      ArrowUp: ({ editor }) => {
        if (!this.options.exitOnArrowUp) return false;
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;
        if (!empty || $from.parent.type !== this.type) return false;
        if ($from.parentOffset !== 0) return false;
        const before = $from.before();
        if (before > 0) return false;
        return editor.commands.insertDefaultBlock({ pos: before });
      },
      ArrowDown: ({ editor }) => {
        if (!this.options.exitOnArrowDown) return false;
        const { state } = editor;
        const { selection, doc } = state;
        const { $from, empty } = selection;
        if (!empty || $from.parent.type !== this.type) return false;
        if (!($from.parentOffset === $from.parent.nodeSize - 2)) return false;
        const after = $from.after();
        if (after === void 0) return false;
        if (doc.nodeAt(after)) return editor.commands.command(({ tr }) => {
          tr.setSelection(Selection.near(doc.resolve(after)));
          return true;
        });
        return editor.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [textblockTypeInputRule({
      find: backtickInputRegex,
      type: this.type,
      getAttributes: (match) => ({ language: match[1] })
    }), textblockTypeInputRule({
      find: tildeInputRegex,
      type: this.type,
      getAttributes: (match) => ({ language: match[1] })
    })];
  },
  addProseMirrorPlugins() {
    return [new Plugin({
      key: new PluginKey("codeBlockVSCodeHandler"),
      props: { handlePaste: (view, event) => {
        if (!event.clipboardData) return false;
        if (this.editor.isActive(this.type.name)) return false;
        const text = event.clipboardData.getData("text/plain");
        const vscode = event.clipboardData.getData("vscode-editor-data");
        const vscodeData = vscode ? JSON.parse(vscode) : void 0;
        const language = vscodeData === null || vscodeData === void 0 ? void 0 : vscodeData.mode;
        if (!text || !language) return false;
        const { tr, schema } = view.state;
        const textNode = schema.text(text.replace(/\r\n?/g, "\n"));
        tr.replaceSelectionWith(this.type.create({ language }, textNode));
        if (tr.selection.$from.parent.type !== this.type) tr.setSelection(TextSelection.near(tr.doc.resolve(Math.max(0, tr.selection.from - 2))));
        tr.setMeta("paste", true);
        view.dispatch(tr);
        return true;
      } }
    })];
  }
});

// node_modules/@tiptap/extension-document/dist/index.js
var Document = Node.create({
  name: "doc",
  topNode: true,
  content: "block+",
  renderMarkdown: (node, h2) => {
    if (!node.content) return "";
    return h2.renderChildren(node.content, "\n\n");
  }
});

// node_modules/@tiptap/extension-hard-break/dist/index.js
var HardBreak = Node.create({
  name: "hardBreak",
  markdownTokenName: "br",
  addOptions() {
    return {
      keepMarks: true,
      HTMLAttributes: {}
    };
  },
  inline: true,
  group: "inline",
  selectable: false,
  linebreakReplacement: true,
  parseHTML() {
    return [{ tag: "br" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["br", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  renderText() {
    return "\n";
  },
  renderMarkdown: () => `  
`,
  parseMarkdown: () => {
    return { type: "hardBreak" };
  },
  addCommands() {
    return { setHardBreak: () => ({ commands, chain, state, editor }) => {
      return commands.first([() => commands.exitCode(), () => commands.command(() => {
        const { selection, storedMarks } = state;
        if (selection.$from.parent.type.spec.isolating) return false;
        const { keepMarks } = this.options;
        const { splittableMarks } = editor.extensionManager;
        const marks = storedMarks || selection.$to.parentOffset && selection.$from.marks();
        return chain().insertContent({ type: this.name }).command(({ tr, dispatch }) => {
          if (dispatch && marks && keepMarks) {
            const filteredMarks = marks.filter((mark) => splittableMarks.includes(mark.type.name));
            tr.ensureMarks(filteredMarks);
          }
          return true;
        }).scrollIntoView().run();
      })]);
    } };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setHardBreak(),
      "Shift-Enter": () => this.editor.commands.setHardBreak()
    };
  }
});

// node_modules/@tiptap/extension-heading/dist/index.js
var Heading = Node.create({
  name: "heading",
  addOptions() {
    return {
      levels: [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      HTMLAttributes: {}
    };
  },
  content: "inline*",
  group: "block",
  defining: true,
  addAttributes() {
    return { level: {
      default: 1,
      rendered: false
    } };
  },
  parseHTML() {
    return this.options.levels.map((level) => ({
      tag: `h${level}`,
      attrs: { level }
    }));
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      `h${this.options.levels.includes(node.attrs.level) ? node.attrs.level : this.options.levels[0]}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  },
  parseMarkdown: (token, helpers) => {
    return helpers.createNode("heading", { level: token.depth || 1 }, helpers.parseInline(token.tokens || []));
  },
  renderMarkdown: (node, h2) => {
    var _node$attrs;
    const level = ((_node$attrs = node.attrs) === null || _node$attrs === void 0 ? void 0 : _node$attrs.level) ? parseInt(node.attrs.level, 10) : 1;
    const headingChars = "#".repeat(level);
    if (!node.content) return "";
    return `${headingChars} ${h2.renderChildren(node.content)}`;
  },
  addCommands() {
    return {
      setHeading: (attributes) => ({ commands }) => {
        if (!this.options.levels.includes(attributes.level)) return false;
        return commands.setNode(this.name, attributes);
      },
      toggleHeading: (attributes) => ({ commands }) => {
        if (!this.options.levels.includes(attributes.level)) return false;
        return commands.toggleNode(this.name, "paragraph", attributes);
      }
    };
  },
  addKeyboardShortcuts() {
    return this.options.levels.reduce((items, level) => ({
      ...items,
      [`Mod-Alt-${level}`]: () => this.editor.commands.toggleHeading({ level })
    }), {});
  },
  addInputRules() {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{${Math.min(...this.options.levels)},${level}})\\s$`),
        type: this.type,
        getAttributes: { level }
      });
    });
  }
});

// node_modules/@tiptap/extension-horizontal-rule/dist/index.js
var HorizontalRule = Node.create({
  name: "horizontalRule",
  addOptions() {
    return {
      HTMLAttributes: {},
      nextNodeType: "paragraph"
    };
  },
  group: "block",
  parseHTML() {
    return [{ tag: "hr" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["hr", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  markdownTokenName: "hr",
  parseMarkdown: (token, helpers) => {
    return helpers.createNode("horizontalRule");
  },
  renderMarkdown: () => {
    return "---";
  },
  addCommands() {
    return { setHorizontalRule: () => ({ chain, state }) => {
      if (!canInsertNode(state, state.schema.nodes[this.name])) return false;
      const { selection } = state;
      const { $to: $originTo } = selection;
      const currentChain = chain();
      if (isNodeSelection(selection)) currentChain.insertContentAt($originTo.pos, { type: this.name });
      else currentChain.insertContent({ type: this.name });
      return currentChain.command(({ state: chainState, tr, dispatch }) => {
        if (dispatch) {
          const { $to } = tr.selection;
          const posAfter = $to.end();
          if ($to.nodeAfter) {
            if ($to.nodeAfter.isTextblock) tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1));
            else if ($to.nodeAfter.isBlock) tr.setSelection(NodeSelection.create(tr.doc, $to.pos));
            else tr.setSelection(TextSelection.create(tr.doc, $to.pos));
          } else {
            const nodeType = chainState.schema.nodes[this.options.nextNodeType] || $to.parent.type.contentMatch.defaultType;
            const node = nodeType === null || nodeType === void 0 ? void 0 : nodeType.create();
            if (node) {
              tr.insert(posAfter, node);
              tr.setSelection(TextSelection.create(tr.doc, posAfter + 1));
            }
          }
          tr.scrollIntoView();
        }
        return true;
      }).run();
    } };
  },
  addInputRules() {
    return [nodeInputRule({
      find: /^(?:---|—-|___\s|\*\*\*\s)$/,
      type: this.type
    })];
  }
});

// node_modules/@tiptap/extension-italic/dist/index.js
var starInputRegex2 = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/;
var starPasteRegex2 = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g;
var underscoreInputRegex2 = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/;
var underscorePasteRegex2 = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g;
var Italic = Mark.create({
  name: "italic",
  addOptions() {
    return { HTMLAttributes: {} };
  },
  parseHTML() {
    return [
      { tag: "em" },
      {
        tag: "i",
        getAttrs: (node) => node.style.fontStyle !== "normal" && null
      },
      {
        style: "font-style=normal",
        clearMark: (mark) => mark.type.name === this.name
      },
      { style: "font-style=italic" }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "em",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  },
  addCommands() {
    return {
      setItalic: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleItalic: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetItalic: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  markdownTokenName: "em",
  parseMarkdown: (token, helpers) => {
    return helpers.applyMark("italic", helpers.parseInline(token.tokens || []));
  },
  markdownOptions: { htmlReopen: {
    open: "<em>",
    close: "</em>"
  } },
  renderMarkdown: (node, h2) => {
    return `*${h2.renderChildren(node)}*`;
  },
  addKeyboardShortcuts() {
    return {
      "Mod-i": () => this.editor.commands.toggleItalic(),
      "Mod-I": () => this.editor.commands.toggleItalic()
    };
  },
  addInputRules() {
    return [markInputRule({
      find: starInputRegex2,
      type: this.type
    }), markInputRule({
      find: underscoreInputRegex2,
      type: this.type
    })];
  },
  addPasteRules() {
    return [markPasteRule({
      find: starPasteRegex2,
      type: this.type
    }), markPasteRule({
      find: underscorePasteRegex2,
      type: this.type
    })];
  }
});

// node_modules/@tiptap/extension-paragraph/dist/index.js
var EMPTY_PARAGRAPH_MARKDOWN = "&nbsp;";
var NBSP_CHAR = " ";
var Paragraph = Node.create({
  name: "paragraph",
  priority: 1e3,
  addOptions() {
    return { HTMLAttributes: {} };
  },
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{ tag: "p" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  },
  parseMarkdown: (token, helpers) => {
    const tokens = token.tokens || [];
    if (tokens.length === 1 && tokens[0].type === "image") return helpers.parseChildren([tokens[0]]);
    const content = helpers.parseInline(tokens);
    if (tokens.length === 1 && tokens[0].type === "text" && (tokens[0].raw === EMPTY_PARAGRAPH_MARKDOWN || tokens[0].text === EMPTY_PARAGRAPH_MARKDOWN || tokens[0].raw === NBSP_CHAR || tokens[0].text === NBSP_CHAR) && content.length === 1 && content[0].type === "text" && (content[0].text === EMPTY_PARAGRAPH_MARKDOWN || content[0].text === NBSP_CHAR)) return helpers.createNode("paragraph", void 0, []);
    return helpers.createNode("paragraph", void 0, content);
  },
  renderMarkdown: (node, h2, ctx) => {
    if (!node) return "";
    const content = Array.isArray(node.content) ? node.content : [];
    if (content.length === 0) {
      var _ctx$previousNode, _ctx$previousNode2;
      const previousContent = Array.isArray(ctx === null || ctx === void 0 || (_ctx$previousNode = ctx.previousNode) === null || _ctx$previousNode === void 0 ? void 0 : _ctx$previousNode.content) ? ctx.previousNode.content : [];
      return (ctx === null || ctx === void 0 || (_ctx$previousNode2 = ctx.previousNode) === null || _ctx$previousNode2 === void 0 ? void 0 : _ctx$previousNode2.type) === "paragraph" && previousContent.length === 0 ? EMPTY_PARAGRAPH_MARKDOWN : "";
    }
    return h2.renderChildren(content);
  },
  addCommands() {
    return { setParagraph: () => ({ commands }) => {
      return commands.setNode(this.name);
    } };
  },
  addKeyboardShortcuts() {
    return { "Mod-Alt-0": () => this.editor.commands.setParagraph() };
  }
});

// node_modules/@tiptap/extension-strike/dist/index.js
var inputRegex2 = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/;
var pasteRegex = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g;
var Strike = Mark.create({
  name: "strike",
  addOptions() {
    return { HTMLAttributes: {} };
  },
  parseHTML() {
    return [
      { tag: "s" },
      { tag: "del" },
      { tag: "strike" },
      {
        style: "text-decoration",
        consuming: false,
        getAttrs: (style) => style.includes("line-through") ? {} : false
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "s",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  },
  markdownTokenName: "del",
  parseMarkdown: (token, helpers) => {
    return helpers.applyMark("strike", helpers.parseInline(token.tokens || []));
  },
  renderMarkdown: (node, h2) => {
    return `~~${h2.renderChildren(node)}~~`;
  },
  addCommands() {
    return {
      setStrike: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleStrike: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetStrike: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return { "Mod-Shift-s": () => this.editor.commands.toggleStrike() };
  },
  addInputRules() {
    return [markInputRule({
      find: inputRegex2,
      type: this.type
    })];
  },
  addPasteRules() {
    return [markPasteRule({
      find: pasteRegex,
      type: this.type
    })];
  }
});

// node_modules/@tiptap/extension-text/dist/index.js
var Text = Node.create({
  name: "text",
  group: "inline",
  parseMarkdown: (token) => {
    return {
      type: "text",
      text: token.text || ""
    };
  },
  renderMarkdown: (node) => node.text || ""
});

// node_modules/@tiptap/starter-kit/dist/index.js
var StarterKit = Extension.create({
  name: "starterKit",
  addExtensions() {
    const extensions = [];
    if (this.options.bold !== false) extensions.push(Bold.configure(this.options.bold));
    if (this.options.blockquote !== false) extensions.push(Blockquote.configure(this.options.blockquote));
    if (this.options.bulletList !== false) extensions.push(BulletList.configure(this.options.bulletList));
    if (this.options.code !== false) extensions.push(Code.configure(this.options.code));
    if (this.options.codeBlock !== false) extensions.push(CodeBlock.configure(this.options.codeBlock));
    if (this.options.document !== false) extensions.push(Document.configure(this.options.document));
    if (this.options.dropcursor !== false) extensions.push(Dropcursor.configure(this.options.dropcursor));
    if (this.options.gapcursor !== false) extensions.push(Gapcursor.configure(this.options.gapcursor));
    if (this.options.hardBreak !== false) extensions.push(HardBreak.configure(this.options.hardBreak));
    if (this.options.heading !== false) extensions.push(Heading.configure(this.options.heading));
    if (this.options.undoRedo !== false) extensions.push(UndoRedo.configure(this.options.undoRedo));
    if (this.options.horizontalRule !== false) extensions.push(HorizontalRule.configure(this.options.horizontalRule));
    if (this.options.italic !== false) extensions.push(Italic.configure(this.options.italic));
    if (this.options.listItem !== false) extensions.push(ListItem.configure(this.options.listItem));
    if (this.options.listKeymap !== false) {
      var _this$options;
      extensions.push(ListKeymap.configure((_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.listKeymap));
    }
    if (this.options.link !== false) {
      var _this$options2;
      extensions.push(Link.configure((_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.link));
    }
    if (this.options.orderedList !== false) extensions.push(OrderedList.configure(this.options.orderedList));
    if (this.options.paragraph !== false) extensions.push(Paragraph.configure(this.options.paragraph));
    if (this.options.strike !== false) extensions.push(Strike.configure(this.options.strike));
    if (this.options.text !== false) extensions.push(Text.configure(this.options.text));
    if (this.options.underline !== false) {
      var _this$options3;
      extensions.push(Underline.configure((_this$options3 = this.options) === null || _this$options3 === void 0 ? void 0 : _this$options3.underline));
    }
    if (this.options.trailingNode !== false) {
      var _this$options4;
      extensions.push(TrailingNode.configure((_this$options4 = this.options) === null || _this$options4 === void 0 ? void 0 : _this$options4.trailingNode));
    }
    return extensions;
  }
});
var src_default = StarterKit;
export {
  StarterKit,
  src_default as default
};
//# sourceMappingURL=@tiptap_starter-kit.js.map
