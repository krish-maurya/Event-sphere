import { EventProvider } from '@/app/context/EventContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CheckCircle, Users, Zap, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <EventProvider>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-balance text-foreground">
            About EventVenue
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revolutionizing the way people discover and book event venues for life's most important celebrations.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-foreground">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We believe every celebration deserves a perfect venue. EventVenue connects event planners and couples with stunning venues that match their vision and budget. Our platform makes it effortless to browse, customize, and book the perfect space.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Since our launch, we&apos;ve helped thousands of couples and event planners create unforgettable moments in beautiful spaces.
                </p>
              </div>
              <div className="space-y-6">
                <div className="bg-card rounded-lg p-6 border border-border">
                  <p className="text-4xl font-bold text-foreground mb-2">100K+</p>
                  <p className="text-muted-foreground">Events Successfully Hosted</p>
                </div>
                <div className="bg-card rounded-lg p-6 border border-border">
                  <p className="text-4xl font-bold text-foreground mb-2">500+</p>
                  <p className="text-muted-foreground">Partner Venues</p>
                </div>
                <div className="bg-card rounded-lg p-6 border border-border">
                  <p className="text-4xl font-bold text-foreground mb-2">50K+</p>
                  <p className="text-muted-foreground">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-foreground" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Quality</h3>
              <p className="text-muted-foreground">
                We partner only with premium venues that meet our high standards.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="text-foreground" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Customer First</h3>
              <p className="text-muted-foreground">
                Your experience and satisfaction is our top priority.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Zap className="text-foreground" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously improve to make booking easier and faster.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Globe className="text-foreground" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Accessibility</h3>
              <p className="text-muted-foreground">
                Great venues should be accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-card border-y border-border py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Why Choose EventVenue?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Curated Selection</h3>
                <p className="text-muted-foreground">
                  Every venue on our platform is carefully selected and verified for quality, amenities, and customer service.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Complete Customization</h3>
                <p className="text-muted-foreground">
                  From decoration themes to catering options and entertainment, customize every detail of your event.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Expert Support</h3>
                <p className="text-muted-foreground">
                  Our team is here to help you at every step, from browsing to booking to celebrating.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Flexible Booking</h3>
                <p className="text-muted-foreground">
                  Easy cancellation policies and flexible scheduling options give you peace of mind.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Transparent Pricing</h3>
                <p className="text-muted-foreground">
                  No hidden fees. See all costs upfront including venue, catering, and entertainment.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Your payment information is encrypted and secure. We use industry-leading security standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Ready to Find Your Venue?</h2>
          <p className="text-lg text-muted-foreground">
            Start exploring stunning venues and create your perfect event today.
          </p>
          <a
            href="/venues"
            className="inline-block px-8 py-3 bg-primary text-foreground-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Browse Venues
          </a>
        </section>
      </main>
      <Footer />
    </EventProvider>
  )
}
