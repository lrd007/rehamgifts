<!-- MarkdownEditor.svelte -->
<script>
  import { Carta, MarkdownEditor } from "carta-md";
  import "carta-md/default.css"; /* Default theme */

  // Your other stuff...
  import DOMPurify from "isomorphic-dompurify";

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize,
  });

  let value = "";
</script>

<MarkdownEditor {carta} bind:value />
