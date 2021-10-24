// tslint:disable:no-namespace
declare namespace NodeJS {
  interface ProcessEnv {
    AUTH_EMAILS_BUCKET_NAME: string;
    AUTH_FACEBOOK_ID: string;
    AUTH_FACEBOOK_SECRET: string;
    AUTH_GITHUB_ID: string;
    AUTH_GITHUB_SECRET: string;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
    AUTH_MASTER_JWT_SECRET: string;
    AUTH_MASTER_JWT_SIGNING_KEY: string;
    AUTH_MASTER_SECRET_KEY: string;
    INTEGRATION_TEST_LAST_FM_KEY: string;
    LASTFM_CACHE_AWS_S3_BUCKET_NAME: string;
    LASTFM_CACHE_AWS_CLOUDFRONT_DOMAIN_NAME: string;
    LAST_FM_KEY: string;
    MLA_AWS_ACCESS_KEY_ID: string;
    MLA_AWS_SECRET_ACCESS_KEY: string;
    MLA_AWS_REGION: string;
    NEXT_PUBLIC_ANALYTICS_UA_CODE: string;
  }
}
