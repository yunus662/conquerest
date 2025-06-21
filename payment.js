// payment.js

export async function buyTickets(quantity = 1) {
  try {
    const response = await fetch("https://your-replit-or-stripe-server.com/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity })
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe checkout
    } else {
      alert("❌ Could not start checkout session.");
    }
  } catch (err) {
    console.error("BuyTickets Error:", err);
    alert("⚠️ Something went wrong while starting payment.");
  }
}
