import { Component } from 'react';
import C from '../theme';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 24px', textAlign: 'center',
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 12, margin: 20,
        }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>⚠️</p>
          <h3 style={{ fontFamily: 'Georgia,serif', color: C.red, marginBottom: 8 }}>Something went wrong</h3>
          <p style={{ color: C.textMid, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 20px', borderRadius: 6, border: 'none',
              background: C.gold, color: '#07090F', fontWeight: 700,
              cursor: 'pointer', fontSize: 13,
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
