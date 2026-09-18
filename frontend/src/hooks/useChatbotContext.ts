import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useChatbot } from '../context/ChatbotContext'

/**
 * Custom hook to automatically set chatbot context based on current page
 * This provides screen-aware guidance
 */
export function useChatbotContext() {
  const location = useLocation()
  const { setCurrentScreenContext } = useChatbot()

  const screenContextMap: Record<string, string> = {
    '/login': `You are on the Login page. Users need to sign in with their email and password. 
              Help them with: 
              - What credentials to use
              - Password recovery if they forgot
              - Redirecting them to signup if they don't have an account`,

    '/signup': `You are on the Sign-up page. New users are creating an account.
              Help them with:
              - What information is required (full name, email, strong password)
              - Password requirements (minimum 6 characters)
              - Account verification process
              - Login redirecting after signup`,

    '/onboarding/language': `You are on the Language Selection page. Users are choosing their preferred language.
                            Help them with:
                            - Available languages: English, हिन्दी, मराठी
                            - Language selection process
                            - Continue to next step`,

    '/onboarding/need': `You are on the Need Selection page. Users choose between Business/Entrepreneurship, Education, or Other.
                        Help them with:
                        - Understanding different need categories
                        - Choosing the right category
                        - What happens next based on their selection`,

    '/onboarding/requirement': `You are on the Requirement Input page. Users describe their need in natural language.
                               Help them with:
                               - What details to provide (project type, cost, desired loan amount, income)
                               - Tips for clear description
                               - Voice input usage
                               - Text extraction process`,

    '/onboarding/profile': `You are on the Profile Confirmation page. Users review extracted information.
                           Help them with:
                           - Understanding what was extracted
                           - Editing incorrect information
                           - Importance of accurate data
                           - Proceeding to eligibility check`,

    '/home': `You are on the Home/Dashboard page. Users see their journey progress.
             Help them with:
             - Understanding the scheme matching process
             - Starting or continuing their journey
             - Viewing previous recommendations
             - Profile management`,

    '/home/scheme-recommendations': `You are on the Scheme Recommendations page. Users see suitable schemes.
                                    Help them with:
                                    - Understanding why schemes are recommended
                                    - Scheme eligibility criteria
                                    - Interest rates and terms
                                    - Selecting a scheme for more details`,

    '/home/emi-calculator': `You are on the EMI Calculator page. Users calculate monthly repayments.
                            Help them with:
                            - How to use the calculator
                            - Understanding EMI components (principal, interest)
                            - Adjusting loan amount and tenure
                            - Interpreting results`,

    '/home/partner-locator': `You are on the Partner Locator page. Users find authorized financial partners.
                             Help them with:
                             - Understanding partner types (banks, NBFC, SCA)
                             - Authorization status
                             - Distance and location information
                             - Selecting a suitable partner`,

    '/home/official-action': `You are on the Official Action page. Users proceed with loan application.
                             Help them with:
                             - Next steps with selected partner
                             - Required documents
                             - Application process
                             - Contact information`,

    '/profile': `You are on the Profile page. Users manage their account information.
                Help them with:
                - Updating personal details
                - Changing preferences
                - Account security
                - Logout and account management`,
  }

  useEffect(() => {
    const context = screenContextMap[location.pathname] || screenContextMap[location.pathname.split('?')[0]] || 
                   `You are on the ${location.pathname} page. Help the user with questions about this page.`
    setCurrentScreenContext(context)
  }, [location.pathname, setCurrentScreenContext])
}
