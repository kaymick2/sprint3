/**
 * amplify-config.js
 * 
 * This file contains the AWS Amplify configuration settings for the application.
 * It defines the AWS Cognito User Pool and Identity Pool settings used for authentication
 * and authorization in the application.
 */

/**
 * AWS Amplify Configuration Object
 * 
 * Contains all the necessary configuration parameters for AWS services used in the application,
 * primarily focused on authentication through Amazon Cognito.
 */
const awsconfig = {
    // AWS Region where the services are deployed
    aws_project_region: "us-east-2",
    
    // Cognito Identity Pool ID for obtaining AWS credentials
    // Used to grant authenticated users access to other AWS services
    aws_cognito_identity_pool_id: "us-east-2:eee482d4-0a23-4bff-bd04-3a2d7394d7e2",
    
    // AWS Region where Cognito services are deployed
    aws_cognito_region: "us-east-2",
    
    // Cognito User Pool ID for user authentication
    aws_user_pools_id: "us-east-2_JT1Zv1m5E",
    
    // Client ID for the Cognito User Pool web client
    aws_user_pools_web_client_id: "9sermtoau2825qojpdf8n7m6s",
    
    // OAuth configuration (empty in this case)
    oauth: {},
    
    // Attributes that can be used as username (empty means standard username)
    aws_cognito_username_attributes: [],
    
    // Social identity providers for federation (empty means no social login)
    aws_cognito_social_providers: [],
    
    // Required attributes during user signup
    aws_cognito_signup_attributes: ["EMAIL"],
    
    // Multi-factor authentication configuration (disabled)
    aws_cognito_mfa_configuration: "OFF",
    
    // Types of MFA that can be used if enabled
    aws_cognito_mfa_types: ["SMS"],
    
    // Password policy settings
    aws_cognito_password_protection_settings: {
      // Minimum password length requirement
      passwordPolicyMinLength: 8,
      // Special character requirements (empty means no specific requirements)
      passwordPolicyCharacters: [],
    },
    
    // Methods used for verifying user accounts
    aws_cognito_verification_mechanisms: ["EMAIL"]
  };
  
  export default awsconfig;
  