/**
 * authTheme.js
 * 
 * This module defines a custom theme for AWS Amplify UI authentication components.
 * It provides consistent styling and branding across all authentication interfaces
 * by customizing colors, fonts, spacing, and component-specific styles.
 */

/**
 * Custom theme configuration
 * 
 * This theme object extends the default Amplify UI theme with custom styling.
 * It defines a cohesive design system with primary and secondary colors,
 * typography settings, and component-specific styling rules.
 */
const theme = {
    name: 'custom-theme',
    tokens: {
      colors: {
        brand: {
          primary: {
            10: '#e6f0ff',   // Lightest blue for backgrounds
            40: '#4d94ff',   // Light blue for accents
            60: '#0066ff',   // Primary blue
            80: '#0052cc',   // Dark blue for hover
            100: '#003d99'   // Darkest blue for active states
          },
          secondary: {
            60: '#6c757d',   // Bootstrap secondary
            80: '#495057'    // Darker secondary for hover
          }
        },
        background: {
          primary: '#ffffff',    // White background
          secondary: '#f8f9fa'   // Light gray background
        },
        border: {
          primary: '#dee2e6',   // Light gray border
          focus: '#0066ff'      // Blue focus border
        },
        font: {
          primary: '#212529',     // Dark gray text
          secondary: '#6c757d',   // Medium gray text
          interactive: '#0066ff'  // Blue interactive text
        }
      },
      fonts: {
        default: {
          variable: { value: 'Lato, system-ui, sans-serif' },
          static: { value: 'Lato, system-ui, sans-serif' }
        }
      },
      components: {
        // Authenticator component styling
        authenticator: {
          router: {
            borderRadius: { value: '8px' },
            boxShadow: { value: '0 4px 6px rgba(0, 0, 0, 0.1)' },
            backgroundColor: { value: '{colors.background.primary}' },
            padding: { value: '2rem' }
          },
          container: {
            width: { value: '100%' },
            maxWidth: { value: '400px' },
            margin: { value: '0 auto' }
          }
        },
        // Button component styling
        button: {
          primary: {
            backgroundColor: { value: '{colors.brand.primary.60}' },
            color: { value: 'white' },
            borderRadius: { value: '4px' },
            fontSize: { value: '1rem' },
            fontWeight: { value: '500' },
            padding: { value: '0.75rem 1.5rem' },
            width: { value: '100%' },
            _hover: {
              backgroundColor: { value: '{colors.brand.primary.80}' }
            },
            _active: {
              backgroundColor: { value: '{colors.brand.primary.100}' }
            },
            _focus: {
              boxShadow: { value: '0 0 0 2px {colors.brand.primary.10}' }
            }
          }
        },
        // Form field component styling
        field: {
          label: {
            color: { value: '{colors.font.primary}' },
            fontSize: { value: '0.875rem' },
            fontWeight: { value: '500' }
          },
          control: {
            borderRadius: { value: '4px' },
            borderColor: { value: '{colors.border.primary}' },
            fontSize: { value: '1rem' },
            _focus: {
              borderColor: { value: '{colors.border.focus}' },
              boxShadow: { value: '0 0 0 3px {colors.brand.primary.10}' }
            }
          }
        },
        // Tabs component styling
        tabs: {
          item: {
            color: { value: '{colors.font.secondary}' },
            _active: {
              color: { value: '{colors.font.interactive}' },
              borderColor: { value: '{colors.brand.primary.60}' }
            }
          }
        }
      }
    }
  }
  
export default theme
  