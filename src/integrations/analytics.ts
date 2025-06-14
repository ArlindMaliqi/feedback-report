export class Analytics {
  private provider: string;
  private config: any;

  constructor(provider: string, config: any) {
    this.provider = provider;
    this.config = config;
  }

  track(event: string, data: any) {
    console.log(`Analytics [${this.provider}]:`, event, data);
  }

  trackFeedbackSubmitted(feedback: any) {
    this.track('feedback_submitted', feedback);
  }
}

export default Analytics;
