import C from '../../theme';

export default function Terms() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', color: C.textMid, lineHeight: 1.6 }}>
      <h1 style={{ fontFamily: 'Georgia,serif', color: C.gold, marginBottom: 10 }}>Terms of Service</h1>
      <p style={{ fontSize: 12, marginBottom: 40 }}>Last updated: June 6, 2026</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>1. Acceptance of Terms</h2>
      <p>By accessing and using this GRE preparation application, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>2. Subscription and Payments</h2>
      <p>Premium features require a paid subscription. All payments are securely processed by Paddle, our Merchant of Record. By subscribing, you agree to provide current, complete, and accurate purchase and account information.</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>3. Intellectual Property</h2>
      <p>The curriculum, word lists, practice questions, and software architecture are the exclusive property of the application owner. You may not reproduce, distribute, or create derivative works without explicit permission.</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>4. User Conduct</h2>
      <p>You agree not to exploit bugs, bypass paywalls, or use automated systems to scrape our content. Violation of this rule will result in immediate account termination without refund.</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>5. Limitation of Liability</h2>
      <p>We do not guarantee specific test scores resulting from the use of this service. The service is provided "as is" without any warranties, express or implied.</p>

      <div style={{ marginTop: 60, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
        <a href="/" style={{ color: C.gold, textDecoration: 'none', fontWeight: 700 }}>← Back to Application</a>
      </div>
    </div>
  );
}
