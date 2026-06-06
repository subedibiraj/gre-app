import C from '../../theme';

export default function Privacy() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', color: C.textMid, lineHeight: 1.6 }}>
      <h1 style={{ fontFamily: 'Georgia,serif', color: C.gold, marginBottom: 10 }}>Privacy Policy</h1>
      <p style={{ fontSize: 12, marginBottom: 40 }}>Last updated: June 6, 2026</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>1. Information We Collect</h2>
      <p>We collect your email address when you sign up using Google Auth. We also collect your study progress, quiz scores, and spaced repetition data to personalize your learning experience.</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>2. How We Use Your Information</h2>
      <p>Your data is used solely to provide and improve the GRE preparation service. Your progress is synced to our secure Supabase database to allow you to study across multiple devices.</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>3. Third-Party Services</h2>
      <p>We use Supabase for authentication and database hosting. We use Paddle to process payments securely. We do not store your credit card information on our servers.</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>4. Data Security</h2>
      <p>We implement strict Row Level Security (RLS) policies to ensure that your study data can only be accessed by you. We use industry-standard encryption for data transmission.</p>

      <h2 style={{ color: C.text, fontSize: 18, marginTop: 30, marginBottom: 10 }}>5. Your Rights</h2>
      <p>You have the right to request the deletion of your account and associated data at any time by contacting our support team.</p>

      <div style={{ marginTop: 60, borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
        <a href="/" style={{ color: C.gold, textDecoration: 'none', fontWeight: 700 }}>← Back to Application</a>
      </div>
    </div>
  );
}
