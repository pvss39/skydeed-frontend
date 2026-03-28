import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')
  const body = await req.json()

  const res = await fetch(
    process.env.RAILWAY_BACKEND_URL + '/payments/stripe/create-checkout',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
      body: JSON.stringify({
        plan_id: body.plan_id,
        currency: 'usd',
        success_url: body.success_url,
        cancel_url: body.cancel_url,
      }),
    }
  )

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
