'use client'

import { Check, X, Building2, Users, Briefcase, Sparkles } from 'lucide-react'
import TansyLogo from '@/components/ui/TansyLogo'
import Tooltip from '@/components/ui/Tooltip'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-tansy-gray-light to-white pb-16">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <TansyLogo size="lg" showText={true} className="justify-center mb-4" />
          <h1 className="text-4xl font-bold text-tansy-gray-darker mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-tansy-gray-dark max-w-2xl mx-auto">
            Choose the plan that works for you. All plans include our core healthcare navigation features.
          </p>
        </div>

        {/* Individual Account */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-tansy-gray-darker mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-tansy-teal-dark" />
            Individual Account
          </h2>
          <div className="bg-white rounded-2xl shadow-lg border border-tansy-gray p-8 max-w-md">
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-tansy-gray-darker">$10</span>
                <span className="text-tansy-gray-dark">/month</span>
              </div>
              <div className="text-sm text-tansy-teal-dark font-medium mb-4">
                Free trial: 3 months
              </div>
              <p className="text-tansy-gray-dark">
                Perfect for individuals and families who want personalized healthcare navigation and appointment scheduling.
              </p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                <span className="text-tansy-gray-darker">Full Tansy AI access</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                <span className="text-tansy-gray-darker">Appointment scheduling</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                <span className="text-tansy-gray-darker">Insurance navigation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                <span className="text-tansy-gray-darker">Provider search</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                <span className="text-tansy-gray-darker">Email support</span>
              </li>
            </ul>
            <button className="w-full bg-tansy-teal text-white py-3 rounded-lg font-semibold hover:bg-tansy-teal-dark transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>

        {/* Employer/Partner Accounts */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-tansy-gray-darker mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-tansy-teal-dark" />
            Employer/Partner Accounts
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Tier */}
            <div className="bg-white rounded-2xl shadow-lg border border-tansy-gray p-8">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-tansy-gray-darker">$5</span>
                  <span className="text-tansy-gray-dark">PEPM</span>
                </div>
                <div className="text-lg font-semibold text-tansy-gray-darker mb-2">Basic</div>
                <p className="text-tansy-gray-dark text-sm">
                  Core Tansy access and email support for your team.
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                  <span className="text-tansy-gray-darker">Core Tansy access</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                  <span className="text-tansy-gray-darker">Email support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                  <span className="text-tansy-gray-darker">Team management</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-tansy-gray flex-shrink-0 mt-0.5" />
                  <span className="text-tansy-gray-dark line-through">Account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-tansy-gray flex-shrink-0 mt-0.5" />
                  <span className="text-tansy-gray-dark line-through">Analytics</span>
                </li>
              </ul>
              <button className="w-full bg-tansy-gray-light text-tansy-gray-darker py-3 rounded-lg font-semibold hover:bg-tansy-gray transition-colors">
                Contact Sales
              </button>
            </div>

            {/* Dedicated Tier */}
            <div className="bg-gradient-to-br from-tansy-teal to-tansy-pink rounded-2xl shadow-lg border-2 border-tansy-teal p-8 relative">
              <div className="absolute top-4 right-4 bg-white text-tansy-teal-dark text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">$8</span>
                  <span className="text-white/90">PEPM</span>
                </div>
                <div className="text-lg font-semibold text-white mb-2">Dedicated</div>
                <p className="text-white/90 text-sm">
                  Everything in Basic, plus dedicated account manager and analytics.
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Everything in Basic</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Dedicated account manager</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Non-PHI analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Custom integrations</span>
                </li>
              </ul>
              <button className="w-full bg-white text-tansy-teal-dark py-3 rounded-lg font-semibold hover:bg-tansy-gray-light transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* Enterprise */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-tansy-gray-darker mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-tansy-teal-dark" />
            Enterprise (300+ employees)
          </h2>
          <div className="bg-white rounded-2xl shadow-lg border border-tansy-gray p-8 max-w-2xl">
            <div className="mb-6">
              <div className="text-2xl font-bold text-tansy-gray-darker mb-2">Custom Pricing</div>
              <p className="text-tansy-gray-dark mb-4">
                Tailored solutions for large organizations. Pricing based on consultation to meet your specific needs.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                  <span className="text-tansy-gray-darker">Everything in Dedicated</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                  <span className="text-tansy-gray-darker">Custom integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                  <span className="text-tansy-gray-darker">Dedicated support team</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                  <span className="text-tansy-gray-darker">SLA guarantees</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-tansy-teal flex-shrink-0 mt-0.5" />
                  <span className="text-tansy-gray-darker">On-site training</span>
                </li>
              </ul>
            </div>
            <button className="w-full bg-tansy-teal text-white py-3 rounded-lg font-semibold hover:bg-tansy-teal-dark transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>

        {/* Pilot Program */}
        <div className="bg-gradient-to-r from-tansy-pink-light to-tansy-teal-light rounded-2xl p-8 border border-tansy-gray">
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-tansy-pink flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-tansy-gray-darker mb-2">Pilot Program</h3>
              <p className="text-tansy-gray-darker mb-4">
                <strong>Free Year 1</strong>, renews as Dedicated tier. Perfect for early partners who want to help shape the product.
              </p>
              <div className="bg-white/80 rounded-lg p-4 mb-4">
                <p className="text-sm text-tansy-gray-darker font-medium mb-2">What we ask in return:</p>
                <ul className="space-y-1 text-sm text-tansy-gray-dark">
                  <li>• Frequent structured feedback</li>
                  <li>• Participation in product development discussions</li>
                  <li>• Case study collaboration (optional)</li>
                </ul>
              </div>
              <Tooltip content="Pilot partners help us improve the product and get free access in return">
                <button className="bg-tansy-pink text-white px-6 py-3 rounded-lg font-semibold hover:bg-tansy-pink-dark transition-colors">
                  Apply for Pilot Program
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-tansy-gray-dark max-w-2xl mx-auto">
            <strong>Note:</strong> All partners understand the product is under active development. 
            Prices will increase as we achieve product-market fit and gain traction. 
            Pilot program participants commit to providing structured feedback throughout the year.
          </p>
        </div>
      </div>
    </div>
  )
}

