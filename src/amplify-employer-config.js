// amplify-employer-config.js
const employerConfig = {
  aws_project_region: "us-east-2",
  aws_cognito_identity_pool_id: "us-east-2:421e3c45-9ce4-43cb-8f09-3fe2c2a7d67c",
  aws_cognito_region: "us-east-2",
  aws_user_pools_id: "us-east-2_7LkBrXGsh",
  aws_user_pools_web_client_id: "7gd93p0u7839q7h2lkk52e41r2",
  oauth: {},
  aws_cognito_username_attributes: [],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ["EMAIL", "ADDRESS", "NICKNAME"],
  aws_cognito_mfa_configuration: "OFF",
  aws_cognito_mfa_types: ["SMS"],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ["EMAIL"]
};

export default employerConfig;
