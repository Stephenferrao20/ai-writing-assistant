import TiptapLink from "@tiptap/extension-link"
import type { EditorView } from "@tiptap/pm/view"
import { getMarkRange } from "@tiptap/react"
import { Plugin, TextSelection } from "@tiptap/pm/state"

export const Link = TiptapLink.extend({
  inclusive: false,

  parseHTML() {
    return [
      {
        tag: 'a[href]:not([data-type="button"]):not([href *= "javascript:" i])',
      },
    ]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
            const { state } = view
            const { selection } = state

            if (event.key === "Escape" && !selection.empty) {
              view.focus()
              // Optionally, dispatch a transaction if you want to change selection
            }

            return false
          },

          handleClick(view: EditorView, pos: number) {
            const { schema, doc, tr } = view.state
            const linkMark = schema.marks.link
            if (!linkMark) return false

            const resolvedPos = doc.resolve(pos)
            const range = getMarkRange(resolvedPos, linkMark)

            if (!range) return false

            const { from, to } = range

            if (pos < from || pos > to) return false

            const $from = doc.resolve(from)
            const $to = doc.resolve(to)

            const transaction = tr.setSelection(new TextSelection($from, $to))
            view.dispatch(transaction)
            return true
          },
        },
      }),
    ]
  },
})

export default Link
