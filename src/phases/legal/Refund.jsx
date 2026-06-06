import C from '../../theme';

export default function Refund() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', color: C.textMid, lineHeight: 1.6 }}>
      <h1 style={{ fontFamily: 'Georgia,serif', color: C.gold, marginBottom: 10 }}>Refund Policy</h1>
      <p style={{ fontSize: 12, marginBottom: 40 }}>Last updated: June 6, 2026</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>7-Day Money-Back Guarantee</h2>
      <p>We stand behind the quality of our GRE preparation materials. If you are not completely satisfied with your Pro subscription, you are eligible for a full refund within 7 days of your initial purchase.</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>Conditions for Refund</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li>The refund request must be submitted within exactly 7 days (168 hours) of the original transaction.</li>
        <li>You must not have completed more than 3 Mock Exams during this 7-day period.</li>
        <li>Refunds apply to initial subscriptions only, not to renewals.</li>
      </ul>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>How to Request a Refund</h2>
      <p>To request a refund, please contact our support team from the email address associated with your account. We process refunds through our payment provider (Paddle), and it may take 5-10 business days for the funds to appear on your bank statement.</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>Subscription Cancellations</h2>
      <p>You can cancel your subscription at any time to prevent future billing. Cancellation does not automatically trigger a refund for the current billing cycle.</p>

      <div style={{ marginTop: 60, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
        <a href="/" style={{ color: C.gold, textDecoration: 'none', fontWeight: 700 }}>← Back to Application</a>
      </div>
    </div>
  );
}
