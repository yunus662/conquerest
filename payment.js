// payment.js

export async function makePayment(quantity = 1) {
  try {
    const response = await fetch("https://a56a19b3-9378-4691-b2ee-d49ea8516899-00-28bd8u7rlzv4s.spock.repl.co/__replco/workspace_iframe.html?initialPath=%2F&id=%3Arer%3A/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity })
    });

    const data = await response.json();
    if (data.url) {
      // Redirect to the checkout session (e.g., for Stripe)
      window.location.href = data.url;
    } else {
      alert("❌ Could not start checkout session.");
    }
  } catch (err) {
    console.error("Make Payment Error:", err);
    alert("⚠️ Something went wrong while starting payment.");
  }
}
