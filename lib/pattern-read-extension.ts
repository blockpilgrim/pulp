import { Extension, type Editor } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { EditorView } from "@tiptap/pm/view";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "it", "its", "are", "was", "were",
  "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "could", "should", "may", "might", "can", "shall",
  "not", "no", "nor", "so", "if", "then", "than", "that", "this",
  "these", "those", "what", "which", "who", "whom", "how", "when",
  "where", "why", "all", "each", "every", "both", "few", "more",
  "most", "other", "some", "such", "only", "own", "same", "too",
  "very", "just", "about", "above", "after", "again", "also",
  "any", "because", "before", "between", "during", "into",
  "out", "over", "under", "here", "there",
  "my", "your", "his", "her", "our", "their", "me", "him",
  "us", "them", "you", "he", "she", "we", "they",
  "much", "many", "like", "well", "back", "even", "still",
  "way", "get", "got", "make", "made", "know", "think",
  "come", "take", "want", "look", "use", "find", "give",
  "tell", "say", "said", "goes", "going", "went",
  "thing", "things", "really", "something", "anything",
  "nothing", "everything", "someone", "anyone", "everyone",
]);

const MIN_WORD_LENGTH = 4;
const CYCLE_INTERVAL = 2200;
const INITIAL_DELAY = 600;

type WordPos = { from: number; to: number };

function findSubstantiveWords(doc: ProseMirrorNode): WordPos[] {
  const words: WordPos[] = [];
  doc.descendants((node, pos) => {
    if (node.isText && node.text) {
      const regex = /\b[a-zA-Z']+\b/g;
      let match;
      while ((match = regex.exec(node.text)) !== null) {
        const word = match[0].toLowerCase().replace(/'/g, "");
        if (word.length >= MIN_WORD_LENGTH && !STOPWORDS.has(word)) {
          words.push({
            from: pos + match.index,
            to: pos + match.index + match[0].length,
          });
        }
      }
    }
  });
  return words;
}

function selectWords(allWords: WordPos[], count: number): WordPos[] {
  const shuffled = [...allWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getHighlightCount(substantiveCount: number): number {
  const count = Math.round(substantiveCount * 0.04);
  return Math.max(2, Math.min(6, count));
}

const patternReadKey = new PluginKey("patternRead");

export const PatternReadExtension = Extension.create({
  name: "patternRead",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: patternReadKey,

        state: {
          init() {
            return { active: false, decorations: DecorationSet.empty };
          },
          apply(tr, value) {
            const meta = tr.getMeta(patternReadKey);
            if (meta) {
              if (meta.setActive === false) {
                return { active: false, decorations: DecorationSet.empty };
              }
              if (meta.setActive === true) {
                return { active: true, decorations: DecorationSet.empty };
              }
              if (meta.decorations !== undefined) {
                return { ...value, decorations: meta.decorations };
              }
            }
            // Map existing decorations through document changes
            if (value.active && value.decorations !== DecorationSet.empty) {
              return {
                ...value,
                decorations: value.decorations.map(tr.mapping, tr.doc),
              };
            }
            return value;
          },
        },

        props: {
          decorations(state) {
            return (
              patternReadKey.getState(state)?.decorations ??
              DecorationSet.empty
            );
          },
        },

        view(editorView: EditorView) {
          let cycleTimer: ReturnType<typeof setInterval> | null = null;
          let delayTimer: ReturnType<typeof setTimeout> | null = null;

          const cycle = () => {
            const { state } = editorView;
            const pluginState = patternReadKey.getState(state);
            if (!pluginState?.active) return;

            const allWords = findSubstantiveWords(state.doc);
            if (allWords.length === 0) return;

            const count = getHighlightCount(allWords.length);
            const selected = selectWords(allWords, count);

            const decorations = selected.map((word, i) =>
              Decoration.inline(word.from, word.to, {
                class: "pattern-read-word",
                style: `--pr-i:${i}`,
              })
            );

            const tr = state.tr;
            tr.setMeta(patternReadKey, {
              decorations: DecorationSet.create(state.doc, decorations),
            });
            tr.setMeta("addToHistory", false);
            editorView.dispatch(tr);
          };

          return {
            update(view: EditorView, prevState) {
              const current = patternReadKey.getState(view.state);
              const prev = patternReadKey.getState(prevState);

              if (current?.active && !prev?.active) {
                // Delay first cycle to let the dim CSS transition settle
                delayTimer = setTimeout(() => {
                  cycle();
                  cycleTimer = setInterval(cycle, CYCLE_INTERVAL);
                }, INITIAL_DELAY);
              } else if (!current?.active && prev?.active) {
                if (delayTimer) {
                  clearTimeout(delayTimer);
                  delayTimer = null;
                }
                if (cycleTimer) {
                  clearInterval(cycleTimer);
                  cycleTimer = null;
                }
              }
            },
            destroy() {
              if (delayTimer) clearTimeout(delayTimer);
              if (cycleTimer) clearInterval(cycleTimer);
            },
          };
        },
      }),
    ];
  },
});

export function setPatternReadActive(editor: Editor, active: boolean) {
  if (editor.isDestroyed) return;
  const tr = editor.state.tr;
  tr.setMeta(patternReadKey, { setActive: active });
  tr.setMeta("addToHistory", false);
  editor.view.dispatch(tr);
}
