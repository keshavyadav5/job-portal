import { Linkedin, Github, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {

  return (
    <footer className="bg-muted/50 border-t border-border transition-all duration-300 ">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 text-center py-6">
            <p className="text-muted-foreground">
              &copy; 2025 job portal. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a 
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-linkedin"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-github"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href={`mailto:kesavyadav992@gmail.com`}
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-email"
            >
              <Mail className="h-5 w-5" />
            </a>
            
          </div>
        </div>
      </div>
    </footer>
  );
}
