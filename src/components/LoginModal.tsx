import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export const LoginModal = ({ isOpen, onClose, onAuthSuccess }: LoginModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Валидация
    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error("Пожалуйста, заполните email и пароль");
        setIsLoading(false);
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        toast.error("Пожалуйста, заполните все обязательные поля");
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Пароли не совпадают");
        setIsLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        // Сохраняем токен в localStorage
        localStorage.setItem('authToken', data.token);

        toast.success(data.message);
        setIsLoading(false);
        onClose();

        // Reset form
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
        });

        // Обновляем состояние аутентификации
        if (onAuthSuccess) {
          onAuthSuccess();
        }

        // Перенаправляем на Dashboard
        navigate('/dashboard');
      } else {
        toast.error(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error("Произошла ошибка. Попробуйте позже.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-8 text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold">
                  {isLogin ? "Вход в аккаунт" : "Регистрация"}
                </DialogTitle>
              </DialogHeader>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-6 text-lg glow-effect"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    {isLogin ? "Вход..." : "Регистрация..."}
                  </div>
                ) : (
                  isLogin ? "Войти" : "Зарегистрироваться"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/50 bg-muted/20">
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:underline"
                >
                  {isLogin
                    ? "Нет аккаунта? Зарегистрироваться"
                    : "Уже есть аккаунт? Войти"
                  }
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};