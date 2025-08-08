import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Crown } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for small teams getting started",
      icon: Star,
      features: [
        "Up to 5 team members",
        "3 projects",
        "Basic task management",
        "1GB file storage",
        "Community support",
        "Basic integrations",
      ],
      limitations: [
        "Limited file storage",
        "Basic features only",
        "No advanced analytics",
      ],
      cta: "Get Started Free",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "per user/month",
      description: "For growing teams that need more power",
      icon: Zap,
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Advanced task management",
        "100GB file storage",
        "Real-time collaboration",
        "Video conferencing",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Automation workflows",
      ],
      cta: "Start Pro Trial",
      variant: "gradient" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$24",
      period: "per user/month",
      description: "For large organizations with advanced needs",
      icon: Crown,
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Advanced security controls",
        "SSO & SAML",
        "Dedicated account manager",
        "Custom branding",
        "API access",
        "Advanced compliance",
        "24/7 phone support",
        "Custom workflows",
        "Data export tools",
      ],
      cta: "Contact Sales",
      variant: "premium" as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your team. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative glass-card p-8 rounded-2xl shadow-soft animate-slide-up ${
                plan.popular ? 'ring-2 ring-primary/50 shadow-glow' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations && (
                  <div className="border-t border-border/50 pt-4 mt-4">
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="text-xs text-muted-foreground mb-1">
                        • {limitation}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Button 
                variant={plan.variant} 
                size="lg" 
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Enterprise Features */}
        <div className="mt-16 text-center">
          <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Enterprise Add-ons</h3>
            <p className="text-muted-foreground mb-6">
              Additional services available for Enterprise customers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">White Label</h4>
                <p className="text-sm text-muted-foreground">Custom branding for agencies</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Marketplace</h4>
                <p className="text-sm text-muted-foreground">Sell plugins & templates</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Dedicated Instance</h4>
                <p className="text-sm text-muted-foreground">Private cloud deployment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Custom Development</h4>
                <p className="text-sm text-muted-foreground">Tailored features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;