import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Code, Server, Globe, Mail, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TeamCardProps {
  name: string;
  role: string;
  icon: LucideIcon;
  github: string;
  linkedin: string;
  twitter: string;
  gradient: string;
}

const TeamCard = ({ name, role, icon: Icon, github, linkedin, twitter, gradient }: TeamCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative group h-full"
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500`}></div>
      
      <div className="relative flex flex-col items-center bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl h-full transition-colors group-hover:bg-black/50">
        <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} mb-6 shadow-lg shadow-primary/20`}>
          <Icon size={32} className="text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{name}</h3>
        <p className="text-primary font-medium text-sm mb-6 uppercase tracking-widest">{role}</p>

        <div className="flex gap-4 mt-auto">
          {[
            { icon: Github, href: github, color: 'hover:bg-white/10' },
            { icon: Linkedin, href: linkedin, color: 'hover:bg-blue-500/20' },
            { icon: Twitter, href: twitter, color: 'hover:bg-sky-400/20' }
          ].map((social, idx) => (
            <motion.a
              key={idx}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full border border-white/5 bg-white/5 transition-all duration-300 ${social.color} hover:border-white/20 text-gray-400 hover:text-white`}
            >
              <social.icon size={20} />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const Footer = () => {
  return (
    <footer className="relative mt-32 pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[10%] w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[10%] w-[25rem] h-[25rem] bg-purple-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
              Meet the Creators
            </h2>
           
          </motion.div>
        </div>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          <TeamCard 
            name="Sourabh Sharma"
            role="Frontend Architect"
            icon={Code}
            gradient="from-blue-600 to-primary"
            github="https://github.com/Sourabh0011"
            linkedin="https://www.linkedin.com/in/sourabh-sharmaa/"
            twitter="https://x.com/Sourabh79197655"
          />
          <TeamCard 
            name="Rahul Vishwakarma"
            role="Backend Specialist"
            icon={Server}
            gradient="from-primary to-purple-600"
            github="https://github.com/rahulvishwakarma-coder"
            linkedin="https://www.linkedin.com/in/rahulvishwakarma-coder"
            twitter="#"
            
          />
        </div>
<br />
        {/* Footer Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-12 border-t border-white/10">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Globe className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">BYBITS.IN</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              Empowering creators and businesses with lightning-fast link management and deep insights.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Stay Connected</h4>
            <div className="flex gap-8">
              <a href="mailto:contact@shortly.com" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm group">
                <Mail size={16} className="group-hover:scale-110 transition-transform" />
                <span>Contact Us</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 text-sm group">
                <Globe size={16} className="group-hover:scale-110 transition-transform" />
                <span>Community</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end justify-center space-y-4">
             <div className="flex gap-6 text-xs font-bold uppercase tracking-tighter text-gray-500">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
             </div>
             <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">
               © 2026 Crafted with <Heart size={10} className="inline text-red-500 fill-red-500 animate-pulse mx-0.5" /> by the team
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
