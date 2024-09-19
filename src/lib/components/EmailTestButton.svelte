<script lang="ts">
  import { onMount } from "svelte";

  let sending = false;
  let result: string | null = null;

  async function sendTestEmail() {
    sending = true;
    result = null;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "ashwinik1989@gmail.com",
          name: "Ashwini",
          subject: "Test Email",
          variables: {
            name: "Ashwini",
            message: "This is a test email sent from our SvelteKit app!",
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        result = "Email sent successfully!";
      } else {
        result = `Failed to send email: ${data.message}`;
      }
    } catch (error: any) {
      result = `Error: ${error.message}`;
    } finally {
      sending = false;
    }
  }
</script>

<button on:click={sendTestEmail} disabled={sending}>
  {sending ? "Sending..." : "Send Test Email"}
</button>

{#if result}
  <p>{result}</p>
{/if}
