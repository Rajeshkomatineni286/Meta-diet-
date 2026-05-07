import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('App crash:', error);
  }

  render() {
    if (this.state.hasError) {
      return <div className='min-h-screen bg-black text-white flex items-center justify-center'>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
