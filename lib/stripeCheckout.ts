export async function handleStripeCheckout(planId: string): Promise<void> {
  const token = localStorage.getItem('skydeed_token')

  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      plan_id: planId,
      success_url: window.location.origin + '/dashboard?payment=success',
      cancel_url: window.location.origin + '/pricing',
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to create checkout session')
  }

  const { url } = await res.json()
  if (url) window.location.href = url
}
