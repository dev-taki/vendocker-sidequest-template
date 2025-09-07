'use client';

import { useEffect, useRef, useState } from 'react';
import { PaymentService, CardData } from '../services/paymentService';
import { AuthService } from '../services/authService';
import { ButtonLoader } from './common/Loader';

interface SquarePaymentFormProps {
  planVariationId: string;
  amount: number;
  onSuccess: (cardId: string) => void;
  onError: (error: string) => void;
}

const SQUARE_CONFIG = {
  applicationId: 'sq0idp-8kztSVgh4k2MrA47TAO_XA',
  locationId: 'LDSF6W9PAWZNK',
};

const COUNTRIES = [
  { value: '', label: '-- Please choose a country --' },
  { value: 'AD', label: 'AD - Andorra' },
  { value: 'AE', label: 'AE - United Arab Emirates' },
  { value: 'AF', label: 'AF - Afghanistan' },
  { value: 'AG', label: 'AG - Antigua and Barbuda' },
  { value: 'AI', label: 'AI - Anguilla' },
  { value: 'AL', label: 'AL - Albania' },
  { value: 'AM', label: 'AM - Armenia' },
  { value: 'AO', label: 'AO - Angola' },
  { value: 'AQ', label: 'AQ - Antarctica' },
  { value: 'AR', label: 'AR - Argentina' },
  { value: 'AS', label: 'AS - American Samoa' },
  { value: 'AT', label: 'AT - Austria' },
  { value: 'AU', label: 'AU - Australia' },
  { value: 'AW', label: 'AW - Aruba' },
  { value: 'AX', label: 'AX - Åland Islands' },
  { value: 'AZ', label: 'AZ - Azerbaijan' },
  { value: 'BA', label: 'BA - Bosnia and Herzegovina' },
  { value: 'BB', label: 'BB - Barbados' },
  { value: 'BD', label: 'BD - Bangladesh' },
  { value: 'BE', label: 'BE - Belgium' },
  { value: 'BF', label: 'BF - Burkina Faso' },
  { value: 'BG', label: 'BG - Bulgaria' },
  { value: 'BH', label: 'BH - Bahrain' },
  { value: 'BI', label: 'BI - Burundi' },
  { value: 'BJ', label: 'BJ - Benin' },
  { value: 'BL', label: 'BL - Saint Barthélemy' },
  { value: 'BM', label: 'BM - Bermuda' },
  { value: 'BN', label: 'BN - Brunei' },
  { value: 'BO', label: 'BO - Bolivia' },
  { value: 'BQ', label: 'BQ - Bonaire' },
  { value: 'BR', label: 'BR - Brazil' },
  { value: 'BS', label: 'BS - Bahamas' },
  { value: 'BT', label: 'BT - Bhutan' },
  { value: 'BV', label: 'BV - Bouvet Island' },
  { value: 'BW', label: 'BW - Botswana' },
  { value: 'BY', label: 'BY - Belarus' },
  { value: 'BZ', label: 'BZ - Belize' },
  { value: 'CA', label: 'CA - Canada' },
  { value: 'CC', label: 'CC - Cocos Islands' },
  { value: 'CD', label: 'CD - Democratic Republic of the Congo' },
  { value: 'CF', label: 'CF - Central African Republic' },
  { value: 'CG', label: 'CG - Congo' },
  { value: 'CH', label: 'CH - Switzerland' },
  { value: 'CI', label: 'CI - Ivory Coast' },
  { value: 'CK', label: 'CK - Cook Islands' },
  { value: 'CL', label: 'CL - Chile' },
  { value: 'CM', label: 'CM - Cameroon' },
  { value: 'CN', label: 'CN - China' },
  { value: 'CO', label: 'CO - Colombia' },
  { value: 'CR', label: 'CR - Costa Rica' },
  { value: 'CU', label: 'CU - Cuba' },
  { value: 'CV', label: 'CV - Cabo Verde' },
  { value: 'CW', label: 'CW - Curaçao' },
  { value: 'CX', label: 'CX - Christmas Island' },
  { value: 'CY', label: 'CY - Cyprus' },
  { value: 'CZ', label: 'CZ - Czechia' },
  { value: 'DE', label: 'DE - Germany' },
  { value: 'DJ', label: 'DJ - Djibouti' },
  { value: 'DK', label: 'DK - Denmark' },
  { value: 'DM', label: 'DM - Dominica' },
  { value: 'DO', label: 'DO - Dominican Republic' },
  { value: 'DZ', label: 'DZ - Algeria' },
  { value: 'EC', label: 'EC - Ecuador' },
  { value: 'EE', label: 'EE - Estonia' },
  { value: 'EG', label: 'EG - Egypt' },
  { value: 'EH', label: 'EH - Western Sahara' },
  { value: 'ER', label: 'ER - Eritrea' },
  { value: 'ES', label: 'ES - Spain' },
  { value: 'ET', label: 'ET - Ethiopia' },
  { value: 'FI', label: 'FI - Finland' },
  { value: 'FJ', label: 'FJ - Fiji' },
  { value: 'FK', label: 'FK - Falkland Islands' },
  { value: 'FM', label: 'FM - Federated States of Micronesia' },
  { value: 'FO', label: 'FO - Faroe Islands' },
  { value: 'FR', label: 'FR - France' },
  { value: 'GA', label: 'GA - Gabon' },
  { value: 'GB', label: 'GB - United Kingdom' },
  { value: 'GD', label: 'GD - Grenada' },
  { value: 'GE', label: 'GE - Georgia' },
  { value: 'GF', label: 'GF - French Guiana' },
  { value: 'GG', label: 'GG - Guernsey' },
  { value: 'GH', label: 'GH - Ghana' },
  { value: 'GI', label: 'GI - Gibraltar' },
  { value: 'GL', label: 'GL - Greenland' },
  { value: 'GM', label: 'GM - Gambia' },
  { value: 'GN', label: 'GN - Guinea' },
  { value: 'GP', label: 'GP - Guadeloupe' },
  { value: 'GQ', label: 'GQ - Equatorial Guinea' },
  { value: 'GR', label: 'GR - Greece' },
  { value: 'GS', label: 'GS - South Georgia' },
  { value: 'GT', label: 'GT - Guatemala' },
  { value: 'GU', label: 'GU - Guam' },
  { value: 'GW', label: 'GW - Guinea-Bissau' },
  { value: 'GY', label: 'GY - Guyana' },
  { value: 'HK', label: 'HK - Hong Kong' },
  { value: 'HM', label: 'HM - Heard Island' },
  { value: 'HN', label: 'HN - Honduras' },
  { value: 'HR', label: 'HR - Croatia' },
  { value: 'HT', label: 'HT - Haiti' },
  { value: 'HU', label: 'HU - Hungary' },
  { value: 'ID', label: 'ID - Indonesia' },
  { value: 'IE', label: 'IE - Ireland' },
  { value: 'IL', label: 'IL - Israel' },
  { value: 'IM', label: 'IM - Isle of Man' },
  { value: 'IN', label: 'IN - India' },
  { value: 'IO', label: 'IO - British Indian Ocean Territory' },
  { value: 'IQ', label: 'IQ - Iraq' },
  { value: 'IR', label: 'IR - Iran' },
  { value: 'IS', label: 'IS - Iceland' },
  { value: 'IT', label: 'IT - Italy' },
  { value: 'JE', label: 'JE - Jersey' },
  { value: 'JM', label: 'JM - Jamaica' },
  { value: 'JO', label: 'JO - Jordan' },
  { value: 'JP', label: 'JP - Japan' },
  { value: 'KE', label: 'KE - Kenya' },
  { value: 'KG', label: 'KG - Kyrgyzstan' },
  { value: 'KH', label: 'KH - Cambodia' },
  { value: 'KI', label: 'KI - Kiribati' },
  { value: 'KM', label: 'KM - Comoros' },
  { value: 'KN', label: 'KN - Saint Kitts and Nevis' },
  { value: 'KP', label: 'KP - North Korea' },
  { value: 'KR', label: 'KR - South Korea' },
  { value: 'KW', label: 'KW - Kuwait' },
  { value: 'KY', label: 'KY - Cayman Islands' },
  { value: 'KZ', label: 'KZ - Kazakhstan' },
  { value: 'LA', label: 'LA - Laos' },
  { value: 'LB', label: 'LB - Lebanon' },
  { value: 'LC', label: 'LC - Saint Lucia' },
  { value: 'LI', label: 'LI - Liechtenstein' },
  { value: 'LK', label: 'LK - Sri Lanka' },
  { value: 'LR', label: 'LR - Liberia' },
  { value: 'LS', label: 'LS - Lesotho' },
  { value: 'LT', label: 'LT - Lithuania' },
  { value: 'LU', label: 'LU - Luxembourg' },
  { value: 'LV', label: 'LV - Latvia' },
  { value: 'LY', label: 'LY - Libya' },
  { value: 'MA', label: 'MA - Morocco' },
  { value: 'MC', label: 'MC - Monaco' },
  { value: 'MD', label: 'MD - Moldova' },
  { value: 'ME', label: 'ME - Montenegro' },
  { value: 'MF', label: 'MF - Saint Martin' },
  { value: 'MG', label: 'MG - Madagascar' },
  { value: 'MH', label: 'MH - Marshall Islands' },
  { value: 'MK', label: 'MK - North Macedonia' },
  { value: 'ML', label: 'ML - Mali' },
  { value: 'MM', label: 'MM - Myanmar' },
  { value: 'MN', label: 'MN - Mongolia' },
  { value: 'MO', label: 'MO - Macao' },
  { value: 'MP', label: 'MP - Northern Mariana Islands' },
  { value: 'MQ', label: 'MQ - Martinique' },
  { value: 'MR', label: 'MR - Mauritania' },
  { value: 'MS', label: 'MS - Montserrat' },
  { value: 'MT', label: 'MT - Malta' },
  { value: 'MU', label: 'MU - Mauritius' },
  { value: 'MV', label: 'MV - Maldives' },
  { value: 'MW', label: 'MW - Malawi' },
  { value: 'MX', label: 'MX - Mexico' },
  { value: 'MY', label: 'MY - Malaysia' },
  { value: 'MZ', label: 'MZ - Mozambique' },
  { value: 'NA', label: 'NA - Namibia' },
  { value: 'NC', label: 'NC - New Caledonia' },
  { value: 'NE', label: 'NE - Niger' },
  { value: 'NF', label: 'NF - Norfolk Island' },
  { value: 'NG', label: 'NG - Nigeria' },
  { value: 'NI', label: 'NI - Nicaragua' },
  { value: 'NL', label: 'NL - Netherlands' },
  { value: 'NO', label: 'NO - Norway' },
  { value: 'NP', label: 'NP - Nepal' },
  { value: 'NR', label: 'NR - Nauru' },
  { value: 'NU', label: 'NU - Niue' },
  { value: 'NZ', label: 'NZ - New Zealand' },
  { value: 'OM', label: 'OM - Oman' },
  { value: 'PA', label: 'PA - Panama' },
  { value: 'PE', label: 'PE - Peru' },
  { value: 'PF', label: 'PF - French Polynesia' },
  { value: 'PG', label: 'PG - Papua New Guinea' },
  { value: 'PH', label: 'PH - Philippines' },
  { value: 'PK', label: 'PK - Pakistan' },
  { value: 'PL', label: 'PL - Poland' },
  { value: 'PM', label: 'PM - Saint Pierre and Miquelon' },
  { value: 'PN', label: 'PN - Pitcairn' },
  { value: 'PR', label: 'PR - Puerto Rico' },
  { value: 'PS', label: 'PS - Palestine' },
  { value: 'PT', label: 'PT - Portugal' },
  { value: 'PW', label: 'PW - Palau' },
  { value: 'PY', label: 'PY - Paraguay' },
  { value: 'QA', label: 'QA - Qatar' },
  { value: 'RE', label: 'RE - Réunion' },
  { value: 'RO', label: 'RO - Romania' },
  { value: 'RS', label: 'RS - Serbia' },
  { value: 'RU', label: 'RU - Russia' },
  { value: 'RW', label: 'RW - Rwanda' },
  { value: 'SA', label: 'SA - Saudi Arabia' },
  { value: 'SB', label: 'SB - Solomon Islands' },
  { value: 'SC', label: 'SC - Seychelles' },
  { value: 'SD', label: 'SD - Sudan' },
  { value: 'SE', label: 'SE - Sweden' },
  { value: 'SG', label: 'SG - Singapore' },
  { value: 'SH', label: 'SH - Saint Helena' },
  { value: 'SI', label: 'SI - Slovenia' },
  { value: 'SJ', label: 'SJ - Svalbard and Jan Mayen' },
  { value: 'SK', label: 'SK - Slovakia' },
  { value: 'SL', label: 'SL - Sierra Leone' },
  { value: 'SM', label: 'SM - San Marino' },
  { value: 'SN', label: 'SN - Senegal' },
  { value: 'SO', label: 'SO - Somalia' },
  { value: 'SR', label: 'SR - Suriname' },
  { value: 'SS', label: 'SS - South Sudan' },
  { value: 'ST', label: 'ST - Sao Tome and Principe' },
  { value: 'SV', label: 'SV - El Salvador' },
  { value: 'SX', label: 'SX - Sint Maarten' },
  { value: 'SY', label: 'SY - Syria' },
  { value: 'SZ', label: 'SZ - Eswatini' },
  { value: 'TC', label: 'TC - Turks and Caicos Islands' },
  { value: 'TD', label: 'TD - Chad' },
  { value: 'TF', label: 'TF - French Southern Territories' },
  { value: 'TG', label: 'TG - Togo' },
  { value: 'TH', label: 'TH - Thailand' },
  { value: 'TJ', label: 'TJ - Tajikistan' },
  { value: 'TK', label: 'TK - Tokelau' },
  { value: 'TL', label: 'TL - Timor-Leste' },
  { value: 'TM', label: 'TM - Turkmenistan' },
  { value: 'TN', label: 'TN - Tunisia' },
  { value: 'TO', label: 'TO - Tonga' },
  { value: 'TR', label: 'TR - Turkey' },
  { value: 'TT', label: 'TT - Trinidad and Tobago' },
  { value: 'TV', label: 'TV - Tuvalu' },
  { value: 'TW', label: 'TW - Taiwan' },
  { value: 'TZ', label: 'TZ - Tanzania' },
  { value: 'UA', label: 'UA - Ukraine' },
  { value: 'UG', label: 'UG - Uganda' },
  { value: 'US', label: 'US - United States' },
  { value: 'UY', label: 'UY - Uruguay' },
  { value: 'UZ', label: 'UZ - Uzbekistan' },
  { value: 'VA', label: 'VA - Vatican City' },
  { value: 'VC', label: 'VC - Saint Vincent and the Grenadines' },
  { value: 'VE', label: 'VE - Venezuela' },
  { value: 'VG', label: 'VG - British Virgin Islands' },
  { value: 'VI', label: 'VI - U.S. Virgin Islands' },
  { value: 'VN', label: 'VN - Vietnam' },
  { value: 'VU', label: 'VU - Vanuatu' },
  { value: 'WF', label: 'WF - Wallis and Futuna' },
  { value: 'WS', label: 'WS - Samoa' },
  { value: 'YE', label: 'YE - Yemen' },
  { value: 'YT', label: 'YT - Mayotte' },
  { value: 'ZA', label: 'ZA - South Africa' },
  { value: 'ZM', label: 'ZM - Zambia' },
  { value: 'ZW', label: 'ZW - Zimbabwe' },
];

declare global {
  interface Window {
    Square: any;
  }
}

export default function SquarePaymentForm({ planVariationId, amount, onSuccess, onError }: SquarePaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    postalCode: '',
    countryCode: '',
    cardHolderName: '',
  });
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const paymentsRef = useRef<any>(null);
  const cardRef = useRef<any>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Square && !initializedRef.current) {
      initializeSquare();
    }

    return () => {
      // Cleanup function
      if (cardRef.current) {
        try {
          cardRef.current.destroy();
        } catch (error) {
          console.log('Card cleanup error:', error);
        }
      }
      initializedRef.current = false;
    };
  }, []);

  const initializeSquare = async () => {
    try {
      if (!window.Square || initializedRef.current || !cardContainerRef.current) {
        return;
      }

      paymentsRef.current = window.Square.payments(SQUARE_CONFIG.applicationId, SQUARE_CONFIG.locationId);
      
      cardRef.current = await paymentsRef.current.card();

      if (cardContainerRef.current) {
        await cardRef.current.attach(cardContainerRef.current);
        initializedRef.current = true;
      }
    } catch (error) {
      console.error('Failed to initialize Square:', error);
      onError('Failed to initialize payment system');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentsRef.current) {
      onError('Payment system not initialized');
      return;
    }

    setLoading(true);
    try {
      if (!cardRef.current) {
        onError('Payment system not initialized');
        return;
      }
      const result = await cardRef.current.tokenize();
      
      if (result.status === 'OK') {
        // First, add the card
        const cardData: CardData = {
          sourceId: result.token,
          cardToken: result.token,
          postalCode: formData.postalCode,
          countryCode: formData.countryCode,
          cardHolderName: formData.cardHolderName,
          business_id: AuthService.getBusinessId(),
        };

        const cardResponse = await PaymentService.addCard(cardData);

        // Then create the subscription
        const subscriptionData = {
          business_id: AuthService.getBusinessId(),
          plan_variation_id: planVariationId.toString(),
          card_id: cardResponse.card_id,
          amount: amount,
        };

        console.log('Creating subscription with:', subscriptionData);
        await PaymentService.createSubscription(subscriptionData);

        onSuccess(cardResponse.id.toString());
      } else {
        onError('Card tokenization failed');
      }
    } catch (error: any) {
      onError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-center">Payment Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Square Card Container - TOP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div 
            ref={cardContainerRef}
            className="w-full h-32 mb-4 min-h-[128px]"
            style={{ minHeight: '128px' }}
          />
        </div>

        {/* Card Holder Name */}
        <div>
          <label htmlFor="cardHolderName" className="block text-sm font-medium text-gray-700 mb-2">
            Card Holder Name
          </label>
          <input
            type="text"
            id="cardHolderName"
            name="cardHolderName"
            value={formData.cardHolderName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B3B3B] focus:border-transparent"
            placeholder="Enter card holder name"
            required
          />
        </div>

        {/* Postal Code */}
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B3B3B] focus:border-transparent"
            placeholder="Enter postal code"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            id="countryCode"
            name="countryCode"
            value={formData.countryCode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B3B3B] focus:border-transparent"
            required
          >
            {COUNTRIES.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
                      className="w-full bg-[#8c52ff] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#7a47e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
                          {loading ? (
                  <>
                    <ButtonLoader size="sm" />
                    Processing...
                  </>
                ) : (
            'Complete Payment'
          )}
        </button>
      </form>
    </div>
  );
}
