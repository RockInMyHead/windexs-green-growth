import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { LoginModal } from "./LoginModal";

export const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-card/80 backdrop-blur-lg border border-border/50">
        <div className="font-display font-bold text-xl">
          <span className="gradient-text">Windexs</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Главная
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Тарифы
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Контакты
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLoginModalOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Вход
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Регистрация
          </Button>
          <Button
            onClick={() => scrollToSection("contact")}
            size="sm"
          >
            Заказать
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLoginModalOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => scrollToSection("contact")}
            size="sm"
          >
            Заказать
          </Button>
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </nav>
    </motion.header>
  );
};
