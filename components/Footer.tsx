import Link from 'next/link'
import { Share2, Share, Users, ExternalLink } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">EventVenue</h3>
            <p className="text-muted-foreground">
              Discover and book stunning venues for your perfect event.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" title="Twitter">
                <Share2 size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" title="LinkedIn">
                <Users size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" title="Instagram">
                <Share size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" title="Facebook">
                <ExternalLink size={20} />
              </a>
            </div>
          </div>

          {/* Browse */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Browse</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/venues" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Venues
                </Link>
              </li>
              <li>
                <Link href="/venues?city=New York" className="text-muted-foreground hover:text-foreground transition-colors">
                  New York
                </Link>
              </li>
              <li>
                <Link href="/venues?city=Brooklyn" className="text-muted-foreground hover:text-foreground transition-colors">
                  Brooklyn
                </Link>
              </li>
              <li>
                <Link href="/venues?city=East Hampton" className="text-muted-foreground hover:text-foreground transition-colors">
                  East Hampton
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Help</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Booking Tips
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © {currentYear} EventVenue. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with Next.js • Powered by Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
