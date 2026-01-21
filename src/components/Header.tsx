import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { LoginModal } from "./LoginModal";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем наличие токена при загрузке
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/');
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

        {isAuthenticated ? (
          <>
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Личный кабинет
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Метрика
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Выйти
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
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                <User className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogIn className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => scrollToSection("contact")}
                size="sm"
              >
                Заказать
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Метрика
              </Button>
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
                onClick={() => {
                  setIsLoginModalOpen(true);
                  // Здесь можно добавить логику для переключения на режим регистрации
                }}
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
                className="text-muted-foreground hover:text-foreground"
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
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
          </>
        )}

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onAuthSuccess={() => setIsAuthenticated(true)}
        />
      </nav>
    </motion.header>
  );
};
