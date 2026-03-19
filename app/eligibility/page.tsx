import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function Eligibility() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="page-hero-title">Eligibility & Rules</h1>
          <p className="page-hero-sub">Tournament Guidelines and Requirements</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-primary-600 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" /> Eligibility Criteria
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">Player Requirements</h3>
                <ul className="space-y-2 text-gray-700">
                  {['Must be Under-19 years of age', 'Currently enrolled in Class 12', 'Resident of Uttar Pradesh', 'Valid Aadhaar Card required'].map(r => (
                    <li key={r} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Team Requirements</h3>
                <ul className="space-y-2 text-gray-700">
                  {['Minimum 11, Maximum 15 players', 'All players from same district', 'Coach and Manager details', 'Registration fee: ₹11,000'].map(r => (
                    <li key={r} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-1 mr-2 flex-shrink-0" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-red-600 flex items-center">
              <XCircle className="w-6 h-6 mr-2" /> Disqualification Criteria
            </h2>
            <div className="bg-red-50 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-700">
                {[
                  ['Age Fraud', 'Providing false age documents will lead to immediate disqualification'],
                  ['Fake Documents', 'Submission of forged or invalid documents'],
                  ['Misconduct', 'Unsporting behavior or violation of tournament rules'],
                  ['Incomplete Registration', 'Missing required documents or information'],
                ].map(([title, desc]) => (
                  <li key={title} className="flex items-start">
                    <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                    <span><strong>{title}:</strong> {desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-primary-600">Tournament Rules</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Match Rules</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Each match will be 20 overs per side</li>
                  <li>• Powerplay for first 6 overs (only 2 fielders outside 30-yard circle)</li>
                  <li>• Maximum 4 overs per bowler</li>
                  <li>• DLS method will be used for rain-affected matches</li>
                  <li>• No ball and wide ball penalties as per ICC rules</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Equipment & Dress Code</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Standard cricket whites or colored clothing</li>
                  <li>• Protective gear mandatory (helmet, pads, gloves)</li>
                  <li>• Only leather balls will be used</li>
                  <li>• Bat specifications as per ICC guidelines</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-6 text-orange-600 flex items-center">
              <AlertCircle className="w-6 h-6 mr-2" /> Important Notes
            </h2>
            <div className="bg-orange-50 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-700">
                <li>• Registration fee is non-refundable once payment is completed</li>
                <li>• Tournament committee decisions are final and binding</li>
                <li>• Players must carry original documents during matches</li>
                <li>• Age fraud will lead to immediate disqualification</li>
                <li>• Final team allocation for individual players is at SPL committee's discretion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
