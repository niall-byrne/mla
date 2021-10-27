const mockAnalyticsHook = {
  event: jest.fn(),
  setup: jest.fn(),
  trackButtonClick: jest.fn(),
  trackExternalLinkClick: jest.fn(),
  trackInternalLinkClick: jest.fn(),
};

export default mockAnalyticsHook;
