import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background/50">
      <div className="container max-w-6xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-base font-medium">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="#pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="https://blog.printvision.cloud"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-medium">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-medium">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/docs"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="/api"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  API
                </Link>
              </li>
              <li>
                <Link 
                  href="/status"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} PrintVision.Cloud. All rights reserved.
              </p>
            </div>
            {/* <div className="flex items-center space-x-4">
              <Link 
                href="https://twitter.com/printvision"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </Link>
              <Link 
                href="https://github.com/printvision"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <Link 
                href="https://discord.gg/printvision"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Discord
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}