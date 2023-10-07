"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/node.ts
var node_exports = {};
__export(node_exports, {
  defineConfig: () => defineConfig,
  getThemeConfig: () => getThemeConfig,
  tabsMarkdownPlugin: () => tabsPlugin
});
module.exports = __toCommonJS(node_exports);

// ../../node_modules/.pnpm/vitepress-plugin-tabs@0.3.0_vitepress@1.0.0-rc.4_vue@3.3.4/node_modules/vitepress-plugin-tabs/dist/index.js
var __create2 = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __getProtoOf2 = Object.getPrototypeOf;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps2 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames2(from))
      if (!__hasOwnProp2.call(to, key) && key !== except)
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_markdown_it_container = __commonJS({
  "../../node_modules/.pnpm/markdown-it-container@3.0.0/node_modules/markdown-it-container/index.js"(exports, module2) {
    "use strict";
    module2.exports = function container_plugin(md, name, options) {
      function validateDefault(params) {
        return params.trim().split(" ", 2)[0] === name;
      }
      function renderDefault(tokens, idx, _options, env, slf) {
        if (tokens[idx].nesting === 1) {
          tokens[idx].attrJoin("class", name);
        }
        return slf.renderToken(tokens, idx, _options, env, slf);
      }
      options = options || {};
      var min_markers = 3, marker_str = options.marker || ":", marker_char = marker_str.charCodeAt(0), marker_len = marker_str.length, validate = options.validate || validateDefault, render = options.render || renderDefault;
      function container2(state, startLine, endLine, silent) {
        var pos, nextLine, marker_count, markup, params, token, old_parent, old_line_max, auto_closed = false, start = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
        if (marker_char !== state.src.charCodeAt(start)) {
          return false;
        }
        for (pos = start + 1; pos <= max; pos++) {
          if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
            break;
          }
        }
        marker_count = Math.floor((pos - start) / marker_len);
        if (marker_count < min_markers) {
          return false;
        }
        pos -= (pos - start) % marker_len;
        markup = state.src.slice(start, pos);
        params = state.src.slice(pos, max);
        if (!validate(params, markup)) {
          return false;
        }
        if (silent) {
          return true;
        }
        nextLine = startLine;
        for (; ; ) {
          nextLine++;
          if (nextLine >= endLine) {
            break;
          }
          start = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
          if (start < max && state.sCount[nextLine] < state.blkIndent) {
            break;
          }
          if (marker_char !== state.src.charCodeAt(start)) {
            continue;
          }
          if (state.sCount[nextLine] - state.blkIndent >= 4) {
            continue;
          }
          for (pos = start + 1; pos <= max; pos++) {
            if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
              break;
            }
          }
          if (Math.floor((pos - start) / marker_len) < marker_count) {
            continue;
          }
          pos -= (pos - start) % marker_len;
          pos = state.skipSpaces(pos);
          if (pos < max) {
            continue;
          }
          auto_closed = true;
          break;
        }
        old_parent = state.parentType;
        old_line_max = state.lineMax;
        state.parentType = "container";
        state.lineMax = nextLine;
        token = state.push("container_" + name + "_open", "div", 1);
        token.markup = markup;
        token.block = true;
        token.info = params;
        token.map = [startLine, nextLine];
        state.md.block.tokenize(state, startLine + 1, nextLine);
        token = state.push("container_" + name + "_close", "div", -1);
        token.markup = state.src.slice(start, pos);
        token.block = true;
        state.parentType = old_parent;
        state.lineMax = old_line_max;
        state.line = nextLine + (auto_closed ? 1 : 0);
        return true;
      }
      md.block.ruler.before("fence", "container_" + name, container2, {
        alt: ["paragraph", "reference", "blockquote", "list"]
      });
      md.renderer.rules["container_" + name + "_open"] = render;
      md.renderer.rules["container_" + name + "_close"] = render;
    };
  }
});
var import_markdown_it_container = __toESM2(require_markdown_it_container(), 1);
var tabMarker = "=";
var tabMarkerCode = tabMarker.charCodeAt(0);
var minTabMarkerLen = 2;
var ruleBlockTab = (state, startLine, endLine, silent) => {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];
  if (state.parentType !== "container") {
    return false;
  }
  if (pos + minTabMarkerLen > max) {
    return false;
  }
  const marker = state.src.charCodeAt(pos);
  if (marker !== tabMarkerCode) {
    return false;
  }
  const mem = pos;
  pos = state.skipChars(pos + 1, marker);
  const tabMarkerLen = pos - mem;
  if (tabMarkerLen < minTabMarkerLen - 1) {
    return false;
  }
  if (silent) {
    return true;
  }
  let nextLine = startLine;
  let endStart = mem;
  let endPos = pos;
  for (; ; ) {
    nextLine++;
    if (nextLine >= endLine) {
      break;
    }
    endStart = state.bMarks[nextLine] + state.tShift[nextLine];
    const max2 = state.eMarks[nextLine];
    if (endStart < max2 && state.sCount[nextLine] < state.blkIndent) {
      break;
    }
    const startCharCode = state.src.charCodeAt(endStart);
    if (startCharCode !== tabMarkerCode) {
      continue;
    }
    const p = state.skipChars(endStart + 1, marker);
    if (p - endStart !== tabMarkerLen) {
      continue;
    }
    endPos = p;
    break;
  }
  const oldParent = state.parentType;
  const oldLineMax = state.lineMax;
  state.parentType = "tab";
  state.lineMax = nextLine;
  const startToken = state.push("tab_open", "div", 1);
  startToken.markup = state.src.slice(mem, pos);
  startToken.block = true;
  startToken.info = state.src.slice(pos, max).trimStart();
  startToken.map = [startLine, nextLine - 1];
  state.md.block.tokenize(state, startLine + 1, nextLine);
  const endToken = state.push("tab_close", "div", -1);
  endToken.markup = state.src.slice(endStart, endPos);
  endToken.block = true;
  state.parentType = oldParent;
  state.lineMax = oldLineMax;
  state.line = nextLine;
  return true;
};
var parseTabsParams = (input) => {
  const match = input.match(/key:(\S+)/);
  return {
    shareStateKey: match == null ? void 0 : match[1]
  };
};
var tabsPlugin = (md) => {
  md.use(import_markdown_it_container.default, "tabs", {
    render(tokens, index) {
      const token = tokens[index];
      if (token.nesting === 1) {
        const params = parseTabsParams(token.info);
        const shareStateKeyProp = params.shareStateKey ? `sharedStateKey="${md.utils.escapeHtml(params.shareStateKey)}"` : "";
        return `<PluginTabs ${shareStateKeyProp}>
`;
      } else {
        return `</PluginTabs>
`;
      }
    }
  });
  md.block.ruler.after("container_tabs", "tab", ruleBlockTab);
  const renderTab = (tokens, index) => {
    const token = tokens[index];
    if (token.nesting === 1) {
      const label = token.info;
      const labelProp = `label="${md.utils.escapeHtml(label)}"`;
      return `<PluginTabsTab ${labelProp}>
`;
    } else {
      return `</PluginTabsTab>
`;
    }
  };
  md.renderer.rules["tab_open"] = renderTab;
  md.renderer.rules["tab_close"] = renderTab;
};

// src/utils/node/index.ts
var import_node_child_process = require("child_process");
var import_utils = require("@dylanjs/utils");

// src/constants/index.ts
var removeBlank = /^\s+|\s+$/g;

// src/utils/node/index.ts
function aliasObjectToArray(obj) {
  return Object.entries(obj).map(([find, replacement]) => ({
    find,
    replacement
  }));
}
function getDefaultTitle(content) {
  const title = clearMatterContent(content).split("\n")?.find((str) => {
    return str.startsWith("# ");
  })?.slice(2).replace(removeBlank, "") || "";
  return title;
}
function clearMatterContent(content) {
  let first___;
  let second___;
  const lines = content.split("\n").reduce((pre, line) => {
    if (!line.trim() && pre.length === 0) {
      return pre;
    }
    if (line.trim() === "---") {
      if (first___ === void 0) {
        first___ = pre.length;
      } else if (second___ === void 0) {
        second___ = pre.length;
      }
    }
    pre.push(line);
    return pre;
  }, []);
  return lines.slice(second___ || 0).join("\n");
}
function getFileBirthTime(url) {
  let date = /* @__PURE__ */ new Date();
  try {
    const infoStr = (0, import_node_child_process.spawnSync)("git", ["log", "-1", '--pretty="%ci"', url]).stdout?.toString().replace(/["']/g, "").trim();
    if (infoStr) {
      date = new Date(infoStr);
    }
  } catch (error) {
    return (0, import_utils.formatBlogDate)(date);
  }
  return (0, import_utils.formatBlogDate)(date);
}
function getTextSummary(text, count = 100) {
  return clearMatterContent(text).match(/^# ([\s\S]+)/m)?.[1]?.replace(/#/g, "")?.replace(/!\[.*?\]\(.*?\)/g, "")?.replace(/\[(.*?)\]\(.*?\)/g, "$1")?.replace(/\*\*(.*?)\*\*/g, "$1")?.split("\n")?.filter((v) => !!v)?.slice(1)?.join("\n")?.replace(/>(.*)/, "")?.slice(0, count);
}

// src/utils/node/mdPlugins.ts
async function getMarkdownPlugins(cfg) {
  const markdownPlugin = [];
  if (cfg?.tags) {
    markdownPlugin.push(tabsPlugin);
  }
  if (cfg) {
    cfg.mermaid = cfg?.mermaid ?? true;
    if (cfg?.mermaid !== false) {
      const { MermaidMarkdown } = await import("vitepress-plugin-mermaid");
      markdownPlugin.push(MermaidMarkdown);
    }
  }
  return markdownPlugin;
}
function registerMdPlugins(vpCfg, plugins) {
  if (plugins.length) {
    vpCfg.mardown = {
      config(...rest) {
        plugins.forEach((plugin) => {
          plugin?.(...rest);
        });
      }
    };
  }
}
function wrapperCfgWithMermaid(config) {
  const extendThemeConfig = config.extends?.themeConfig?.blog || {};
  const resultConfig = extendThemeConfig.mermaid === false ? config : {
    ...config,
    mermaid: extendThemeConfig.mermaid === true ? {} : extendThemeConfig.mermaid
  };
  assignMermaid(resultConfig);
  return resultConfig;
}
async function assignMermaid(config) {
  if (!config?.mermaid)
    return;
  if (!config.vite)
    config.vite = {};
  if (!config.vite.plugins)
    config.vite.plugins = [];
  const { MermaidPlugin } = await import("vitepress-plugin-mermaid");
  config.vite.plugins.push(MermaidPlugin(config.mermaid));
  if (!config.vite.resolve)
    config.vite.resolve = {};
  if (!config.vite.resolve.alias)
    config.vite.resolve.alias = {};
  config.vite.resolve.alias = [
    ...aliasObjectToArray({
      ...config.vite.resolve.alias,
      "cytoscape/dist/cytoscape.umd.js": "cytoscape/dist/cytoscape.esm.js",
      mermaid: "mermaid/dist/mermaid.esm.mjs"
    }),
    { find: /^dayjs\/(.*).js/, replacement: "dayjs/esm/$1" }
  ];
}
function supportRunExtendsPlugin(config) {
  if (!config.markdown)
    config.markdown = {};
  if (config.extends?.markdown?.config) {
    const markdownExtendsConfigOriginal = config.extends?.markdown?.config;
    const selfMarkdownConfig = config.markdown?.config;
    config.markdown.config = (...rest) => {
      selfMarkdownConfig?.(...rest);
      markdownExtendsConfigOriginal?.(...rest);
    };
  }
}

// src/utils/node/theme.ts
var import_node_path = __toESM(require("path"));
var import_node_fs = __toESM(require("fs"));
var import_fast_glob = require("fast-glob");
var import_gray_matter = __toESM(require("gray-matter"));
var import_utils2 = require("@dylanjs/utils");
function getArticles(cfg) {
  const srcDir = cfg?.srcDir || process.argv.slice(2)?.[1] || ".";
  const files = import_fast_glob.glob.sync(`${srcDir}/**/*.md`, { ignore: ["node_modules"] });
  const data = files.map((v) => {
    let route = v.replace(".md", "");
    route = route.replace(new RegExp(`^${import_node_path.default.join(srcDir, "/").replace(new RegExp(`\\${import_node_path.default.sep}`, "g"), "/")}`), "");
    const fileContent = import_node_fs.default.readFileSync(v, "utf-8");
    const { data: frontmatter } = (0, import_gray_matter.default)(fileContent, {
      excerpt: true
    });
    const meta = {
      ...frontmatter
    };
    if (!meta.title) {
      meta.title = getDefaultTitle(fileContent);
    }
    if (!meta.date) {
      meta.date = getFileBirthTime(v);
    } else {
      const timeZone = cfg?.timeZone ?? 8;
      meta.date = (0, import_utils2.formatBlogDate)(/* @__PURE__ */ new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`));
    }
    meta.tags = typeof meta.tags === "string" ? [meta.tags] : meta.tags;
    meta.tag = [meta.tag || []].flat().concat([.../* @__PURE__ */ new Set([...meta.tags || []])]);
    const typeArr = route.split("/");
    meta.type = typeArr.slice(0, typeArr.length - 1).join("-");
    const wordCount = 100;
    meta.description = meta.description || getTextSummary(fileContent, wordCount);
    meta.cover = meta.cover ?? (fileContent.match(/[!]\[.*?\]\((https:\/\/.+)\)/)?.[1] || "");
    if (meta.publish === false) {
      meta.hidden = true;
      meta.recommend = false;
    }
    return {
      route: `/${route}`,
      meta
    };
  }).filter((v) => v.meta.layout !== "home");
  return data;
}
function patchVPThemeConfig(cfg, vpThemeConfig = {}) {
  vpThemeConfig.sidebar = patchDefaultThemeSideBar(cfg)?.sidebar;
  return vpThemeConfig;
}
function patchDefaultThemeSideBar(cfg) {
  return cfg?.blog !== false && cfg?.recommend !== false ? {
    sidebar: [
      {
        text: "",
        items: []
      }
    ]
  } : void 0;
}

// src/utils/node/vitePlugins.ts
var import_node_path2 = __toESM(require("path"));
var import_node_child_process2 = require("child_process");
function getVitePlugins(cfg) {
  const plugins = [];
  const buildEndFn = [];
  plugins.push(inlineBuildEndPlugin(buildEndFn));
  if (cfg?.search === "pagefind" || cfg?.search instanceof Object && cfg.search.mode === "pagefind") {
    plugins.push(inlinePagefindPlugin(buildEndFn));
  }
  return plugins;
}
function inlineBuildEndPlugin(buildEndFn) {
  let rewrite = false;
  return {
    name: "@sugarar/theme-plugin-build-end",
    enforce: "pre",
    configResolved(config) {
      if (rewrite) {
        return;
      }
      const vitepressConfig = config.vitepress;
      if (!vitepressConfig) {
        return;
      }
      rewrite = true;
      const selfBuildEnd = vitepressConfig.buildEnd;
      vitepressConfig.buildEnd = (siteCfg) => {
        selfBuildEnd?.(siteCfg);
        buildEndFn.filter((fn) => typeof fn === "function").forEach((fn) => fn(siteCfg));
      };
    }
  };
}
function inlinePagefindPlugin(buildEndFn) {
  buildEndFn.push(() => {
    const ignore = [
      // 侧边栏内容
      "div.aside",
      // 标题锚点
      "a.header-anchor"
    ];
    const { log } = console;
    log();
    log("=== pagefind: https://pagefind.app/ ===");
    let command = `npx pagefind --source ${import_node_path2.default.join(
      process.argv.slice(2)?.[1] || ".",
      ".vitepress/dist"
    )}`;
    if (ignore.length) {
      command += ` --exclude-selectors "${ignore.join(", ")}"`;
    }
    log(command);
    log();
    (0, import_node_child_process2.execSync)(command, {
      stdio: "inherit"
    });
  });
  return {
    name: "@sugarar/theme-plugin-pagefind",
    enforce: "pre",
    // 添加检索的内容标识
    transform(code, id) {
      if (id.endsWith("theme-default/Layout.vue")) {
        return code.replace("<VPContent>", "<VPContent data-pagefind-body>");
      }
      return code;
    }
  };
}
function registerVitePlugins(vpCfg, plugins) {
  vpCfg.vite = {
    plugins
  };
}

// src/node.ts
async function getThemeConfig(cfg) {
  const pagesData = getArticles(cfg);
  const extraVPConfig = {};
  const vitePlugins = getVitePlugins(cfg);
  registerVitePlugins(extraVPConfig, vitePlugins);
  const markdownPlugin = await getMarkdownPlugins(cfg);
  registerMdPlugins(extraVPConfig, markdownPlugin);
  return {
    themeConfig: {
      blog: {
        pagesData,
        ...cfg
      },
      // 补充一些额外的配置用于继承
      ...patchVPThemeConfig(cfg)
    },
    ...extraVPConfig
  };
}
function defineConfig(config) {
  const resultConfig = wrapperCfgWithMermaid(config);
  supportRunExtendsPlugin(resultConfig);
  return resultConfig;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineConfig,
  getThemeConfig,
  tabsMarkdownPlugin
});
